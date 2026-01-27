console.log('js carregou')
import { supabase } from "./supabaseClients.js";

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
  }
});



const lista = document.getElementById('lista');
const lista2 = document.getElementById('lista2');
const tbody = document.getElementById('tbody');
const select = document.getElementById('selectDespesas');
const btndespesas = document.getElementById('btnDespesas');
const btnLucro = document.getElementById('btnLucros');
const selectLucro = document.getElementById('selectLucros');

const btnPDFdespesas = document.getElementById('PDFDespesas');
const btnPDFLucro = document.getElementById('PDFLucros')


//desativado por enquanto
btnPDFLucro.style.display = 'none';
btnPDFdespesas.style.display = 'none';

document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
  }
});


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



btndespesas.addEventListener('click', async ()=>{
    const { data: datadespesa, error } = await supabase
        .from('despesas_avulsas')
        .select('*');

 if (error) {
    console.error(error);
    return;
    }   


    
function limparRelatorio() {
  tbody.textContent = '';
  lista.textContent = '';
} 
 limparRelatorio();

    

const pagamentos = datadespesa ;
	
pagamentos.forEach(item => {
  item.valor = item.valor / item.parcelamento;
});

const meses = Number(select.value);

function filtro(meses) {
  const inicio = new Date();
  const fim = new Date();

  inicio.setHours(0, 0, 0, 0);
  fim.setHours(23, 59, 59, 999);

  inicio.setMonth(fim.getMonth() - meses);

  return { inicio, fim };
}

const { inicio, fim } = filtro(meses);

function filtroPagamento(inicio, fim) {
  const resultado = [];
  pagamentos.forEach(item => {
    const compra = new Date(item.criado_em);
    const parcelas = item.parcelamento;

    let valido = false;

    for (let i = 0; i < parcelas; i++) {
      const dataParcela = new Date(compra);
      dataParcela.setMonth(compra.getMonth() + i);

      if (dataParcela >= inicio && dataParcela <= fim) {
        valido = true;
        break;
      }
    }
    if (!valido) return;

    if (item.forma_pagamento !== 'credito') {
      resultado.push({
        id: item.id,
        descricao: item.identificacao,
        valor: item.valor,
        parcela: '-',
        data: compra
      });
      return;
    }

   
    for (let i = 0; i < parcelas; i++) {
      const dataParcela = new Date(compra);
      dataParcela.setMonth(compra.getMonth() + i);

      if (dataParcela >= inicio && dataParcela <= fim) {
        resultado.push({
          id: item.id,
          descricao: item.identificacao,
          valor: item.valor,
          parcela: `${i + 1}/${parcelas}`,
          data: dataParcela
        });
      }
    }
  });

  return resultado;
}

function limparRelatorio() {
  tbody.textContent = '';
  lista.textContent = '';
}

const pagamentosFiltrados = filtroPagamento(inicio, fim);

//telefones
pagamentosFiltrados.forEach(item =>{
    const tr = document.createElement('tr')

    const tdDescrição = document.createElement('td')
    tdDescrição.textContent = item.descricao

    const tdValor = document.createElement('td')
    tdValor.textContent = item.valor
    
    const tdparcela = document.createElement('td')
    tdparcela.textContent = item.parcela

    const tdData = document.createElement('td')
    tdData.textContent = item.data.toLocaleDateString('pt-BR')

    const botaoExcluirdividadesk = document.createElement('button')
    botaoExcluirdividadesk.textContent = 'excluir';

    tr.append(tdDescrição, tdValor, tdparcela, tdData, botaoExcluirdividadesk)
    tbody.appendChild(tr);

    botaoExcluirdividadesk.addEventListener('click', async () => {
    const confirmar = confirm('Deseja excluir esta despesa?');
    if (!confirmar) return;

    const { error } = await supabase
        .from('despesas_avulsas')
        .delete()
        .eq('id', item.id);

    if (error) {
        console.error(error);
        alert('Erro ao excluir despesa');
        return;
    }

    tr.remove();
    });
})


pagamentosFiltrados.forEach(item => {
    //criação lista1
    const dl = document.createElement('dl');
    const dtDescricao = document.createElement('dt');
    dtDescricao.textContent = 'descrição';
   

    const ddDescricao = document.createElement('dd')
    ddDescricao.textContent = item.descricao;

    const dtValor = document.createElement('dt')
    dtValor.textContent = 'valor'

    const ddValor = document.createElement('dd')
    ddValor.textContent = `R$ ${item.valor}`

    dl.append(dtDescricao, ddDescricao, dtValor, ddValor)
    //criação lista2
    const dl2 = document.createElement('dl');

    const dtParcela = document.createElement('dt');
    dtParcela.textContent = 'parcela';

    const ddParcela = document.createElement('dd')
    ddParcela.textContent = item.parcela

    const dtData = document.createElement('dt');
    dtData.textContent = 'data';

    const ddData = document.createElement('dd')
    ddData.textContent = item.data.toLocaleDateString('pt-BR')
    dl2.append(dtParcela, ddParcela, dtData, ddData)


    //uma div para centralizar
    const wrapper = document.createElement('div')
    wrapper.classList.add('listas')
    
    const botaoExcluirdivida = document.createElement('button')
    botaoExcluirdivida.textContent = 'excluir'
    
    wrapper.append(dl, dl2)
    lista.append(wrapper, botaoExcluirdivida)
    // ativar_botãoExcluir


    botaoExcluirdivida.addEventListener('click', async () => {
    const confirmar = confirm('Deseja excluir esta despesa?');
    if (!confirmar) return;

    const { error } = await supabase
        .from('despesas_avulsas')
        .delete()
        .eq('id', item.id);

    if (error) {
        console.error(error);
        alert('Erro ao excluir despesa');
        return;
    }

    // remove da tela
    wrapper.remove();
    botaoExcluirdivida.remove();
    });
    

  
})
btndespesas.disabled = true
})
//btnExcluir





//lucros
btnLucro.addEventListener('click', async()=>{
const {data: dataGanho, error: errorGanho} = await supabase
    .from('ganhos_do_dia')
    .select('*')

    if(errorGanho){
        console.error(errorGanho)
    }


const pagamentos = dataGanho;


const meses = Number(selectLucro.value);

function filtro(meses) {
  const inicio = new Date();
  const fim = new Date();

  inicio.setHours(0, 0, 0, 0);
  fim.setHours(23, 59, 59, 999);

  inicio.setMonth(fim.getMonth() - meses);

  return { inicio, fim };
}

const { inicio, fim } = filtro(meses);

console.log(inicio)
console.log(fim)

function filtroPagamentos(inicio, fim){
    const resultado = [];
    pagamentos.forEach(item => {
        const compra = new Date(item.criado_em);
        if(compra >= inicio && compra <= fim){
            resultado.push({
            id: item.id,
            descricao: item.identificacao,
            valor: item.valor,
            parcela: '-',
            data: compra
            })
        }

    })
    return resultado;
}

function limparRelatorio() {
  tbody.textContent = '';
  lista.textContent = '';
} 
 limparRelatorio();



const pagamentosFiltrados = filtroPagamentos(inicio, fim)

pagamentosFiltrados.forEach(item =>{
    const tr = document.createElement('tr')

    const tdDescrição = document.createElement('td')
    tdDescrição.textContent = item.descricao

    const tdValor = document.createElement('td')
    tdValor.textContent = item.valor
    
    const tdparcela = document.createElement('td')
    tdparcela.textContent = item.parcela

    const tdData = document.createElement('td')
    tdData.textContent = item.data.toLocaleDateString('pt-BR')

    const botaoExcluirlucro = document.createElement('button')
    botaoExcluirlucro.textContent = 'excluir';

    tr.append(tdDescrição, tdValor, tdparcela, tdData, botaoExcluirlucro)
    tbody.appendChild(tr);

    botaoExcluirlucro.addEventListener('click', async () => {
    const confirmar = confirm('Deseja excluir esta despesa?');
    if (!confirmar) return;

    const { error } = await supabase
        .from('ganhos_do_dia')
        .delete()
        .eq('id', item.id);

    if (error) {
        console.error(error);
        alert('Erro ao excluir despesa');
        return;
    }

    tr.remove();
    });

    
    
})


pagamentosFiltrados.forEach(item => {
    //criação lista1
    const dl = document.createElement('dl');
    const dtDescricao = document.createElement('dt');
    dtDescricao.textContent = 'descrição';
   

    const ddDescricao = document.createElement('dd')
    ddDescricao.textContent = item.descricao;

    const dtValor = document.createElement('dt')
    dtValor.textContent = 'valor'

    const ddValor = document.createElement('dd')
    ddValor.textContent = `R$ ${item.valor}`

    dl.append(dtDescricao, ddDescricao, dtValor, ddValor)
    //criação lista2
    const dl2 = document.createElement('dl');

    const dtParcela = document.createElement('dt');
    dtParcela.textContent = 'parcela';

    const ddParcela = document.createElement('dd')
    ddParcela.textContent = item.parcela

    const dtData = document.createElement('dt');
    dtData.textContent = 'data';

    const ddData = document.createElement('dd')
    ddData.textContent = item.data.toLocaleDateString('pt-BR')
    dl2.append(dtParcela, ddParcela, dtData, ddData)


    //uma div para centralizar
    const wrapper = document.createElement('div')
    wrapper.classList.add('listas')
    
    const botaoExcluirlucro = document.createElement('button')
    botaoExcluirlucro.textContent = 'excluir'
    
    wrapper.append(dl, dl2)
    lista.append(wrapper, botaoExcluirlucro)

    botaoExcluirlucro.addEventListener('click', async () => {
    const confirmar = confirm('Deseja excluir esta despesa?');
    if (!confirmar) return;

    const { error } = await supabase
        .from('ganhos_do_dia')
        .delete()
        .eq('id', item.id);

    if (error) {
        console.error(error);
        alert('Erro ao excluir despesa');
        return;
    }

    // remove da tela
    wrapper.remove();
    botaoExcluirlucro.remove();
    });
  
})
btnLucro.disabled = true
})

