import { supabase } from "./supabaseClients.js";

console.log("despesas.js carregado");

document.getElementById("btn_avulso").addEventListener("click", add_avulso);

async function add_avulso() {

    const identificacao_avulso = document.getElementById('id_avulso').value;
    const valor_avulso = parseFloat(document.getElementById('valor_avulso').value);
    const pagament_avulso = document.getElementById('pag_avulso').value;
    let parcelament_avulso = parseInt(document.getElementById('parcel_avulso').value);

    if (
        pagament_avulso === 'pix' ||
        pagament_avulso === 'debito'||
        pagament_avulso === 'dinheiro'||
        pagament_avulso === 'outras'
    ){parcelament_avulso = 1}

    if (pagament_avulso === 'credito' && (isNaN(parcelament_avulso) || parcelament_avulso <= 0)){
        alert ('preencha a quantidade de parcelas');
        return;
    }

    if (!identificacao_avulso || !valor_avulso || valor_avulso<=0){
        alert('preencha todos os campos');
        return;
    }

    const {data, error} = await supabase
    .from ('despesas_avulsas')
    .insert({
        identificacao: identificacao_avulso,
        valor: valor_avulso,
        forma_pagamento: pagament_avulso,
        parcelamento: parcelament_avulso,
        criado_em: new Date().toISOString()
        
    })

    if (error){
        console.error(error);
        alert('erro ao registrar');
        return;
    }
    
    document.getElementById('id_avulso').value="";
    document.getElementById('valor_avulso').value="";
    document.getElementById('pag_avulso').value="pix";

    alert('despesa registrada com sucesso')
}

//fixo

document.getElementById('btn_fixo').addEventListener('click', add_fixo);

async function add_fixo(){

    const identificacao_fixo = document.getElementById('id_fixo').value;
    let valor_fixo = parseFloat(document.getElementById('valor_fixo').value);
    const vencimento_fixo = document.getElementById('venci_fixo').value;

    if (!identificacao_fixo.trim()||
        !vencimento_fixo ||
        isNaN(valor_fixo) || valor_fixo<=0){
        alert('preencha todos os campos!');
        return;
    }

    const {data, error} = await supabase
    .from('despesas_fixas')
    .insert({
        identificacao: identificacao_fixo,
        valor: valor_fixo,
        dia_vencimento: vencimento_fixo
    })
     if (error){
        console.error(error);
        alert('erro ao registrar');
        return;
    }
    
    document.getElementById('id_fixo').value='';
    document.getElementById('valor_fixo').value='';
    document.getElementById('venci_fixo').value='';

    alert('despesa registrada com sucesso')
    }

document.querySelectorAll('.btn_recor').forEach(botao => {
    botao.addEventListener('click', add_recorrencia);
})

async function add_recorrencia(event) {
    const item = event.target.dataset.item;

    const valor = parseFloat(document.getElementById(`valor_recor_${item}`).value);
    const venc = document.getElementById(`venci_recor_${item}`).value;

    if (isNaN(valor) || valor <= 0 || !venc) {
        alert('Preencha todos os campos!');
        return;
    }

    const { data, error } = await supabase
        .from('despesas_recorrentes')
        .insert({
            identificacao: item,
            valor: valor,
            vencimento: venc,
            criado_em: new Date().toISOString()//sem slice, isso faz o banco só receber um horario fixo
        });
        
   

    if (error) {
        console.error(error);
        alert('Erro ao registrar!');
        return;
    }

    document.getElementById(`valor_recor_${item}`).value = "";
    document.getElementById(`venci_recor_${item}`).value = "";

    alert(`Despesa de ${item} registrada com sucesso!`);
}

function formatarReal(valor){
  return new Intl.NumberFormat('pt-BR',{
    style: "currency",
    currency: 'BRL'
  }).format(valor);
}

document.getElementById("mostrar_dados").addEventListener('click', carregar_fixo);
async function carregar_fixo() {

    const {data, error} =await supabase
        .from('despesas_fixas')
        .select('*')

    console.log('carregar_fixo rodou');
    console.log('resposta do banco',data);
    console.log ('erro', error);


        const tabela = document.getElementById("dadosBanco");
        tabela.innerHTML = '';

        data.forEach(item => {
            const tr = document.createElement('tr');
            tr.classList.add("linha_banco")

                const tdNome = document.createElement('td');
                tdNome.className = 'coluna_nome';
                tdNome.textContent = item.identificacao;

                const tdValor = document.createElement('td');
                tdValor.className = 'coluna_nome';
                tdValor.textContent = formatarReal(item.valor);

                const tdDia = document.createElement('td');
                tdDia.className = 'coluna_nome';
                tdDia.textContent = item.dia_vencimento;

                tr.append(tdNome, tdValor, tdDia);
                tabela.appendChild(tr);
        })
        

}
