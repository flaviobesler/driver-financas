import { supabase } from "./supabaseClients.js";
console.log('js carregou');



document.addEventListener('DOMContentLoaded', async () =>{

    const nomeSpan = document.getElementById('nome');
    const emailSpan = document.getElementById('email');
    const statusSpan = document.getElementById('status');


    const {data, error} = await supabase
    .from ('usuarios')
    .select('id, nome, email, status');

    const id = data[0].id;
    const nome = String(data[0].nome);
    const email = String(data[0].email);
    console.log(email);
    console.log(nome);
    console.log(id);

    nomeSpan.textContent = nome;
    emailSpan.textContent = email;



});