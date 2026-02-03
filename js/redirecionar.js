import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', assinar)

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

  const text = await res.text()

  if (!res.ok) {
    console.error('Erro backend:', text)
    alert('Erro ao iniciar pagamento')
    return
  }

  const json = JSON.parse(text)

  if (json.url) {
    window.location.href = json.url
  }
}
