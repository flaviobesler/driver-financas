const { createClient } = require('@supabase/supabase-js')
const Stripe = require('stripe')

const supabaseAuth = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  /* -------------------------
     🔐 Valida sessão
  -------------------------- */
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Não autenticado' })
  }

  const { data: { user }, error } = await supabaseAuth.auth.getUser(token)

  if (error || !user) {
    return res.status(401).json({ error: 'Sessão inválida' })
  }

  /* -------------------------
     👤 Busca status do usuário
  -------------------------- */
  const { data: usuario, error: userError } = await supabaseAdmin
    .from('usuarios')
    .select('status')
    .eq('id', user.id)
    .single()

  if (userError || !usuario) {
    return res.status(404).json({ error: 'Usuário não encontrado' })
  }

  if (!['aguardando', 'cancelado'].includes(usuario.status)) {
    return res.status(403).json({ error: 'Assinatura não permitida' })
  }

  /* -------------------------
     💳 Cria checkout Stripe
  -------------------------- */
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1
        }
      ],
      success_url: 'https://driver-financas.vercel.app/dashboard.html',
      cancel_url: 'https://driver-financas.vercel.app/assinar.html',
      client_reference_id: user.id
    })

    return res.status(200).json({ url: session.url })

  } catch (err) {
    console.error('Stripe error:', err)
    return res.status(500).json({ error: 'Erro ao criar checkout' })
  }
}
