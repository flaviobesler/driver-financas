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
    
    const SpanCancelar = document.getElementById('SpanCancelar');
    const btnCancelar = document.getElementById('cancelar');
    const btnDesejoCancelar = document.getElementById('DesejoCancelar');
    const SpanCancelar2 = document.getElementById('SpanCancelar2');
    const btnManter = document.getElementById('manterAssinatura');
    const btnRedefinir = document.getElementById('redefinirSenha');
    const btnassinar = document.getElementById('assinar');
    

InputNome.style.display = 'none';
btnSalvar.style.display = 'none';
SpanCancelar.style.display = 'none';
btnDesejoCancelar.style.display = 'none';
SpanCancelar2.style.display = 'none';
btnManter.style.display = 'none';

document.addEventListener('DOMContentLoaded', async () =>{

    const {data, error} = await supabase
    .from ('usuarios')
    .select('id, nome, email, status, trial_ends_at, created_et ');



    const userId = data[0].id;
    const nomebanco = data[0].nome
    const emailbanco = data[0].email;
    const statusbanco  = data[0].status;
    const trialEnd = data[0].trial_ends_at;
    const criado = data[0].created_et
    console.log(criado)

    if(statusbanco !== 'ativo'){
        btnCancelar.style.display = 'none';
        btnassinar.style.display = 'block';
    }else{
        btnCancelar.style.display = 'block';
        btnassinar.style.display = 'none';
    }




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

    if(statusbanco === 'aguardando'){
        Spanvencimento.textContent = 'aguardando pagamento';
    }
    if(statusbanco === 'cancelado'){
        Spanvencimento.textContent = 'cancelado';
        Spanvencimento.style.color = 'red';
    }
    if(statusbanco ==='ativo'){
        const proximomes = String(new Date().getMonth()+2).padStart(2, '0');
        const dia = criado.slice(8,10)

        Spanvencimento.textContent =  `${dia}/${proximomes}`
    }


btnCancelar.addEventListener('click',  () => {
    btnRedefinir.style.display= 'none';
    btnCancelar.style.display = 'none';

    btnDesejoCancelar.style.display = 'block';
    btnManter.style.display = 'block';

    SpanCancelar.style.display = 'block';
    SpanCancelar2.style.display = 'block';

    SpanCancelar.style.color = 'red';
    SpanCancelar2.style.color = 'red';
    SpanCancelar2.style.fontWeight = 'bold';

    SpanCancelar.textContent = 'tem certeza que deseja cancelar sua assinatura?'
    SpanCancelar2.textContent = 'Para voltar, será necessário assinar novamente'


})

btnManter.addEventListener('click', () => {
    btnRedefinir.style.display= 'block';
    btnCancelar.style.display = 'block';

    btnDesejoCancelar.style.display = 'none';
    btnManter.style.display = 'none';

    SpanCancelar.style.display = 'none';
    SpanCancelar2.style.display = 'none';
})

btnDesejoCancelar.addEventListener('click', async () => {

    const {error: updadeError} = await supabase
    .from('usuarios')
    .update({
        status: 'cancelado'
    })
    .eq('id', userId);

    if(updadeError){
        console.error(updadeError);
        return;}

    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error(error);
        return;}
  window.location.href = '/login.html';


})
btnsair.addEventListener('click', async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  window.location.href = '/login.html';
});








});
