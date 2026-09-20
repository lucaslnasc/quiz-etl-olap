const SOURCE_GROUPS = [
  { id: "criacao", title: "Criação de data warehouses", count: 5 },
  { id: "relacional", title: "Relacional × multidimensional", count: 5 },
  { id: "modelagem", title: "Modelagem multidimensional", count: 5 },
  { id: "metodologias", title: "Metodologias de Data Warehouse", count: 5 },
  { id: "bi", title: "Business intelligence", count: 5 },
  { id: "banco", title: "Banco de Questões", count: 11 }
];
const sourceTitle = id => SOURCE_GROUPS.find(group => group.id === id).title;
const SQ = (group, number, topic, level, prompt, options, answer, hints, explanation, context = "") => ({
  id: `${group}-${number}`, type: "mc", sourceGroup: group, sourceNumber: number,
  source: `${sourceTitle(group)} · questão ${number}`, topic, level, prompt, options, answer, hints, explanation, context
});
const SD = (group, number, topic, level, prompt, context, hints, rubric, model, note = "", image = "") => ({
  id: `${group}-${number}`, type: "disc", sourceGroup: group, sourceNumber: number,
  source: `${sourceTitle(group)} · questão ${number}`, topic, level, prompt, context, hints, rubric, model, note, image
});

window.SOURCE_GROUPS = SOURCE_GROUPS;
window.SOURCE_BANK = [
  SQ("criacao", 1, "Dados", 1,
    "Como classificar o banco relacional, os e-mails/PDFs e as páginas XML da empresa?",
    ["Estruturados: banco relacional; não estruturados: e-mails e PDFs; semiestruturados: XML.", "Não estruturados: banco relacional; estruturados: e-mails e PDFs; semiestruturados: XML.", "Semiestruturados: banco relacional; não estruturados: e-mails e PDFs; estruturados: XML.", "Estruturados: banco relacional; semiestruturados: e-mails e PDFs; não estruturados: XML.", "Redimensionados: banco; duplicados: e-mails e PDFs; indefinidos: XML."], 0,
    ["O banco relacional tem esquema de colunas definido.", "XML tem marcações; texto livre de e-mails e conteúdo de PDFs não seguem uma tabela única."],
    "A alternativa A corresponde à classificação esperada pelo exercício. Planilhas podem variar conforme sua organização; o enunciado foca banco relacional, documentos e XML.",
    "Há planilhas Excel, um banco relacional de 1 TB, 312 PDFs, 12 mil e-mails e 212 páginas XML."),
  SQ("criacao", 2, "DW & BI", 1,
    "A equipe de compras analisa repetidamente apenas dados de fornecedores de um DW corporativo. Qual solução é mais adequada?",
    ["Replicar todo o DW para leitura.", "Criar um data mart especializado em fornecedores.", "Excluir do DW os dados de outros assuntos.", "Copiar os dados de fornecedores para uma planilha.", "Remover objetos semiestruturados do DW."], 1,
    ["O uso se concentra em um assunto e uma equipe.", "Um subconjunto analítico por área é chamado data mart."],
    "Um data mart reúne os dados necessários a uma área ou assunto específico, preservando o DW corporativo."),
  SQ("criacao", 3, "ETL", 3,
    "Segundo a distinção adotada pelo exercício, qual ferramenta se destaca por uma arquitetura E-LT em vez de ETL tradicional?",
    ["Oracle Data Integrator (ODI)", "DataStage", "PowerCenter", "Ab Initio", "SSIS"], 0,
    ["A questão contrasta transformação no destino com transformação em um motor intermediário.", "A ferramenta da Oracle é conhecida por E-LT."],
    "Resposta esperada no exercício: ODI, cuja arquitetura típica E-LT carrega antes de transformar no destino. Atenção: a documentação oficial da Oracle informa que o ODI também suporta fluxos ETL; portanto, a expressão ‘única que não é baseada em ETL’ é simplificadora."),
  SQ("criacao", 4, "DW & BI", 1,
    "Qual alternativa é uma informação, em vez de um dado isolado?",
    ["Azulado.", "Rio Grande do Sul.", "Jogadores com mais de 30 anos.", "A bola azul é do jogador Carlos.", "Jogadores do Rio Grande do Sul gostam mesmo."], 3,
    ["Uma informação articula dados em uma afirmação com sentido completo.", "Procure a frase que relaciona objeto, característica e pessoa."],
    "A frase ‘A bola azul é do jogador Carlos’ combina dados e expressa uma relação compreensível. A alternativa D é a resposta esperada."),
  SQ("criacao", 5, "DW & BI", 1,
    "Qual afirmação sobre data warehouse e data marts corresponde ao material?",
    ["DW não volátil dividido em data mining.", "DW não volátil dividido em data mining volátil.", "DW volátil dividido em data marts não voláteis.", "DW não volátil dividido em data marts voláteis.", "DW não volátil, com data marts especializados também voltados a dados históricos."], 4,
    ["Data mining é técnica de análise, não um repositório departamental.", "Pense no data mart como recorte analítico do DW."],
    "A alternativa E expressa a resposta do exercício: o DW é não volátil e pode alimentar data marts especializados. A política concreta de atualização de cada data mart depende do projeto."),

  SQ("relacional", 1, "Modelagem", 2,
    "Sobre relacionamentos em um modelo relacional, quais afirmativas estão corretas?",
    ["I, apenas.", "III, apenas.", "I e II, apenas.", "II e III, apenas.", "I, II e III."], 3,
    ["Uma propriedade de entidade é um atributo; relacionamento é associação.", "II define associação entre ocorrências; III trata do papel desempenhado pela entidade."],
    "II e III estão corretas. A I confunde atributo (propriedade) com relacionamento (associação entre entidades).",
    "I. Relacionamento é uma propriedade sobre a qual se deseja manter informações. II. Relacionamento é um conjunto de associações entre ocorrências de entidades. III. O papel da entidade descreve o que sua instância desempenha em uma instância do relacionamento."),
  SQ("relacional", 2, "Modelagem", 1,
    "Qual é uma característica central da modelagem de um data warehouse?",
    ["Refletir a visão do usuário final e as necessidades do negócio.", "Representar apenas a visão do analista de dados.", "Ser idêntica ao modelo dos sistemas operacionais.", "Usar somente modelagem relacional na origem.", "Seguir etapas rígidas iguais para toda organização."], 0,
    ["O DW existe para apoiar decisões de quem consome os dados.", "Métricas e dimensões devem responder às perguntas do negócio."],
    "O modelo dimensional deve representar métricas e dimensões relevantes para os usuários e gestores, refletindo as regras do negócio."),
  SQ("relacional", 3, "Modelagem", 1,
    "Qual afirmação descreve corretamente tabela fato e tabelas dimensão?",
    ["A fato dispensa dimensões, pois contém todas as descrições.", "A fato reúne métricas e chaves das dimensões; as dimensões trazem descrições.", "Dimensões guardam métricas e chaves estrangeiras da fato.", "Dimensões recebem todas as métricas; a fato apenas agrupa.", "Um DW deve evitar dimensões para ser mais rápido."], 1,
    ["Medidas ficam no centro do esquema estrela.", "As dimensões permitem filtrar e agrupar a medida por contexto."],
    "A fato armazena medidas e chaves para dimensões; as dimensões armazenam atributos descritivos como cliente, produto e tempo."),
  SQ("relacional", 4, "DW & BI", 2,
    "Qual prática ajuda a organizar e validar um projeto de data warehouse?",
    ["Ouvir apenas os dados indicados pelo usuário e ignorar políticas de controle.", "Escolher banco e ferramentas sem considerar o projeto.", "Comunicar objetivos e decisões a todos os participantes do projeto.", "Deixar a validação somente com o analista, sem usuários.", "Encerrar toda manutenção após a entrega."], 2,
    ["A modelagem precisa refletir regras do negócio.", "A participação de gestores, usuários e equipe técnica reduz desalinhamentos."],
    "A comunicação entre os envolvidos permite entender métricas, regras e necessidades do usuário final e validar o projeto com eles."),
  SQ("relacional", 5, "Modelagem", 2,
    "Qual comparação entre esquema estrela e floco de neve está correta?",
    ["No estrela, dimensões são normalizadas; no floco, não.", "No floco, dimensões não podem se relacionar.", "No estrela, fato está sempre na terceira forma normal e dimensões na segunda.", "No estrela, dimensões são em geral desnormalizadas e a redundância pode simplificar consultas.", "O estrela é necessariamente mais complexo que o floco."], 3,
    ["Compare a quantidade de tabelas auxiliares ligadas às dimensões.", "O esquema estrela tende a usar menos junções e aceitar repetição em atributos descritivos."],
    "A alternativa D corresponde ao material: estrela usa dimensões normalmente desnormalizadas; floco de neve as normaliza, reduzindo redundância e aumentando relações."),

  SQ("modelagem", 1, "Modelagem", 1,
    "Qual forma costuma representar visualmente uma modelagem multidimensional?",
    ["Quadrado", "Cubo", "Octógono", "Pirâmide", "Estrela"], 1,
    ["Pense na combinação de medidas com vários eixos de dimensão.", "Produto, local e tempo podem ser eixos de um cubo."],
    "O cubo é a representação didática de medidas vistas por várias dimensões. Um esquema estrela é um arranjo de tabelas, não a forma perguntada aqui."),
  SQ("modelagem", 2, "Operações OLAP", 1,
    "Qual é a principal função do OLAP?",
    ["Acessar e alterar dados corporativos como um sistema transacional.", "Importar dados de vários SGBDs.", "Verificar dados pessoais pelo usuário.", "Consultar e analisar dados corporativos com bom desempenho.", "Transformar dados importados antes da carga."], 3,
    ["OLAP significa processamento analítico online.", "Seu foco é exploração e agregação, não registro de transações."],
    "OLAP permite consultas e análises multidimensionais de dados corporativos, frequentemente com agregações e navegação por hierarquias."),
  SQ("modelagem", 3, "Modelagem", 1,
    "Quais elementos compõem um modelo multidimensional OLAP?",
    ["Fatos, histórico e métodos.", "Metodologia, dimensões e arquivos.", "Dimensões, medidas e recursividade.", "Fatos, ponteiros e hipóteses.", "Fatos, dimensões e medidas."], 4,
    ["A medida é um valor analisável; a dimensão explica seu contexto.", "A tabela fato reúne medidas e ligações para dimensões."],
    "Fatos registram eventos mensuráveis; medidas quantificam esses eventos; dimensões dão contexto à análise."),
  SQ("modelagem", 4, "Modelagem", 2,
    "Quais são esquemas usuais de modelagem multidimensional?",
    ["Estrela, cubo e pirâmide.", "Floco de neve e constelação de estrelas, apenas.", "Estrela, floco de neve e constelação de fatos.", "Quadrado, circular e linear.", "Estrela, bola de neve e galáxia."], 2,
    ["Há esquemas com uma fato central e com várias fatos compartilhando dimensões.", "A lista correta contém estrela e floco de neve, além da constelação de fatos."],
    "Estrela, floco de neve e constelação de fatos são padrões de organização dimensional citados no exercício."),
  SQ("modelagem", 5, "Operações OLAP", 1,
    "Qual é a função de Slice and Dice?",
    ["Trocar linhas por colunas.", "Fatiar e selecionar porções menores dos dados.", "Aumentar a velocidade do DW automaticamente.", "Atualizar dados de um usuário.", "Não existe essa função."], 1,
    ["A operação seleciona subconjuntos do cubo.", "Slice pode fixar uma dimensão; dice pode restringir intervalos em várias dimensões."],
    "Slice and dice seleciona fatias ou subcubos para examinar um recorte da informação. Trocar linhas por colunas é pivot."),

  SQ("metodologias", 1, "DW & BI", 1,
    "Segundo o exercício, qual diferença resume melhor DW e banco de dados operacional tradicional?",
    ["Só o DW permite relacionamentos.", "O banco operacional sempre contém mais dados que o DW.", "O DW centraliza dados para análise; o banco operacional atende registros do dia a dia.", "O DW só funciona em UNIX.", "Não há diferença."], 2,
    ["Compare análise histórica com transações correntes.", "A alternativa correta destaca a finalidade analítica do DW."],
    "A alternativa C é a intenção do exercício. Bancos operacionais também permitem consultas, mas o DW é projetado para dados integrados, históricos e consultas analíticas."),
  SQ("metodologias", 2, "DW & BI", 2,
    "Entre as alternativas do exercício, qual reúne características atribuídas a um DW?",
    ["Cliente/servidor, inconsistência e estrutura relacional.", "Consistência, desorganização e volatilidade.", "Organização, não relacional e consistência.", "Consistência, cliente/servidor, organização e volatilidade.", "Organização, consistência e não volatilidade, em uma implementação relacional cliente/servidor."], 4,
    ["Elimine alternativas que afirmam volatilidade ou inconsistência.", "A não volatilidade preserva o histórico analítico."],
    "E é a alternativa esperada. Organização, integração/consistência e não volatilidade são propriedades centrais; ser relacional ou cliente/servidor é escolha de implementação, não requisito universal."),
  SQ("metodologias", 3, "DW & BI", 2,
    "Qual é a função mais próxima de um repositório de metadados em um DW?",
    ["Documentar e localizar definições dos dados para apoiar o uso e a consulta.", "Garantir sozinho o relacionamento entre todas as tabelas.", "Impedir automaticamente qualquer atraso de atualização.", "Aumentar sozinho a velocidade do servidor.", "Tornar cliente e servidor compatíveis."], 0,
    ["Metadados são dados sobre os dados.", "Eles registram nomes, significados, fontes, regras e momentos de extração."],
    "A é a melhor opção entre as propostas. O enunciado original fala em ‘indexar os metadados’; mais precisamente, o repositório documenta definições, origens e regras dos dados para facilitar sua interpretação."),
  SQ("metodologias", 4, "ETL", 2,
    "Como um DW recebe mudanças feitas nas bases de origem, segundo o material?",
    ["Por atualização sempre síncrona com cada transação.", "Apenas por meio de metadados.", "Por atualização assíncrona planejada entre fontes e DW.", "Somente por manutenção manual.", "Não pode receber mudanças."], 2,
    ["O DW normalmente não atualiza cada linha no mesmo instante da transação operacional.", "Cargas podem ocorrer em lotes ou por captura de mudanças, com latência definida."],
    "O material descreve atualização assíncrona. O projeto deve definir frequência, tratamento de alterações e nível de atualidade exigido pelo negócio."),
  SQ("metodologias", 5, "DW & BI", 1,
    "Quais ferramentas são usadas para explorar dados de um DW?",
    ["Análise e sorteio aleatório.", "Análise e mineração de dados.", "Mineração e exclusão de dados.", "Nenhuma consulta é possível.", "Apenas consulta simples."], 1,
    ["O objetivo é extrair padrões e apoiar decisões.", "Uma ferramenta analisa indicadores; a outra descobre padrões nos dados."],
    "Ferramentas de análise e de mineração de dados ajudam a consultar, resumir e encontrar padrões no DW."),

  SQ("bi", 1, "DW & BI", 2,
    "Qual sequência sintetiza melhor o ciclo contínuo de BI entre as alternativas do exercício?",
    ["Coleta, transformação, relatório e armazenamento em data mart.", "Integração, análise, decisão e feedback que orienta novas ações.", "Armazenamento, dashboards, ações e auditoria apenas.", "Extração, monitoramento, ações e arquivamento apenas.", "Relatórios, revisão, integração e atualização do banco."], 1,
    ["O ciclo não termina na visualização.", "Depois da decisão, resultados e feedback alimentam o próximo planejamento."],
    "B é a opção mais completa dentre as oferecidas. O ciclo detalhado do material também inclui planejamento, coleta, processamento, produção, disseminação e avaliação."),
  SQ("bi", 2, "DW & BI", 1,
    "Qual é a relação entre data warehouse e data marts em uma arquitetura de BI?",
    ["O data mart é central e o DW guarda apenas relatórios.", "São sempre independentes e sem integração.", "O data mart organiza um subconjunto por área de negócio, frequentemente derivado do DW.", "O DW tornou os data marts obsoletos.", "O data mart coleta dados brutos para depois montar o DW."], 2,
    ["O DW integra a visão corporativa.", "O data mart atende perguntas de uma área específica."],
    "Na arquitetura descrita pelo exercício, data marts derivam do DW e atendem áreas ou assuntos específicos. Em outras arquiteturas, a integração pode seguir desenho bottom-up."),
  SQ("bi", 3, "DW & BI", 3,
    "No caso da secretaria municipal, quais afirmativas sobre implantação e ciclo de BI estão corretas?",
    ["I e II, apenas.", "II e III, apenas.", "III e IV, apenas.", "I, III e IV, apenas.", "I, II e III, apenas."], 0,
    ["Treinamento e acesso padronizado podem ampliar a autonomia; governança continua necessária.", "O feedback mantém o ciclo, enquanto qualidade de dados e custo-benefício não podem ser ignorados."],
    "I e II são verdadeiras. III é falsa porque a visualização não corrige dados inconsistentes; IV é falsa porque benefícios não dispensam avaliar custos e resultados.",
    "I. Padronização, treinamentos e portal ampliam autonomia. II. Feedback após disseminação/avaliação retroalimenta o planejamento. III. BI dispensa integração e qualidade. IV. BI elimina análise de custo-benefício."),
  SQ("bi", 4, "DW & BI", 1,
    "Que tipo de informação um DW disponibiliza, segundo suas características centrais?",
    ["Informações categorizadas e integradas.", "Informações integradas e voláteis.", "Informações voláteis e seguras.", "Séries históricas descentralizadas.", "Informações descentralizadas e categorizadas."], 0,
    ["Dados de diferentes fontes são padronizados e organizados por assunto.", "Volatilidade e descentralização não descrevem o objetivo de um DW."],
    "O DW oferece informações integradas e organizadas por temas/categorias para análises históricas e comparações."),
  SQ("bi", 5, "DW & BI", 2,
    "Qual vantagem de BI é destacada no caso da rede de supermercados VerdeMix?",
    ["Identificar apenas produtos sazonais.", "Projetar o impacto de mudanças de preço sobre o volume vendido.", "Monitorar concorrentes em tempo real como única função.", "Definir descontos automáticos como única função.", "Reconhecer apenas clientes da linha premium."], 1,
    ["O caso combina dados históricos e simulação de cenários.", "A pergunta central é ‘o que pode acontecer se o preço mudar?’"],
    "O BI permite simular cenários de precificação e estimar seu efeito sobre as vendas, apoiando decisões de estoque e margem."),

  SD("banco", 1, "Modelagem", 2,
    "Explique a diferença entre Star Schema e Snowflake Schema em Data Warehousing.",
    "Considere estrutura, normalização e impacto nas consultas.",
    ["Observe se os atributos de cada dimensão permanecem numa só tabela.", "Uma estrutura pode reduzir redundância ao custo de mais junções."],
    ["Star: fato central ligada diretamente a dimensões em geral desnormalizadas.", "Snowflake: dimensões normalizadas em tabelas auxiliares.", "Relaciona redundância, simplicidade e número de junções."],
    "No Star Schema, a fato central liga-se a dimensões normalmente desnormalizadas. Isso torna o desenho simples e reduz junções, embora repita atributos. No Snowflake, dimensões são normalizadas em tabelas auxiliares, diminuindo repetição e aumentando a complexidade das consultas."),
  SD("banco", 2, "ETL", 2,
    "Explique detalhadamente extração, transformação e carga no processo ETL.",
    "Dê exemplos de tarefas em cada etapa.",
    ["Siga a ordem E → T → L.", "Depois de coletar, pense em limpar/padronizar antes de gravar."],
    ["Extração lê dados de fontes como OLTP, arquivos e APIs.", "Transformação valida, limpa, converte formatos, deduplica e integra.", "Carga insere os dados preparados no destino analítico.", "Pode mencionar carga inicial e incremental."],
    "Extração coleta registros das fontes e identifica o que mudou. Transformação valida tipos, corrige inconsistências, padroniza códigos e datas, remove duplicatas e aplica regras de negócio. Carga grava o resultado no DW ou data mart, de forma completa ou incremental."),
  SD("banco", 3, "DW & BI", 1,
    "Qual é a diferença entre OLAP e Data Warehouse?",
    "Use o exemplo de uma análise de vendas por região e mês.",
    ["Separe repositório de processamento analítico.", "Um guarda e organiza o histórico; o outro permite explorá-lo."],
    ["DW reúne dados históricos integrados para análise.", "OLAP é a forma de consultar/agregar medidas por dimensões.", "Um exemplo mostra como os dois se complementam."],
    "O DW armazena e organiza vendas históricas de várias fontes. OLAP permite consultar esse conjunto por mês, região e produto, fazendo agregações, filtros e navegação em hierarquias."),
  SD("banco", 4, "Modelagem", 3,
    "Projete um Star Schema com uma única fato para gasto por cliente em 2025, quantidade por departamento e semana, e top 10 clientes por itens comprados em setembro de 2025. Mostre três consultas SQL.",
    "Use a figura: ITEM_COMPRA → COMPRA → CLIENTE; ITEM_COMPRA → PRODUTO → CATEGORIA → DEPARTAMENTO. Indique grão, medidas e dimensões.",
    ["Use uma linha de ITEM_COMPRA como grão; ela tem QTD_PRODUTO e PCO_PRODUTO.", "A data e o cliente estão em COMPRA; o departamento chega por PRODUTO → CATEGORIA. No Star, esses atributos podem ser incorporados às dimensões."],
    ["Grão: uma linha por ITEM_COMPRA, identificada por NUM_ITEM_COMPRA e NUM_COMPRA.", "FatoItemCompra relaciona DimCliente, DimProduto e DimTempo e guarda quantidade, preço unitário e valor_item = quantidade × preço.", "DimProduto incorpora categoria e departamento; DimTempo deriva de COMPRA.DATA_HOR_COMPRA, convertida para data na ETL.", "SQL 1 soma valor_item por cliente em 2025.", "SQL 2 soma quantidade por departamento, ano e semana.", "SQL 3 soma quantidade por cliente em setembro/2025, ordena e limita a 10.", "Defina quais situações de COMPRA contam como venda concluída para não incluir compras canceladas."],
    `Origem na figura: ITEM_COMPRA(NUM_ITEM_COMPRA, NUM_COMPRA, COD_PRODUTO, QTD_PRODUTO, PCO_PRODUTO) liga-se a COMPRA(NUM_COMPRA, COD_CLIENTE, DATA_HOR_COMPRA), CLIENTE, PRODUTO, CATEGORIA e DEPARTAMENTO.

Modelo estrela — grão: uma linha por ITEM_COMPRA.
FatoItemCompra(item_compra_id, num_compra, cliente_sk, produto_sk, tempo_sk, quantidade, preco_unitario, valor_item)
DimCliente(cliente_sk, cod_cliente, nom_cliente)
DimProduto(produto_sk, cod_produto, nom_produto, cod_categoria, nom_categoria, cod_departamento, nom_departamento)
DimTempo(tempo_sk, data, ano, mes, semana_ano)

Na ETL: quantidade = ITEM_COMPRA.QTD_PRODUTO; preco_unitario = ITEM_COMPRA.PCO_PRODUTO; valor_item = quantidade * preco_unitario. Obtenha COD_CLIENTE e DATA_HOR_COMPRA por NUM_COMPRA; converta a data/hora de COMPRA para data e calendário. Derive departamento via PRODUTO → CATEGORIA → DEPARTAMENTO. Considere somente compras concluídas, conforme a situação registrada no sistema; o diagrama não informa quais códigos representam essa situação.

1) SELECT c.cod_cliente, c.nom_cliente, SUM(f.valor_item) AS gasto
FROM FatoItemCompra f
JOIN DimCliente c ON c.cliente_sk = f.cliente_sk
JOIN DimTempo t ON t.tempo_sk = f.tempo_sk
WHERE t.ano = 2025
GROUP BY c.cod_cliente, c.nom_cliente;

2) SELECT p.nom_departamento, t.ano, t.semana_ano, SUM(f.quantidade) AS qtd
FROM FatoItemCompra f
JOIN DimProduto p ON p.produto_sk = f.produto_sk
JOIN DimTempo t ON t.tempo_sk = f.tempo_sk
GROUP BY p.nom_departamento, t.ano, t.semana_ano;

3) SELECT c.cod_cliente, c.nom_cliente, SUM(f.quantidade) AS qtd
FROM FatoItemCompra f
JOIN DimCliente c ON c.cliente_sk = f.cliente_sk
JOIN DimTempo t ON t.tempo_sk = f.tempo_sk
WHERE t.ano = 2025 AND t.mes = 9
GROUP BY c.cod_cliente, c.nom_cliente
ORDER BY qtd DESC LIMIT 10;`,
    "Figura relacional fornecida para a questão 4. As tabelas da solução são propostas para o Data Warehouse; seus nomes não existem literalmente no sistema de origem.",
    "modelo-relacional-questao-4.png"),
  SD("banco", 5, "Medalhão", 2,
    "Explique a arquitetura medalhão e suas camadas.",
    "Use Bronze, Silver e Gold e descreva como a qualidade dos dados evolui.",
    ["A primeira camada preserva dados brutos.", "A camada final atende relatórios e usuários de negócio."],
    ["Bronze ingere e preserva dados próximos da origem.", "Silver valida, limpa, padroniza e integra.", "Gold entrega dados curados, modelados ou agregados para consumo analítico."],
    "Bronze recebe dados brutos e mantém rastreabilidade. Silver limpa, valida, deduplica e integra registros. Gold organiza resultados prontos para análise de negócio, como receita mensal por região. A qualidade e a utilidade aumentam a cada camada."),
  SD("banco", 6, "Dados", 1,
    "O que são dados estruturados, semiestruturados e não estruturados?",
    "Dê um exemplo de cada tipo.",
    ["Compare esquema fixo, chaves flexíveis e conteúdo livre.", "Pense em tabela relacional, JSON/XML e texto/áudio."],
    ["Estruturados possuem esquema regular, como uma tabela de vendas.", "Semiestruturados têm marcações ou chaves flexíveis, como JSON/XML.", "Não estruturados não seguem campos regulares, como texto livre, imagem ou áudio."],
    "Uma tabela relacional de vendas é estruturada porque possui colunas definidas. Um arquivo JSON ou XML é semiestruturado porque tem chaves ou marcações, mas formato flexível. O texto livre de e-mail, uma imagem ou áudio é não estruturado."),
  SD("banco", 7, "DW & BI", 2,
    "Desenhe uma arquitetura tecnológica de Business Intelligence.",
    "Você pode escrever o fluxo com setas, indicando a função de cada camada.",
    ["Comece nos sistemas de origem.", "Passe por ETL/ELT, armazenamento, análise e visualização."],
    ["Inclui fontes operacionais/externas.", "Inclui integração e qualidade por ETL/ELT.", "Inclui DW/data marts ou estrutura analítica.", "Inclui OLAP/consultas e relatórios/dashboards para decisão."],
    "Fontes (OLTP, planilhas, APIs) → ETL/ELT (extração, validação, integração) → DW/data marts (histórico organizado) → consultas/OLAP (medidas e indicadores) → dashboards/relatórios → decisões e feedback. Governança e metadados acompanham o fluxo."),
  SD("banco", 8, "OLTP × OLAP", 2,
    "Quais as principais diferenças práticas entre sistemas OLTP e OLAP?",
    "Compare finalidade, tipo de consulta, atualização e exemplo.",
    ["Um registra eventos correntes; o outro analisa conjuntos históricos.", "Pense em concluir uma venda versus comparar vendas trimestrais."],
    ["OLTP executa transações operacionais com escritas frequentes.", "OLAP executa consultas analíticas com agregações e várias dimensões.", "Dá exemplos concretos e menciona histórico/latência."],
    "OLTP registra uma venda e atualiza estoque, com transações curtas e frequentes. OLAP consulta muitos registros históricos para comparar receita por produto, região e período, usando agrupamentos e agregações. Os dados operacionais são preparados para análise por ETL/ELT."),
  SD("banco", 9, "Modelagem", 2,
    "Defina tabelas fato e dimensão e diferencie Star Schema de Snowflake Schema quanto à normalização e redundância.",
    "Responda às partes a e b do enunciado.",
    ["A fato registra medidas; as dimensões descrevem o contexto.", "Compare a organização dos atributos descritivos nos dois esquemas."],
    ["Fato central tem medidas e chaves de dimensões, com grão definido.", "Dimensões guardam atributos usados em filtros e agrupamentos.", "Star tende a dimensões desnormalizadas e alguma redundância.", "Snowflake normaliza dimensões em tabelas relacionadas, com mais junções."],
    "Uma tabela fato contém medidas como quantidade e valor, além de chaves para dimensões. Tabelas dimensão contêm descrições como cliente, produto e tempo. No Star, dimensões normalmente desnormalizadas ligam-se à fato; no Snowflake, são separadas em tabelas auxiliares normalizadas, reduzindo repetição e exigindo mais junções."),
  SD("banco", 10, "ETL", 2,
    "Descreva as três etapas do ETL e explique por que a transformação é essencial quando o DW recebe duas ou mais fontes.",
    "Responda às partes a e b do enunciado.",
    ["Explique E, T e L na ordem.", "Fontes podem usar moedas, datas, códigos e definições diferentes para a mesma coisa."],
    ["Extração coleta registros das fontes.", "Transformação limpa, valida, converte e aplica regras comuns.", "Carga grava dados preparados no DW.", "Explica que padronizar fontes evita duplicidade e indicadores incompatíveis."],
    "A extração lê dados operacionais. A transformação verifica qualidade, corrige inconsistências, converte formatos e concilia códigos/identidades. A carga grava o resultado no DW. Com várias fontes, sem regras comuns, datas, clientes ou produtos podem ser contados de formas diferentes e distorcer indicadores."),
  SQ("banco", 11, "ETL", 2,
    "Sobre o papel do ETL entre OLTP e OLAP, quais afirmativas estão corretas?",
    ["I, apenas.", "II e III, apenas.", "I e II, apenas.", "I, II e III."], 2,
    ["A extração lê registros operacionais; a transformação prepara os dados.", "A carga não deve transferir inconsistências para o usuário final resolver em gráficos."],
    "I e II são verdadeiras. III é falsa: o objetivo do ETL é tratar e carregar dados adequados ao ambiente analítico, não deixar a limpeza para quem usa OLAP.",
    "I. ETL extrai registros cotidianos dos sistemas OLTP. II. A transformação verifica, higieniza e padroniza conforme o DW. III. A carga coloca dados brutos e inconsistentes no OLAP para limpeza pelo usuário.")
];

