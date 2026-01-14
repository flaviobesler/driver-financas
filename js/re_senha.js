import { supabase } from "./supabaseClients.js";

console.log('js carregou');

const btnRecuperar = document.getElementById('recuperar');

    btnRecuperar.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const span = document.getElementById('span');
    

    

    const {error} = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:5500/redefinirsenha.html'
    });
    
    if(error){
        span.textContent= 'email incorreto ou inesistente';
        return;}
        else{
            span.textContent='Email enviado! Verifique sua caixa de entrada'
        }
    
    btnRecuperar.disabled = true;
});