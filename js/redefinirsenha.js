import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', () =>{
    const span = document.getElementById('span');

    function validarSenha(senha1){
      const erros = [];

      if(senha1.length < 8){
        erros.push( 'minimo de 8 caracteres')};
      
      if(!/[a-z]/.test(senha1)){
         erros.push( 'uma letra minuscula')};
      
      if(!/[A-Z]/.test(senha1)){
         erros.push( 'uma letra maiúscula')};
      
      if(!/\d/.test(senha1)){
         erros.push( 'um número')};
      
      if(!/[@$!%*#?&]/.test(senha1)){
         erros.push( 'um simbulo')}; 
      return erros;
      }

    const inputSenha = document.getElementById('senha1')
    inputSenha.addEventListener('input', () =>{

    const erros = validarSenha(inputSenha.value);
    if (erros.length > 0) {
      span.textContent = 'A senha precisa conter:\n' + erros.join(',\n ');
      span.style.color = 'red';
      }else {
      span.textContent = '';
      }
  })
    const btnRedefinir = document.getElementById('redefinir');
    document.getElementById('login').style.display = 'none';
    document.getElementById('redefinir').addEventListener('click', async () => {
        
        const senha1 = document.getElementById('senha1').value;
        const senha2 = document.getElementById('senha2').value;
        
      const erros = validarSenha(senha1);
        if (erros.length > 0) {
            span.textContent = 'Corrija a senha antes de continuar';
            span.style.color = 'red';
        return;}

        if (senha1 !== senha2){
        span.textContent= 'as senhas não estão iguais';
        return;}


        const {error} = await supabase.auth.updateUser({
            password: senha1
        })


        if(error){
            alert(error.message);
        }else{
            span.textContent = 'senha alterada com sucesso, retorne ao login'
        }
        document.getElementById('redefinir').style.display = 'none';
        document.getElementById('login').style.display = 'block';
        btnRedefinir.disabled = true;

    })

})