import { supabase } from "./supabaseClients.js";


document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = '/login.html';
  }
});



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


const lista = document.getElementById('lista');
const tbody = document.getElementById('tbody');
const btndespesas = document.getElementById('btnDespesas');
const btnLucro = document.getElementById('btnLucros');


document.addEventListener('DOMContentLoaded', () =>{
const inicioDespesa = document.getElementById('iniciodespesa');
const fimDespesa = document.getElementById('fimdespesa');
const inicioLucro = document.getElementById('inicioLucro');
const fimLucro = document.getElementById('fimLucro');


fimDespesa.addEventListener('change', () => {
    if (!inicioDespesa.value) {
        alert('Preencha a data inicial primeiro');
        fimDespesa.value = '';
        fimDespesa.disabled = true;
        return;
    }

    const inicio = new Date(inicioDespesa.value);
    const fim = new Date(fimDespesa.value);

    if (fim < inicio) {
        alert('A data final não pode ser menor que a data inicial');
        fimDespesa.value = '';
    }
})

fimLucro.addEventListener('change', () => {
    if (!inicioLucro.value) {
        alert('Preencha a data inicial primeiro');
        fimLucro.value = '';
        fimLucro.disabled = true;
        return;
    }

    const inicio = new Date(inicioLucro.value);
    const fim = new Date(fimLucro.value);

    if (fim < inicio) {
        alert('A data final não pode ser menor que a data inicial');
        fimLucro.value = '';
    }
})

})








btndespesas.addEventListener('click', async ()=>{
    const inicioDespesa = document.getElementById('iniciodespesa').value;
    const fimDespesa = document.getElementById('fimdespesa').value;

 
    
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
   
const inicio = new Date(inicioDespesa)
const fim = new Date (fimDespesa)

inicio.setHours(0,0,0,0);
fim.setHours(23,59,59,999);




function gerarRelatorio(inicio, fim) {
  const lista = [];

  datadespesa.forEach(item => {
    const pagamento = item.forma_pagamento;

    // escolhe a data certa
    const dataReferencia =
      pagamento === 'credito'
        ? new Date(item.data_parcela)
        : new Date(item.criado_em);

    // filtra
    if (dataReferencia < inicio || dataReferencia > fim) return;

  

    lista.push({
      id: item.id,
      descricao: item.identificacao,
      valor: item.valor,
      parcela:
        pagamento === 'credito'
          ? `${item.parcelamento}`
          : '-',
      data: dataReferencia
    });
  });

  return lista;
}


const pagamentosFiltrados = gerarRelatorio(inicio, fim);

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
    alert('atualize a pagina')

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

    const inicioLucro = document.getElementById('inicioLucro').value;
    const fimLucro = document.getElementById('fimLucro').value;


    const {data: dataGanho, error: errorGanho} = await supabase
    .from('ganhos_do_dia')
    .select('*')

    if(errorGanho){
        console.error(errorGanho)
    }


    function limparRelatorio() {
  tbody.textContent = '';
  lista.textContent = '';
} 
 limparRelatorio();

const inicio = new Date(inicioLucro);
const fim = new Date (fimLucro);

inicio.setHours(0,0,0,0);
fim.setHours(23,59,59,999);

console.log(inicio)
console.log(fim)



function gerarRelatorio(inicio, fim){
    const lista  = []
    dataGanho.forEach(item =>{
        const dataItem = new Date(item.criado_em)
        if(dataItem >= inicio && dataItem<= fim){
        lista.push({
            id: item.id,
            descricao: item.identificacao,
            valor: item.valor,
            parcela: '-',
            data: dataItem})
        }//fim do if
    })//fim do forEach
    
    return lista;
}

const pagamentosFiltrados = gerarRelatorio(inicio, fim)

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

