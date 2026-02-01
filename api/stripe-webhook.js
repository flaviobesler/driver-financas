const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return res.status(400).send(`Webhook Error`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    // Aqui você:
    // 1. identifica o usuário
    // 2. muda status para ATIVO no banco
  }

  if (event.type === 'customer.subscription.deleted') {
    // status = cancelado
  }

  res.json({ received: true })
}
