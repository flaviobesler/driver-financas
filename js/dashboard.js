import { supabase } from "./supabaseClients.js";

const apresentacao = document.getElementById('apresentacao');
const bemVindo = document.getElementById('Bem-vindo');
const nomeInput = document.getElementById('nome');
const addNome = document.getElementById('addnome');
const SalvarNome = document.getElementById('salvarNome');
const SpanNome = document.getElementById('SpanNome');

nomeInput.style.display = 'none';
SalvarNome.style.display = 'none';

addNome.addEventListener('click', () =>{
  nomeInput.style.display = 'block';
  SalvarNome.style.display = 'inline';
  addNome.style.display = 'none';

  nomeInput.focus();
})

SalvarNome.addEventListener('click', async () => {

  const {data} = await supabase
  .from('usuarios')
  .select('id');

  const userId = data[0].id;
  console.log(userId)
  const { error } = await supabase
    .from('usuarios')
    .update({
      nome: nomeInput.value
    })
    .eq('id', userId);

  if (error) {
    console.error(error);
    return;
  }

  SalvarNome.disabled = true;

})

document.addEventListener('DOMContentLoaded', async () =>{

  const {data, error} = await supabase
  .from('usuarios')
  .select('nome');

  const ValorNome = data[0].nome;
  SpanNome.textContent = ValorNome;

})


if(SpanNome.textContent.length){
  apresentacao.style.display = 'none';
  bemVindo.style.display = 'block';

}else{
  apresentacao.style.display = 'block';
  bemVindo.style.display = 'none';
};


document.getElementById('btn_ganho').addEventListener('click',add_ganho);
async function add_ganho() {

    const identificacao = document.getElementById('identificacao_ganho').value;
    const valor = parseFloat(document.getElementById('valor_ganho').value);

    if ( !valor || valor<=0 ){
        alert('preencha todos os campos!');
        return;
    }

    const {data:dataGanhos, error: errorGanhos} = await supabase
    .from ('ganhos_do_dia')
    .insert({
        identificacao,
        valor,
        criado_em: new Date().toISOString()
    });

    if (dataGanhos || errorGanhos) {
    alert('erro ao registrar')};

    document.getElementById('identificacao_ganho').value="";
    document.getElementById('valor_ganho').value="";

    alert('lucro registrada com sucesso!')
    document.getElementById('btn_ganho').disabled = true;
}


document.getElementById('btn_registrar').addEventListener('click', add_meta);

async function add_meta() {
  const Metaa = parseFloat(document.getElementById('valor_meta').value);

  if (!Metaa || Metaa <= 0) {
    alert('Informe um valor válido');
    return;
  }

  const {data:dataMeta, error:errorMeta} = await supabase 
 .from('meta_semanal') 
 .insert({ valor: Metaa }); 
 
 if (errorMeta){
   console.error(errorMeta);
    return; }

  alert('Meta salva com sucesso');
  document.getElementById('btn_registrar').disabled = true;
}

function formatarReal(valor){
  return new Intl.NumberFormat('pt-BR',{
    style: "currency",
    currency: 'BRL'
  }).format(valor);
}

//antes do grafico
document.addEventListener('DOMContentLoaded', async () =>{
  

  const {data:metaData, error:metaError} = await supabase
    .from('meta_semanal')
    .select('id, valor');
    
  
  const {data:ganhoData, error:ganhoError} = await supabase
    .from('ganhos_do_dia')
    .select('valor, criado_em');

    
    
  if (metaError || ganhoError){
    console.error(metaError || ganhoError);
    return;
  }
  
  //reutilização da query 'meta_semanal'

  const metaId = metaData.id;
  const meta = Number(metaData[0].valor);//usar [0] só com rls de desenvolvimento 'with - true' no supabase

  const metaSpan = document.getElementById('metaValor');
  const metaInput = document.getElementById('valor_meta');
  const btnRegistrar = document.getElementById('btn_registrar');
  const btnEditar = document.getElementById('btn_editar');
  const btnEdMeta = document.getElementById('btn_editarMeta');

  metaSpan.textContent = formatarReal(meta);
  metaInput.value = meta;
  

  if (!meta || meta <=0){
    metaSpan.style.display = 'none';
    metaInput.style.display = 'inline';

    btnRegistrar.style.display = 'inline';
    btnEdMeta.style.display = 'none';
    btnEditar.style.display = 'none';
      return;
  }

  metaSpan.style.display = 'inline';
  metaInput.style.display = 'none';

  btnRegistrar.style.display = 'none';
  btnEditar.style.display = 'inline';


  //
  btnEditar.addEventListener('click', () => {
  metaSpan.style.display = 'none';
  metaInput.style.display = 'inline';
  btnEditar.style.display = 'none';
  btnEdMeta.style.display = 'inline';

  metaInput.focus();
  });
  //
btnEdMeta.addEventListener('click', Editarmeta)

async function Editarmeta() {
  const valoreditado = parseFloat(document.getElementById('valor_meta').value);

  if (!valoreditado || valoreditado <= 0) {
    alert('Informe um valor válido');
    return;
  }
     await supabase
    .from('meta_semanal')
    .update({ valor: valoreditado })
    .eq('id', metaId)
    .select()

    //se o await não foi definido como const {data, error}, o if(error) não vai funcionar
  

}
//meta diaria 
const metadiaria = document.getElementById('metadiaria');
const diaria = meta /7;
metadiaria.textContent = formatarReal(diaria)


//final da reutilização da query

  const ganhos = ganhoData; //arrays das colunas valor e criado_em

  
  

  function getSemanaAtual(){
    const hoje = new Date(); 
    console.log('hoje:', hoje, 'diaSemana:', hoje.getDay());
    
    const diaSemana = hoje.getDay();
    // Ajusta para que a semana comece na segunda-feira
    const diffSegunda = diaSemana === 0? -6:1 - diaSemana; // se segunda (0?) começa nova semana (-6), caso contrario é (dia x da mesma semana)
    console.log('diffSegunda:', diffSegunda);

    //definir nova semana
    const segunda = new Date(hoje);
    segunda.setDate(hoje.getDate()+diffSegunda);
    segunda.setHours(0,0,0,0);



    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate()+6);
    domingo.setHours(23,59,59,);


    return {segunda, domingo}; //ordem correta: inicio(segunda) e domingo(fim)
  }
  

  const {segunda,domingo } = getSemanaAtual();
  
  const inicio = segunda;
  const fim = domingo;
  

  const progresso = calcularProgresso(
    meta,
    ganhos,
    inicio,
    fim
  );

  function calcularProgresso(){
    const totalGanhos = ganhos
    .filter(g =>{
      const data = new Date(g.criado_em);
      return data>= inicio && data<= fim;
    })
    .reduce((soma,g) => soma + g.valor,0);
    
    return{
      atingido: totalGanhos,
      restante: Math.max(meta - totalGanhos, 0)//lembra sempre de usar o math.max
    };
    
  }
  
  
  const canvas = document.getElementById('metaChart');
  const ctx = canvas.getContext('2d');
  console.log('Chart:', Chart);
  console.log('canvas size:', canvas.width, canvas.height);

  new Chart (ctx,{
    type: 'doughnut',
    data:{
      labels:['atingido', 'restante'],
      datasets:[{
        data: [progresso.atingido, progresso.restante],
        backgroundColor: ['red', 'blue']
      }]
    },
    options:{
      animation: false,
      responsive: false,
    }
    
    
  })

  if (!canvas) {
  console.error('Canvas metaChart não encontrado');
  return;
}


const faltante = document.getElementById('faltante');
faltante.textContent = (progresso.restante).toFixed(2);


});




