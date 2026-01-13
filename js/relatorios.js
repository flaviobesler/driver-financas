
import { supabase } from "./supabaseClients.js";

console.log('js carregou');
function formatarDataLocal(dataUTC) {
    return new Date(dataUTC).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo'});

    } //sempre definir o horario do sistema por que se não, o banco coloca em utc 0
function formatarReal(valor){
  return new Intl.NumberFormat('pt-BR',{
    style: "currency",
    currency: 'BRL'
  }).format(valor);
}


//relatorio gerado no site

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('btn_gastos_relatorio');
    btn.addEventListener('click',async ()  =>{ 

    const { data: datadespesa, error } = await supabase
        .from('despesas_avulsas')
        .select('*');

    if (error) {
        console.error(error);
        return;
    }

    const mesesFiltro = Number(document.getElementById('select_despesas').value);

    function gerarLinhasRelatorio(datadespesa, mesesFiltro) {
        const hoje = new Date();
        const resultado = [];

        datadespesa.forEach(item => {
            const dataCompra = new Date(item.criado_em);

            // NÃO PARCELADO
            if (item.forma_pagamento !== 'credito' || !item.parcelamento) {
                resultado.push({
                    descricao: item.identificacao,
                    valor: item.valor,
                    data: dataCompra,
                    parcela: '-'
                });
                return;
            }

            // PARCELADO
            const totalParcelas = Number(item.parcelamento);
            const valorParcela = item.valor / totalParcelas;

            for (let i = 0; i < totalParcelas; i++) {
                const dataParcela = new Date(dataCompra);
                dataParcela.setMonth(dataCompra.getMonth() + i);

                const diffMeses =
                    (dataParcela.getFullYear() - hoje.getFullYear()) * 12 +
                    (dataParcela.getMonth() - hoje.getMonth());

                if (diffMeses < 0 || diffMeses >= mesesFiltro) continue;

                resultado.push({
                    descricao: item.identificacao,
                    valor: valorParcela,
                    data: dataParcela,
                    parcela: `${i + 1}/${totalParcelas}`
                });
            }
        });

        return resultado;
    }

    const linhas = gerarLinhasRelatorio(datadespesa, mesesFiltro);

    const tabela = document.querySelector('.tbody');
    tabela.textContent = '';

    linhas.forEach(item => {
        const tr = document.createElement('tr');

        const tdNome = document.createElement('td');
        tdNome.textContent = item.descricao;

        const tdValor = document.createElement('td');
        tdValor.textContent = formatarReal(item.valor);

        const tdDia = document.createElement('td');
        tdDia.textContent = item.data.toLocaleDateString('pt-BR');

        const tdParcela = document.createElement('td');
        tdParcela.textContent = item.parcela;

        tr.append(tdNome, tdValor, tdDia, tdParcela);
        tabela.appendChild(tr);
    });

    document.getElementById('btn_gastos_pdf').style.display = 'block';
    document.getElementById('btn_lucro_pdf').style.display = 'none';
    });
});



document.getElementById('btn_lucro_relatorio').addEventListener('click', gerar_lucro);

async function gerar_lucro() {
    
    const {data: dataGanho, error: errorGanho} = await supabase
    .from('ganhos_do_dia')
    .select('*')

    if(errorGanho){
        console.error(errorGanho)
    }

    const dias = Number(document.getElementById('selectLucro').value);



    function calcularIntervalo(dias){
        const fim = new Date(); // lembrar que inicio e fim tem que ser const(isso não é python)
        const inicio = new Date();

        inicio.setDate(fim.getDate()- dias);
        inicio.setHours(0,0,0,0);
        fim.setHours(23,59,59,999);
        return {inicio, fim};

    }



    const {inicio, fim} = calcularIntervalo(dias);
    
    const lucroFiltrado = dataGanho.filter(g =>{
        const data = new Date(g.criado_em);
        return data >= inicio && data<=fim;
    })



    const tabela = document.querySelector('.tbody');
    tabela.textContent='';

    lucroFiltrado.forEach (item => {
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
    
    document.getElementById('btn_lucro_pdf').style.display = 'block';
    document.getElementById('btn_gastos_pdf').style.display = 'none';
}





document.getElementById("btn_gastos_pdf").addEventListener('click',gerargastoPDF);

function gerargastoPDF() {
  const relatorio = document.getElementById('relatoriopdf');

    setTimeout(()=> { // sempre lembrar de colocar essa linha...
    html2pdf() .from(relatorio).set({
        margin: 10,
        filename: 'relatorio de gastos.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css', 'legacy'] }}).save();
        },100); //... e essa linha para imprimir 100% do relatorio, caso contrario, o js não termina de carregar e fica cortando linhas

}

document.getElementById("btn_lucro_pdf").addEventListener('click',gerarPDF);
function gerarPDF() {
    const relatorio2 = document.getElementById('relatoriopdf');

    
    setTimeout(()=> {
    html2pdf() .from(relatorio2).set({
        margin: 10,
        filename: 'relatorio de lucros.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait'},
        pagebreak: { mode: ['css', 'legacy'] }
    }).save();
    },100);
}