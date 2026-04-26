import { supabase } from "./supabaseClients.js";


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

//inicio do codigo
const botao =  document.getElementById('gerarRelatorio');



botao.addEventListener('click', async()=>{
    botao.disabled = true;
    try{

        const conteiner = document.getElementById('tabela');

        const inicio    =  new Date(document.getElementById('inicioResumo').value);
        const fim       =  new Date(document.getElementById('fimResumo').value);

        inicio.setHours(0,0,0,0);
        fim.setHours(23,59,59,999);

        const Span      =  document.getElementById('span');

        if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
            Span.textContent = 'preencha todos os campos';
            Span.style.color = 'red';
            return;
        }
        if(fim < inicio){
            Span.textContent = 'a data final não pode ser menor que a data inicial'
            Span.style.color = 'red';
            return;
        }


        const {data, error} = await supabase
        .from('movimentacoes')
        .select('id, type, identify, value, created_at')

        const movimentacoes = data;
    
        function limparRelatorio() {
            conteiner.textContent = '';
        } 
        limparRelatorio();


        function gerar_relatorio(inicio, fim){
            const lista = [];

            movimentacoes.forEach(item =>{
                const dataReferencia = new Date(formatarDataLocal(item.created_at));
                

                if(dataReferencia < inicio || dataReferencia >fim) return;

                lista.push ({
                        id: item.id,
                        tipo: item.type,
                        descricao: item.identify,
                        valor: item.value,
                        data: dataReferencia})
                })//fim do forEach
            return lista;
        }//fim da function

        const PagamentosFiltrados = gerar_relatorio(inicio, fim);
        const valores = PagamentosFiltrados.map(item=>item.valor);
        let total = valores.reduce((acc,n)=> acc+n,0);

        const spanTotal = document.getElementById('spantotal');
        spanTotal.textContent = `seu saldo R$ ${formatarReal(total)}`

        if(total >0){spanTotal.style.color = 'green';}
        else if(total <0){spanTotal.style.color = 'red'}
        else{spanTotal.style.color = 'gray'}


        PagamentosFiltrados.forEach(item =>{
            const dl1 = document.createElement('dl');

                const dtDescricacao = document.createElement('dt');
                dtDescricacao.textContent = 'descrição';

                const ddDescricao = document.createElement('dd');
                ddDescricao.textContent = item.descricao;

                const dtOrigem = document.createElement('dt');
                dtOrigem.textContent = 'origem';

                const ddOrigem = document.createElement('dd');
                ddOrigem.textContent = item.tipo;
            dl1.append(dtOrigem,ddOrigem,dtDescricacao,ddDescricao);

            const dl2 = document.createElement('dl');
                const dtValor = document.createElement('dt');
                dtValor.textContent = 'valor';

                const ddvalor = document.createElement('dd');
                ddvalor.textContent = `R$ ${formatarReal(item.valor)}`;

                const dtData = document.createElement('dt');
                dtData.textContent = 'data';

                const ddData = document.createElement('dd');
                ddData.textContent = formatarDataLocal(item.data);
            dl2.append(dtValor, ddvalor, dtData, ddData);

            const div = document.createElement('div');
            div.classList.add('listas');
            div.append(dl1, dl2);
            

            const excluir = document.createElement('button');
            excluir.textContent = 'excluir'
            conteiner.append(div, excluir);

            excluir.addEventListener('click', async()=>{
                const {error} = await supabase
                    .from('movimentacoes')
                    .delete()
                    .eq('id', item.id)
                    total -= Number(item.valor);
                    spanTotal.textContent = `Total: ${formatarReal(total)}`;

                    if(total >0){spanTotal.style.color = 'green';}
                    else if(total <0){spanTotal.style.color = 'red'}
                    else{spanTotal.style.color = 'gray'}

                    div.remove()
                    excluir.remove()
            })
        })
    
    } catch (e) {
        console.error(e);
    }
    setTimeout(() => {
        botao.disabled = false;
    }, 10000);

})