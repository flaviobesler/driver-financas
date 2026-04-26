const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const requiredEnv = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PRICE_ID'
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
}

const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  const { data: { user }, error: authError } =
    await supabaseAuth.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ error: 'Sessão inválida' });
  }

  const { data: usuario, error: userError } = await supabaseAdmin
    .from('usuarios')
    .select('id, status, stripe_customer_id')
    .eq('id', user.id)
    .maybeSingle();

  if (userError) {
    console.error(userError);
    return res.status(500).json({ error: 'Erro ao buscar usuário' });
  }

  if (!usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }

  if (!['aguardando', 'cancelado', 'pagamento_pendente'].includes(usuario.status)) {
    return res.status(403).json({ error: 'Assinatura não permitida' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',

      customer: usuario.stripe_customer_id || undefined,

      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],

      success_url: 'https://driver-financas.vercel.app/dashboard.html',
      cancel_url: 'https://driver-financas.vercel.app/assinar.html',

      client_reference_id: user.id,

      metadata: {
        user_id: user.id
      },

      subscription_data: {
        metadata: {
          user_id: user.id
        }
      }
    });

    return res.status(200).json({ url: session.url });

  } catch (err) {
    console.error('Stripe checkout error:', err);
    return res.status(500).json({ error: 'Erro ao criar checkout' });
  }
};