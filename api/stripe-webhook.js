import Stripe from 'stripe';
import { buffer } from 'micro';
import { createClient } from '@supabase/supabase-js';

export const config = {
  api: {
    bodyParser: false
  }
};

const requiredEnv = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ error: 'Assinatura ausente' });
  }

  let event;

  try {
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send('Invalid signature');
  }

  const { error: eventInsertError } = await supabase
    .from('stripe_events')
    .insert({
      id: event.id,
      type: event.type
    });

  if (eventInsertError) {
    if (eventInsertError.code === '23505') {
      return res.status(200).json({ received: true, duplicate: true });
    }

    console.error('Erro ao registrar evento:', eventInsertError);
    return res.status(500).json({ error: 'Erro ao registrar evento' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const userId = session.metadata?.user_id || session.client_reference_id;

        if (!userId) {
          console.warn('Checkout sem user_id');
          break;
        }

        if (!session.customer || !session.subscription) {
          console.warn('Checkout sem customer ou subscription');
          break;
        }

        const { data: usuario, error: usuarioError } = await supabase
          .from('usuarios')
          .select('id')
          .eq('id', userId)
          .maybeSingle();

        if (usuarioError) throw usuarioError;

        if (!usuario) {
          console.warn('Usuário não encontrado:', userId);
          break;
        }

        const { error } = await supabase
          .from('usuarios')
          .update({
            status: 'ativo',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription
          })
          .eq('id', userId);

        if (error) throw error;

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        if (!subscription.id) break;

        const { error } = await supabase
          .from('usuarios')
          .update({
            status: 'cancelado'
          })
          .eq('stripe_subscription_id', subscription.id);

        if (error) throw error;

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;

        if (!invoice.customer) break;

        const { error } = await supabase
          .from('usuarios')
          .update({
            status: 'pagamento_pendente'
          })
          .eq('stripe_customer_id', invoice.customer);

        if (error) throw error;

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;

        if (!invoice.customer) break;

        const { error } = await supabase
          .from('usuarios')
          .update({
            status: 'ativo'
          })
          .eq('stripe_customer_id', invoice.customer);

        if (error) throw error;

        break;
      }

      default:
        break;
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Webhook failed' });
  }
}