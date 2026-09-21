(() => {
  "use strict";

  const bank = window.QUIZ_BANK;
  const sourceBank = window.SOURCE_BANK;
  const sourceGroups = window.SOURCE_GROUPS;
  const notesHtml = window.STUDY_NOTES_HTML;
  const noteLinks = window.STUDY_NOTE_LINKS;
  const root = document.getElementById("app");
  const pattern = ["mc", "mc", "disc", "mc", "mc", "disc", "mc", "mc", "disc", "mc", "mc", "disc"];
  const levels = { 1: "Básica", 2: "Intermediária", 3: "Desafio" };
  let state;
  let adaptiveSession;
  let materialSession;

  function rememberSession() {
    if (state.mode === "adaptive") adaptiveSession = state;
    if (state.mode === "picker" || state.mode === "source") materialSession = state;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  function topicRecords(records, topic) {
    return records.filter(record => record.topic === topic);
  }

  function pickQuestion(records, type, targetLevel, focusTopics = null) {
    const used = new Set(records.map(record => record.id));
    let choices = bank.filter(question => question.type === type && !used.has(question.id));
    if (focusTopics?.length) {
      const focused = choices.filter(question => focusTopics.includes(question.topic));
      if (focused.length) choices = focused;
    }
    if (!choices.length) return null;
    const last = records.at(-1);
    return choices.map(question => {
      const attempts = topicRecords(records, question.topic);
      const weak = attempts.filter(item => item.grade < 2).length;
      const score =
        (attempts.length === 0 ? 8 : 0) +
        weak * 4 +
        (last?.topic === question.topic && last.grade < 2 ? 10 : 0) -
        attempts.length * 5 -
        Math.abs(question.level - targetLevel) * 2 +
        Math.random() * 2;
      return { question, score };
    }).sort((a, b) => b.score - a.score)[0].question;
  }

  function start(focusTopics = null) {
    const sessionPattern = focusTopics?.length ? (() => {
      const remaining = {
        mc: bank.filter(question => question.type === "mc" && focusTopics.includes(question.topic)).length,
        disc: bank.filter(question => question.type === "disc" && focusTopics.includes(question.topic)).length
      };
      return pattern.filter(type => remaining[type]-- > 0).slice(0, 6);
    })() : pattern;
    state = {
      mode: "adaptive",
      records: [], current: focusTopics?.length ? pickQuestion([], "mc", 1, focusTopics) : bank.find(question => question.id === "etl-padronizacao"),
      goal: sessionPattern.length, sessionPattern, focusTopics,
      targetLevel: 1, hintCount: 0, selected: null, essay: "", revealed: false, selfGrade: null, done: false
    };
    adaptiveSession = state;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openMaterial() {
    rememberSession();
    state = materialSession ?? { mode: "picker", records: [], done: false };
    materialSession = state;
    render();
  }

  function openPicker() {
    if (state.mode === "adaptive") adaptiveSession = state;
    state = { mode: "picker", records: [], done: false };
    materialSession = state;
    render();
  }

  function openAdaptive() {
    rememberSession();
    state = adaptiveSession;
    render();
  }

  function openNotes() {
    rememberSession();
    state = { mode: "notes" };
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startSource(groupId = "all") {
    const sequence = groupId === "all" ? sourceBank : sourceBank.filter(question => question.sourceGroup === groupId);
    state = {
      mode: "source", groupId, sequence, records: [], current: sequence[0], goal: sequence.length,
      hintCount: 0, selected: null, essay: "", revealed: false, selfGrade: null, done: false
    };
    materialSession = state;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function sidebar() {
    if (state.mode === "picker") return `<aside class="sidebar" aria-label="Material disponível"><span class="eyebrow">Material completo</span><strong class="side-title">36 questões</strong><p class="side-copy">Cinco exercícios de cada PDF de conteúdo e 11 itens do Banco de Questões. Escolha um conjunto ou faça todos.</p></aside>`;
    if (state.mode === "notes") return `<aside class="sidebar notes-sidebar" aria-label="Índice das anotações"><span class="eyebrow">Nesta revisão</span><strong class="side-title">Mapa da matéria</strong><nav class="notes-toc" aria-label="Seções das anotações">${noteLinks.map(([id, label], index) => `<a href="#${id}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHtml(label)}</a>`).join("")}</nav><a class="back-to-top" href="#app">↑ Voltar ao topo</a></aside>`;
    const completed = state.records.length;
    const mcRecords = state.records.filter(record => record.type === "mc");
    const correct = mcRecords.filter(record => record.grade === 2).length;
    const discRecords = state.records.filter(record => record.type === "disc");
    const mastered = discRecords.filter(record => record.grade === 2).length;
    return `<aside class="sidebar" aria-label="Progresso da sessão">
      <span class="eyebrow">Seu treino</span>
      <strong class="side-title">${state.done ? "Rodada concluída" : `Questão ${completed + 1} de ${state.goal}`}</strong>
      <p class="side-copy">${state.mode === "source" ? "Você está percorrendo as questões do PDF selecionado, na ordem do material." : state.focusTopics?.length ? "Revisão dos temas que precisavam de mais atenção." : "Questões objetivas e discursivas do material da prova."}</p>
      <div class="progress-label"><span>Progresso</span><span>${completed}/${state.goal}</span></div>
      <div class="progress-track" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="${state.goal}" aria-valuenow="${completed}"><div class="progress-fill" style="width:${completed / state.goal * 100}%"></div></div>
      <ul class="metric-list"><li><span>Objetivas corretas</span><strong>${correct}/${mcRecords.length}</strong></li><li><span>Discursivas dominadas</span><strong>${mastered}/${discRecords.length}</strong></li></ul>
    </aside>`;
  }

  function options(question) {
    return `<div class="options" role="group" aria-label="Alternativas">${question.options.map((option, index) => {
      const classes = ["option"];
      if (!state.revealed && state.selected === index) classes.push("is-selected");
      if (state.revealed && index === question.answer) classes.push("is-correct");
      if (state.revealed && state.selected === index && index !== question.answer) classes.push("is-wrong");
      return `<button type="button" class="${classes.join(" ")}" data-option="${index}" aria-pressed="${state.selected === index}" ${state.revealed ? "disabled" : ""}><span class="letter">${"ABCDE"[index]}</span><span>${escapeHtml(option)}</span></button>`;
    }).join("")}</div>`;
  }

  function hints(question) {
    if (!state.hintCount) return "";
    return `<div class="hint" aria-live="polite"><strong>${state.hintCount === 1 ? "Dica 1" : "Dicas 1 e 2"}</strong>${question.hints.slice(0, state.hintCount).map((hint, index) => `<p>${state.hintCount > 1 ? `${index + 1}. ` : ""}${escapeHtml(hint)}</p>`).join("")}</div>`;
  }

  function feedback(question) {
    if (!state.revealed) return "";
    if (question.type === "mc") {
      const correct = state.selected === question.answer;
      return `<div class="feedback ${correct ? "ok" : "bad"}" role="status"><h3>${correct ? "Resposta certa" : `A resposta é ${"ABCDE"[question.answer]}`}</h3><p>${escapeHtml(question.explanation)}</p><span class="source">Base: ${escapeHtml(question.source)}</span></div>`;
    }
    return `<div class="feedback" role="status"><h3>Critérios de correção</h3><p>Compare sua resposta com estes pontos:</p><ul class="rubric">${question.rubric.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul><p><strong>Exemplo de resposta:</strong></p><div class="model-answer">${escapeHtml(question.model)}</div><span class="source">Base: ${escapeHtml(question.source)}</span></div>
      <p class="self-label">Como você avalia sua resposta?</p>
      <div class="self-actions" role="group" aria-label="Autoavaliação da resposta discursiva">
        <button type="button" class="btn ${state.selfGrade === 2 ? "is-active" : ""}" data-grade="2" ${!state.essay.trim() ? "disabled" : ""}>Dominei</button>
        <button type="button" class="btn ${state.selfGrade === 1 ? "is-active" : ""}" data-grade="1" ${!state.essay.trim() ? "disabled" : ""}>Parcial</button>
        <button type="button" class="btn ${state.selfGrade === 0 ? "is-active" : ""}" data-grade="0">Preciso rever</button>
      </div>${!state.essay.trim() ? '<p class="source">Sem resposta escrita: marque “Preciso rever” para continuar.</p>' : ""}`;
  }

  function questionView() {
    const question = state.current;
    const isDisc = question.type === "disc";
    const position = state.records.length + 1;
    return `<section class="main" aria-label="Questão atual">
      <div class="lead"><span class="eyebrow">${state.mode === "source" ? "Questões do material" : state.focusTopics?.length ? "Revisão focada" : "Quiz adaptativo"}</span><span class="count">${String(position).padStart(2, "0")} / ${state.goal}</span></div>
      <h1>${isDisc ? "Construa a resposta." : "Escolha a resposta."}</h1>
      <article class="question-card">
        <div class="meta"><span>${isDisc ? "Discursiva" : "Objetiva"} · ${levels[question.level]}</span><span class="topic-pill">${escapeHtml(question.topic)}</span></div>
        ${state.mode === "source" ? `<div class="question-origin">${escapeHtml(question.source)}</div>` : ""}
        <h2>${escapeHtml(question.prompt)}</h2>
        ${question.context ? `<p class="context">${escapeHtml(question.context)}</p>` : ""}
        ${question.image ? `<figure class="question-diagram"><a href="${escapeHtml(question.image)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir o diagrama relacional em tamanho original"><img src="${escapeHtml(question.image)}" width="955" height="693" alt="Diagrama relacional: CLIENTE se liga a COMPRA; COMPRA a ITEM_COMPRA; ITEM_COMPRA a PRODUTO; PRODUTO a CATEGORIA; CATEGORIA a DEPARTAMENTO." loading="lazy"></a><figcaption>Figura da questão 4 · clique ou toque para ampliar</figcaption></figure><details class="diagram-details"><summary>Descrição das relações principais</summary><p>ITEM_COMPRA registra quantidade e preço do produto e aponta para COMPRA e PRODUTO. COMPRA informa cliente e data. PRODUTO aponta para CATEGORIA, que aponta para DEPARTAMENTO.</p></details>` : ""}
        ${question.note ? `<p class="question-note">${escapeHtml(question.note)}</p>` : ""}
        ${isDisc ? `<label class="sr-only" for="essay">Sua resposta</label><textarea id="essay" class="essay" maxlength="5000" placeholder="Escreva sua resposta com suas palavras..." ${state.revealed ? "disabled" : ""}>${escapeHtml(state.essay)}</textarea><div class="essay-count" id="essay-count">${state.essay.length}/5000 caracteres</div>` : options(question)}
        ${hints(question)}
        ${feedback(question)}
        <div class="actions"><button type="button" class="btn btn-quiet" data-action="hint" ${state.hintCount >= 2 || state.revealed ? "disabled" : ""}>${state.hintCount === 0 ? "Pedir dica" : state.hintCount === 1 ? "Mais uma dica" : "Dicas usadas"}</button>
          <div class="actions-right">${!state.revealed ? `<button type="button" class="btn btn-primary" data-action="submit" ${!isDisc && state.selected === null ? "disabled" : ""}>${isDisc ? "Ver critérios" : "Conferir resposta"}</button>` : `<button type="button" class="btn btn-primary" data-action="next" ${isDisc && state.selfGrade === null ? "disabled" : ""}>${position === state.goal ? "Ver resultado" : "Próxima questão"}</button>`}</div>
        </div>
      </article>
    </section>`;
  }

  function summaryView() {
    const mc = state.records.filter(record => record.type === "mc");
    const disc = state.records.filter(record => record.type === "disc");
    const good = mc.filter(record => record.grade === 2).length;
    const mastered = disc.filter(record => record.grade === 2).length;
    const hintTotal = state.records.reduce((sum, record) => sum + record.hints, 0);
    const weakTopics = [...new Set(state.records.filter(record => record.grade < 2).map(record => record.topic))];
    const isSource = state.mode === "source";
    const message = isSource ? `Você percorreu as ${state.goal} questões de ${state.groupId === "all" ? "todos os PDFs" : sourceGroups.find(group => group.id === state.groupId).title}.` : good === mc.length && mastered === disc.length ? "Você dominou os temas desta rodada. Uma nova rodada traz outras perguntas do banco." : "Revise os temas abaixo e faça uma rodada focada para consolidar o conteúdo.";
    return `<section class="main" aria-label="Resultado da rodada"><div class="lead"><span class="eyebrow">Resultado</span><span class="count">${state.goal} / ${state.goal}</span></div><h1>Rodada concluída.</h1><div class="summary"><h2>Seu desempenho</h2><p>${message}</p>
      <div class="result-grid"><div class="result"><span>Objetivas corretas</span><strong>${good}/${mc.length}</strong></div><div class="result"><span>Discursivas dominadas</span><strong>${mastered}/${disc.length}</strong></div><div class="result"><span>Dicas usadas</span><strong>${hintTotal}</strong></div></div>
      <h2>Temas para revisar</h2>${weakTopics.length ? `<ul class="review-list">${weakTopics.map(topic => `<li>${escapeHtml(topic)}</li>`).join("")}</ul>` : '<p class="empty-review">Nenhum tema marcado para revisão nesta rodada.</p>'}
      <div class="actions">${isSource ? '<button class="btn" type="button" data-action="source-repeat">Refazer este conjunto</button><button class="btn btn-primary" type="button" data-action="source-picker">Escolher outro PDF</button>' : `<button class="btn" type="button" data-action="restart">Nova rodada variada</button>${weakTopics.length ? '<button class="btn btn-primary" type="button" data-action="focus">Revisar estes temas</button>' : ""}`}</div></div></section>`;
  }

  function sourcePickerView() {
    return `<section class="main" aria-label="Escolher questões do material"><div class="lead"><span class="eyebrow">Questões do material</span><span class="count">36 no total</span></div><h1>Escolha o conjunto.</h1><p class="context">Pratique os cinco exercícios de cada PDF e os 11 itens do Banco de Questões. A redação foi adaptada para a tela; as observações de conteúdo aparecem na correção.</p>
      <div class="source-choices"><button type="button" class="source-choice source-all" data-source="all"><span><strong>Todos os PDFs</strong><small>Percorra as 36 questões na ordem do material</small></span><b>36 →</b></button>
      ${sourceGroups.map(group => `<button type="button" class="source-choice" data-source="${group.id}"><span><strong>${escapeHtml(group.title)}</strong><small>${group.id === "banco" ? "Discursivas e uma objetiva" : "Exercícios objetivos do PDF"}</small></span><b>${group.count} →</b></button>`).join("")}</div></section>`;
  }

  function footer() {
    return `<footer class="footer"><details><summary>Materiais usados no quiz</summary><ul>
      <li>Banco de Questões</li><li>Criação de data warehouses</li><li>Representação relacional versus representação multidimensional dos dados</li><li>Compreender a modelagem de dados Multidimensional</li><li>Utilização das metodologias de Data Warehouse</li><li>Business intelligence (BI)</li>
      <li>Arquitetura medalhão: <a href="https://docs.databricks.com/aws/pt/lakehouse/medallion" target="_blank" rel="noopener noreferrer">documentação Databricks</a></li>
      <li>Oracle Data Integrator: <a href="https://docs.oracle.com/middleware/1212/odi/ODIDG/intro.htm" target="_blank" rel="noopener noreferrer">documentação Oracle sobre ETL e E-LT</a></li>
    </ul></details></footer>`;
  }

  function render() {
    const materialActive = state.mode === "picker" || state.mode === "source";
    const content = state.mode === "notes" ? notesHtml : state.mode === "picker" ? sourcePickerView() : state.done ? summaryView() : questionView();
    root.innerHTML = `<main class="app"><header class="top"><div class="brand"><span class="mark" aria-hidden="true">E</span>ETL &amp; OLAP</div><nav class="mode-nav" aria-label="Modos do quiz"><button type="button" class="mode-btn ${state.mode === "adaptive" ? "active" : ""}" data-action="adaptive" aria-current="${state.mode === "adaptive" ? "page" : "false"}">Treino adaptativo</button><button type="button" class="mode-btn ${materialActive ? "active" : ""}" data-action="material" aria-current="${materialActive ? "page" : "false"}">Questões do material</button><button type="button" class="mode-btn ${state.mode === "notes" ? "active" : ""}" data-action="notes" aria-current="${state.mode === "notes" ? "page" : "false"}">Anotações</button></nav></header><div class="layout ${state.mode === "notes" ? "notes-layout" : ""}">${sidebar()}${content}</div></main>${footer()}`;
  }

  function advance() {
    const question = state.current;
    const grade = question.type === "mc" ? (state.selected === question.answer ? 2 : 0) : state.selfGrade;
    if (grade === null) return;
    state.records.push({ id: question.id, topic: question.topic, type: question.type, grade, hints: state.hintCount });
    if (state.mode === "adaptive") state.targetLevel = Math.max(1, Math.min(3, state.targetLevel + (grade === 2 && state.hintCount === 0 ? 1 : grade === 0 ? -1 : 0)));
    if (state.records.length >= state.goal) state.done = true;
    else state.current = state.mode === "source" ? state.sequence[state.records.length] : pickQuestion(state.records, state.sessionPattern[state.records.length], state.targetLevel, state.focusTopics);
    state.hintCount = 0; state.selected = null; state.essay = ""; state.revealed = false; state.selfGrade = null;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  root.addEventListener("click", event => {
    const source = event.target.closest("[data-source]");
    if (source) { startSource(source.dataset.source); return; }
    const option = event.target.closest("[data-option]");
    if (option && !state.done && !state.revealed) {
      state.selected = Number(option.dataset.option);
      root.querySelectorAll("[data-option]").forEach(button => {
        button.classList.toggle("is-selected", button === option);
        button.setAttribute("aria-pressed", String(button === option));
      });
      root.querySelector('[data-action="submit"]').disabled = false;
      return;
    }
    const gradeButton = event.target.closest("[data-grade]");
    if (gradeButton && state.revealed && state.current.type === "disc") {
      state.selfGrade = Number(gradeButton.dataset.grade);
      root.querySelectorAll("[data-grade]").forEach(button => button.classList.toggle("is-active", button === gradeButton));
      root.querySelector('[data-action="next"]').disabled = false;
      return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (!action) return;
    if (action === "adaptive") {
      if (state.mode !== "adaptive") openAdaptive();
    } else if (action === "material") {
      if (state.mode !== "picker" && state.mode !== "source") openMaterial();
    } else if (action === "notes") {
      if (state.mode !== "notes") openNotes();
    } else if (action === "source-picker") {
      openPicker();
    } else if (action === "source-repeat" && state.mode === "source") {
      startSource(state.groupId);
    } else if (action === "hint" && !state.revealed && state.hintCount < 2) {
      state.hintCount += 1; render();
    } else if (action === "submit" && !state.revealed) {
      if (state.current.type === "mc" && state.selected === null) return;
      state.revealed = true; render();
      root.querySelector(".feedback")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else if (action === "next" && state.revealed) {
      advance();
    } else if (action === "restart" && state.done) {
      start();
    } else if (action === "focus" && state.done) {
      const weakTopics = [...new Set(state.records.filter(record => record.grade < 2).map(record => record.topic))];
      start(weakTopics);
    }
  });

  root.addEventListener("input", event => {
    if (event.target.id === "essay") {
      state.essay = event.target.value;
      root.querySelector("#essay-count").textContent = `${state.essay.length}/5000 caracteres`;
    }
  });

  function registerWebMcp() {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = tool => {
      try { Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); }
      catch { /* Browsers without WebMCP keep the regular interface. */ }
    };
    register({
      name: "read_quiz_state", title: "Ler questão atual",
      description: "Lê a questão atual e o progresso da sessão sem alterá-los.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        if (state.mode === "picker") return { mode: "material-picker", groups: [{ id: "all", count: sourceBank.length }, ...sourceGroups.map(group => ({ id: group.id, count: group.count }))] };
        if (state.mode === "notes") return { mode: "notes", sections: noteLinks.map(([id, title]) => ({ id, title })) };
        return state.done ? { done: true, completed: state.records.length, goal: state.goal } : {
          done: false, mode: state.mode, completed: state.records.length, goal: state.goal,
          question: { type: state.current.type, topic: state.current.topic, prompt: state.current.prompt, options: state.current.options ?? null },
          hintsRevealed: state.hintCount, answerRevealed: state.revealed
        };
      }
    });
    register({
      name: "reveal_quiz_hint", title: "Mostrar próxima dica",
      description: "Revela a próxima dica da questão atual e atualiza a página.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute() {
        if (state.mode === "picker" || state.mode === "notes" || state.done || state.revealed || state.hintCount >= 2) throw new Error("Não há outra dica disponível agora.");
        const hint = state.current.hints[state.hintCount++]; render();
        return { hint, hintsRevealed: state.hintCount };
      }
    });
    register({
      name: "submit_quiz_answer", title: "Responder questão",
      description: "Envia uma letra da alternativa para questão objetiva ou um texto para questão discursiva, revela a correção e atualiza a página.",
      inputSchema: { type: "object", properties: { answer: { type: "string", description: "Letra A–E (conforme as opções) ou texto discursivo." } }, required: ["answer"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (state.mode === "picker" || state.mode === "notes" || state.done || state.revealed) throw new Error("Escolha uma questão ainda não respondida.");
        if (typeof input?.answer !== "string") throw new Error("Informe uma resposta em texto.");
        const question = state.current;
        if (question.type === "mc") {
          const letter = input.answer.trim().toUpperCase();
          if (!/^[A-E]$/.test(letter) || letter.charCodeAt(0) - 65 >= question.options.length) throw new Error("Escolha uma letra entre as alternativas apresentadas.");
          state.selected = letter.charCodeAt(0) - 65;
          state.revealed = true; render();
          return { correct: state.selected === question.answer, correctAnswer: "ABCDE"[question.answer], explanation: question.explanation };
        }
        if (input.answer.length > 5000) throw new Error("A resposta deve ter no máximo 5000 caracteres.");
        state.essay = input.answer;
        state.revealed = true; render();
        return { rubric: question.rubric, modelAnswer: question.model, nextStep: "Avalie a própria resposta e avance." };
      }
    });
    register({
      name: "advance_quiz", title: "Avançar questão",
      description: "Avança após a correção. Em discursivas, registra a autoavaliação: dominei, parcial ou rever.",
      inputSchema: { type: "object", properties: { selfRating: { type: "string", enum: ["dominei", "parcial", "rever"] } }, additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (state.mode === "picker" || state.mode === "notes" || state.done || !state.revealed) throw new Error("Confira a resposta antes de avançar.");
        if (state.current.type === "disc") {
          const ratings = { dominei: 2, parcial: 1, rever: 0 };
          if (!Object.hasOwn(ratings, input?.selfRating)) throw new Error("Informe selfRating: dominei, parcial ou rever.");
          if (!state.essay.trim() && ratings[input.selfRating] > 0) throw new Error("Sem resposta escrita, use rever.");
          state.selfGrade = ratings[input.selfRating];
        }
        advance();
        return state.done ? { done: true, completed: state.records.length, goal: state.goal } : { done: false, completed: state.records.length, goal: state.goal, nextQuestion: state.current.prompt };
      }
    });
    register({
      name: "start_source_quiz", title: "Iniciar questões do material",
      description: "Inicia todos os exercícios dos PDFs ou apenas o conjunto de um material específico.",
      inputSchema: { type: "object", properties: { groupId: { type: "string", enum: ["all", ...sourceGroups.map(group => group.id)] } }, required: ["groupId"], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        if (!sourceGroups.some(group => group.id === input?.groupId) && input?.groupId !== "all") throw new Error("Escolha um grupo válido.");
        startSource(input.groupId);
        return { groupId: input.groupId, goal: state.goal, firstQuestion: state.current.prompt };
      }
    });
  }

  start();
  registerWebMcp();
})();
