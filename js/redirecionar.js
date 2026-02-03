document.addEventListener('DOMContentLoaded', assinar)

async function assinar() {
  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await res.json()

  if (data.url) {
    window.location.href = data.url
  } else {
    alert('Erro ao iniciar pagamento')
  }
}