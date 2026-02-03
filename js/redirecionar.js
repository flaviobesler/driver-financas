import { supabase } from './supabaseClients.js'

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    window.location.href = '/login.html'
    return
  }

  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    }
  })

  // 🔥 PROTEÇÃO CONTRA ERRO NÃO JSON
  if (!res.ok) {
    const text = await res.text()
    console.error('Erro backend:', text)
    alert('Erro ao iniciar pagamento')
    return
  }

  const data = await res.json()

  window.location.href = data.url
})
