import { supabase } from "./supabaseClients.js";

//veiculo
const btnVeiculo = document.getElementById("btnVeiculo");
btnVeiculo.addEventListener('click', async()=>{
    btnVeiculo.disabled = true;
    try{

        const identificacao = document.getElementById("identVeiculo").value;
        const valor = -Math.abs(parseFloat(document.getElementById("valorVeiculo").value));
        const tipo = "veiculo";

        if (!identificacao || isNaN(valor)) {
            alert("preencha todos os campos corretamente");
            return;
        }
        const {data, error} = await supabase
        .from('movimentacoes')
        .insert({
            type: tipo,
            identify: identificacao,
            value: valor,
            created_at: new Date().toISOString()
        })


        if(error){
            console.error("erro ao registrar")
        }
        else{
            alert("despesa registrada com sucesso");
        }

    } catch (e) {
        console.error(e);
    }
    setTimeout(() => {
        btnVeiculo.disabled = false;
    }, 10000);

});

//pessoal
const btnPessoal = document.getElementById("btnPessoal");
btnPessoal.addEventListener('click', async()=>{

    btnPessoal.disabled = true;
    try{
        const identificacao = document.getElementById("identPessoal").value;
        const valor = -Math.abs(parseFloat(document.getElementById("valorPessoal").value));
        const tipo = "pessoal"

        if (!identificacao || isNaN(valor)) {
            alert("preencha todos os campos corretamente");
            return;
        }

        const {data, error} = await supabase
        .from('movimentacoes')
        .insert({
            type: tipo,
            identify: identificacao,
            value: valor,
            created_at: new Date().toISOString()
        })


        if(error){
            console.error("erro ao registrar")
        }
        else{
            alert("despesa registrada com sucesso");
        }


    } catch (e) {
        console.error(e);
    }
    setTimeout(() => {
        btnPessoal.disabled = false;
    }, 10000);


});
