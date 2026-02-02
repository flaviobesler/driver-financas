import { supabase } from "./supabaseClients.js";



//dados do formulario

const email = document.getElementById('email');
const senha1 = document.getElementById('password');
const senha2 = document.getElementById('password2');

//spans

const spanemail = document.getElementById('spanEmail');
const span = document.getElementById('msg');
const span2 = document.getElementById('msg2');

//formulario
const form = document.getElementById('signup-form')
const btnSubmit = document.getElementById('submit');


document.addEventListener('DOMContentLoaded', () =>{
  
  //span do email
  email.addEventListener('input',() =>{
    spanemail.textContent = 'confira se o email esta escrito corretamente';
    spanemail.style.color = 'orange';
  });

  //validação de erros
  function validarsenha(senha1){
    const erros = []

    if(senha1.length < 8){
      erros.push('minimo de 8 caracteres');}
    
    if(!/[a-z]/.test(senha1)){
      erros.push('uma letra minuscula')};
    
    if(!/[A-Z]/.test(senha1)){
      erros.push('uma letra maiúscula')};

    if(!/\d/.test(senha1)){
      erros.push('um numero')};
    
    if(!/[@$!%*#?&]/.test(senha1)){
      erros.push('um simbulo')};  

    return erros;}
  
  //span da senha
  senha1.addEventListener('input', () =>{
    const erros = validarsenha(senha1.value);
    if(erros.length > 0){
      span.textContent = `A senha deve conter: \n` + erros.join(',\n');
      span.style.color = 'red';}
    else{span.textContent = '';}
  })

  //span senha 2
  senha2.addEventListener('input', () =>{
    if(senha1.value !== senha2.value){
      span2.textContent = 'as senhas são diferentes';
      span2.style.color = 'red';
    }
    else{
      span2.textContent = '';}
  })


})//final do carregamento DOM


//formulario de cadastro
  btnSubmit.addEventListener('click', () =>{
    form.addEventListener('submit', async (e) =>{
      e.preventDefault();

      const {data, error} = await supabase.auth.signUp({
        email : email.value,
        password: senha1.value
      },{
        redirectTo:'https://driver-financas.vercel.app/login.html'
      })
    
    if(error){
      span.textContent = error.message;
    }
    else{
      span.textContent = 'Conta criada. Verifique seu e-mail.';
      span.style.color = 'green';
    }

    btnSubmit.disabled = true;


    })



  })