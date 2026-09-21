window.STUDY_NOTE_LINKS = [
  ["visao-geral", "Visão geral"],
  ["etl-elt", "ETL e ELT"],
  ["oltp-olap", "OLTP e OLAP"],
  ["data-warehouse", "Data Warehouse"],
  ["modelo-dimensional", "Modelo dimensional"],
  ["cubo-olap", "Cubo e operações OLAP"],
  ["medalhao", "Arquitetura Medalhão"],
  ["conceitos-chave", "KPI, metadados e Data Mart"],
  ["revisao-rapida", "Revisão rápida"],
];

window.STUDY_NOTES_HTML = `
  <section class="main notes-view" aria-labelledby="notes-title">
    <div class="notes-hero" id="visao-geral">
      <span class="eyebrow">GUIA DE REVISÃO</span>
      <h1 id="notes-title">ETL, OLAP, Data Warehouse e Arquitetura Medalhão</h1>
      <p class="notes-lead">Leia a matéria seguindo o caminho que os dados percorrem: da operação diária até a decisão de negócio.</p>
      <div class="learning-path" aria-label="Caminho dos dados">
        <span>OLTP</span><b>→</b><span>ETL / ELT</span><b>→</b><span>Bronze</span><b>→</b><span>Silver</span><b>→</b><span>Gold</span><b>→</b><span>Data Warehouse</span><b>→</b><span>Modelo multidimensional</span><b>→</b><span>OLAP</span><b>→</b><span>BI e dashboards</span><b>→</b><span>Decisão</span>
      </div>
      <div class="memory-card"><strong>Ideia central</strong><p>Os dados nascem nos sistemas operacionais, são tratados e organizados para depois serem analisados.</p></div>
    </div>

    <article class="note-section" id="etl-elt">
      <div class="section-heading"><span>01</span><div><p>Preparação dos dados</p><h2>ETL e ELT</h2></div></div>
      <p><strong>ETL</strong> significa <strong>Extract, Transform, Load</strong>: extrair, transformar e carregar. É o processo usado para buscar dados em diferentes fontes, corrigir e padronizar essas informações e gravá-las no destino.</p>
      <div class="stage-grid">
        <div class="stage-card"><span>1</span><h3>Extração</h3><p>Coleta dados de bancos, planilhas, APIs, sistemas web, arquivos CSV e outras fontes.</p></div>
        <div class="stage-card"><span>2</span><h3>Transformação</h3><p>Limpa, corrige, padroniza, remove duplicidades, converte tipos e aplica regras de negócio.</p></div>
        <div class="stage-card"><span>3</span><h3>Carga</h3><p>Grava os dados tratados no Data Warehouse, Data Lake ou outro repositório analítico.</p></div>
      </div>
      <div class="example-box"><strong>Exemplo</strong><p>As vendas estão em planilhas, no ERP e no e-commerce. O ETL reúne tudo, corrige datas e valores, remove registros repetidos e carrega o resultado em um repositório central.</p></div>
      <div class="comparison-grid">
        <div><span class="term">ETL</span><p><strong>Extrair → Transformar → Carregar.</strong> A transformação acontece antes da carga.</p></div>
        <div><span class="term">ELT</span><p><strong>Extrair → Carregar → Transformar.</strong> Os dados brutos são carregados primeiro e tratados dentro do destino.</p></div>
      </div>
      <p>O <strong>ELT</strong> é comum em arquiteturas modernas, porque plataformas como Data Lakes e Data Warehouses em nuvem conseguem processar grandes volumes de dados.</p>
      <h3 class="subheading">ETL incremental</h3>
      <p>Carrega somente os dados novos ou alterados desde a última execução. Ele reduz o tempo de processamento, o uso de recursos e a movimentação desnecessária de dados.</p>
      <div class="memory-card"><strong>Para lembrar</strong><p>Carga completa processa tudo novamente. Carga incremental processa apenas o que mudou.</p></div>
    </article>

    <article class="note-section" id="oltp-olap">
      <div class="section-heading"><span>02</span><div><p>Operação e análise</p><h2>OLTP e OLAP</h2></div></div>
      <p>Os dois tipos de sistema trabalham com dados, mas foram criados para objetivos diferentes.</p>
      <div class="comparison-grid wide">
        <div><span class="term">OLTP</span><h3>Processamento transacional</h3><p>Registra operações do dia a dia, como vendas, pagamentos, cadastros e pedidos.</p><ul><li>Muitas inserções e atualizações</li><li>Consultas rápidas e simples</li><li>Dados atuais e detalhados</li><li>Banco geralmente normalizado</li></ul></div>
        <div><span class="term">OLAP</span><h3>Processamento analítico</h3><p>Analisa grandes volumes de dados para apoiar decisões.</p><ul><li>Consultas complexas</li><li>Dados históricos</li><li>Agregações e comparações</li><li>Visão multidimensional</li></ul></div>
      </div>
      <div class="memory-card"><strong>Para lembrar</strong><p><strong>OLTP registra.</strong> <strong>OLAP analisa.</strong></p></div>
    </article>

    <article class="note-section" id="data-warehouse">
      <div class="section-heading"><span>03</span><div><p>Repositório analítico</p><h2>Data Warehouse</h2></div></div>
      <p>Um <strong>Data Warehouse</strong> é um repositório central criado para armazenar dados históricos e integrados, próprios para análise e tomada de decisão.</p>
      <div class="feature-grid">
        <div><strong>Orientado por assunto</strong><p>Organizado em temas como vendas, clientes, produtos e finanças.</p></div>
        <div><strong>Integrado</strong><p>Reúne fontes diferentes em uma estrutura padronizada.</p></div>
        <div><strong>Temporal</strong><p>Mantém histórico para analisar mudanças ao longo do tempo.</p></div>
        <div><strong>Não volátil</strong><p>Depois de carregados, os dados tendem a ser consultados, não alterados continuamente.</p></div>
      </div>
      <div class="memory-card"><strong>Macete: OITN</strong><p><strong>O</strong>rientado por assunto · <strong>I</strong>ntegrado · <strong>T</strong>emporal · <strong>N</strong>ão volátil.</p></div>
    </article>

    <article class="note-section" id="modelo-dimensional">
      <div class="section-heading"><span>04</span><div><p>Organização para análise</p><h2>Modelagem multidimensional</h2></div></div>
      <p>Organiza os dados para facilitar consultas analíticas. Seus dois elementos principais são a <strong>tabela fato</strong> e as <strong>tabelas dimensão</strong>.</p>
      <div class="comparison-grid wide">
        <div><span class="term">Tabela fato</span><p>Guarda eventos ou medidas numéricas do negócio.</p><ul><li>Quantidade vendida</li><li>Valor da venda</li><li>Desconto</li><li>Lucro</li></ul></div>
        <div><span class="term">Tabela dimensão</span><p>Descreve o contexto usado para analisar os fatos.</p><ul><li>Tempo</li><li>Produto</li><li>Cliente</li><li>Loja</li><li>Região</li></ul></div>
      </div>
      <div class="example-box"><strong>Exemplo</strong><p>A pergunta “qual foi o total de vendas por produto e por mês?” usa o valor da venda na tabela fato e os detalhes de produto e tempo nas dimensões.</p></div>
      <h3 class="subheading">Star Schema e Snowflake Schema</h3>
      <div class="schema-grid">
        <div><h3>Star Schema</h3><p>A tabela fato fica no centro e se conecta diretamente às dimensões. É simples, intuitivo e costuma exigir menos junções.</p><div class="mini-schema"><span>Produto</span><span>Tempo</span><strong>Fato vendas</strong><span>Cliente</span><span>Loja</span></div></div>
        <div><h3>Snowflake Schema</h3><p>As dimensões são normalizadas e divididas em outras tabelas. Reduz redundância, mas aumenta a quantidade de junções e a complexidade.</p><div class="snow-path"><span>Produto</span><b>→</b><span>Categoria</span><b>→</b><span>Departamento</span></div></div>
      </div>
      <div class="memory-card"><strong>Para lembrar</strong><p><strong>Estrela:</strong> simples e direta. <strong>Floco de neve:</strong> mais normalizado e mais complexo.</p></div>
    </article>

    <article class="note-section" id="cubo-olap">
      <div class="section-heading"><span>05</span><div><p>Análise multidimensional</p><h2>Cubo e operações OLAP</h2></div></div>
      <p>O <strong>cubo OLAP</strong> representa dados por várias dimensões. Um exemplo é analisar vendas ao mesmo tempo por <strong>produto</strong>, <strong>tempo</strong> e <strong>região</strong>.</p>
      <div class="olap-operations">
        <div><span>Slice</span><p>Seleciona uma única dimensão ou valor.</p><small>Ex.: somente o ano de 2024.</small></div>
        <div><span>Dice</span><p>Seleciona um subconjunto usando vários filtros.</p><small>Ex.: produtos A e B, regiões Sul e Sudeste, de 2023 a 2024.</small></div>
        <div><span>Drill-down</span><p>Aumenta o nível de detalhe.</p><small>Ano → trimestre → mês → dia.</small></div>
        <div><span>Roll-up</span><p>Resume e agrega os dados.</p><small>Dia → mês → trimestre → ano.</small></div>
      </div>
      <div class="memory-card"><strong>Movimento mental</strong><p><strong>Drill-down desce</strong> para ver detalhes. <strong>Roll-up sobe</strong> para enxergar o resumo.</p></div>
    </article>

    <article class="note-section" id="medalhao">
      <div class="section-heading"><span>06</span><div><p>Qualidade em camadas</p><h2>Arquitetura Medalhão</h2></div></div>
      <p>A Arquitetura Medalhão organiza os dados em camadas de qualidade crescente.</p>
      <div class="medallion-grid">
        <div class="bronze"><span>Bronze</span><h3>Dados brutos</h3><p>Dados quase como vieram da fonte, ainda sem limpeza completa. Preserva o histórico original.</p></div>
        <div class="silver"><span>Silver</span><h3>Dados tratados</h3><p>Dados limpos, padronizados, validados, integrados e sem duplicidades.</p></div>
        <div class="gold"><span>Gold</span><h3>Dados para negócio</h3><p>Dados agregados e organizados para relatórios, dashboards, KPIs e decisões.</p></div>
      </div>
      <div class="memory-card"><strong>Para lembrar</strong><p><strong>Bronze = bruto.</strong> <strong>Silver = limpo.</strong> <strong>Gold = pronto para análise.</strong></p></div>
    </article>

    <article class="note-section" id="conceitos-chave">
      <div class="section-heading"><span>07</span><div><p>Termos que aparecem na prova</p><h2>KPI, metadados e Data Mart</h2></div></div>
      <div class="concept-stack">
        <div><span class="term">KPI</span><p><strong>Key Performance Indicator</strong> é um indicador que mede o desempenho de um objetivo do negócio.</p><ul><li>Faturamento mensal</li><li>Ticket médio</li><li>Taxa de conversão</li><li>Margem de lucro</li></ul><p class="note-detail">Um KPI deve ser mensurável, relevante e ligado a um objetivo.</p></div>
        <div><span class="term">Metadados</span><p>São “dados sobre os dados”. Explicam origem, formato, significado, data de atualização e responsável por cada informação.</p><p class="note-detail">Exemplo: um campo chamado <strong>valor_venda</strong> pode ter metadados informando que é decimal, representa reais e vem do sistema de vendas.</p></div>
        <div><span class="term">Data Mart</span><p>É uma parte menor e especializada de um Data Warehouse, focada em uma área ou departamento.</p><p class="note-detail">Exemplos: Data Mart de Vendas, Financeiro ou Recursos Humanos.</p></div>
      </div>
    </article>

    <article class="note-section quick-review" id="revisao-rapida">
      <div class="section-heading"><span>08</span><div><p>Antes da prova</p><h2>Revisão rápida</h2></div></div>
      <dl class="review-list">
        <div><dt>ETL</dt><dd>Extrair, transformar e carregar.</dd></div>
        <div><dt>ELT</dt><dd>Extrair, carregar e transformar.</dd></div>
        <div><dt>OLTP</dt><dd>Operações e transações do dia a dia.</dd></div>
        <div><dt>OLAP</dt><dd>Análise de dados históricos.</dd></div>
        <div><dt>Data Warehouse</dt><dd>Repositório histórico, integrado e analítico.</dd></div>
        <div><dt>Tabela fato</dt><dd>Medidas numéricas e eventos do negócio.</dd></div>
        <div><dt>Dimensão</dt><dd>Contexto usado para analisar os fatos.</dd></div>
        <div><dt>Star Schema</dt><dd>Estrutura simples com fato no centro.</dd></div>
        <div><dt>Snowflake</dt><dd>Dimensões normalizadas em mais tabelas.</dd></div>
        <div><dt>Slice</dt><dd>Seleciona um valor ou dimensão.</dd></div>
        <div><dt>Dice</dt><dd>Combina vários filtros.</dd></div>
        <div><dt>Drill-down</dt><dd>Vai para mais detalhes.</dd></div>
        <div><dt>Roll-up</dt><dd>Resume e agrega.</dd></div>
        <div><dt>Bronze</dt><dd>Dados brutos.</dd></div>
        <div><dt>Silver</dt><dd>Dados limpos e integrados.</dd></div>
        <div><dt>Gold</dt><dd>Dados prontos para análise.</dd></div>
        <div><dt>KPI</dt><dd>Indicador de desempenho.</dd></div>
        <div><dt>Metadados</dt><dd>Dados que descrevem outros dados.</dd></div>
        <div><dt>Data Mart</dt><dd>Parte do DW focada em uma área.</dd></div>
      </dl>
      <div class="final-summary"><span>Resumo em uma linha</span><p>Os dados nascem no <strong>OLTP</strong>, passam por <strong>ETL ou ELT</strong>, evoluem pelas camadas <strong>Bronze, Silver e Gold</strong>, são organizados no <strong>Data Warehouse</strong> e no <strong>modelo multidimensional</strong> e, por fim, são explorados com <strong>OLAP, BI e KPIs</strong> para apoiar decisões.</p></div>
    </article>
  </section>
`;
