import { supabase } from './supabaseClient.js'

document.addEventListener('DOMContentLoaded', () => {
  assinar()
})

async function assinar() {
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    window.location.href = '/login.html'
    return
  }

  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.session.access_token}`
    }
  })

  const result = await res.json()

  if (result.url) {
    window.location.href = result.url
  } else {
    alert('Erro ao iniciar pagamento')
  }
}
