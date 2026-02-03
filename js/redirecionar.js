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

  if (!res.ok) {
    const text = await res.text()
    console.error(text)
    alert('Erro ao iniciar pagamento')
    return
  }

  const data = await res.json()

  if (data.url) {
    window.location.href = data.url
  } else {
    alert('Erro ao iniciar pagamento')
  }
})
