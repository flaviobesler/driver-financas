import { supabase } from "./supabaseClients.js";
console.log('js carregou');

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
  }
});

    const nomeSpan = document.getElementById('nome');
    const InputNome = document.getElementById('InputNome');
    const btnEditar = document.getElementById('btnEditar');
    const btnSalvar = document.getElementById('btnSalvar');
    const emailSpan = document.getElementById('email');
    const statusSpan = document.getElementById('status');
    const Spanvencimento = document.getElementById('vencimento');
    const btnsair = document.getElementById('sair');
    

InputNome.style.display = 'none';
btnSalvar.style.display = 'none';

document.addEventListener('DOMContentLoaded', async () =>{

    const {data, error} = await supabase
    .from ('usuarios')
    .select('id, nome, email, status, trial_ends_at, created_et ');

    const userId = data[0].id;
    const nomebanco = data[0].nome
    const emailbanco = data[0].email;
    const statusbanco  = data[0].status;
    const trialEnd = data[0].trial_ends_at;
    const criado = data[0].created_et;

    console.log(emailbanco);
    console.log(nomebanco);
    console.log(userId);

    

    //atualizar nome
    btnEditar.addEventListener('click', () =>{
    nomeSpan.style.display = 'none';
    btnEditar.style.display ='none';
    InputNome.style.display = 'block';
    btnSalvar.style.display = 'block';

    })
    btnSalvar.addEventListener('click', async() =>{
    const {data, error} = await supabase
    .from('usuarios')
    .update({
        nome: InputNome.value
    })
    .eq('id', userId);

    if(error){
        console.error(error);
        return;
    }
    btnSalvar.disabled = true;});


    nomeSpan.textContent = nomebanco;
    emailSpan.textContent = emailbanco;
    statusSpan.textContent = statusbanco;

    if(statusbanco === 'trial'){
        Spanvencimento.textContent = trialEnd;
    }
    if(statusbanco === 'cancelado'){
        Spanvencimento.textContent = 'cancelado';
        Spanvencimento.style.color = 'red';
    }
    if(statusbanco ==='ativado'){
        const proximomes = String(new Date().getMonth()+2).padStart(2, '0');
        const dia = criado.slice(8,10);

        Spanvencimento.textContent =  `${dia}/${proximomes}`
    }




btnsair.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  window.location.href = '/login.html';
});








});
