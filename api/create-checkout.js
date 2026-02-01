const Stripe = require('stripe')
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const priceId = process.env.STRIPE_PRICE_ID

console.log(process.env.STRIPE_PRICE_ID)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  // ⚠️ Por enquanto vamos assumir que o usuário já está autenticado
  // depois a gente valida sessão Supabase aqui

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1
      }
    ],
    success_url: 'https://driver-financas.vercel.app/pagamento/sucesso',
    cancel_url: 'https://driver-financas.vercel.app/assinar.html'
  })

  res.status(200).json({ url: session.url })
}
