const { createClient } = require('@supabase/supabase-js')
const Stripe = require('stripe')

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Não autenticado' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return res.status(401).json({ error: 'Sessão inválida' })

  const { data: usuario } = await supabase
    .from('usuarios')
    .select('status')
    .eq('id', user.id)
    .single()

  if (!['aguardando', 'cancelado'].includes(usuario.status)) {
    return res.status(403).json({ error: 'Assinatura não permitida' })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: 'https://driver-financas.vercel.app/pagamento/sucesso',
    cancel_url: 'https://driver-financas.vercel.app/assinar.html',
    client_reference_id: user.id
  })

  res.status(200).json({ url: session.url })
}
