// Configuração
const LANG = "pt-BR";  // idioma da voz
const BAR_COUNT = 28;  // barras
const MODEL = "gemini-3.5-flash";  // nome do modelo

// Prompt da professora
const SYSTEM_PROMPT = `Você é a Sua Professora Virtual: uma professora especialista em montar planos de estudo e em escolher métodos de estudo sob medida para cada pessoa, e também uma companheira que acompanha a rotina do estudante, lembra de compromissos e provas e incentiva a constância. Atende estudantes de qualquer área (escola, vestibular, faculdade, concursos, cursos). Seu tom é humano, acolhedor e motivador, sem exageros.
Como você trabalha:
1. A entrevista vem sempre primeiro. Enquanto o perfil estiver incompleto (veja "Faltam no perfil" abaixo), conduza uma entrevista curta, com no máximo 2 perguntas por mensagem, nesta ordem: (a) como a pessoa quer ser chamada e a rotina com compromissos fixos; (b) melhor período para estudar, horas livres por dia e dias disponíveis; (c) como aprende melhor (lendo, vendo, ouvindo, praticando) e se prefere estudar sozinha ou em grupo; (d) objetivo com prazos, e hábitos (se procrastina, se distrai fácil, se rende mais com prazo apertado ou com antecedência). A abertura da conversa já fez as primeiras perguntas, e a primeira mensagem da pessoa é a resposta a elas. Salve cada resposta com save_profile (inclua name) e faça as perguntas seguintes. Se a pessoa não responder, repita a pergunta com gentileza. Se ela pedir outra coisa antes de a entrevista terminar, diga com gentileza que primeiro precisa conhecê-la e continue; se ela insistir, atenda. Use só o que a pessoa disser: não diagnostique nem rotule. Chame a pessoa pelo nome de vez em quando, sem exagero.
2. Tour: o tour guiado é conduzido pelo app, uma etapa por vez. Quando o perfil ficar completo, confirme em uma frase e avise que o tour vai começar. Se a pessoa pedir o tour, chame start_tour.
3. Compromissos: se a pessoa avisar de um compromisso, consulta ou evento que atrapalhe os estudos, registre com add_event (kind compromisso, com start_time e end_time se houver horário), considere na rotina e, se o plano atual for afetado, sugira ajustes e refaça o plano com create_study_plan.
4. Provas, com postura preventiva. Quando houver uma prova no calendário (veja "Provas" abaixo): se não souber os conteúdos, pergunte e registre com set_exam_topics. Monte o plano considerando o tempo até a prova, os compromissos e as dificuldades que a pessoa contou, sem criar rotinas impossíveis de cumprir. Sugira revisões, exercícios, flashcards (create_flashcards, passando topic) e mini simulados no próprio chat (uma questão por vez, corrigida e comentada). Cada conteúdo aparece com [registro] ou [sem registro]. Nunca presuma que a pessoa não estudou algo só porque não há registro: pergunte se estudou por fora e, se ela disser que sim, use mark_topic. Se o tempo estiver curto, diga com franqueza, priorize os conteúdos mais importantes e os de maior dificuldade para a pessoa e proponha um plano enxuto e realista. Acompanhe: pergunte se ela está conseguindo cumprir o plano e ajuste quando ela ficar para trás. Se houver uma "mensagem proativa" recente abaixo, a pessoa pode estar respondendo a ela.
5. Plano: monte com create_study_plan. Respeite o perfil, a rotina fixa e os compromissos do calendário: nunca marque estudo em cima de um compromisso com horário e não ultrapasse as horas livres por dia. Priorize o que vence primeiro, ponha as matérias mais difíceis no melhor período da pessoa, inclua pausas, revisões antes das provas e alguma folga. Plano de 7 dias por padrão, ou até a prova se ela for antes. Cada bloco leva a matéria, o que fazer e o método usado. Se a ferramenta devolver conflitos, corrija e envie o plano completo de novo.
6. Escolha métodos conforme a pessoa e a matéria: Pomodoro, blocos de foco profundo, recuperação ativa (testar-se sem consultar), revisão espaçada com flashcards, método Feynman (explicar com as próprias palavras), resolução de exercícios, mapas mentais, resumos e estudo em grupo. Quem aprende vendo costuma gostar de mapas mentais e vídeos; quem se distrai fácil rende com blocos de 15 a 25 minutos; quem procrastina ganha com metas pequenas e prazos próprios; quem só rende sob pressão precisa de prazos intermediários. Explique em uma frase por que escolheu cada método.
7. Explique conceitos como uma professora paciente: linguagem simples e um exemplo.
8. Pomodoro: quando o estudante quiser estudar com cronômetro ou pedir uma sugestão de ritmo, ofereça estas 3 opções: Clássico (25 minutos de foco e 5 de pausa), Profundo (50 e 10) e Tranquilo (25 e 15), ou ajuste ao perfil dele, e aceite também um ritmo personalizado. Assim que ele escolher ou disser os tempos, chame start_pomodoro. O app acompanha o tempo e a professora avisa pausas e voltas. Se ele disser qual matéria vai estudar, passe o nome dela em subject.
9. Calendário: quando o estudante mencionar prova, entrega, prazo ou compromisso com data, chame add_event com kind (prova, entrega ou compromisso), subject e topics quando souber. Use a data de hoje e a lista dos próximos dias abaixo para converter dias da semana e datas relativas. Quando a pessoa disser uma data clara dentro dos próximos 14 dias (amanhã, sexta, dia 18), pode salvar e repetir a data por extenso na confirmação, por exemplo: sexta-feira, 20 de novembro. Se a data for distante, ambígua ou incompleta (só o dia, sem o mês), pergunte antes de salvar e peça o dia, o mês e, se necessário, o ano; peça também o horário de início e fim quando for um compromisso que ocupa o dia.
10. Tarefas: para tarefas e metas do dia, chame add_task.
11. Flashcards: quando o estudante pedir flashcards, use create_flashcards com a matéria, o level (facil, medio ou dificil) e, se for de uma prova, o topic. Fácil: conceitos básicos e perguntas diretas. Médio: interpretação e aplicação do conhecimento em situações. Difícil: questões complexas, que exigem raciocínio em várias etapas e domínio do conteúdo. Se a pessoa não disser o nível, pergunte qual prefere antes de criar. Crie de 5 a 10 cartas, varie os formatos (definição, aplicação, comparação, causa e consequência, passo a passo), evite perguntas repetidas ou superficiais e confira que cada resposta esteja correta, curta e completa.
12. Notas e faltas: quando a pessoa contar uma nota tirada ou uma falta, registre com add_grade ou add_absence, e use set_subject_rules quando ela informar a média alvo ou o limite de faltas. Use o resumo de notas e faltas abaixo: dê mais atenção no plano a matérias com média abaixo do alvo e avise com clareza quando as faltas chegarem perto do limite. As regras de aprovação variam por escola: não afirme regras que a pessoa não contou.
13. Ajustes e registros: se a pessoa disser que um compromisso mudou, use update_event em vez de criar outro; se foi cancelado, use delete_event. Antes de apagar qualquer coisa, confirme com a pessoa, a menos que o pedido de apagar seja claro. Quando um compromisso novo ou alterado bater com blocos do plano (a ferramenta informa os conflitos), avise e ofereça ajustar o plano com create_study_plan. Quando ela disser que fez uma tarefa, use complete_task; se disser que cumpriu um bloco do plano, use mark_plan_block; marque só o que ela disser. Para guardar uma anotação, use add_note; para a meta diária de estudo, use set_daily_goal.
Depois de usar uma ferramenta, confirme em uma frase. Depois de criar um plano, diga que ele está na aba Seu perfil e resuma em poucas frases, sem ler todos os blocos.
Regras de resposta: português do Brasil, texto puro, sem markdown, sem asteriscos e sem emojis, porque sua resposta será lida em voz alta. Seja curta e natural, com no máximo 6 frases. Se o assunto não tiver relação com estudos ou organização, traga a conversa de volta com gentileza.`;

// Elementos
const chat = document.getElementById("chat");
const empty = document.getElementById("empty");
const micBtn = document.getElementById("mic");
const meter = document.getElementById("meter");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear");

// barras do visualizador
const bars = [];
for (let i = 0; i < BAR_COUNT; i++) {
  const b = document.createElement("span");
  b.style.setProperty("--i", i);
  meter.appendChild(b);
  bars.push(b);
}

// Mensagens
function addMessage(text, who) {
  empty.hidden = true;
  if (who === "bot" && document.getElementById("app").dataset.tab !== "chat") document.getElementById("tabChat").classList.add("dot");
  const el = document.createElement("div");
  el.className = "bubble " + who;
  el.textContent = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
  return el;
}

function setStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", isError);
}

window.addEventListener("error", (e) => setStatus("Erro no código: " + e.message, true));

clearBtn.addEventListener("click", () => {
  if (busy) { showToast("Espere a resposta terminar para limpar a conversa."); return; }
  chat.querySelectorAll(".bubble").forEach((b) => b.remove());
  conversation.length = 0;
  stopSpeaking();
  empty.hidden = false;
  showWelcome(true);
});

// IA (Gemini)
let apiKey = "";
try { apiKey = sessionStorage.getItem("gemini_key") || ""; } catch (e) { }
const conversation = [];  // histórico da conversa

const ttsEl = document.getElementById("tts");
const keyDialog = document.getElementById("keyDialog");
const keyInput = document.getElementById("keyInput");

document.getElementById("keyBtn").addEventListener("click", () => {
  keyInput.value = "";
  keyDialog.showModal();
});
document.getElementById("keyCancel").addEventListener("click", () => keyDialog.close());
document.getElementById("keySave").addEventListener("click", () => {
  apiKey = keyInput.value.trim();
  try { sessionStorage.setItem("gemini_key", apiKey); } catch (e) { }
  keyDialog.close();
  setStatus(apiKey ? "Chave salva. Toque para falar" : "Toque para falar");
});

function friendlyError(status) {
  if (status === 400) return "O Google recusou o pedido (erro 400). Confira se a chave foi copiada inteira. Se estiver certa, aperte F12 e veja o Console para o motivo.";
  if (status === 403) return "Essa chave não tem permissão para usar o Gemini. Crie uma nova no Google AI Studio.";
  if (status === 404) return "Modelo não encontrado. Troque o valor de MODEL no topo do script.";
  if (status === 429) return "Atingi o limite gratuito de requisições. Espere um minuto e tente de novo.";
  return "O serviço de IA falhou (código " + status + "). Tente de novo.";
}

// Ferramentas da IA
const TOOLS = [{
  functionDeclarations: [
    {
      name: "add_event",
      description: "Marca uma data importante (prova, entrega, prazo) no calendário do estudante.",
      parameters: {
        type: "object", properties: {
          title: { type: "string", description: "Nome do evento, por exemplo: Prova de química" },
          date: { type: "string", description: "Data no formato AAAA-MM-DD" },
          start_time: { type: "string", description: "Hora de início HH:MM, se for um compromisso com horário (opcional)" },
          end_time: { type: "string", description: "Hora de término HH:MM (opcional)" },
          kind: { type: "string", description: "prova, entrega ou compromisso" },
          subject: { type: "string", description: "Matéria, se for uma prova ou entrega (opcional)" },
          topics: { type: "array", description: "Conteúdos que vão cair na prova (opcional)", items: { type: "string" } }
        },
        required: ["title", "date"]
      }
    },
    {
      name: "start_pomodoro",
      description: "Inicia o cronômetro Pomodoro com os tempos escolhidos pelo estudante.",
      parameters: {
        type: "object", properties: {
          focus_minutes: { type: "integer", description: "Minutos de foco" },
          break_minutes: { type: "integer", description: "Minutos de pausa" },
          cycles: { type: "integer", description: "Quantidade de ciclos (padrão 4)" },
          subject: { type: "string", description: "Matéria estudada, se o estudante disser (opcional)" }
        },
        required: ["focus_minutes", "break_minutes"]
      }
    },
    {
      name: "add_task",
      description: "Adiciona uma tarefa ou meta ao planejador do estudante.",
      parameters: {
        type: "object", properties: {
          text: { type: "string", description: "A tarefa, por exemplo: Resolver lista 3 de cálculo" },
          subject: { type: "string", description: "Matéria, se houver (opcional)" },
          date: { type: "string", description: "Data AAAA-MM-DD (opcional, padrão hoje)" }
        },
        required: ["text"]
      }
    },
    {
      name: "create_flashcards",
      description: "Cria flashcards para revisão espaçada sobre um assunto.",
      parameters: {
        type: "object", properties: {
          subject: { type: "string", description: "Matéria das cartas, por exemplo: Biologia" },
          level: { type: "string", description: "Nível das perguntas: facil, medio ou dificil" },
          topic: { type: "string", description: "Assunto ou conteúdo de prova a que as cartas se referem (opcional)" },
          cards: {
            type: "array", description: "Lista de cartas", items: {
              type: "object", properties: {
                front: { type: "string", description: "Pergunta curta" },
                back: { type: "string", description: "Resposta curta" }
              }, required: ["front", "back"]
            }
          }
        },
        required: ["subject", "cards"]
      }
    },
    {
      name: "save_profile",
      description: "Salva ou atualiza o perfil de estudo da pessoa com o que ela contou. Envie só os campos que ela informou.",
      parameters: {
        type: "object", properties: {
          name: { type: "string", description: "Como a pessoa quer ser chamada" },
          routine: { type: "string", description: "Rotina e compromissos fixos (aulas, trabalho, horários)" },
          best_period: { type: "string", description: "Período em que rende mais (manhã, tarde, noite)" },
          daily_hours: { type: "string", description: "Horas livres por dia para estudar" },
          days: { type: "string", description: "Dias da semana disponíveis" },
          learning_style: { type: "string", description: "Como aprende melhor (lendo, vendo, ouvindo, praticando)" },
          group_or_solo: { type: "string", description: "Prefere estudar sozinha ou em grupo" },
          focus_span_minutes: { type: "string", description: "Quanto tempo consegue manter o foco" },
          personality: { type: "string", description: "Hábitos que a pessoa descreveu (procrastina, se distrai, rende com prazo apertado...)" },
          goals: { type: "string", description: "Objetivo e prazos" },
          notes: { type: "string", description: "Outras preferências" }
        }
      }
    },
    {
      name: "create_study_plan",
      description: "Cria o plano de estudos em blocos de horário, substituindo o plano anterior. Os blocos não podem bater com compromissos do calendário que tenham horário.",
      parameters: {
        type: "object", properties: {
          title: { type: "string", description: "Título do plano" },
          blocks: {
            type: "array", description: "Blocos de estudo", items: {
              type: "object", properties: {
                date: { type: "string", description: "Data AAAA-MM-DD" },
                start: { type: "string", description: "Início HH:MM" },
                end: { type: "string", description: "Fim HH:MM" },
                subject: { type: "string", description: "Matéria" },
                activity: { type: "string", description: "O que fazer neste bloco" },
                method: { type: "string", description: "Método de estudo usado" }
              }, required: ["date", "start", "end", "subject", "activity"]
            }
          }
        },
        required: ["title", "blocks"]
      }
    },
    {
      name: "set_exam_topics",
      description: "Registra os conteúdos que vão cair em uma prova já marcada no calendário.",
      parameters: {
        type: "object", properties: {
          exam: { type: "string", description: "Título (ou matéria) da prova" },
          topics: { type: "array", description: "Conteúdos cobrados", items: { type: "string" } }
        },
        required: ["exam", "topics"]
      }
    },
    {
      name: "mark_topic",
      description: "Marca um conteúdo de prova como revisado, quando a pessoa disser que já estudou.",
      parameters: {
        type: "object", properties: {
          exam: { type: "string", description: "Título (ou matéria) da prova" },
          topic: { type: "string", description: "Conteúdo" },
          reviewed: { type: "boolean", description: "true se já revisou, false para desmarcar" }
        },
        required: ["exam", "topic"]
      }
    },
    {
      name: "start_tour",
      description: "Inicia o tour guiado do app, uma etapa por vez. Use quando a pessoa pedir o tour.",
      parameters: { type: "object", properties: {} }
    },
    {
      name: "add_grade",
      description: "Registra uma nota tirada em uma avaliação de uma matéria.",
      parameters: {
        type: "object", properties: {
          subject: { type: "string", description: "Matéria" },
          title: { type: "string", description: "Nome da avaliação, por exemplo: Prova 1" },
          grade: { type: "number", description: "Nota tirada" },
          max: { type: "number", description: "Nota máxima da avaliação (padrão 10)" },
          weight: { type: "number", description: "Peso na média (padrão 1)" },
          date: { type: "string", description: "Data AAAA-MM-DD (padrão hoje)" }
        },
        required: ["subject", "grade"]
      }
    },
    {
      name: "add_absence",
      description: "Registra faltas em uma matéria.",
      parameters: {
        type: "object", properties: {
          subject: { type: "string", description: "Matéria" },
          quantity: { type: "integer", description: "Quantidade de faltas (padrão 1)" },
          date: { type: "string", description: "Data AAAA-MM-DD (padrão hoje)" }
        },
        required: ["subject"]
      }
    },
    {
      name: "set_subject_rules",
      description: "Define a média alvo e o limite de faltas de uma matéria, quando a pessoa informar.",
      parameters: {
        type: "object", properties: {
          subject: { type: "string", description: "Matéria" },
          target_average: { type: "number", description: "Média que a pessoa precisa alcançar" },
          absence_limit: { type: "integer", description: "Quantidade máxima de faltas permitidas" }
        },
        required: ["subject"]
      }
    },
    {
      name: "update_event",
      description: "Atualiza um compromisso, prova ou entrega que já está no calendário (data, horário, título, tipo ou matéria). Use em vez de criar outro quando algo mudou.",
      parameters: {
        type: "object", properties: {
          event: { type: "string", description: "Título (ou parte do título) do compromisso atual" },
          current_date: { type: "string", description: "Data atual AAAA-MM-DD, para distinguir compromissos com o mesmo nome (opcional)" },
          new_title: { type: "string", description: "Novo título (opcional)" },
          date: { type: "string", description: "Nova data AAAA-MM-DD (opcional)" },
          start_time: { type: "string", description: "Novo início HH:MM, ou texto vazio para remover o horário (opcional)" },
          end_time: { type: "string", description: "Novo término HH:MM, ou texto vazio para remover o horário (opcional)" },
          kind: { type: "string", description: "prova, entrega ou compromisso (opcional)" },
          subject: { type: "string", description: "Matéria (opcional)" }
        },
        required: ["event"]
      }
    },
    {
      name: "delete_event",
      description: "Apaga um compromisso, prova ou entrega do calendário. Confirme com a pessoa antes, a menos que o pedido seja claro.",
      parameters: {
        type: "object", properties: {
          event: { type: "string", description: "Título (ou parte do título)" },
          date: { type: "string", description: "Data AAAA-MM-DD, para distinguir compromissos com o mesmo nome (opcional)" }
        },
        required: ["event"]
      }
    },
    {
      name: "complete_task",
      description: "Marca uma tarefa como feita (ou desmarca) quando a pessoa disser que concluiu.",
      parameters: {
        type: "object", properties: {
          task: { type: "string", description: "Texto (ou parte do texto) da tarefa" },
          done: { type: "boolean", description: "true para concluída (padrão), false para desmarcar" }
        },
        required: ["task"]
      }
    },
    {
      name: "mark_plan_block",
      description: "Marca um bloco do plano de estudos como cumprido (ou desmarca) quando a pessoa disser que o fez.",
      parameters: {
        type: "object", properties: {
          date: { type: "string", description: "Data do bloco AAAA-MM-DD" },
          subject: { type: "string", description: "Matéria do bloco (opcional)" },
          start: { type: "string", description: "Horário de início HH:MM do bloco (opcional)" },
          done: { type: "boolean", description: "true para cumprido (padrão), false para desmarcar" }
        },
        required: ["date"]
      }
    },
    {
      name: "add_note",
      description: "Guarda uma anotação de estudo, opcionalmente ligada a uma matéria.",
      parameters: {
        type: "object", properties: {
          text: { type: "string", description: "Texto da anotação" },
          subject: { type: "string", description: "Matéria (opcional)" }
        },
        required: ["text"]
      }
    },
    {
      name: "set_daily_goal",
      description: "Define a meta diária de estudo, em minutos.",
      parameters: {
        type: "object", properties: {
          minutes: { type: "integer", description: "Minutos de estudo por dia (0 a 1440)" }
        },
        required: ["minutes"]
      }
    }
  ]
}];

// Roda a ferramenta; se der erro, avisa a IA
function runTool(name, args) {
  try { return runToolRaw(name, args); }
  catch (err) {
    console.error("Erro na ferramenta " + name + ":", err);
    return { ok: false, error: "Falha interna ao executar " + name + ". Avise a pessoa e peça para tentar de novo." };
  }
}

function runToolRaw(name, args) {
  if (name === "add_event") {
    const ev = addEvent(args.title, args.date, args.start_time, args.end_time, args.kind, args.subject ? ensureSubject(args.subject) : "", args.topics);
    if (!ev) return { ok: false, error: "Data inválida. Use AAAA-MM-DD." };
    ev.coachDay = todayISO();  // sem lembrete duplicado hoje
    saveEvents();
    const out = { ok: true, compromisso: describeEv(ev) };
    if ((args.start_time || args.end_time) && !ev.start) out.aviso = "O horário NÃO foi salvo: é preciso início e fim em HH:MM, com o fim depois do início. Avise a pessoa e peça os dois horários.";
    if (ev.kind === "prova" && !ev.topics.length) out.nota = "Prova sem conteúdos informados: pergunte quais conteúdos vão cair.";
    const conf = planConflicts(ev);
    if (conf.length) { out.conflitos_com_o_plano = conf; out.instrucao = "Avise a pessoa e ofereça ajustar o plano de estudos."; }
    return out;
  }
  if (name === "start_pomodoro") {
    startPomodoro(+args.focus_minutes, +args.break_minutes, +args.cycles, args.subject ? ensureSubject(args.subject) : undefined);
    return { ok: true };
  }
  if (name === "add_task") {
    return addTask(args.text, args.subject ? ensureSubject(args.subject) : "", args.date) ? { ok: true } : { ok: false, error: "Texto vazio." };
  }
  if (name === "create_flashcards") {
    const list = Array.isArray(args.cards) ? args.cards : [];
    const r = addCards(ensureSubject(args.subject), list.map((c) => ({ q: c.front, a: c.back })), args.level, args.topic);
    return r.skipped
      ? { ok: r.n > 0, criados: r.n, ignorados: r.skipped, nota: "Cartas repetidas ou curtas demais foram ignoradas. Varie as perguntas." }
      : { ok: r.n > 0, criados: r.n };
  }
  if (name === "save_profile") {
    const out = { ok: true, saved: saveProfile(args) };
    if (!profileComplete()) out.faltam = missingProfile();
    else if (!db.tourDone) { startTourSoon = true; out.instrucao = "Perfil completo. Confirme em uma frase e avise que o tour guiado vai começar agora."; }
    return out;
  }
  if (name === "set_exam_topics") {
    const ex = findExam(args.exam);
    if (!ex) return { ok: false, error: "Prova não encontrada.", provas: exams().map((e) => e.title) };
    const n = addTopics(ex, Array.isArray(args.topics) ? args.topics : []);
    saveEvents();
    renderExams();
    return { ok: true, adicionados: n, total: ex.topics.length };
  }
  if (name === "mark_topic") {
    const ex = findExam(args.exam);
    const tp = ex && (ex.topics || []).find((t) => norm(t.name) === norm(args.topic) || norm(t.name).includes(norm(args.topic)));
    if (!tp) return { ok: false, error: "Prova ou conteúdo não encontrado.", conteudos: ex ? ex.topics.map((t) => t.name) : [] };
    tp.done = args.reviewed !== false;
    saveEvents();
    renderExams();
    return { ok: true };
  }
  if (name === "add_grade") {
    const sid = args.subject ? ensureSubject(args.subject) : "";
    const r = addGrade(sid, args.title, args.grade, args.max, args.weight, args.date);
    if (r.error) return { ok: false, error: r.error };
    const avg = subjectAverage(sid);
    return { ok: true, media: avg === null ? null : Math.round(avg * 10) / 10, media_alvo: rules(sid).target, faltas: absencesOf(sid), limite_de_faltas: rules(sid).limit || "não definido" };
  }
  if (name === "add_absence") {
    const sid = args.subject ? ensureSubject(args.subject) : "";
    const r = addAbsence(sid, args.quantity, args.date);
    if (r.error) return { ok: false, error: r.error };
    return { ok: true, total_de_faltas: absencesOf(sid), limite_de_faltas: rules(sid).limit || "não definido", alerta: absenceAlert(sid) || undefined };
  }
  if (name === "set_subject_rules") {
    const sid = args.subject ? ensureSubject(args.subject) : "";
    if (!sid) return { ok: false, error: "Informe a matéria." };
    setRules(sid, args.target_average, args.absence_limit);
    return { ok: true, regras: rules(sid) };
  }
  if (name === "update_event") {
    const f = pickEvent(args.event, args.current_date);
    if (f.error) return f.error;
    const draft = { ...f.ev };
    if (args.date !== undefined && args.date !== "") {
      if (!parseISO(args.date)) return { ok: false, error: "Data inválida. Use AAAA-MM-DD." };
      draft.date = args.date;
      delete draft.last;
    }
    if (args.new_title) draft.title = String(args.new_title).trim().slice(0, 80);
    if (["prova", "entrega", "compromisso"].includes(args.kind)) draft.kind = args.kind;
    if (args.subject) draft.subject = ensureSubject(args.subject);
    if (args.start_time !== undefined || args.end_time !== undefined) {
      const st = args.start_time !== undefined ? args.start_time : draft.start;
      const en = args.end_time !== undefined ? args.end_time : draft.end;
      if (!st && !en) { delete draft.start; delete draft.end; }
      else if (validTime(st) && validTime(en) && en > st) { draft.start = st; draft.end = en; }
      else return { ok: false, error: "Horário inválido. Use HH:MM, com início e fim." };
    }
    draft.coachDay = todayISO();
    events[events.indexOf(f.ev)] = draft;
    saveEvents();
    renderCalendar();
    renderExams();
    const conf = planConflicts(draft);
    return conf.length
      ? { ok: true, compromisso: describeEv(draft), conflitos_com_o_plano: conf, instrucao: "Avise a pessoa e ofereça ajustar o plano de estudos." }
      : { ok: true, compromisso: describeEv(draft) };
  }
  if (name === "delete_event") {
    const f = pickEvent(args.event, args.date);
    if (f.error) return f.error;
    events = events.filter((e) => e.id !== f.ev.id);
    saveEvents();
    renderCalendar();
    renderExams();
    return { ok: true, apagado: describeEv(f.ev) };
  }
  if (name === "complete_task") {
    const k = norm(args.task), done = args.done !== false;
    let list = db.tasks.filter((t) => norm(t.text).includes(k) || k.includes(norm(t.text)));
    const pref = list.filter((t) => t.done !== done);
    if (pref.length) list = pref;
    if (!list.length) return { ok: false, error: "Tarefa não encontrada.", tarefas_abertas: db.tasks.filter((t) => !t.done).slice(0, 10).map((t) => t.text) };
    if (list.length > 1) return { ok: false, error: "Mais de uma tarefa corresponde. Pergunte qual.", opcoes: list.slice(0, 6).map((t) => t.text) };
    list[0].done = done;
    saveDb();
    renderTasks();
    return { ok: true, tarefa: list[0].text, concluida: done };
  }
  if (name === "mark_plan_block") {
    const date = parseISO(args.date) ? args.date : todayISO();
    const sk = norm(args.subject), done = args.done !== false;
    const dia = db.plan ? db.plan.blocks.filter((b) => b.date === date) : [];
    let list = dia;
    if (args.start) list = list.filter((b) => b.start === args.start);
    if (sk) list = list.filter((b) => norm(subjectName(b.subject)).includes(sk) || norm(b.activity).includes(sk));
    if (!list.length) return { ok: false, error: "Bloco não encontrado nesse dia.", blocos_do_dia: dia.map(describeBlock) };
    if (list.length > 1) return { ok: false, error: "Mais de um bloco corresponde. Pergunte qual.", opcoes: list.map(describeBlock) };
    list[0].done = done;
    saveDb();
    renderPlan();
    renderExams();
    return { ok: true, bloco: describeBlock(list[0]), cumprido: done };
  }
  if (name === "add_note") {
    const text = String(args.text || "").trim().slice(0, 2000);
    if (!text) return { ok: false, error: "Anotação vazia." };
    db.notes.push({ id: uid(), subject: args.subject ? ensureSubject(args.subject) : "", text, ts: Date.now() });
    saveDb();
    renderNotes();
    return { ok: true };
  }
  if (name === "set_daily_goal") {
    const m = Math.round(+args.minutes);
    if (!(m >= 0 && m <= 1440)) return { ok: false, error: "Informe minutos entre 0 e 1440." };
    db.goal = m;
    saveDb();
    renderTasks();
    return { ok: true, meta: fmtMin(m, true) };
  }
  if (name === "start_tour") { startTourSoon = true; return { ok: true }; }
  if (name === "create_study_plan") {
    return createPlan(args.title, args.blocks);
  }
  return { ok: false, error: "Ferramenta desconhecida." };
}

// Prompt com a data de hoje e os dados do aluno
function buildSystemPrompt() {
  const now = new Date();
  const hoje = now.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const marcadas = upcomingEvents().slice(0, 30)
    .map((e) => e.title + " em " + e.date + (e.start ? " das " + e.start + " às " + e.end : ""))
    .join("; ") || "nenhum";
  const proximos = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "") + " " + isoDate(d);
  }).join(", ");
  const perfil = Object.entries(db.profile || {}).map(([k, v]) => k + ": " + v).join("; ") || "vazio (ainda não conheço a pessoa)";
  const bl = db.plan ? db.plan.blocks : [];
  const plano = bl.length ? bl.length + " blocos, de " + bl[0].date + " a " + bl[bl.length - 1].date : "nenhum";
  const provas = exams().slice(0, 6).map((ex) => {
    const d = daysUntil(ex.date);
    const tps = (ex.topics || []).map((t) => t.name + " [" + (topicRecord(ex, t) || "sem registro") + "]").join(", ") || "conteúdos não informados";
    return ex.title + " em " + ex.date + " (" + (d === 0 ? "hoje" : "em " + d + " dias") + (ex.subject ? ", matéria " + subjectName(ex.subject) : "") + "): " + tps;
  }).join("; ") || "nenhuma";
  return SYSTEM_PROMPT
    + "\nHoje é " + hoje + " (" + isoDate(now) + ").\nPróximos 14 dias: " + proximos + "."
    + "\nCompromissos e datas no calendário: " + marcadas + "."
    + "\nProvas: " + provas + "."
    + "\nNotas e faltas: " + gradesSummaryText() + "."
    + "\nMatérias do estudante: " + (db.subjects.map((s) => s.name).join(", ") || "nenhuma") + "."
    + "\nPerfil de estudo salvo: " + perfil + ".\nPlano de estudos atual: " + plano + "."
    + (bl.length ? "\nBlocos do plano a partir de hoje: " + planBlocksText() + "." : "")
    + "\nFaltam no perfil: " + (missingProfile().join(", ") || "nada, o perfil está completo") + "."
    + (openingPending && welcomeText ? "\nA mensagem de abertura já exibida foi: \"" + welcomeText.replace(/\n/g, " ") + "\" A primeira mensagem da pessoa é a resposta a ela." : "")
    + (coachPending && coachContext ? "\nMensagem proativa que você acabou de enviar à pessoa: \"" + coachContext + "\" Ela pode estar respondendo a isso." : "");
}

// Mantém o histórico curto
function trimHistory() {
  while (conversation.length > 22) {
    conversation.shift();
    while (conversation.length && !(conversation[0].role === "user" && conversation[0].parts.some((p) => p.text))) conversation.shift();
  }
}

// Manda a conversa ao Gemini e executa as ferramentas pedidas
async function handleUserText(text) {
  if (!apiKey) {
    keyDialog.showModal();
    return "Para ativar a sua Assistente Virtual, cole sua chave do Gemini no botão Chave da API.";
  }
  trimHistory();
  const startLen = conversation.length;
  conversation.push({ role: "user", parts: [{ text }] });

  try {
    for (let step = 0; step < 5; step++) {
      // desiste se a internet travar
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 45000);
      let res, data;
      try {
        res = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            signal: ctl.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
              tools: TOOLS,
              contents: conversation
            })
          }
        );
        if (res.ok) data = await res.json();
        else console.error("Erro da API:", res.status, await res.text());
      } finally { clearTimeout(timer); }
      if (!res.ok) {
        conversation.length = startLen;
        return friendlyError(res.status);
      }
      const content = data.candidates?.[0]?.content;
      if (!content || !content.parts) {
        conversation.length = startLen;
        return "Não consegui gerar uma resposta. Tente de novo.";
      }
      conversation.push(content);  // guarda do jeito que veio

      const calls = content.parts.filter((p) => p.functionCall);
      if (!calls.length) {
        const reply = content.parts.filter((p) => p.text && !p.thought).map((p) => p.text).join("").trim();
        openingPending = false;
        coachPending = false;
        return reply || "Pronto.";
      }
      const results = calls.map((p) => ({
        functionResponse: { name: p.functionCall.name, response: runTool(p.functionCall.name, p.functionCall.args || {}) }
      }));
      conversation.push({ role: "user", parts: results });
    }
    conversation.length = startLen;
    return "Fiz o que você pediu.";
  } catch (err) {
    console.error("Falha ao chamar o Gemini:", err);
    conversation.length = startLen;
    if (err && err.name === "AbortError") return "O Gemini demorou demais para responder. Tente de novo em 3 minutos.";
    return "Não consegui falar com o Gemini. Se você abriu esta página dentro do chat, baixe o arquivo e abra no Chrome. Se já está no Chrome, verifique sua internet.";
  }
}

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

// Fala o texto em voz alta
function speak(text, force = false) {
  if ((!force && !ttsEl.checked) || !("speechSynthesis" in window)) return;
  stopSpeaking();
  const voice = currentVoice();
  // uma frase por vez (o Chrome corta falas longas)
  text.replace(/[*#_`]/g, "").split(/(?<=[.!?:])\s+|\n+/).filter(Boolean).forEach((part) => {
    const u = new SpeechSynthesisUtterance(part);
    u.lang = voice ? voice.lang : LANG;
    if (voice) u.voice = voice;
    u.rate = voiceRate;
    speechSynthesis.speak(u);
  });
}

// Envio de mensagens (voz e texto)
const composer = document.getElementById("composer");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");
let busy = false;

async function sendMessage(text) {
  if (busy) return;
  busy = true;
  sendBtn.disabled = true;
  try {
    showTab("chat");
    stopSpeaking();
    addMessage(text, "user");
    setStatus("Pensando…");
    const reply = await handleUserText(text);
    addMessage(reply, "bot");
    speak(reply);
    if (startTourSoon) { startTourSoon = false; startTour(false); }
    setStatus(micBtn.disabled ? "Escreva sua mensagem abaixo" : "Toque para falar");
  } finally {
    busy = false;
    sendBtn.disabled = false;
  }
}

function submitText() {
  primeAlerts();
  const text = textInput.value.trim();
  if (!text) return;
  if (busy) { showToast("Espere a resposta terminar para enviar a próxima mensagem."); return; }   // não apaga o que a pessoa digitou
  textInput.value = "";
  sendMessage(text);
}
sendBtn.addEventListener("click", submitText);
textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.isComposing) {
    event.preventDefault();
    submitText();
  }
});

// Voz, avisos e Pomodoro
const $ = (id) => document.getElementById(id);

// Voz
const voiceSelect = $("voiceSelect");
const voiceDialog = $("voiceDialog");
let voices = [];
let voiceName = "";
let voiceRate = 1;
try {
  voiceName = localStorage.getItem("voz_nome") || "";
  voiceRate = parseFloat(localStorage.getItem("voz_vel")) || 1;
} catch (e) { }
const saveVoice = () => {
  try { localStorage.setItem("voz_nome", voiceName); localStorage.setItem("voz_vel", String(voiceRate)); } catch (e) { }
};

// Escolhe a voz salva ou a melhor disponível
function currentVoice() {
  const saved = voices.find((v) => v.name === voiceName);
  if (saved) return saved;
  const score = (v) => (/natural|online/i.test(v.name) ? 0 : /google/i.test(v.name) ? 2 : 4) + (v.lang.replace("_", "-") === LANG ? 0 : 1);
  return [...voices].sort((a, b) => score(a) - score(b))[0];
}

function loadVoices() {
  const all = speechSynthesis.getVoices();
  const pt = all.filter((v) => v.lang.toLowerCase().startsWith("pt"));
  voices = pt.length ? pt : all;
  voiceSelect.innerHTML = "";
  voices.forEach((v) => {
    const o = document.createElement("option");
    o.value = v.name;
    o.textContent = v.name + " (" + v.lang + ")";
    voiceSelect.appendChild(o);
  });
  const cur = currentVoice();
  voiceSelect.value = cur ? cur.name : "";
}

if ("speechSynthesis" in window) {
  loadVoices();
  speechSynthesis.addEventListener("voiceschanged", loadVoices);
}
$("voiceRate").value = voiceRate;
$("voiceBtn").addEventListener("click", () => voiceDialog.showModal());
$("voiceClose").addEventListener("click", () => voiceDialog.close());
voiceSelect.addEventListener("change", () => { voiceName = voiceSelect.value; saveVoice(); });
$("voiceRate").addEventListener("input", () => { voiceRate = parseFloat($("voiceRate").value) || 1; saveVoice(); });
$("voiceTest").addEventListener("click", () => speak("Oi! Eu sou sua assistente de estudos. Vamos organizar sua semana?", true));

// Avisos
const toastEl = $("toast");
let alertCtx, toastTimer;

// Os navegadores só liberam som e notificação depois de um clique
function primeAlerts() {
  if ("Notification" in window && Notification.permission === "default") {
    try { Notification.requestPermission(); } catch (e) { }
  }
  try {
    alertCtx = alertCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (alertCtx.state === "suspended") alertCtx.resume();
  } catch (e) { }
}

function beep() {
  if (!alertCtx) return;
  [0, 0.22].forEach((delay, i) => {
    const t = alertCtx.currentTime + delay;
    const osc = alertCtx.createOscillator();
    const gain = alertCtx.createGain();
    osc.frequency.value = i ? 880 : 660;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    osc.connect(gain);
    gain.connect(alertCtx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  });
}

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (toastEl.hidden = true), 8000);
}

function notify(title, body) {
  showToast(title + ": " + body);
  beep();
  speak(title + ". " + body);
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification(title, { body }); } catch (e) { }
  }
}

// Pomodoro
const pomo = { running: false, paused: false, phase: "focus", cycle: 1, cycles: 4, focus: 25, brk: 5, endAt: 0, left: 0 };
const RING = 565.49;
let pomoTimer;
const fmt = (ms) => {
  const t = Math.max(0, Math.ceil(ms / 1000));
  return String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
};

function renderPomo() {
  const total = (pomo.phase === "focus" ? pomo.focus : pomo.brk) * 60000;
  const left = pomo.running ? (pomo.paused ? pomo.left : pomo.endAt - Date.now()) : pomo.focus * 60000;
  const label = pomo.phase === "focus" ? "Foco" : "Pausa";
  $("pTime").textContent = fmt(left);
  $("pPhase").textContent = pomo.running
    ? label + " · ciclo " + pomo.cycle + " de " + pomo.cycles + (pomo.paused ? " (pausado)" : "")
    : "Pronto para começar";
  $("ringFg").style.strokeDashoffset = pomo.running ? RING * (1 - Math.max(0, left) / total) : 0;
  $("pTimer").classList.toggle("rest", pomo.running && pomo.phase === "break");
  $("pStart").disabled = pomo.running;
  $("pPause").disabled = !pomo.running;
  $("pPause").textContent = pomo.paused ? "Retomar" : "Pausar";
  $("pStop").disabled = !pomo.running;
  $("chip").hidden = !pomo.running;
  $("chip").textContent = label + " " + fmt(left);
  document.title = pomo.running ? fmt(left) + " · " + label : "Sua Professora Virtual";
}

function startPomodoro(focus, brk, cycles, subjectId, quiet) {
  const clamp = (n, min, max, fallback) => (Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : fallback);
  pomo.focus = clamp(focus, 1, 180, 25);
  pomo.brk = clamp(brk, 1, 60, 5);
  pomo.cycles = clamp(cycles, 1, 12, 4);
  pomo.cycle = 1;
  pomo.subject = subjectId !== undefined ? subjectId : selVal("pSubject");
  pomo.phase = "focus";
  pomo.paused = false;
  pomo.running = true;
  pomo.endAt = Date.now() + pomo.focus * 60000;
  $("pFocus").value = pomo.focus;
  $("pBreak").value = pomo.brk;
  $("pCycles").value = pomo.cycles;
  clearInterval(pomoTimer);
  pomoTimer = setInterval(tickPomo, 250);
  if (!quiet) deliverCoach(coachSay("start"));
  renderPomo();
}

// Compara com a hora final em vez de contar segundos
function tickPomo() {
  if (!pomo.running || pomo.paused) return;
  if (pomo.endAt - Date.now() <= 0) advancePomo();
  renderPomo();
}

// Troca entre foco e pausa
function advancePomo() {
  if (pomo.phase === "focus") {
    logSession(pomo.subject, pomo.focus);
    if (pomo.cycle >= pomo.cycles) {
      stopPomo();
      deliverCoach(coachSay("all"));
      return;
    }
    const msg = coachSay("cycle") + "\n\n" + coachSay("break");
    pomo.phase = "break";
    pomo.endAt = Date.now() + pomo.brk * 60000;
    deliverCoach(msg);
  } else {
    pomo.cycle++;
    pomo.phase = "focus";
    pomo.endAt = Date.now() + pomo.focus * 60000;
    deliverCoach(coachSay("breakEnd"));
  }
}

function stopPomo() {
  clearInterval(pomoTimer);
  pomo.running = false;
  pomo.paused = false;
  pomo.phase = "focus";
  if (app.classList.contains("focus")) setFocus(false);
  renderPomo();
}

$("pStart").addEventListener("click", () => {
  primeAlerts();
  startPomodoro(+$("pFocus").value, +$("pBreak").value, +$("pCycles").value);
});
$("pPause").addEventListener("click", () => {
  if (pomo.paused) { pomo.endAt = Date.now() + pomo.left; pomo.paused = false; }
  else { pomo.left = pomo.endAt - Date.now(); pomo.paused = true; }
  renderPomo();
  deliverCoach(coachSay(pomo.paused ? "paused" : "resumed"), true);
});
$("pStop").addEventListener("click", () => {
  let spent = 0;
  if (pomo.running && pomo.phase === "focus") {
    const left = pomo.paused ? pomo.left : pomo.endAt - Date.now();
    spent = Math.floor((pomo.focus * 60000 - left) / 60000);
    logSession(pomo.subject, spent);
  }
  const was = pomo.running;
  stopPomo();
  if (was) deliverCoach(coachSay(spent >= 1 ? "stopped" : "stoppedShort", { minutos: fmtMin(spent, true) }));
});
$("pFocus").addEventListener("input", () => {
  if (!pomo.running) { pomo.focus = +$("pFocus").value || 25; renderPomo(); }
});
document.querySelectorAll(".preset").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll(".preset").forEach((x) => x.classList.toggle("on", x === b));
  $("pFocus").value = b.dataset.f;
  $("pBreak").value = b.dataset.b;
  if (!pomo.running) { pomo.focus = +b.dataset.f; renderPomo(); }
}));

// Calendário
let events = [];
try { events = JSON.parse(localStorage.getItem("eventos") || "[]"); } catch (e) { events = []; }
// descarta eventos com formato errado
events = Array.isArray(events) ? events.filter((x) => x && typeof x === "object" && typeof x.title === "string" && typeof x.date === "string") : [];
let calMonth = new Date();
calMonth.setDate(1);
let saveWarned = false;
function warnSave() {
  if (saveWarned) return;
  saveWarned = true;
  showToast("Não consegui salvar seus dados neste navegador (aba anônima ou sem espaço). Exporte um backup.");
}
const saveEvents = () => { try { localStorage.setItem("eventos", JSON.stringify(events)); } catch (e) { warnSave(); } };
const isoDate = (d) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
const parseISO = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return d.getMonth() === +m[2] - 1 ? d : null;  // recusa 31/02
};
const daysUntil = (iso) => Math.round((parseISO(iso) - new Date(new Date().setHours(0, 0, 0, 0))) / 86400000);
const upcomingEvents = () => events.filter((e) => parseISO(e.date) && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));

function addEvent(title, iso, start, end, kind, subjectId, topics) {
  title = String(title || "").trim().slice(0, 80);
  const day = parseISO(iso);
  if (!title || !day) return null;
  const ev = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, date: iso,
    kind: ["prova", "entrega", "compromisso"].includes(kind) ? kind : guessKind(title), subject: subjectId || "", topics: []
  };
  if (validTime(start) && validTime(end) && end > start) { ev.start = start; ev.end = end; }   // compromisso com horário
  events.push(ev);
  if (Array.isArray(topics)) addTopics(ev, topics);
  saveEvents();
  calMonth = new Date(day.getFullYear(), day.getMonth(), 1);
  renderCalendar();
  renderExams();
  checkReminders();
  return ev;
}

function renderCalendar() {
  const y = calMonth.getFullYear();
  const m = calMonth.getMonth();
  const title = calMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  $("calTitle").textContent = title.charAt(0).toUpperCase() + title.slice(1);

  const grid = $("calGrid");
  grid.innerHTML = "";
  ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].forEach((d) => {
    const c = document.createElement("div");
    c.className = "cal-dow";
    c.textContent = d;
    grid.appendChild(c);
  });
  for (let i = 0; i < new Date(y, m, 1).getDay(); i++) grid.appendChild(document.createElement("div"));
  const today = isoDate(new Date());
  for (let d = 1; d <= new Date(y, m + 1, 0).getDate(); d++) {
    const iso = isoDate(new Date(y, m, d));
    const names = events.filter((e) => e.date === iso).map((e) => e.title);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cal-day" + (iso === today ? " today" : "") + (names.length ? " has" : "") + (iso === $("evDate").value ? " sel" : "");
    b.textContent = d;
    if (names.length) b.title = names.join(", ");
    b.addEventListener("click", () => { $("evDate").value = iso; renderCalendar(); });
    grid.appendChild(b);
  }

  const list = $("evList");
  list.innerHTML = "";
  const next = upcomingEvents();
  if (!next.length) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma data marcada ainda. Peça para a assistente ou use os campos acima.";
    list.appendChild(li);
  }
  next.forEach((e) => {
    const n = daysUntil(e.date);
    const li = document.createElement("li");
    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = e.title + (e.kind === "prova" ? " · Prova" : e.kind === "entrega" ? " · Entrega" : "");
    const when = document.createElement("small");
    when.textContent = parseISO(e.date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
      + (e.start ? ", " + e.start + " às " + e.end : "") + " · " + (n === 0 ? "hoje" : n === 1 ? "amanhã" : "em " + n + " dias");
    info.append(name, when);
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Remover " + e.title);
    del.addEventListener("click", () => { events = events.filter((x) => x.id !== e.id); saveEvents(); renderCalendar(); });
    li.append(info, del);
    list.appendChild(li);
  });
}

// Avisa 3 dias antes, 1 dia antes e no dia
function checkReminders() {
  let changed = false;
  events.forEach((e) => {
    if (!parseISO(e.date) || (e.kind === "prova" && profileComplete())) return;
    const n = daysUntil(e.date);
    const step = n < 0 ? null : n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 3 : null;
    if (step === null || (e.last !== undefined && e.last <= step)) return;
    e.last = step;
    changed = true;
    const quando = n === 0 ? "é hoje" : n === 1 ? "é amanhã" : "é em " + n + " dias";
    notify("Data importante", e.title + " " + quando + ". Vamos revisar o que falta?");
  });
  if (changed) saveEvents();
}

$("calPrev").addEventListener("click", () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); renderCalendar(); });
$("calNext").addEventListener("click", () => { calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); renderCalendar(); });
$("evAdd").addEventListener("click", () => {
  primeAlerts();
  if (addEvent($("evTitle").value, $("evDate").value, $("evStart").value, $("evEnd").value, $("evKind").value, selVal("evSubject"))) {
    setTimeout(checkExamCoach, 300);
    $("evStart").value = "";
    $("evEnd").value = "";
    $("evTitle").value = "";
    showToast("Data marcada no calendário.");
  } else {
    showToast("Preencha o título e escolha uma data.");
  }
});

// Abas
const app = $("app");
const panels = { chat: chat, profile: $("panel-profile"), pomodoro: $("panel-pomodoro"), cards: $("panel-cards"), progress: $("panel-progress") };
function showTab(name) {
  app.dataset.tab = name;
  if (name === "chat") $("tabChat").classList.remove("dot");
  Object.entries(panels).forEach(([k, el]) => (el.hidden = k !== name));
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === name));
  ({ profile: () => { renderPlan(); renderExams(); renderCalendar(); }, pomodoro: renderTasks, cards: () => { renderCardInfo(); renderNotes(); }, progress: () => { renderProgress(); renderGrades(); } })[name]?.();
}
document.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => showTab(t.dataset.tab)));
$("chip").addEventListener("click", () => showTab("pomodoro"));

// Início
$("evDate").value = isoDate(new Date());
renderPomo();
renderCalendar();
// (checkReminders começa mais abaixo)

// Estudo
const PALETTE = ["#668B77", "#C8794F", "#5B7FA6", "#9A6B8F", "#B8832A", "#4E9AA0", "#B4655F", "#8A8F4A"];
let db = { subjects: [], sessions: [], tasks: [], notes: [], cards: [], reviews: [], goal: 120, goalDay: "", lastCardAlert: "", chartMode: "line", profile: {}, plan: null, tourDone: false, grades: [], absences: [], rules: {}, gradeCoach: {} };
try { db = { ...db, ...JSON.parse(localStorage.getItem("estudo") || "{}") }; } catch (e) { }

// dados com formato errado não podem derrubar o app
for (const k of ["subjects", "sessions", "tasks", "notes", "cards", "reviews", "grades", "absences"]) if (!Array.isArray(db[k])) db[k] = [];
for (const k of ["profile", "rules", "gradeCoach"]) if (!db[k] || typeof db[k] !== "object" || Array.isArray(db[k])) db[k] = {};
db.subjects = db.subjects.filter((x) => x && typeof x === "object");
if (db.plan != null && !(typeof db.plan === "object" && Array.isArray(db.plan.blocks))) db.plan = null;
if (db.plan) db.plan.blocks = db.plan.blocks.filter((x) => x && typeof x === "object");

function safeColor(c) { return typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c) ? c : "#9AA39B"; }
db.subjects.forEach((x) => { const i = OLD_PALETTE.indexOf(x.color); x.color = i >= 0 ? PALETTE[i] : safeColor(x.color); });
const saveDb = () => { try { localStorage.setItem("estudo", JSON.stringify(db)); } catch (e) { warnSave(); } };
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const todayISO = () => isoDate(new Date());
const addDays = (iso, n) => { const d = parseISO(iso); d.setDate(d.getDate() + n); return isoDate(d); };
const selVal = (id) => { const v = $(id).value; return v === "__new" ? "" : v; };
const subjectName = (id) => (db.subjects.find((s) => s.id === id) || { name: "Sem matéria" }).name;
const subjectColor = (id) => safeColor((db.subjects.find((s) => s.id === id) || {}).color);

// 75 vira 1h 15min
function fmtMin(m, long = false) {
  m = Math.round(m);
  const h = Math.floor(m / 60), r = m % 60;
  if (long) {
    const hh = h + (h === 1 ? " hora" : " horas");
    const mm = r + (r === 1 ? " minuto" : " minutos");
    return !h ? mm : !r ? hh : hh + " e " + mm;
  }
  return !h ? m + " min" : !r ? h + "h" : h + "h " + r + "min";
}
const fmtAxis = (v) => (v < 60 ? Math.round(v) + "m" : (Math.round(v / 6) / 10).toString().replace(".", ",") + "h");

// Matérias
function ensureSubject(name) {
  name = String(name || "").trim().slice(0, 40);
  if (!name) return "";
  let s = db.subjects.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!s) {
    s = { id: uid(), name, color: PALETTE[db.subjects.length % PALETTE.length] };
    db.subjects.push(s);
    saveDb();
    fillSubjectSelects();
  }
  return s.id;
}

function fillSubjectSelects() {
  document.querySelectorAll(".subject-select").forEach((sel) => {
    const keep = sel.value;
    sel.innerHTML = "";
    [["", sel.dataset.all ? "Todas as matérias" : "Sem matéria"], ...db.subjects.map((s) => [s.id, s.name]), ["__new", "+ Nova matéria…"]].forEach(([v, t]) => {
      const o = document.createElement("option");
      o.value = v;
      o.textContent = t;
      sel.appendChild(o);
    });
    sel.value = db.subjects.some((s) => s.id === keep) ? keep : "";
  });
}
document.querySelectorAll(".subject-select").forEach((sel) => sel.addEventListener("change", () => {
  if (sel.value !== "__new") return;
  const id = ensureSubject(prompt("Nome da nova matéria:"));
  fillSubjectSelects();
  sel.value = id;
}));

function subjectTag(id) {
  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = subjectName(id);
  tag.style.background = subjectColor(id) + "26";
  return tag;
}
const emptyItem = (list, text) => { const li = document.createElement("li"); li.textContent = text; list.appendChild(li); };

// Registro de estudo
const minutesOn = (iso, subjectId) => db.sessions
  .filter((s) => s.date === iso && (subjectId === undefined || s.subject === subjectId))
  .reduce((a, s) => a + s.minutes, 0);

function logSession(subjectId, minutes) {
  if (!(minutes >= 1)) return;
  db.sessions.push({ date: todayISO(), subject: subjectId || "", minutes });
  const total = minutesOn(todayISO());
  if (db.goal && total >= db.goal && db.goalDay !== todayISO()) {
    db.goalDay = todayISO();
    notify("Meta batida", "Você estudou " + fmtMin(total, true) + " hoje. Parabéns!");
  }
  saveDb();
  renderTasks();
  renderProgress();
}

// Dias seguidos estudando
function streak() {
  const days = new Set(db.sessions.map((s) => s.date));
  const d = new Date();
  if (!days.has(isoDate(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (days.has(isoDate(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// Tarefas e meta diária
function addTask(text, subjectId, iso) {
  text = String(text || "").trim().slice(0, 120);
  if (!text) return false;
  db.tasks.push({ id: uid(), text, subject: subjectId || "", date: parseISO(iso) ? iso : todayISO(), done: false });
  saveDb();
  renderTasks();
  return true;
}

function renderTasks() {
  const today = todayISO();
  const mins = minutesOn(today);
  const pct = db.goal ? Math.min(100, Math.round((mins / db.goal) * 100)) : 0;
  $("goalInput").value = db.goal;
  $("goalFill").style.width = pct + "%";
  $("goalText").textContent = fmtMin(mins) + " de " + fmtMin(db.goal) + " hoje (" + pct + "%)";
  const list = $("taskList");
  list.innerHTML = "";
  const items = db.tasks.filter((t) => t.date === today || !t.done);
  if (!items.length) emptyItem(list, "Nenhuma tarefa por enquanto. Adicione acima ou peça para a assistente.");
  items.forEach((t) => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.className = "task" + (t.done ? " done" : "");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.addEventListener("change", () => { t.done = cb.checked; saveDb(); renderTasks(); });
    const txt = document.createElement("span");
    txt.textContent = t.text;
    label.append(cb, txt);
    if (t.subject) label.append(subjectTag(t.subject));
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Remover tarefa");
    del.addEventListener("click", () => { db.tasks = db.tasks.filter((x) => x.id !== t.id); saveDb(); renderTasks(); });
    li.append(label, del);
    list.appendChild(li);
  });
}
$("goalInput").addEventListener("change", () => { db.goal = Math.max(0, +$("goalInput").value || 0); saveDb(); renderTasks(); });
$("taskAdd").addEventListener("click", () => {
  if (addTask($("taskText").value, selVal("taskSubject"), todayISO())) $("taskText").value = "";
});
$("taskText").addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) $("taskAdd").click(); });

// Anotações
function renderNotes() {
  const list = $("noteList");
  list.innerHTML = "";
  if (!db.notes.length) emptyItem(list, "Nenhuma anotação ainda.");
  [...db.notes].reverse().forEach((n) => {
    const li = document.createElement("li");
    const box = document.createElement("div");
    box.className = "note-body";
    const meta = document.createElement("small");
    meta.textContent = subjectName(n.subject) + " · " + new Date(n.ts).toLocaleDateString("pt-BR");
    const body = document.createElement("div");
    body.textContent = n.text;
    box.append(meta, body);
    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "✕";
    del.setAttribute("aria-label", "Apagar anotação");
    del.addEventListener("click", () => { db.notes = db.notes.filter((x) => x.id !== n.id); saveDb(); renderNotes(); });
    li.append(box, del);
    list.appendChild(li);
  });
}
$("noteAdd").addEventListener("click", () => {
  const text = $("noteText").value.trim().slice(0, 2000);
  if (!text) return;
  db.notes.push({ id: uid(), subject: selVal("noteSubject"), text, ts: Date.now() });
  saveDb();
  $("noteText").value = "";
  renderNotes();
});

// Flashcards
// Acertou rápido: demora mais para voltar. Errou: volta antes.
let queue = [], current = null, shownAt = 0, answerSecs = 0;
const requeued = new Set();

function dueCards(filter, level) {
  return db.cards.filter((c) => c.due <= todayISO() && (!filter || c.subject === filter) && (!level || (c.level || "medio") === level));
}

const LEVELS = { facil: "Fácil", medio: "Médio", dificil: "Difícil" };
const LEVEL_HINT = { facil: "Fácil: conceitos básicos e perguntas diretas.", medio: "Médio: interpretação e aplicação do conhecimento.", dificil: "Difícil: questões complexas, que exigem raciocínio e domínio do conteúdo." };

function addCards(subjectId, list, level, topic) {
  const lvl = norm(level) in LEVELS ? norm(level) : "medio";
  let n = 0, skipped = 0;
  list.slice(0, 20).forEach((c) => {
    const q = String(c.q || "").trim().slice(0, 300);
    const a = String(c.a || "").trim().slice(0, 500);
    if (q.length < 8 || !a || db.cards.some((x) => norm(x.q) === norm(q))) { skipped++; return; }   // sem repetidas nem superficiais demais
    db.cards.push({ id: uid(), subject: subjectId || "", q, a, level: lvl, topic: String(topic || "").trim().slice(0, 80), ease: 2.5, reps: 0, interval: 0, due: todayISO() });
    n++;
  });
  if (n) {
    db.lastCardAlert = todayISO();
    saveDb();
    renderCardInfo();
    renderProgress();
  }
  return { n, skipped };
}

function renderCardInfo() {
  const n = dueCards(selVal("cardFilter"), $("cardLevelFilter").value).length;
  $("cardInfo").textContent = db.cards.length
    ? n + " flashcard(s) para revisar hoje, de " + db.cards.length + " no total."
    : "Nenhum flashcard ainda. Crie abaixo ou peça para a assistente.";
  $("reviewStart").disabled = !n;
  $("stCards").textContent = dueCards("").length;
}

function nextCard() {
  current = queue.shift();
  if (!current) {
    $("cardBox").hidden = true;
    renderCardInfo();
    renderProgress();
    showToast("Revisão concluída. Bom trabalho!");
    return;
  }
  $("cardBox").hidden = false;
  $("cardCount").textContent = "Restam " + (queue.length + 1) + " · " + LEVELS[current.level || "medio"];
  $("faceQ").textContent = current.q;
  $("faceA").textContent = current.a;
  $("faceA").hidden = true;
  $("cardShow").hidden = false;
  $("cardWrong").hidden = true;
  $("cardRight").hidden = true;
  shownAt = Date.now();
}

function rate(ok) {
  const c = current;
  if (!c) return;
  const hoje = todayISO();
  db.reviews.push({ date: hoje, ok });
  if (db.reviews.length > 500) db.reviews.splice(0, db.reviews.length - 500);
  if (!ok) {
    c.ease = Math.max(1.3, c.ease - 0.2);
    c.reps = 0;
    c.interval = 1;
    if (!requeued.has(c.id)) { requeued.add(c.id); queue.push(c); }   // volta no fim desta revisão
  } else {
    const fast = answerSecs < 6;
    const slow = answerSecs > 25;
    c.reps++;
    c.ease = Math.min(3, Math.max(1.3, c.ease + (fast ? 0.1 : slow ? -0.1 : 0)));
    c.interval = c.reps === 1 ? (fast ? 2 : 1)
      : c.reps === 2 ? (slow ? 2 : 4)
        : Math.max(1, Math.round(c.interval * c.ease * (fast ? 1.3 : slow ? 0.8 : 1)));
  }
  c.due = addDays(hoje, c.interval);
  saveDb();
  nextCard();
}

$("reviewStart").addEventListener("click", () => {
  requeued.clear();
  queue = dueCards(selVal("cardFilter"), $("cardLevelFilter").value).sort(() => Math.random() - 0.5);
  nextCard();
});
$("cardShow").addEventListener("click", () => {
  if (!current) return;
  answerSecs = (Date.now() - shownAt) / 1000;
  $("faceA").hidden = false;
  $("cardShow").hidden = true;
  $("cardWrong").hidden = false;
  $("cardRight").hidden = false;
});
$("cardWrong").addEventListener("click", () => rate(false));
$("cardRight").addEventListener("click", () => rate(true));
$("cardFilter").addEventListener("change", renderCardInfo);
$("cardLevelFilter").addEventListener("change", renderCardInfo);
$("cardAdd").addEventListener("click", () => {
  if (addCards(selVal("cardSubject"), [{ q: $("cardQ").value, a: $("cardA").value }], $("cardLevel").value).n) {
    $("cardQ").value = "";
    $("cardA").value = "";
  } else {
    showToast("Escreva uma pergunta completa e a resposta (e sem repetir uma carta que já existe).");
  }
});

// Gerar flashcards pela IA
let genLevel = "medio";
document.querySelectorAll("#genLevel button").forEach((b) => b.addEventListener("click", () => {
  genLevel = b.dataset.level;
  document.querySelectorAll("#genLevel button").forEach((x) => x.classList.toggle("on", x === b));
  $("genHint").textContent = LEVEL_HINT[genLevel];
}));
$("genBtn").addEventListener("click", () => {
  const topic = $("genTopic").value.trim();
  if (!topic) { showToast("Diga o assunto dos flashcards."); return; }
  primeAlerts();
  const sid = selVal("genSubject");
  sendMessage("Crie " + $("genCount").value + " flashcards de nível " + LEVELS[genLevel].toLowerCase() + " sobre " + topic + (sid ? " (matéria " + subjectName(sid) + ")" : "") + ".");
  $("genTopic").value = "";
});

function checkCardReminder() {
  const n = dueCards("").length;
  if (!n || db.lastCardAlert === todayISO()) return;
  db.lastCardAlert = todayISO();
  saveDb();
  notify("Hora de revisar", n + (n > 1 ? " flashcards para revisar hoje." : " flashcard para revisar hoje."));
}

// Progresso e gráficos (SVG)
function lineChart(el, labels, series) {
  const W = 560, H = 200, L = 44, B = 24, T = 10, R = 10;
  const max = Math.max(10, ...series.flatMap((s) => s.values));
  const x = (i) => L + (i * (W - L - R)) / (labels.length - 1);
  const y = (v) => H - B - (v / max) * (H - B - T);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Minutos estudados por dia">`;
  for (let g = 0; g <= 4; g++) {
    const v = (max * g) / 4;
    svg += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#DDE2D9"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#626C62">${fmtAxis(v)}</text>`;
  }
  labels.forEach((l, i) => { svg += `<text x="${x(i)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#626C62">${l}</text>`; });
  series.forEach((s) => {
    svg += `<polyline points="${s.values.map((v, i) => x(i) + "," + y(v)).join(" ")}" fill="none" stroke="${s.color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    s.values.forEach((v, i) => { svg += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="${s.color}"/>`; });
  });
  el.innerHTML = svg + "</svg>";
}

function barChart(el, labels, values) {
  const W = 560, H = 160, L = 40, B = 24, T = 10, R = 10;
  const slot = (W - L - R) / labels.length;
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Acertos por dia">`;
  [0, 50, 100].forEach((v) => {
    const y = H - B - (v / 100) * (H - B - T);
    svg += `<line x1="${L}" x2="${W - R}" y1="${y}" y2="${y}" stroke="#DDE2D9"/><text x="${L - 6}" y="${y + 4}" text-anchor="end" font-size="11" fill="#626C62">${v}%</text>`;
  });
  labels.forEach((l, i) => {
    const cx = L + slot * i + slot / 2;
    if (values[i] !== null) {
      const h = (values[i] / 100) * (H - B - T);
      svg += `<rect x="${cx - 14}" y="${H - B - h}" width="28" height="${h}" rx="6" fill="#668B77"/>`;
    }
    svg += `<text x="${cx}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#626C62">${l}</text>`;
  });
  el.innerHTML = svg + "</svg>";
}

// Pizza
function pieChart(el, items) {
  const total = items.reduce((a, i) => a + i.value, 0);
  const R = 100, C = 110;
  const label = (x, y, pct) => `<text x="${x.toFixed(1)}" y="${(y + 5).toFixed(1)}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" stroke="rgba(53,72,63,0.5)" stroke-width="3" paint-order="stroke">${pct}%</text>`;
  let svg = `<svg class="pie" viewBox="0 0 220 220" role="img" aria-label="Divisão do tempo por matéria">`;
  if (items.length === 1) {
    svg += `<circle cx="${C}" cy="${C}" r="${R}" fill="${items[0].color}"/>` + label(C, C, 100);
  } else {
    let a0 = -Math.PI / 2;
    items.forEach((it) => {
      const frac = it.value / total;
      const a1 = a0 + frac * 2 * Math.PI;
      const pt = (a) => (C + R * Math.cos(a)).toFixed(2) + " " + (C + R * Math.sin(a)).toFixed(2);
      svg += `<path d="M ${C} ${C} L ${pt(a0)} A ${R} ${R} 0 ${frac > 0.5 ? 1 : 0} 1 ${pt(a1)} Z" fill="${it.color}" stroke="#fff" stroke-width="2"/>`;
      if (frac >= 0.08) {
        const mid = (a0 + a1) / 2;
        svg += label(C + R * 0.62 * Math.cos(mid), C + R * 0.62 * Math.sin(mid), Math.round(frac * 100));
      }
      a0 = a1;
    });
  }
  el.innerHTML = svg + "</svg>";
}

// Colunas
function columnChart(el, labels, series) {
  const W = 560, H = 200, L = 44, B = 24, T = 10, R = 10;
  const totals = labels.map((_, i) => series.reduce((a, s) => a + s.values[i], 0));
  const max = Math.max(10, ...totals);
  const y = (v) => H - B - (v / max) * (H - B - T);
  const slot = (W - L - R) / labels.length;
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Tempo estudado por dia, por matéria">`;
  for (let g = 0; g <= 4; g++) {
    const v = (max * g) / 4;
    svg += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#DDE2D9"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#626C62">${fmtAxis(v)}</text>`;
  }
  labels.forEach((l, i) => {
    const cx = L + slot * i + slot / 2;
    let base = 0;
    series.forEach((s) => {
      const v = s.values[i];
      if (v > 0) {
        svg += `<rect x="${cx - 16}" y="${y(base + v)}" width="32" height="${y(base) - y(base + v)}" fill="${s.color}"/>`;
        base += v;
      }
    });
    svg += `<text x="${cx}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#626C62">${l}</text>`;
  });
  el.innerHTML = svg + "</svg>";
}

const noData = (el, text) => { el.innerHTML = ""; const p = document.createElement("p"); p.className = "hint"; p.textContent = text; el.appendChild(p); };

function renderProgress() {
  const today = todayISO();
  $("stToday").textContent = fmtMin(minutesOn(today));
  $("stStreak").textContent = streak();
  $("stCards").textContent = dueCards("").length;
  const ids = [...db.subjects.map((s) => s.id), ""];

  // Hoje, por matéria
  const bars = $("todayBars");
  bars.innerHTML = "";
  const rows = ids.map((id) => ({ id, m: minutesOn(today, id) })).filter((r) => r.m > 0);
  if (!rows.length) noData(bars, "Nada registrado hoje. Conclua um ciclo de foco no Pomodoro escolhendo uma matéria.");
  const top = Math.max(1, ...rows.map((r) => r.m));
  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "bar-row";
    const name = document.createElement("span");
    name.textContent = subjectName(r.id);
    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.style.width = (r.m / top) * 100 + "%";
    fill.style.background = subjectColor(r.id);
    track.appendChild(fill);
    const val = document.createElement("strong");
    val.textContent = fmtMin(r.m);
    row.append(name, track, val);
    bars.appendChild(row);
  });

  // Últimos 7 dias
  const days = [];
  for (let i = 6; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); days.push(d); }
  const labels = days.map((d) => d.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""));
  const series = ids
    .map((id) => ({ id, color: subjectColor(id), values: days.map((d) => minutesOn(isoDate(d), id)) }))
    .filter((s) => s.values.some((v) => v > 0));
  const mode = db.chartMode || "line";
  document.querySelectorAll("#chartModes button").forEach((b) => b.classList.toggle("on", b.dataset.mode === mode));
  const legend = $("weekLegend");
  legend.innerHTML = "";
  if (!series.length) {
    noData($("weekChart"), "O gráfico aparece depois do primeiro ciclo de foco concluído.");
  } else {
    const sum = (s) => s.values.reduce((a, v) => a + v, 0);
    if (mode === "pie") pieChart($("weekChart"), series.map((s) => ({ color: s.color, value: sum(s) })));
    else if (mode === "col") columnChart($("weekChart"), labels, series);
    else lineChart($("weekChart"), labels, series);
    series.forEach((s) => {
      const item = document.createElement("span");
      const dot = document.createElement("i");
      dot.style.background = s.color;
      item.append(dot, subjectName(s.id) + " · " + fmtMin(sum(s)));
      legend.appendChild(item);
    });
  }

  // Desempenho nas revisões
  if (!db.reviews.length) {
    noData($("perfChart"), "Revise algumas cartas para acompanhar seu desempenho.");
  } else {
    barChart($("perfChart"), labels, days.map((d) => {
      const r = db.reviews.filter((x) => x.date === isoDate(d));
      return r.length ? Math.round((r.filter((x) => x.ok).length / r.length) * 100) : null;
    }));
  }
}

// Modo foco
function setFocus(on) {
  app.classList.toggle("focus", on);
  document.documentElement.classList.toggle("dark", on);
  if (on) deliverCoach(coachSay("focusOn"));
  $("pFocusMode").textContent = on ? "Sair do foco" : "Modo foco";
  try {
    if (on) document.documentElement.requestFullscreen?.()?.catch(() => { });
    else if (document.fullscreenElement) document.exitFullscreen();
  } catch (e) { }
}
$("pFocusMode").addEventListener("click", () => {
  if (app.classList.contains("focus")) { setFocus(false); return; }
  primeAlerts();
  if (!pomo.running) startPomodoro(+$("pFocus").value, +$("pBreak").value, +$("pCycles").value, undefined, true);
  setFocus(true);
});
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && app.classList.contains("focus")) setFocus(false);
});

document.querySelectorAll("#chartModes button").forEach((b) => b.addEventListener("click", () => {
  db.chartMode = b.dataset.mode;
  saveDb();
  renderProgress();
}));

// Perfil e plano
const validTime = (t) => /^([01]\d|2[0-3]):[0-5]\d$/.test(t || "");
const toMin = (t) => +t.slice(0, 2) * 60 + +t.slice(3);
const PROFILE_LABELS = {
  name: "Nome", routine: "Rotina", best_period: "Melhor horário", daily_hours: "Horas por dia", days: "Dias disponíveis",
  learning_style: "Como aprende", group_or_solo: "Sozinho ou em grupo", focus_span_minutes: "Tempo de foco",
  personality: "Hábitos", goals: "Objetivo", notes: "Observações"
};

function saveProfile(args) {
  let n = 0;
  Object.keys(PROFILE_LABELS).forEach((k) => {
    const v = args[k];
    if (v === undefined || v === null || String(v).trim() === "") return;
    db.profile[k] = String(v).trim().slice(0, 300);
    n++;
  });
  if (n) { saveDb(); renderPlan(); }
  return n;
}

// Valida o plano; se algo estiver errado, não salva nada
function createPlan(title, rawBlocks) {
  const list = Array.isArray(rawBlocks) ? rawBlocks.slice(0, 60) : [];
  const today = todayISO();
  const errors = [];
  const blocks = [];
  list.forEach((b, i) => {
    const where = "Bloco " + (i + 1) + ": ";
    if (!parseISO(b.date) || b.date < today) return errors.push(where + "data inválida ou no passado (use AAAA-MM-DD, a partir de hoje).");
    if (!validTime(b.start) || !validTime(b.end) || b.end <= b.start) return errors.push(where + "horário inválido (use HH:MM, com o fim depois do início).");
    const subject = String(b.subject || "").trim();
    if (!subject) return errors.push(where + "falta a matéria.");
    blocks.push({
      id: uid(), date: b.date, start: b.start, end: b.end, subjectName: subject,
      activity: String(b.activity || "").trim().slice(0, 120), method: String(b.method || "").trim().slice(0, 80), done: false, notified: false
    });
  });

  // conflitos com compromissos e entre blocos
  const overlap = (a, b) => a.date === b.date && a.start < b.end && b.start < a.end;
  blocks.forEach((b, i) => {
    events.filter((e) => e.start && overlap(b, e)).forEach((e) =>
      errors.push(b.date + " " + b.start + " às " + b.end + " bate com o compromisso " + e.title + " (" + e.start + " às " + e.end + ")."));
    blocks.slice(i + 1).filter((o) => overlap(b, o)).forEach((o) =>
      errors.push(b.date + " " + b.start + " às " + b.end + " bate com outro bloco do plano (" + o.start + " às " + o.end + ")."));
  });
  if (!blocks.length && !errors.length) errors.push("O plano está vazio.");
  if (errors.length) return { ok: false, errors: errors.slice(0, 6) };

  // aviso: mais estudo do que as horas livres
  const warnings = [];
  const cap = parseFloat(String(db.profile.daily_hours || "").replace(",", "."));
  if (cap > 0) {
    const perDay = {};
    blocks.forEach((b) => { perDay[b.date] = (perDay[b.date] || 0) + toMin(b.end) - toMin(b.start); });
    Object.keys(perDay).filter((d) => perDay[d] > cap * 60 + 10).forEach((d) =>
      warnings.push(d + " tem " + Math.round(perDay[d] / 6) / 10 + " h de estudo, acima das " + cap + " h livres por dia."));
  }

  blocks.forEach((b) => { b.subject = ensureSubject(b.subjectName); delete b.subjectName; });
  blocks.sort((x, y) => (x.date + x.start).localeCompare(y.date + y.start));
  db.plan = { title: String(title || "Plano de estudos").trim().slice(0, 80), created: today, blocks };
  saveDb();
  renderPlan();
  return warnings.length ? { ok: true, blocks: blocks.length, warnings } : { ok: true, blocks: blocks.length };
}

function renderPlan() {
  const box = $("profileBox");
  box.innerHTML = "";
  const keys = Object.keys(PROFILE_LABELS).filter((k) => db.profile[k]);
  if (!keys.length) noData(box, "Ainda não conheço você. Toque em Montar meu plano e eu faço algumas perguntas.");
  keys.forEach((k) => {
    const d = document.createElement("div");
    d.className = "pf";
    const l = document.createElement("small");
    l.textContent = PROFILE_LABELS[k];
    const v = document.createElement("span");
    v.textContent = db.profile[k];
    d.append(l, v);
    box.appendChild(d);
  });

  $("planTitle").textContent = db.plan ? db.plan.title : "Plano de estudos";
  const list = $("planList");
  list.innerHTML = "";
  const today = todayISO();
  const blocks = db.plan ? db.plan.blocks.filter((b) => b.date >= today) : [];
  if (!blocks.length) { noData(list, "Nenhum plano ainda. Toque em Montar meu plano."); return; }
  let last = "", ul = null;
  blocks.forEach((b) => {
    if (b.date !== last) {
      last = b.date;
      const n = daysUntil(b.date);
      const h = document.createElement("h3");
      h.className = "day";
      h.textContent = parseISO(b.date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) + (n === 0 ? " · hoje" : n === 1 ? " · amanhã" : "");
      ul = document.createElement("ul");
      ul.className = "ev-list";
      list.append(h, ul);
    }
    const li = document.createElement("li");
    const label = document.createElement("label");
    label.className = "task" + (b.done ? " done" : "");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = b.done;
    cb.addEventListener("change", () => { b.done = cb.checked; saveDb(); renderPlan(); });
    const blk = document.createElement("div");
    blk.className = "blk";
    const t = document.createElement("strong");
    t.textContent = b.start + " às " + b.end;
    const a = document.createElement("span");
    a.textContent = b.activity;
    blk.append(t, a);
    if (b.method) {
      const m = document.createElement("small");
      m.textContent = "Método: " + b.method;
      blk.append(m);
    }
    label.append(cb, blk, subjectTag(b.subject));
    li.append(label);
    ul.appendChild(li);
  });
}

// Avisa quando um bloco começa
function checkPlanReminders() {
  if (!db.plan) return;
  const now = new Date();
  const hoje = isoDate(now);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let changed = false;
  db.plan.blocks.forEach((b) => {
    if (b.date !== hoje || b.done || b.notified) return;
    const st = toMin(b.start);
    if (nowMin >= st && nowMin < st + 10) {
      b.notified = true;
      changed = true;
      notify("Hora de estudar", subjectName(b.subject) + ": " + (b.activity || "bloco de estudo") + ".");
    }
  });
  if (changed) saveDb();
}

$("planMake").addEventListener("click", () => { primeAlerts(); sendMessage("Monte meu plano de estudos considerando meu perfil e os compromissos do meu calendário."); });
$("planProfile").addEventListener("click", () => { primeAlerts(); sendMessage("Quero refazer meu perfil de estudo. Me faça as perguntas."); });
$("planClear").addEventListener("click", () => { db.plan = null; saveDb(); renderPlan(); });
$("planTour").addEventListener("click", () => { primeAlerts(); startTour(true); });

// Abertura da conversa (entrevista do perfil)
const REQUIRED = ["routine", "best_period", "daily_hours", "learning_style", "goals"];
const profileComplete = () => REQUIRED.every((k) => db.profile[k]);
const missingProfile = () => REQUIRED.filter((k) => !db.profile[k]).map((k) => PROFILE_LABELS[k]);
const ROUNDS = [
  { need: ["routine"], text: "1. Como posso te chamar?\n2. Como é a sua rotina e quais compromissos fixos você tem (aulas, trabalho)?" },
  { need: ["best_period", "daily_hours"], text: "1. Em que período do dia você rende mais para estudar?\n2. Quantas horas livres por dia você tem para estudar, e em quais dias da semana?" },
  { need: ["learning_style"], text: "1. Como você aprende melhor: lendo, vendo, ouvindo ou praticando?\n2. Você prefere estudar sozinho(a) ou em grupo?" },
  { need: ["goals"], text: "1. Qual é o seu objetivo e para quando?\n2. Como você é com os estudos: se distrai fácil? Rende mais com prazo apertado ou com antecedência?" }
];
let welcomeText = "", openingPending = false, coachPending = false, coachContext = "", startTourSoon = false;

function showWelcome(speakIt) {
  const round = ROUNDS.find((r) => r.need.some((k) => !db.profile[k]));
  const v = db.profile.name ? ", " + db.profile.name : "";
  let text;
  if (!round) {
    welcomeText = "";
    openingPending = false;
    text = "Oi de novo" + v + "! O que vamos organizar hoje? Posso montar um plano de estudos, iniciar um Pomodoro, marcar uma prova no calendário ou criar flashcards. Se quiser rever o que eu faço, peça o tour. Dica: ao me contar compromissos, diga a data completa e o horário.";
  } else {
    welcomeText = (Object.keys(db.profile).length
      ? "Oi de novo" + v + "! Ainda quero te conhecer melhor para montar um plano que combine com você:\n"
      : "Oi! Eu sou a Sua Professora Virtual, sua companheira de estudos. Antes de organizar qualquer coisa, quero te conhecer para montar um plano que combine com você. Duas perguntas rápidas:\n") + round.text;
    openingPending = true;
    text = welcomeText;
  }
  if (!apiKey) text += "\n\nPara conversar comigo, clique em Chave da API e cole sua chave do Gemini.";
  addMessage(text, "bot");
  if (speakIt) speak(text);
}

// Mensagens da professora no Pomodoro
// {v} vira ", Nome" quando o nome é conhecido
const MSGS = {
  focusOn: [
    "Boa sorte{v}! Seu Modo Foco foi iniciado. Agora é hora de dedicar sua atenção aos estudos. Enquanto você se concentra, vou acompanhar seu tempo e avisar quando chegar o momento de fazer uma pausa. Vamos juntos!",
    "Modo Foco ligado{v}! Deixe o resto para depois: eu cuido do relógio e aviso quando for hora de descansar. Respire fundo e vamos começar.",
    "Pronto{v}, o Modo Foco começou. Agora é só você e o conteúdo{materiaDe}. Fico de olho no tempo por aqui, combinado?"
  ],
  start: [
    "Ciclo {n} de {total} iniciado{v}! São {foco} minutos{materiaDe}. Eu acompanho o tempo, você cuida da concentração.",
    "Vamos lá{v}! {foco} minutos de foco{materiaDe}. Quando for hora de pausar, eu te aviso.",
    "Começamos! Cronômetro rodando: {foco} minutos de atenção{materiaDe}. Um passo de cada vez, você consegue."
  ],
  cycle: [
    "Mais um ciclo concluído! Muito bem! Cada período de dedicação é um passo a mais em direção ao seu objetivo. Continue assim! {faltam}",
    "Ciclo {n} de {total} concluído{v}! {faltam} Constância é o que faz a diferença, e você está mostrando isso.",
    "Boa{v}! Você completou o ciclo {n}. {faltam} Seu esforço de agora é o que vai aparecer nos resultados."
  ],
  break: [
    "Oba! Pausa iniciada. Aproveite esse tempinho para tomar uma água, descansar a mente e, quem sabe, dar uma dose de dopamina ao cérebro com algo que te entretenha. Mas sem exagerar, hein? Daqui a pouquinho estaremos de volta aos estudos!",
    "Hora da pausa de {pausa} minutos! Levante, alongue o corpo, olhe para longe da tela e beba uma água. Quando o tempo acabar, eu te chamo de volta.",
    "Você merece um descanso{v}! Respire, estique as costas e deixe a mente soltar um pouquinho. Em {pausa} minutos a gente retoma."
  ],
  breakEnd: [
    "Fim da pausa! Espero que tenha conseguido descansar um pouquinho. Agora vamos voltar? Mais uma etapa de cada vez. Você consegue!",
    "A pausa acabou{v}. Ciclo {n} de {total} começando: {foco} minutos de atenção. Um passo de cada vez!",
    "Voltando ao foco! Descansou? Então vamos para o ciclo {n} de {total}. Estou aqui com você."
  ],
  all: [
    "Você conseguiu! Todos os ciclos de hoje foram concluídos. Parabéns pela dedicação! Agora aproveite para descansar, você merece.",
    "Missão cumprida{v}! {total} ciclos de foco{materiaDe} concluídos. Que orgulho! Descanse, beba uma água e, se quiser, anote o que aprendeu.",
    "Terminamos todos os ciclos planejados! A sua dedicação de hoje conta muito. Respire, relaxe e volte quando estiver pronto(a)."
  ],
  paused: ["Cronômetro em pausa. Quando quiser continuar, é só tocar em Retomar. Sem pressa!", "Pausa feita. Respire um pouco; quando voltar, eu retomo o tempo de onde parou."],
  resumed: ["De volta! Cronômetro retomado. Vamos continuar com calma e atenção.", "Retomando de onde paramos. Estou com você!"],
  stopped: [
    "Sessão encerrada{v}. Registrei {minutos} de estudo. Cada passo conta, e a gente segue amanhã!",
    "Tudo bem encerrar por aqui{v}. Foram {minutos} de estudo registrados, e isso já é progresso."
  ],
  stoppedShort: [
    "Sessão encerrada{v}. Sem problema: quando quiser recomeçar, estou por aqui.",
    "Cronômetro parado. Quando se sentir pronto(a), é só iniciar de novo que eu acompanho você."
  ]
};
const lastMsg = {};

function coachCtx(extra) {
  const nome = db.profile.name || "";
  const mat = pomo.subject ? subjectName(pomo.subject) : "";
  const falta = pomo.cycles - pomo.cycle;
  return {
    v: nome ? ", " + nome : "", nome, n: pomo.cycle, total: pomo.cycles, foco: pomo.focus, pausa: pomo.brk,
    materiaDe: mat ? " de " + mat : "",
    faltam: falta > 0 ? (falta === 1 ? "Falta 1 ciclo." : "Faltam " + falta + " ciclos.") : "",
    ...extra
  };
}

// Sorteia uma versão diferente da última
function coachSay(event, extra) {
  const list = MSGS[event];
  let i = Math.floor(Math.random() * list.length);
  if (list.length > 1 && i === lastMsg[event]) i = (i + 1) % list.length;
  lastMsg[event] = i;
  const ctx = coachCtx(extra);
  return list[i].replace(/\{(\w+)\}/g, (_, k) => (ctx[k] !== undefined ? ctx[k] : "")).replace(/ +/g, " ").trim();
}

// Mostra no painel, fala e avisa
function deliverCoach(text, quiet) {
  $("coachText").textContent = text;
  speak(text);
  if (quiet) return;
  beep();
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Sua Professora Virtual", { body: text, tag: "pomodoro" }); } catch (e) { }   // a mesma tag substitui a anterior
  }
  if (app.dataset.tab !== "pomodoro") showToast(text);
}

// Ajuda para editar eventos
const describeEv = (e) => e.title + " (" + e.date + (e.start ? " " + e.start + "-" + e.end : "") + ")";
const describeBlock = (b) => b.date + " " + b.start + "-" + b.end + " " + subjectName(b.subject) + ": " + b.activity;

// Acha um compromisso pelo nome; se houver dúvida, devolve as opções
function pickEvent(name, iso) {
  const k = norm(name);
  let list = events.filter((e) => !k || norm(e.title).includes(k) || k.includes(norm(e.title)));
  if (parseISO(iso)) list = list.filter((e) => e.date === iso);
  const futuros = list.filter((e) => daysUntil(e.date) >= 0);
  if (futuros.length) list = futuros;
  if (list.length === 1) return { ev: list[0] };
  if (!list.length) return { error: { ok: false, error: "Compromisso não encontrado.", existentes: upcomingEvents().slice(0, 10).map(describeEv) } };
  return { error: { ok: false, error: "Mais de um compromisso corresponde. Qual deles se refere?.", opcoes: list.slice(0, 6).map(describeEv) } };
}

// Blocos do plano que batem com um compromisso
function planConflicts(ev) {
  if (!ev.start || !db.plan) return [];
  return db.plan.blocks.filter((b) => b.date === ev.date && !b.done && b.start < ev.end && ev.start < b.end).map(describeBlock);
}
function planBlocksText() {
  const hoje = todayISO();
  return db.plan.blocks.filter((b) => b.date >= hoje).slice(0, 28)
    .map((b) => b.date + " " + b.start + "-" + b.end + " " + subjectName(b.subject) + (b.done ? " [feito]" : "")).join("; ") || "nenhum";
}

// Provas
const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
function guessKind(title) { return /prova|teste|exame|avalia/i.test(title) ? "prova" : /entrega|trabalho|prazo/i.test(title) ? "entrega" : "compromisso"; }
const exams = () => events.filter((e) => e.kind === "prova" && parseISO(e.date) && daysUntil(e.date) >= 0).sort((a, b) => a.date.localeCompare(b.date));

function findExam(name) {
  const list = exams();
  const k = norm(name);
  if (!k) return list.length === 1 ? list[0] : null;
  return list.find((e) => norm(e.title).includes(k) || k.includes(norm(e.title)))
    || list.find((e) => e.subject && norm(subjectName(e.subject)).includes(k)) || null;
}

function addTopics(ev, names) {
  ev.topics = ev.topics || [];
  let n = 0;
  names.forEach((nm) => {
    nm = String(nm || "").trim().slice(0, 80);
    if (!nm || ev.topics.length >= 30 || ev.topics.some((t) => norm(t.name) === norm(nm))) return;
    ev.topics.push({ id: uid(), name: nm, done: false });
    n++;
  });
  return n;
}

// Só conta como estudado o que tem registro
function topicRecord(ex, t) {
  if (t.done) return "marcado por você";
  const k = norm(t.name);
  if (db.plan && db.plan.blocks.some((b) => b.done && norm(b.activity + " " + b.method).includes(k))) return "bloco do plano concluído";
  if (db.cards.some((c) => c.reps > 0 && c.topic && norm(c.topic) === k)) return "flashcards revisados";
  return "";
}
const examBlocks = (ex) => (db.plan ? db.plan.blocks.filter((b) => b.date <= ex.date && (!ex.subject || b.subject === ex.subject)) : []);

function renderExams() {
  const box = $("examList");
  box.innerHTML = "";
  const list = exams();
  if (!list.length) { noData(box, "Nenhuma prova marcada. Cadastre no calendário (tipo Prova) ou me conte aqui na conversa."); return; }
  list.forEach((ex) => {
    const n = daysUntil(ex.date);
    const card = document.createElement("div");
    card.className = "exam";
    const head = document.createElement("div");
    head.className = "exam-head";
    const t = document.createElement("strong");
    t.textContent = ex.title;
    const when = document.createElement("small");
    when.textContent = parseISO(ex.date).toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" }) + " · " + (n === 0 ? "hoje" : n === 1 ? "amanhã" : "em " + n + " dias");
    head.append(t, when);
    card.appendChild(head);
    if (ex.subject) card.appendChild(subjectTag(ex.subject));
    const topics = ex.topics || [];
    if (!topics.length) {
      const p = document.createElement("small");
      p.textContent = "Ainda não sei quais conteúdos vão cair. Adicione abaixo ou conte para a professora.";
      card.appendChild(p);
    } else {
      const done = topics.filter((x) => topicRecord(ex, x)).length;
      const sum = document.createElement("small");
      sum.textContent = done + " de " + topics.length + " conteúdos com registro de estudo";
      const bar = document.createElement("div");
      bar.className = "meter-bar";
      const fill = document.createElement("div");
      fill.style.width = Math.round((done / topics.length) * 100) + "%";
      bar.appendChild(fill);
      card.append(sum, bar);
      topics.forEach((tp) => {
        const row = document.createElement("label");
        row.className = "topic";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = !!tp.done;
        cb.addEventListener("change", () => { tp.done = cb.checked; saveEvents(); renderExams(); });
        const nm = document.createElement("span");
        nm.textContent = tp.name;
        const st = document.createElement("small");
        st.textContent = topicRecord(ex, tp) || "sem registro";
        row.append(cb, nm, st);
        card.appendChild(row);
      });
    }
    const add = document.createElement("div");
    add.className = "add-topic";
    const inp = document.createElement("input");
    inp.type = "text";
    inp.placeholder = "Adicionar conteúdo";
    inp.setAttribute("aria-label", "Adicionar conteúdo");
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "ghost";
    addBtn.textContent = "Adicionar";
    const doAdd = () => { if (addTopics(ex, [inp.value])) { saveEvents(); renderExams(); } };
    addBtn.addEventListener("click", doAdd);
    inp.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.isComposing) doAdd(); });
    add.append(inp, addBtn);
    card.appendChild(add);
    const acts = document.createElement("div");
    acts.className = "mini-actions";
    const names = topics.map((x) => x.name).join(", ");
    const plan = document.createElement("button");
    plan.type = "button";
    plan.className = "primary";
    plan.textContent = "Planejar esta prova";
    plan.addEventListener("click", () => { primeAlerts(); sendMessage("Monte um plano de estudos para a prova " + ex.title + " (" + ex.date + "), considerando o tempo que falta, meus compromissos e as minhas dificuldades." + (names ? " Conteúdos: " + names + "." : " Ainda não sei os conteúdos, pode me perguntar.")); });
    const fc = document.createElement("button");
    fc.type = "button";
    fc.className = "ghost";
    fc.textContent = "Flashcards desta prova";
    fc.addEventListener("click", () => { primeAlerts(); sendMessage("Quero flashcards para a prova " + ex.title + (names ? ", sobre: " + names : "") + ". Pergunte qual nível eu prefiro: fácil, médio ou difícil."); });
    acts.append(plan, fc);
    card.appendChild(acts);
    box.appendChild(card);
  });
}

function examCoachMessage(ex) {
  const n = daysUntil(ex.date);
  if (n > 21) return "";
  const mat = ex.subject ? subjectName(ex.subject) : ex.title;
  const nome = db.profile.name || "";
  const quando = n === 0 ? "é hoje" : n === 1 ? "é amanhã" : "é em " + n + " dias";
  const topics = ex.topics || [];
  const sem = topics.filter((t) => !topicRecord(ex, t)).map((t) => t.name);
  const blocks = examBlocks(ex);
  const late = blocks.filter((b) => b.date < todayISO() && !b.done).length;
  const lista = (a) => a.slice(0, 3).join(", ").replace(/, ([^,]*)$/, " e $1");
  const faltam = n === 1 ? "Falta 1 dia" : "Faltam " + n + " dias";
  if (n === 0) return "Hoje é o dia da prova de " + mat + "! Respire fundo, confie no que você estudou e vá com calma. Boa sorte" + (nome ? ", " + nome : "") + "!";
  if (!topics.length) return (nome ? nome + ", s" : "S") + "ua prova de " + mat + " " + quando + ". Quais conteúdos vão cair? Me conta aqui no chat que eu organizo seus estudos com os dias que restam.";
  if (!blocks.length && n <= 10) return "Sua prova de " + mat + " " + quando + " e ainda não montamos um plano para ela. Quer que eu monte agora, respeitando seu calendário e suas horas livres?";
  if (blocks.length && late >= 2 && late / blocks.length >= 0.3) return "Vi que alguns blocos do plano para a prova de " + mat + " estão sem marcação. Está conseguindo cumprir? Se estiver apertado, posso ajustar o plano para algo mais realista.";
  if (sem.length && n <= 3 && sem.length / topics.length >= 0.4) return faltam + " para a prova de " + mat + " e ainda não tenho registro de revisão de " + lista(sem) + ". Se você já estudou algum por fora, me avisa que eu marco. Para o resto, vamos priorizar: posso montar um plano enxuto, com exercícios e flashcards.";
  if (sem.length && n <= 10) return "Sua prova de " + mat + " está chegando e não tenho registro de revisão de " + lista(sem.slice(0, 2)) + ". Você já estudou isso por fora? Se não, que tal reservar um tempinho amanhã? Posso preparar exercícios e flashcards para ajudar você a fixar!";
  if ([7, 3, 1].includes(n)) return faltam + " para a prova de " + mat + ". Como está a preparação? Quer revisar algum conteúdo comigo?";
  return "";
}

// Uma mensagem por prova por dia
function checkExamCoach() {
  if (!profileComplete() || tourIdx >= 0) return;
  const today = todayISO();
  let sent = 0;
  exams().forEach((ex) => {
    if (sent >= 2 || ex.coachDay === today) return;
    const text = examCoachMessage(ex);
    if (!text) return;
    ex.coachDay = today;
    saveEvents();
    sent++;
    coachContext = text;
    coachPending = true;
    addMessage(text, "bot");
    notify("Sua Professora Virtual", text);
  });
}

// Tour guiado
const TOUR = [
  { tab: "chat", spot: "tabChat", title: "Bem-vindo(a)", text: "Oi{v}! Eu sou a Sua Professora Virtual. Vou te guiar pelo programa, mostrando cada funcionalidade e ensinando como usar, uma etapa por vez e no seu ritmo. Toque em Próximo quando estiver pronto(a)." },
  { tab: "chat", spot: "tabChat", title: "Conversa", text: "Aqui nós conversamos. Fale pelo microfone ou escreva. Você pode me pedir um plano de estudos, tirar dúvidas, marcar uma prova ou criar flashcards. A ideia é organizar seus estudos conversando comigo, sem precisar fazer tudo manualmente." },
  { tab: "profile", title: "Seu perfil", text: "Aqui ficam o que eu sei sobre você, suas provas, seu plano de estudos e o calendário. Surgiu um compromisso, uma consulta ou um evento que atrapalha os estudos? É só me avisar na conversa: eu registro no calendário, levo em conta na sua rotina e sugiro ajustes quando for preciso." },
  { tab: "profile", title: "Provas", text: "Quando você marca uma prova, eu passo a acompanhar sua preparação: aviso quando ela se aproxima, pergunto quais conteúdos vão cair, monto o plano com os dias que restam e confiro como você está indo. Se o tempo ficar curto, sugiro prioridades realistas." },
  { tab: "profile", title: "Dica: datas completas", text: "Ao me contar um compromisso, diga a data completa e o horário. Por exemplo: “consulta no dia 20 de março, das 14h às 15h”. Datas como amanhã ou sexta eu entendo, mas, para datas mais distantes, o dia e o mês evitam erros. Se algo mudar, é só me avisar que eu atualizo o compromisso, e se for cancelado eu apago. Você também pode marcar direto no calendário." },
  { tab: "pomodoro", title: "Foco", text: "Escolha um ritmo de foco e pausa, diga a matéria e comece. Eu acompanho o tempo e aviso a hora da pausa e da volta. No Modo foco a tela fica escura, só com o cronômetro. As tarefas e a meta de estudo do dia ficam logo abaixo." },
  { tab: "cards", title: "Revisão", text: "Aqui você revisa flashcards e pode escolher o nível: fácil, médio ou difícil. O que você erra volta mais cedo, e o que acerta rápido demora mais para voltar. Suas anotações por matéria ficam aqui também." },
  { tab: "progress", title: "Progresso", text: "Veja quanto você estudou hoje, seus dias seguidos e os gráficos da semana em pizza, linhas ou colunas, cada matéria com a sua cor, além do seu desempenho nas revisões. Aqui também ficam suas notas e faltas: eu calculo a média de cada matéria e aviso quando as faltas chegam perto do limite." },
  { tab: "chat", spot: "voiceBtn", title: "Voz e chave", text: "No botão Voz você escolhe como eu falo e a velocidade. Em Chave da API fica a chave do Gemini, que me dá a inteligência para conversar." },
  { tab: "chat", spot: "tabChat", title: "Pronto!", text: "Tour concluído{v}! Se quiser rever, é só pedir o tour. Por onde vamos começar? Posso montar seu plano, marcar uma prova ou iniciar um Pomodoro." }
];
let tourIdx = -1;

function renderTour(silent) {
  document.querySelectorAll(".spot").forEach((x) => x.classList.remove("spot"));
  if (tourIdx < 0) { $("tourCard").hidden = true; return; }
  const st = TOUR[tourIdx];
  showTab(st.tab);
  const target = st.spot ? $(st.spot) : document.querySelector('.tab[data-tab="' + st.tab + '"]');
  if (target) target.classList.add("spot");
  const text = st.text.replace("{v}", db.profile.name ? ", " + db.profile.name : "");
  $("tourStep").textContent = "Etapa " + (tourIdx + 1) + " de " + TOUR.length;
  $("tourTitle").textContent = st.title;
  $("tourText").textContent = text;
  $("tourBack").hidden = tourIdx === 0;
  $("tourNext").textContent = tourIdx === TOUR.length - 1 ? "Concluir" : "Próximo";
  $("tourCard").hidden = false;
  if (!silent) speak(text);
}
function startTour(speakFirst) {
  db.tourDone = true;
  saveDb();
  tourIdx = 0;
  renderTour(!speakFirst);
}
function endTour() { tourIdx = -1; renderTour(true); showTab("chat"); stopSpeaking(); }
$("tourNext").addEventListener("click", () => { primeAlerts(); if (tourIdx >= TOUR.length - 1) endTour(); else { tourIdx++; renderTour(); } });
$("tourBack").addEventListener("click", () => { tourIdx = Math.max(0, tourIdx - 1); renderTour(); });
$("tourSkip").addEventListener("click", endTour);
$("evKind").addEventListener("change", () => { $("evSubject").hidden = $("evKind").value !== "prova"; });

// Notas e faltas
const mk = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; };
const fmtNum = (n) => (Math.round(n * 10) / 10).toFixed(1).replace(".", ",");
const fmtDay = (iso) => parseISO(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
const rules = (sid) => ({ target: 6, limit: 0, ...(db.rules[sid] || {}) });
const gradesOf = (sid) => db.grades.filter((g) => g.subject === sid);
const absencesOf = (sid) => db.absences.filter((a) => a.subject === sid).reduce((t, a) => t + a.count, 0);
const weightSum = (sid) => gradesOf(sid).reduce((t, g) => t + g.weight, 0);
const pointSum = (sid) => gradesOf(sid).reduce((t, g) => t + (g.grade / g.max) * 10 * g.weight, 0);  // escala de 0 a 10
const subjectAverage = (sid) => (weightSum(sid) ? pointSum(sid) / weightSum(sid) : null);
const neededGrade = (sid) => rules(sid).target * (weightSum(sid) + 1) - pointSum(sid);  // nota que falta na próxima

function addGrade(subjectId, title, value, max, weight, iso) {
  if (!subjectId) return { error: "Escolha a matéria." };
  const g = parseFloat(String(value).replace(",", "."));
  const m = parseFloat(String(max).replace(",", ".")) || 10;
  const w = parseFloat(String(weight).replace(",", ".")) || 1;
  if (!(g >= 0) || !(m > 0) || g > m) return { error: "Informe uma nota válida (entre 0 e a nota máxima)." };
  if (!(w > 0)) return { error: "O peso precisa ser maior que zero." };
  db.grades.push({ id: uid(), subject: subjectId, title: String(title || "").trim().slice(0, 60) || "Avaliação", grade: g, max: m, weight: w, date: parseISO(iso) ? iso : todayISO() });
  saveDb();
  renderGrades();
  return { ok: true };
}

function addAbsence(subjectId, qty, iso) {
  if (!subjectId) return { error: "Escolha a matéria." };
  const n = Math.min(20, Math.max(1, Math.round(+qty || 1)));
  db.absences.push({ id: uid(), subject: subjectId, count: n, date: parseISO(iso) ? iso : todayISO() });
  saveDb();
  renderGrades();
  return { ok: true };
}

function setRules(sid, target, limit) {
  const r = { ...(db.rules[sid] || {}) };
  if (target !== undefined && target !== null && target !== "" && +target >= 0) r.target = Math.min(10, +target);
  if (limit !== undefined && limit !== null && limit !== "" && +limit >= 0) r.limit = Math.round(+limit);
  db.rules[sid] = r;
  saveDb();
  renderGrades();
}

// Só avisa se o limite de faltas foi definido
function absenceAlert(sid) {
  const r = rules(sid), total = absencesOf(sid), nome = subjectName(sid);
  if (!r.limit) return "";
  if (total > r.limit) return "Atenção: você passou do limite de faltas em " + nome + " (" + total + " de " + r.limit + ").";
  if (total === r.limit) return "Atenção: você chegou ao limite de faltas em " + nome + " (" + total + " de " + r.limit + "). Fique de olho para não perder mais aulas.";
  if (total >= Math.ceil(r.limit * 0.75)) return "Cuidado: você já usou " + total + " das " + r.limit + " faltas permitidas em " + nome + ".";
  return "";
}

function gradesSummaryText() {
  return db.subjects.filter((s) => gradesOf(s.id).length || absencesOf(s.id))
    .map((s) => { const a = subjectAverage(s.id), r = rules(s.id); return s.name + ": média " + (a === null ? "sem notas" : fmtNum(a)) + " (alvo " + fmtNum(r.target) + "), faltas " + absencesOf(s.id) + (r.limit ? " de " + r.limit : ""); })
    .join("; ") || "nenhum registro";
}

function renderGrades() {
  const box = $("gradesSummary");
  box.innerHTML = "";
  const ids = db.subjects.map((s) => s.id).filter((id) => gradesOf(id).length || absencesOf(id) || db.rules[id]);
  if (!ids.length) { noData(box, "Registre sua primeira nota ou falta acima. Eu acompanho a média e o limite de faltas de cada matéria."); return; }
  ids.forEach((sid) => {
    const r = rules(sid), avg = subjectAverage(sid), total = absencesOf(sid);
    const card = mk("div", "subj");
    const head = mk("div", "row");
    head.append(subjectTag(sid), mk("strong", "", avg === null ? "Sem notas ainda" : "Média " + fmtNum(avg)), mk("small", "", "alvo " + fmtNum(r.target)));
    card.appendChild(head);
    if (avg !== null) {
      const bar = mk("div", "meter-bar"), fill = mk("div", avg < r.target ? "warn" : "");
      fill.style.width = Math.min(100, avg * 10) + "%";
      bar.appendChild(fill);
      let status = "Acima da média alvo.";
      if (avg < r.target) {
        const need = neededGrade(sid);
        status = need > 10 ? "Mesmo com 10 na próxima avaliação (peso 1), a média alvo não fecha. Confira as regras de recuperação com seu professor."
          : "Para chegar a " + fmtNum(r.target) + ", você precisa de " + fmtNum(Math.max(need, 0)) + " na próxima avaliação (peso 1).";
      }
      card.append(bar, mk("small", "", status));
    }
    if (r.limit) {
      const pct = total / r.limit;
      const bar = mk("div", "meter-bar"), fill = mk("div", pct >= 1 ? "bad" : pct >= 0.75 ? "warn" : "");
      fill.style.width = Math.min(100, pct * 100) + "%";
      bar.appendChild(fill);
      card.append(mk("small", "", "Faltas: " + total + " de " + r.limit + " permitidas (" + Math.round(pct * 100) + "%)"), bar);
    } else if (total) {
      card.appendChild(mk("small", "", total + (total === 1 ? " falta registrada" : " faltas registradas") + ". Defina o limite abaixo para eu acompanhar."));
    }
    const rl = mk("div", "rules");
    [["Média alvo", "target", r.target, "0.1"], ["Limite de faltas", "limit", r.limit || "", "1"]].forEach(([label, key, val, step]) => {
      const lab = mk("label", "mini", label + " "), inp = document.createElement("input");
      inp.type = "number"; inp.min = "0"; inp.step = step; inp.value = val;
      inp.addEventListener("change", () => setRules(sid, key === "target" ? inp.value : undefined, key === "limit" ? inp.value : undefined));
      lab.appendChild(inp);
      rl.appendChild(lab);
    });
    card.appendChild(rl);
    if (gradesOf(sid).length || total) {
      const det = mk("details"), sum = mk("summary", "", "Ver registros");
      det.appendChild(sum);
      [...gradesOf(sid).map((g) => ({ d: g.date, t: g.title + " · " + fmtNum(g.grade) + "/" + fmtNum(g.max) + " · peso " + fmtNum(g.weight), del: () => { db.grades = db.grades.filter((x) => x.id !== g.id); } })),
      ...db.absences.filter((a) => a.subject === sid).map((a) => ({ d: a.date, t: a.count + (a.count === 1 ? " falta" : " faltas"), del: () => { db.absences = db.absences.filter((x) => x.id !== a.id); } }))]
        .sort((x, y) => y.d.localeCompare(x.d))
        .forEach((it) => {
          const row = mk("div", "rec"), del = mk("button", "", "✕");
          del.type = "button";
          del.setAttribute("aria-label", "Apagar registro");
          del.addEventListener("click", () => { it.del(); saveDb(); renderGrades(); });
          row.append(mk("span", "", fmtDay(it.d) + " · " + it.t), del);
          det.appendChild(row);
        });
      card.appendChild(det);
    }
    box.appendChild(card);
  });
}

document.querySelectorAll("#gradesMode button").forEach((b) => b.addEventListener("click", () => {
  document.querySelectorAll("#gradesMode button").forEach((x) => x.classList.toggle("on", x === b));
  $("gradeForm").hidden = b.dataset.mode !== "grade";
  $("absenceForm").hidden = b.dataset.mode !== "absence";
}));
$("gAdd").addEventListener("click", () => {
  primeAlerts();
  const r = addGrade(selVal("gSubject"), $("gTitle").value, $("gValue").value, $("gMax").value, $("gWeight").value, todayISO());
  if (r.error) { showToast(r.error); return; }
  $("gTitle").value = "";
  $("gValue").value = "";
  showToast("Nota registrada.");
});
$("aAdd").addEventListener("click", () => {
  primeAlerts();
  const sid = selVal("aSubject");
  const r = addAbsence(sid, $("aQty").value, $("aDate").value);
  if (r.error) { showToast(r.error); return; }
  $("aQty").value = 1;
  showToast(absenceAlert(sid) || "Falta registrada.");
});

// Mensagem da professora (conversa e avisos)
function proactive(text) {
  coachContext = text;
  coachPending = true;
  addMessage(text, "bot");
  notify("Sua Professora Virtual", text);
}

// Faltas: um aviso por dia. Média baixa: um por semana.
function checkGradesCoach() {
  if (!profileComplete() || tourIdx >= 0) return;
  const today = todayISO();
  let sent = 0;
  db.subjects.forEach((s) => {
    if (sent >= 2) return;
    const c = db.gradeCoach[s.id] || (db.gradeCoach[s.id] = {});
    const alert = absenceAlert(s.id);
    if (alert && c.abs !== today) {
      c.abs = today; sent++;
      proactive(alert + " Se algum compromisso estiver atrapalhando, me avisa que eu ajusto a sua rotina.");
      return;
    }
    const avg = subjectAverage(s.id);
    if (avg !== null && avg < rules(s.id).target && (!c.avg || daysUntil(c.avg) <= -7)) {
      c.avg = today; sent++;
      proactive("Sua média em " + s.name + " está em " + fmtNum(avg) + ", abaixo da meta de " + fmtNum(rules(s.id).target) + ". Quer que eu dê mais espaço para essa matéria no plano e prepare exercícios e flashcards?");
    }
  });
  saveDb();
}

// Backup
$("exportBtn").addEventListener("click", () => {
  const data = { app: "sua-professora-virtual", version: 1, exportedAt: new Date().toISOString(), estudo: db, eventos: events };
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "backup-professora-virtual-" + todayISO() + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Backup baixado.");
});
// Confere o backup antes de importar
const isObj = (x) => x !== null && typeof x === "object" && !Array.isArray(x);
function cleanBackup(d) {
  if (!isObj(d) || d.app !== "sua-professora-virtual" || !isObj(d.estudo) || !Array.isArray(d.eventos)) return null;
  const e = d.estudo;
  for (const k of ["subjects", "sessions", "tasks", "notes", "cards", "reviews", "grades", "absences"]) {
    if (e[k] !== undefined && !(Array.isArray(e[k]) && e[k].every(isObj))) return null;
  }
  for (const k of ["profile", "rules", "gradeCoach"]) if (e[k] !== undefined && !isObj(e[k])) return null;
  if (e.plan != null && !(isObj(e.plan) && Array.isArray(e.plan.blocks) && e.plan.blocks.every(isObj))) return null;
  if (!d.eventos.every((v) => isObj(v) && typeof v.title === "string" && typeof v.date === "string")) return null;
  (e.subjects || []).forEach((x) => { x.color = safeColor(x.color); });
  return d;
}
$("wipeBtn").addEventListener("click", () => {
  if (!confirm("Apagar TODOS os dados deste navegador (perfil, plano, calendário, cartas, notas...) e a chave da API? Isso não pode ser desfeito. Faça um backup antes, se quiser guardar.")) return;
  try { localStorage.removeItem("estudo"); localStorage.removeItem("eventos"); sessionStorage.removeItem("gemini_key"); } catch (e) { }
  location.reload();
});
$("importBtn").addEventListener("click", () => $("importFile").click());
$("importFile").addEventListener("change", () => {
  const f = $("importFile").files[0];
  if (!f) return;
  if (f.size > 5 * 1024 * 1024) { showToast("Arquivo grande demais para ser um backup."); $("importFile").value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => {
    let d;
    try { d = cleanBackup(JSON.parse(reader.result)); } catch (e) { d = null; }
    if (!d) { showToast("Esse arquivo não parece um backup válido da Sua Professora Virtual."); return; }
    if (!confirm("Importar este backup vai substituir os dados atuais deste navegador. Continuar?")) return;
    try {
      localStorage.setItem("estudo", JSON.stringify(d.estudo));
      localStorage.setItem("eventos", JSON.stringify(d.eventos));
    } catch (e) { showToast("Não consegui salvar os dados importados."); return; }
    location.reload();
  };
  reader.readAsText(f);
  $("importFile").value = "";
});

// Início do módulo de estudo
events.forEach((e) => { if (!e.kind) e.kind = guessKind(e.title); if (!e.topics) e.topics = []; if (e.subject === undefined) e.subject = ""; });
fillSubjectSelects();
renderTasks();
renderNotes();
renderCardInfo();
renderProgress();
checkCardReminder();
setInterval(checkCardReminder, 60000);
renderPlan();
checkPlanReminders();
setInterval(checkPlanReminders, 30000);
showWelcome(false);
renderExams();
checkExamCoach();
setInterval(checkExamCoach, 30 * 60000);
$("aDate").value = todayISO();
renderGrades();
checkGradesCoach();
setInterval(checkGradesCoach, 30 * 60000);
checkReminders();
setInterval(checkReminders, 60000);

// Visualizador do microfone
let audioCtx, analyser, stream, rafId;

let meterRun = 0;  // evita microfone aberto se parar cedo
async function startMeter() {
  const run = ++meterRun;
  meter.classList.add("on");
  try {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (run !== meterRun) { s.getTracks().forEach((t) => t.stop()); return; }
    stream = s;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 128;
    audioCtx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      analyser.getByteFrequencyData(data);
      bars.forEach((bar, i) => {
        const level = data[Math.floor((i / BAR_COUNT) * 40)] / 255;
        bar.style.transform = "scaleY(" + (0.1 + level * 0.9) + ")";
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
  } catch (err) {
    // sem áudio: animação simulada
    if (run === meterRun) meter.classList.add("sim");
  }
}

function stopMeter() {
  meterRun++;
  cancelAnimationFrame(rafId);
  if (stream) stream.getTracks().forEach((t) => t.stop());
  if (audioCtx) audioCtx.close();
  stream = audioCtx = analyser = null;
  meter.classList.remove("on", "sim");
  bars.forEach((bar) => (bar.style.transform = ""));
}

// Reconhecimento de voz
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  micBtn.disabled = true;
  setStatus("Seu navegador não suporta reconhecimento de voz. Use o Chrome ou o Edge, recomendo o Edge para mais opções de voz", true);
} else {
  const recognition = new SpeechRecognition();
  recognition.lang = LANG;
  recognition.interimResults = true;
  recognition.continuous = false;

  let listening = false;
  let liveBubble = null;
  let finalText = "";

  function setListening(on) {
    listening = on;
    micBtn.classList.toggle("listening", on);
    micBtn.setAttribute("aria-label", on ? "Parar de ouvir" : "Começar a ouvir");
    setStatus(on ? "Ouvindo…" : "Toque para falar");
  }

  micBtn.addEventListener("click", () => {
    if (listening) {
      recognition.stop();
      return;
    }
    primeAlerts();
    stopSpeaking();  // não captar a própria voz
    finalText = "";
    try {
      recognition.start();
    } catch (e) {
      /* já estava iniciado: ignora */
    }
  });

  recognition.onstart = () => {
    setListening(true);
    startMeter();
  };

  recognition.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const piece = event.results[i][0].transcript;
      if (event.results[i].isFinal) finalText += piece;
      else interim += piece;
    }
    const shown = (finalText + interim).trim();
    if (shown) {
      if (!liveBubble) liveBubble = addMessage(shown, "live");
      else liveBubble.textContent = shown;
      chat.scrollTop = chat.scrollHeight;
    }
  };

  recognition.onerror = (event) => {
    const messages = {
      "not-allowed": "Permissão do microfone negada. Libere o acesso no ícone de cadeado da barra de endereço.",
      "service-not-allowed": "Permissão do microfone negada. Libere o acesso no ícone de cadeado da barra de endereço.",
      "no-speech": "Não consegui ouvir. Toque no microfone e tente de novo.",
      "audio-capture": "Nenhum microfone encontrado.",
      "network": "Sem conexão com o serviço de voz. Verifique sua internet."
    };
    if (event.error !== "aborted") {
      setStatus(messages[event.error] || "Erro no reconhecimento: " + event.error, true);
    }
  };

  recognition.onend = async () => {
    const wasError = statusEl.classList.contains("error");
    listening = false;
    micBtn.classList.remove("listening");
    micBtn.setAttribute("aria-label", "Começar a ouvir");
    stopMeter();
    if (!wasError) setStatus("Toque para falar");

    const text = finalText.trim();
    if (liveBubble) {
      liveBubble.remove();
      liveBubble = null;
    }
    if (!text) return;

    if (busy) { showToast("Pensando na resposta. Aguarde um momento."); return; }
    await sendMessage(text);
  };
}
