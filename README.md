# driver-financas
saas de controle financeiro simples criado para aprendizado.
SaaS simples de controle financeiro voltado para motoristas de aplicativo, desenvolvido como **projeto de aprendizado** em JavaScript, HTML, CSS e Supabase.
O objetivo do projeto é consolidar conceitos de frontend, autenticação, banco de dados e regras de segurança (RLS), simulando um produto real.

## Funcionalidades
- Cadastro e login de usuários
- Definição de meta semanal de ganhos
- Registro de ganhos diários
- Cálculo automático de progresso semanal
- Visualização gráfica do desempenho
- Interface simples e responsiva
---
## Tecnologias utilizadas
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla JS)**
- **Supabase**
  - Auth (autenticação)
  - Database (PostgreSQL)
  - Row Level Security (RLS)
---
## Ele foi criado com o objetivo de:
- aprender JavaScript na prática
- entender integração frontend ↔ banco de dados
- aplicar autenticação real
- lidar com erros, segurança e arquitetura básica de um SaaS
---
#segurança:
- atualmente:
-  a autenticação é feita pelo supabase Auth
-  Algumas validações de lógica ainda estão concentradas no frontend (JavaScript)
- O uso de Row Level Security (RLS) está presente, porém com regras simplificadas para fins de desenvolvimento.
---
 **Observação importante:**  
Em um ambiente de produção real, parte dessas validações deveria ser movida para o backend (edge functions ou API intermediária), com regras de RLS mais restritivas e separação clara entre permissões de leitura e escrita.
---
Este repositório prioriza clareza, aprendizado e funcionamento do produto, deixando explícitos os pontos de evolução planejados em segurança.
---
## Autor
**Flavio Besler**  
Projeto desenvolvido para fins educacionais e de portfólio.
