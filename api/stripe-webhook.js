import Stripe from 'stripe'
import { buffer } from 'micro'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false
  }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // backend only
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const sig = req.headers['stripe-signature']
  let event

  try {
    const buf = await buffer(req)
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).send('Invalid signature')
  }

  /* --------------------------------------------------
     🔒 IDEMPOTÊNCIA — ignora eventos duplicados
  -------------------------------------------------- */
  const eventId = event.id

  const { data: alreadyProcessed } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('id', eventId)
    .maybeSingle()

  if (alreadyProcessed) {
    return res.status(200).json({ received: true })
  }

  try {
    switch (event.type) {

      /* ---------------------------------------------
         ✅ CHECKOUT CONCLUÍDO (ASSINATURA CRIADA)
      --------------------------------------------- */
      case 'checkout.session.completed': {
        const session = event.data.object

        const userId = session.metadata?.user_id
        if (!userId) break

        await supabase
          .from('users')
          .update({
            status: 'ativo',
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription
          })
          .eq('id', userId)

        break
      }

      /* ---------------------------------------------
         ❌ ASSINATURA CANCELADA
      --------------------------------------------- */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        await supabase
          .from('users')
          .update({ status: 'cancelado' })
          .eq('stripe_subscription_id', subscription.id)

        break
      }

      /* ---------------------------------------------
         ⚠️ FALHA DE PAGAMENTO (SEM DOWNGRADE INDEVIDO)
      --------------------------------------------- */
      case 'invoice.payment_failed': {
        const invoice = event.data.object

        const { data: user } = await supabase
          .from('users')
          .select('status')
          .eq('stripe_customer_id', invoice.customer)
          .single()

        if (user && user.status === 'ativo') {
          await supabase
            .from('users')
            .update({ status: 'inadimplente' })
            .eq('stripe_customer_id', invoice.customer)
        }

        break
      }

      /* ---------------------------------------------
         🔁 PAGAMENTO RECUPERADO
      --------------------------------------------- */
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object

        await supabase
          .from('usuarios')
          .update({ status: 'ativo' })
          .eq('stripe_customer_id', invoice.customer)

        break
      }

      default:
        break
    }

    /* --------------------------------------------------
       🧾 REGISTRA EVENTO PROCESSADO
    -------------------------------------------------- */
    await supabase
      .from('stripe_events')
      .insert({ id: eventId })

    return res.status(200).json({ received: true })

  } catch (err) {
    console.error('Webhook processing error:', err)
    return res.status(500).json({ error: 'Webhook failed' })
  }
}
