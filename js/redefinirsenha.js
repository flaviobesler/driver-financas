import { supabase } from "./supabaseClients.js";

console.log('js carregou')

document.getElementById('login').style.display = 'none';


document.getElementById('redefinir').addEventListener('click', async () => {
    
    const senha1 = document.getElementById('senha1').value;
    const senha2 = document.getElementById('senha2').value;
    const span = document.getElementById('span');


    if (senha1 !== senha2){
    span.textContent= 'as senhas não estão iguais';
    return;}

    if(senha1.length < 6){
        span.textContent = 'a senha deve ter no minimo 6 caracteres'
        return;
    }

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
    

})

