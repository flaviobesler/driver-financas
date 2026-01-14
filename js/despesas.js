import { supabase } from "./supabaseClients.js";

console.log("despesas.js carregado");

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
  }
});




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
    ){parcelament_avulso = 0}

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
    document.getElementById('btn_avulso').disabled = true;
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
    document.getElementById('btn_fixo').disabled = true;
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
document.getElementById('esconder_dados').style.display = 'none';
document.getElementById('tabelabanco').style.display = 'none';

document.getElementById("mostrar_dados").addEventListener('click', carregar_fixo);
async function carregar_fixo() {
    const tbody = document.getElementById('dadosBanco');
    tbody.replaceChildren();


    const {data, error} =await supabase
        .from('despesas_fixas')
        .select('identificacao, dia_vencimento, valor')

        
        const valores = data.map(item => Number(item.valor));
        const total = valores.reduce((acc, valor) => acc + valor,0);

        const esteMes = String(new Date().getMonth()+1).padStart(2, '0');
        console.log(esteMes)




        const tabela = document.getElementById("dadosBanco");
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
                const dia = item.dia_vencimento.slice(8,10);
                tdDia.textContent = `${dia}/${esteMes}`;

                tr.append(tdNome, tdValor, tdDia);
                tabela.appendChild(tr);
           
        });

        const trTotal = document.createElement('tr');
        const tdTotal = document.createElement('td');
        tdTotal.colSpan = 3;
        tdTotal.className = 'coluna_nome';
        tdTotal.textContent = 'total: ' +formatarReal(total)

        trTotal.appendChild(tdTotal)
        tabela.appendChild(trTotal);

        
    document.getElementById('mostrar_dados').style.display = 'none';
    document.getElementById('esconder_dados').style.display = 'block';
    document.getElementById('tabelabanco').style.display = 'block';
}



document.getElementById('esconder_dados').addEventListener('click', esconder_dados)
function esconder_dados(){
    
    
    document.getElementById('tabelabanco').style.display = 'none';
    document.getElementById('mostrar_dados').style.display = 'block';
    document.getElementById('esconder_dados').style.display = 'none';
    const tbody = document.getElementById('dadosBanco');
    tbody.replaceChildren();
    
}

