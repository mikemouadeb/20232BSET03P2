# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2

## Vulnerabilidades identificadas e as medidas adotadas para corrigir cada uma delas.

### SQL Injection
- Descrição: O primeiro código permitia a injeção de SQL, uma vez que os parâmetros dos comandos SQL eram colocados diretamente na string de consulta, sem nenhuma sanitização ou validação. Assim, poderia acontecer de um usuário mal-intencionado manipular o comando SQL, causando danos ao banco de dados ou acessando dados sensíveis.
- Medida Adotada: Foi implementado o uso de "prepared statements" através do db.prepare(). Isso irá garantir que os valores inseridos pelo usuário sejam tratados como dados, e não como parte do comando SQL, eliminando a possibilidade de injeção de SQL.

### Falta de Validação de Entradas: 
- Descrição: No método de voto, não havia validação para checar se o tipo de animal (cats ou dogs) era válido. Isso poderia trazer erros inesperados ou a manipulação mal-intencionada das tabelas do banco de dados.
- Medida Adotada: Foi adicionada uma verificação explícita do tipo de animal no início do método de voto, retornando um erro, caso o tipo de animal não for válido.

### Atualização de Dados Sem Verificação: 
- Descrição: O primeiro código não checava se o animal especificado existia mesmo, antes de atualizar o número de votos. Assim, isso poderia resultar em alterações no banco de dados para registros inexistentes.
- Medida Adotada: Antes de atualizar o número de votos, o código irá verificar se o registro específico do animal existe. Caso o animal não seja encontrado, é retornado um erro 404.

### Tratamento Inadequado de Erros
- Descrição: O tratamento de erros no primeiro código era errado e poderia vazar detalhes de implementação internos, o que é uma prática ruim tanto do ponto de vista de segurança quanto de usabilidade.
- Medida Adotada: O tratamento de erros foi melhorado para mandar mensagens de erro mais genéricas ao usuário final, enquanto os detalhes do erro são registrados internamente (console.error). Isso evita a exposição de detalhes de implementação e melhora a experiência do usuário.
