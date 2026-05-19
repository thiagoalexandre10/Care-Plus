// ═══════════════════════════════════════════════════
//  CarePlus – script.js
//  Correções pontuais:
//  - Calendário sempre no mês/ano atual e marcação do dia real
//  - Botão cancelar em consultas agendadas
//  - Pontos + notificações para agendar, confirmar, reagendar e cancelar
//  - Aparência, cores da sidebar e clima preservados
// ═══════════════════════════════════════════════════

// ─── ESTADO GLOBAL ─────────────────────────────────
let currentUser = {
  nome: 'Lucas Oliveira',
  cpf: '123.456.789-00',
  email: 'lucas.oliveira@email.com',
  nascimento: '15/05/1998'
};

let pontosUsuario = 850;
let ultimoDiaSelecionado = null;

const hojeSistema = new Date();
let calYear = hojeSistema.getFullYear();
let calMonth = hojeSistema.getMonth();

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const monthAbbr = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];

const notificacoes = [
  {
    titulo: 'Bem-vindo ao CarePlus',
    texto: 'Sua central de saúde está pronta para uso.',
    icone: 'bi-heart-pulse-fill',
    cor: 'var(--primary)',
    lida: false
  }
];

// ─── DADOS ─────────────────────────────────────────
const consultas = [
  {
    id: 1, dia: 31, mes: 'OUT', semana: 'Sex', ano: hojeSistema.getFullYear(),
    stripe: 'stripe-blue', icon: 'bi-heart-pulse-fill',
    iconBg: '#e8f0fe', iconColor: '#1e4fc2',
    esp: 'Cardiologista', medico: 'Dr. Carlos Henrique',
    local: 'Hospital Sírio-Libanês', hora: '09:30', dur: '30 min',
    status: 'confirmada', presencaConfirmada: false,
    filter: ['todas', 'proximas', 'confirmadas']
  },
  {
    id: 2, dia: 18, mes: 'OUT', semana: 'Sáb', ano: hojeSistema.getFullYear(),
    stripe: 'stripe-green', icon: 'bi-stethoscope',
    iconBg: '#dcfce7', iconColor: '#22c55e',
    esp: 'Clínico Geral', medico: 'Dra. Mariana Lopes',
    local: 'Hospital Sancta Maggiore', hora: '10:00', dur: '30 min',
    status: 'realizada', presencaConfirmada: true,
    filter: ['todas', 'realizadas']
  },
  {
    id: 3, dia: 5, mes: 'OUT', semana: 'Dom', ano: hojeSistema.getFullYear(),
    stripe: 'stripe-red', icon: 'bi-bandaid-fill',
    iconBg: '#fee2e2', iconColor: '#ef4444',
    esp: 'Ortopedista', medico: 'Dr. Felipe Andrade',
    local: 'Hospital Albert Einstein', hora: '14:00', dur: '30 min',
    status: 'cancelada', presencaConfirmada: false,
    filter: ['todas', 'canceladas']
  },
  {
    id: 4, dia: 20, mes: 'SET', semana: 'Sáb', ano: hojeSistema.getFullYear(),
    stripe: 'stripe-green', icon: 'bi-eye-fill',
    iconBg: '#e0f2fe', iconColor: '#0ea5e9',
    esp: 'Oftalmologista', medico: 'Dra. Juliana Ribeiro',
    local: 'Hospital das Clínicas', hora: '11:15', dur: '30 min',
    status: 'realizada', presencaConfirmada: true,
    filter: ['todas', 'realizadas']
  }
];

const conquistas = [
  { name: 'Imune e Forte', pts: 100, desc: 'Tomou todas as vacinas de prevenção', emoji: '💉', status: 'desbloqueadas', prog: null },
  { name: 'Pontual', pts: 150, desc: 'Compareceu a 3 consultas sem faltar', emoji: '⏰', status: 'andamento', prog: 66 },
  { name: 'Ativo', pts: 200, desc: 'Mantém uma rotina de cuidados por 30 dias', emoji: '🏃', status: 'andamento', prog: 60 },
  { name: 'Equilíbrio', pts: 200, desc: 'Registrou hábitos saudáveis por 30 dias', emoji: '⚖️', status: 'andamento', prog: 46 },
  { name: 'Focado', pts: 300, desc: 'Complete 5 desafios de saúde', emoji: '🎯', status: 'bloqueadas', prog: 0 },
  { name: 'Constante', pts: 500, desc: 'Mantenha 90 dias de rotina', emoji: '📅', status: 'bloqueadas', prog: 0 },
  { name: 'Campeão', pts: 1000, desc: 'Alcance o topo do ranking mensal', emoji: '🏆', status: 'bloqueadas', prog: 0 },
  { name: 'Cuidado Total', pts: 1500, desc: 'Complete todos os desafios', emoji: '⭐', status: 'bloqueadas', prog: 0 }
];

const rankingData = [
  { name: 'Ana Souza', pts: 1200, color: '#f59e0b' },
  { name: 'Bruno Lima', pts: 1100, color: '#3b82f6' },
  { name: 'Carla Mendes', pts: 980, color: '#8b5cf6' },
  { name: 'Diego Santos', pts: 950, color: '#22c55e' },
  { name: 'Elena Costa', pts: 920, color: '#ef4444' },
  { name: 'Fernando Rocha', pts: 890, color: '#14b8a6' },
  { name: 'Gabriela Ferreira', pts: 875, color: '#f97316' },
  { name: 'Henrique Alves', pts: 860, color: '#06b6d4' },
  { name: 'Isabela Nunes', pts: 855, color: '#ec4899' },
  { name: 'Lucas Oliveira', pts: pontosUsuario, color: '#1e4fc2', isMe: true }
];

const chatResponses = {
  'agendar consulta': 'Claro! Para agendar uma consulta, use o botão "Agendar consulta" no topo da tela, ou me diga a especialidade desejada. 📅',
  'ver próximas consultas': () => listarProximasConsultasChat(),
  'reagendar': 'Para reagendar, acesse a aba Consultas ou Calendário e clique em "Reagendar" na consulta desejada. 🗓️',
  'falar sobre pontos': () => `Você tem ${pontosUsuario} pontos acumulados! 🏆<br><br>Você ganha pontos por agendar, confirmar presença e reagendar com antecedência. Você perde pontos ao cancelar consultas, principalmente em cima da hora.`,
  'clima no dia da consulta': 'A previsão de São Paulo aparece na tela inicial. Recomendo conferir antes de sair para a consulta. ⛅',
  'saber sobre o trajeto': 'Hoje em São Paulo: trânsito e vias principais sem ocorrências críticas simuladas. Metrô e trens operando normalmente. 🚇🚗'
};

// ─── UTILITÁRIOS DE DATA ───────────────────────────
function pad2(n) {
  return String(n).padStart(2, '0');
}

function hojeISO() {
  const h = new Date();
  return `${h.getFullYear()}-${pad2(h.getMonth() + 1)}-${pad2(h.getDate())}`;
}

function dataISO(year, monthIndex, day) {
  return `${year}-${pad2(monthIndex + 1)}-${pad2(day)}`;
}

function mesParaIndice(mes) {
  const idx = monthAbbr.indexOf(String(mes).toUpperCase());
  return idx >= 0 ? idx : new Date().getMonth();
}

function semanaPt(dateObj) {
  const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return nomes[dateObj.getDay()];
}

function formatarDataBR(dataIso) {
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

function normalizarConsulta(c) {
  if (!c.dataISO) {
    const ano = c.ano || new Date().getFullYear();
    const mesIndex = mesParaIndice(c.mes);
    c.dataISO = dataISO(ano, mesIndex, c.dia);
  }

  const [ano, mes, dia] = c.dataISO.split('-').map(Number);
  const d = new Date(ano, mes - 1, dia);

  c.ano = ano;
  c.dia = dia;
  c.mes = monthAbbr[mes - 1];
  c.semana = semanaPt(d);
  c.dur = c.dur || '30 min';

  atualizarFiltrosConsulta(c);
  aplicarVisualConsulta(c);
}

function atualizarFiltrosConsulta(c) {
  if (c.status === 'confirmada') {
    c.filter = ['todas', 'proximas', 'confirmadas'];
  } else if (c.status === 'realizada') {
    c.filter = ['todas', 'realizadas'];
  } else if (c.status === 'cancelada') {
    c.filter = ['todas', 'canceladas'];
  } else {
    c.filter = ['todas'];
  }
}

function estiloEspecialidade(esp) {
  const mapa = {
    'Cardiologista': { icon: 'bi-heart-pulse-fill', iconBg: '#e8f0fe', iconColor: '#1e4fc2', stripe: 'stripe-blue' },
    'Clínico Geral': { icon: 'bi-stethoscope', iconBg: '#dcfce7', iconColor: '#22c55e', stripe: 'stripe-green' },
    'Oftalmologista': { icon: 'bi-eye-fill', iconBg: '#e0f2fe', iconColor: '#0ea5e9', stripe: 'stripe-blue' },
    'Ortopedista': { icon: 'bi-bandaid-fill', iconBg: '#fee2e2', iconColor: '#ef4444', stripe: 'stripe-red' },
    'Dermatologista': { icon: 'bi-droplet-fill', iconBg: '#fce7f3', iconColor: '#ec4899', stripe: 'stripe-blue' },
    'Neurologista': { icon: 'bi-cpu-fill', iconBg: '#ede9fe', iconColor: '#8b5cf6', stripe: 'stripe-blue' }
  };
  return mapa[esp] || mapa['Clínico Geral'];
}

function aplicarVisualConsulta(c) {
  const st = estiloEspecialidade(c.esp);
  c.icon = c.icon || st.icon;
  c.iconBg = c.iconBg || st.iconBg;
  c.iconColor = c.iconColor || st.iconColor;
  c.stripe = c.status === 'cancelada' ? 'stripe-red' : c.status === 'realizada' ? 'stripe-green' : st.stripe;
}

// ─── GAMIFICAÇÃO E NOTIFICAÇÕES ────────────────────
function registrarPontuacao(pontos, motivo, tipo = 'info') {
  pontosUsuario += pontos;
  if (pontosUsuario < 0) pontosUsuario = 0;

  const textoPontos = pontos >= 0 ? `+${pontos} pontos` : `${pontos} pontos`;
  const icone = pontos >= 0 ? 'bi-trophy-fill' : 'bi-exclamation-triangle-fill';
  const cor = pontos >= 0 ? 'var(--green)' : 'var(--red)';

  adicionarNotificacao(motivo, `${textoPontos}. Pontuação atual: ${pontosUsuario} pontos.`, icone, cor);
  atualizarPontosUI();
}

function adicionarNotificacao(titulo, texto, icone = 'bi-bell-fill', cor = 'var(--primary)') {
  notificacoes.unshift({
    titulo,
    texto,
    icone,
    cor,
    lida: false
  });

  renderNotificacoes();
}

function renderNotificacoes() {
  const list = document.getElementById('notif-list');
  const dot = document.getElementById('notif-dot');
  if (!list) return;

  if (!notificacoes.length) {
    list.innerHTML = `<div class="notif-empty">Nenhuma notificação no momento.</div>`;
    if (dot) dot.classList.remove('visible');
    return;
  }

  list.innerHTML = notificacoes.map(n => `
    <div class="notif-item ${n.lida ? '' : 'unread'}">
      <div class="notif-icon" style="background:var(--primary-pale); color:${n.cor}">
        <i class="bi ${n.icone}"></i>
      </div>
      <div class="notif-text">
        <strong>${n.titulo}</strong>
        <span>${n.texto}</span>
      </div>
    </div>
  `).join('');

  if (dot) {
    const temNaoLida = notificacoes.some(n => !n.lida);
    dot.classList.toggle('visible', temNaoLida);
  }
}

function atualizarPontosUI() {
  const pointsSpan = document.querySelector('.points-card span');
  if (pointsSpan) pointsSpan.textContent = pontosUsuario;

  document.querySelectorAll('.ranking-badge').forEach(el => {
    if (el.textContent.includes('Meus pontos')) {
      el.innerHTML = `<i class="bi bi-trophy-fill"></i> Meus pontos: ${pontosUsuario}`;
    }
  });

  const me = rankingData.find(r => r.isMe);
  if (me) {
    me.pts = pontosUsuario;
    me.name = currentUser.nome;
  }

  rankingData.sort((a, b) => b.pts - a.pts);
  if (document.getElementById('ranking-list')) renderRanking();
}

// ─── LOGIN ─────────────────────────────────────────
function doLogin() {
  const cpf = document.getElementById('login-cpf').value.trim();
  const pwd = document.getElementById('login-pwd').value.trim();
  if (!cpf || !pwd) {
    toast('⚠️ Preencha CPF e senha.');
    return;
  }

  document.getElementById('page-login').classList.remove('active');
  document.getElementById('page-app').classList.add('active');
  initApp();
}

function doLogout() {
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('login-cpf').value = '';
  document.getElementById('login-pwd').value = '';
}

// ─── NAVEGAÇÃO ─────────────────────────────────────
const viewTitles = {
  inicio: ['Início', 'Bem-vindo ao CarePlus'],
  consultas: ['Minhas consultas', 'Acompanhe, confirme ou reagende suas consultas.'],
  calendario: ['Calendário', 'Gerencie suas consultas e compromissos'],
  chat: ['CarePlus', 'Sua assistente virtual de saúde'],
  conquistas: ['Conquistas', 'Complete desafios e ganhe recompensas'],
  ranking: ['Ranking', 'Veja sua posição entre outros usuários'],
  configuracoes: ['Configurações', 'Personalize sua experiência no CarePlus']
};

function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item-cp').forEach(b => b.classList.remove('active'));

  const view = document.getElementById('view-' + name);
  if (view) view.classList.add('active');

  const map = {
    inicio: 'início',
    consultas: 'consultas',
    calendario: 'calendário',
    chat: 'chat',
    conquistas: 'conquistas',
    ranking: 'ranking',
    configuracoes: 'configurações'
  };

  const label = map[name] || name;
  const btn = [...document.querySelectorAll('.nav-item-cp')]
    .find(b => b.textContent.trim().toLowerCase().includes(label));
  if (btn) btn.classList.add('active');

  const [title, sub] = viewTitles[name] || ['CarePlus', ''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-sub').textContent = sub;

  if (name === 'calendario') renderCalendar();
  if (name === 'consultas') renderConsultas(obterFiltroConsultasAtivo());

  if (window.innerWidth < 900) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ─── INIT ──────────────────────────────────────────
function initApp() {
  consultas.forEach(normalizarConsulta);
  renderConsultas('todas');
  renderConquistas('todas');
  renderRanking();
  renderCalendar();
  renderNotificacoes();
  atualizarPontosUI();
  atualizarProximaConsultaHome();
  carregarClimaSaoPaulo();
  syncUserName();
}

// ─── SINCRONIZAÇÃO DE NOME ─────────────────────────
function syncUserName() {
  const nome = currentUser.nome.trim();
  const primeiroNome = nome.split(' ')[0];
  const iniciais = nome.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('');

  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = nome; });
  document.querySelectorAll('[data-user-firstname]').forEach(el => { el.textContent = primeiroNome; });
  document.querySelectorAll('[data-user-initials]').forEach(el => { el.textContent = iniciais; });

  const preview = document.getElementById('preview-nome');
  if (preview) preview.textContent = `Olá, ${primeiroNome}! 👋`;

  const me = rankingData.find(r => r.isMe);
  if (me) me.name = nome;
  renderRanking();
}

function salvarPerfil() {
  const inputNome = document.getElementById('input-nome');
  const inputCpf = document.getElementById('input-cpf');
  const inputEmail = document.getElementById('input-email');
  const inputNasc = document.getElementById('input-nascimento');

  if (!inputNome) return;
  const novoNome = inputNome.value.trim();
  if (!novoNome) {
    toast('⚠️ O nome não pode estar vazio.');
    return;
  }

  currentUser.nome = novoNome;
  currentUser.cpf = inputCpf ? inputCpf.value : currentUser.cpf;
  currentUser.email = inputEmail ? inputEmail.value : currentUser.email;
  currentUser.nascimento = inputNasc ? inputNasc.value : currentUser.nascimento;

  syncUserName();
  toast(`✅ Dados salvos! Bem-vindo(a), ${novoNome.split(' ')[0]}!`);
}

// ─── CONSULTAS ─────────────────────────────────────
function obterFiltroConsultasAtivo() {
  const activeTab = document.querySelector('#consulta-tabs .filter-tab.active');
  const labelMap = {
    'todas': 'todas',
    'próximas': 'proximas',
    'confirmadas': 'confirmadas',
    'realizadas': 'realizadas',
    'canceladas': 'canceladas'
  };

  return activeTab
    ? (labelMap[activeTab.textContent.trim().toLowerCase()] || 'todas')
    : 'todas';
}

function renderConsultas(filter) {
  consultas.forEach(normalizarConsulta);

  const list = document.getElementById('consultas-list');
  if (!list) return;

  const items = consultas
    .filter(c => c.filter.includes(filter))
    .sort((a, b) => new Date(a.dataISO + 'T' + a.hora) - new Date(b.dataISO + 'T' + b.hora));

  renderConsultasStats();

  list.innerHTML = items.map(c => {
    let statusBadge = '';
    let actions = '';

    if (c.status === 'confirmada') {
      statusBadge = `<span class="badge-status badge-confirmada">
        <i class="bi bi-circle-fill" style="font-size:.5rem"></i> Confirmada
      </span>`;

      const btnPresenca = c.presencaConfirmada
        ? `<button class="btn-outline-cp" style="opacity:.65;cursor:default;pointer-events:none;" disabled>
             <i class="bi bi-check-circle-fill" style="color:var(--green)"></i>
             Presença confirmada
           </button>`
        : `<button class="btn-outline-green" onclick="confirmarPresenca(${c.id})">
             <i class="bi bi-check-circle"></i> Confirmar presença
           </button>`;

      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})">
          <i class="bi bi-eye"></i> Ver detalhes
        </button>
        ${btnPresenca}
        <button class="btn-outline-cp" onclick="openModal('reagendar', ${c.id})">
          <i class="bi bi-calendar"></i> Reagendar
        </button>
        <button class="btn-outline-red" onclick="cancelarConsulta(${c.id})">
          <i class="bi bi-x-circle"></i> Cancelar
        </button>`;

    } else if (c.status === 'realizada') {
      statusBadge = `<span class="badge-status badge-realizada">
        <i class="bi bi-circle-fill" style="font-size:.5rem"></i> Realizada
      </span>`;

      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})">
          <i class="bi bi-eye"></i> Ver detalhes
        </button>
        <button class="btn-outline-cp" onclick="openModal('agendar')">
          <i class="bi bi-calendar-plus"></i> Novo agendamento
        </button>`;

    } else {
      statusBadge = `<span class="badge-status badge-cancelada">
        <i class="bi bi-circle-fill" style="font-size:.5rem"></i> Cancelada
      </span>`;

      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})">
          <i class="bi bi-eye"></i> Ver detalhes
        </button>
        <button class="btn-outline-red" onclick="openModal('agendar')">
          <i class="bi bi-calendar-plus"></i> Agendar novamente
        </button>`;
    }

    return `
      <div class="consulta-item">
        <div class="consulta-stripe ${c.stripe}"></div>
        <div class="consulta-date">
          <div class="day">${pad2(c.dia)}</div>
          <div class="month">${c.mes}</div>
          <div class="weekday">${c.semana}</div>
        </div>
        <div class="consulta-icon-wrap" style="background:${c.iconBg}">
          <i class="bi ${c.icon}" style="color:${c.iconColor}"></i>
        </div>
        <div class="consulta-info">
          <h4>${c.esp}</h4>
          <div class="doctor">${c.medico}</div>
          <div class="place"><i class="bi bi-geo-alt-fill"></i>${c.local}</div>
        </div>
        <div class="consulta-meta">
          <span><i class="bi bi-clock"></i>${c.hora}</span>
          <span><i class="bi bi-stopwatch"></i>${c.dur}</span>
        </div>
        <div style="min-width:120px; text-align:center">${statusBadge}</div>
        <div class="consulta-actions">${actions}</div>
      </div>`;
  }).join('') || `
    <div style="padding:40px; text-align:center; color:var(--gray-400)">
      <i class="bi bi-calendar-x" style="font-size:2rem; display:block; margin-bottom:10px"></i>
      Nenhuma consulta encontrada.
    </div>`;

  atualizarProximaConsultaHome();
}

function renderConsultasStats() {
  const stats = document.getElementById('consultas-stats');
  if (!stats) return;

  const proximas = consultas.filter(c => c.status === 'confirmada').sort((a, b) => new Date(a.dataISO) - new Date(b.dataISO));
  const proxima = proximas[0];

  const confirmadas = consultas.filter(c => c.status === 'confirmada').length;
  const realizadas = consultas.filter(c => c.status === 'realizada').length;
  const canceladas = consultas.filter(c => c.status === 'cancelada').length;

  stats.innerHTML = `
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--primary-pale); color:var(--primary)"><i class="bi bi-calendar-check"></i></div>
        <div>
          <div class="stat-label">Próxima consulta</div>
          <div class="stat-value" style="font-size:1.1rem">${proxima ? `${pad2(proxima.dia)} de ${monthNames[mesParaIndice(proxima.mes)].toLowerCase()}` : '--'}</div>
          <div class="stat-sub">${proxima ? `${proxima.hora} • ${proxima.esp}` : 'Sem consulta'}</div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--green-pale); color:var(--green)"><i class="bi bi-check-circle-fill"></i></div>
        <div>
          <div class="stat-label">Consultas confirmadas</div>
          <div class="stat-value text-green">${confirmadas}</div>
          <div class="stat-sub">Esse ano</div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:#ede9fe; color:var(--purple)"><i class="bi bi-clock-fill"></i></div>
        <div>
          <div class="stat-label">Consultas realizadas</div>
          <div class="stat-value" style="color:var(--purple)">${realizadas}</div>
          <div class="stat-sub">Esse ano</div>
        </div>
      </div>
    </div>
    <div class="col-md-3">
      <div class="stat-card">
        <div class="stat-icon" style="background:var(--red-pale); color:var(--red)"><i class="bi bi-x-circle-fill"></i></div>
        <div>
          <div class="stat-label">Consultas canceladas</div>
          <div class="stat-value text-red">${canceladas}</div>
          <div class="stat-sub">Esse ano</div>
        </div>
      </div>
    </div>`;
}

function filterConsultas(filter, btn) {
  document.querySelectorAll('#consulta-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderConsultas(filter);
}

function verDetalhesConsulta(id) {
  const c = consultas.find(x => x.id === Number(id));
  if (!c) return;

  const status = c.status === 'confirmada' ? 'Confirmada' : c.status === 'realizada' ? 'Realizada' : 'Cancelada';
  alert(
    `Detalhes da consulta\n\n` +
    `Especialidade: ${c.esp}\n` +
    `Médico: ${c.medico}\n` +
    `Local: ${c.local}\n` +
    `Data: ${formatarDataBR(c.dataISO)}\n` +
    `Horário: ${c.hora}\n` +
    `Duração: ${c.dur}\n` +
    `Status: ${status}`
  );
}

function confirmarPresenca(consultaId) {
  const c = consultas.find(x => x.id === Number(consultaId));
  if (!c) return;

  if (c.presencaConfirmada) {
    toast('ℹ️ Presença já confirmada para esta consulta.');
    return;
  }

  c.presencaConfirmada = true;
  registrarPontuacao(50, 'Presença confirmada', `Consulta de ${c.esp} confirmada com sucesso.`);
  toast('✅ Presença confirmada! +50 pontos adicionados.');

  renderConsultas(obterFiltroConsultasAtivo());
  renderCalendar();

  if (ultimoDiaSelecionado) selectDay(ultimoDiaSelecionado);
}

function cancelarConsulta(consultaId) {
  const c = consultas.find(x => x.id === Number(consultaId));
  if (!c) return;

  if (c.status === 'cancelada') {
    toast('ℹ️ Esta consulta já está cancelada.');
    return;
  }

  c.status = 'cancelada';
  c.presencaConfirmada = false;
  atualizarFiltrosConsulta(c);
  aplicarVisualConsulta(c);

  registrarPontuacao(-80, 'Consulta cancelada', `Você cancelou a consulta de ${c.esp}.`);
  toast('❌ Consulta cancelada. -80 pontos.');

  renderConsultas(obterFiltroConsultasAtivo());
  renderCalendar();

  if (ultimoDiaSelecionado) selectDay(ultimoDiaSelecionado);
}

// ─── MODAL – AGENDAR / REAGENDAR ───────────────────
function openModal(mode = 'agendar', consultaId = '') {
  _esconderErroData();

  const modal = document.getElementById('modal-overlay');
  const title = document.getElementById('modal-title');
  const subtitle = document.getElementById('modal-subtitle');
  const modeInput = document.getElementById('modal-mode');
  const idInput = document.getElementById('modal-consulta-id');
  const dataInput = document.getElementById('modal-data');

  if (modeInput) modeInput.value = mode;
  if (idInput) idInput.value = consultaId || '';
  if (dataInput) dataInput.min = hojeISO();

  if (mode === 'reagendar' && consultaId) {
    const c = consultas.find(x => x.id === Number(consultaId));
    if (c) {
      if (title) title.textContent = 'Reagendar consulta';
      if (subtitle) subtitle.textContent = 'Escolha uma nova data e horário para sua consulta.';
      document.getElementById('modal-esp').value = c.esp;
      document.getElementById('modal-medico').value = c.medico;
      document.getElementById('modal-local').value = c.local;
      document.getElementById('modal-data').value = c.dataISO;
      document.getElementById('modal-hora').value = c.hora;
    }
  } else {
    if (title) title.textContent = 'Agendar consulta';
    if (subtitle) subtitle.textContent = 'Preencha os dados para agendar sua consulta.';
    if (dataInput && !dataInput.value) dataInput.value = hojeISO();
  }

  modal.classList.add('open');
}

function closeModal() {
  _esconderErroData();
  document.getElementById('modal-overlay').classList.remove('open');
}

function _mostrarErroData(mensagem) {
  let errEl = document.getElementById('cp-date-error');

  if (!errEl) {
    errEl = document.createElement('div');
    errEl.id = 'cp-date-error';

    const dataField = document.getElementById('modal-data');
    if (dataField) {
      dataField.insertAdjacentElement('afterend', errEl);
    } else {
      const actions = document.querySelector('.modal-actions');
      if (actions) actions.before(errEl);
    }
  }

  errEl.innerHTML = `<i class="bi bi-exclamation-triangle-fill"></i><span>${mensagem}</span>`;
  errEl.style.display = 'flex';

  const dataField = document.getElementById('modal-data');
  if (dataField) dataField.classList.add('cp-input-error');

  errEl.classList.remove('cp-shake');
  void errEl.offsetWidth;
  errEl.classList.add('cp-shake');
}

function _esconderErroData() {
  const errEl = document.getElementById('cp-date-error');
  const dataField = document.getElementById('modal-data');
  if (errEl) errEl.style.display = 'none';
  if (dataField) dataField.classList.remove('cp-input-error');
}

function confirmarModal() {
  const dataInput = document.getElementById('modal-data');

  if (!dataInput || !dataInput.value) {
    _mostrarErroData('Selecione uma data para o agendamento.');
    return;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataSelecionada = new Date(dataInput.value + 'T00:00:00');
  dataSelecionada.setHours(0, 0, 0, 0);

  if (dataSelecionada < hoje) {
    const fmt = dataSelecionada.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    _mostrarErroData(`Data inválida: <strong>${fmt}</strong> já passou. Escolha uma data futura.`);
    return;
  }

  const mode = document.getElementById('modal-mode')?.value || 'agendar';
  const consultaId = document.getElementById('modal-consulta-id')?.value;

  const dados = {
    esp: document.getElementById('modal-esp').value,
    medico: document.getElementById('modal-medico').value,
    local: document.getElementById('modal-local').value,
    dataISO: dataInput.value,
    hora: document.getElementById('modal-hora').value,
    dur: '30 min',
    status: 'confirmada',
    presencaConfirmada: false
  };

  if (mode === 'reagendar' && consultaId) {
    const c = consultas.find(x => x.id === Number(consultaId));
    if (c) {
      Object.assign(c, dados);
      normalizarConsulta(c);
      registrarPontuacao(20, 'Consulta reagendada', `Sua consulta de ${c.esp} foi reagendada para ${formatarDataBR(c.dataISO)} às ${c.hora}.`);
      toast('🔁 Consulta reagendada com sucesso! +20 pontos.');
    }
  } else {
    const nova = {
      id: consultas.length ? Math.max(...consultas.map(c => c.id)) + 1 : 1,
      ...dados
    };

    normalizarConsulta(nova);
    consultas.push(nova);
    registrarPontuacao(50, 'Consulta agendada', `Nova consulta de ${nova.esp} em ${formatarDataBR(nova.dataISO)} às ${nova.hora}.`);
    toast('✅ Consulta agendada com sucesso! +50 pontos.');
  }

  _esconderErroData();
  closeModal();
  renderConsultas(obterFiltroConsultasAtivo());
  renderCalendar();
  atualizarProximaConsultaHome();
}

// ─── CALENDÁRIO ────────────────────────────────────
function renderCalendar() {
  consultas.forEach(normalizarConsulta);

  const title = document.getElementById('cal-month-title');
  if (title) title.textContent = `${monthNames[calMonth]} ${calYear}`;

  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth + 1, 0).getDate();
  const hoje = new Date();

  let html = days.map(d => `<div class="cal-day-header">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty other-month"></div>`;
  }

  for (let d = 1; d <= total; d++) {
    const iso = dataISO(calYear, calMonth, d);
    const isToday = d === hoje.getDate() &&
      calMonth === hoje.getMonth() &&
      calYear === hoje.getFullYear();

    const hasEvent = consultas.some(c => c.dataISO === iso && c.status !== 'cancelada');

    html += `<div class="cal-day${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}" onclick="selectDay(${d})">${d}</div>`;
  }

  grid.innerHTML = html;

  if (calMonth === hoje.getMonth() && calYear === hoje.getFullYear()) {
    marcarDiaSelecionado(hoje.getDate());
  }
}

function changeMonth(dir) {
  calMonth += dir;

  if (calMonth > 11) {
    calMonth = 0;
    calYear++;
  }

  if (calMonth < 0) {
    calMonth = 11;
    calYear--;
  }

  ultimoDiaSelecionado = null;
  renderCalendar();
}

function marcarDiaSelecionado(d) {
  document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
    if (parseInt(el.textContent) === d) el.classList.add('selected');
  });
}

function selectDay(d) {
  ultimoDiaSelecionado = d;
  marcarDiaSelecionado(d);

  const titleEl = document.getElementById('cal-detail-title');
  const content = document.getElementById('cal-detail-content');
  if (!titleEl || !content) return;

  titleEl.textContent = `${d} de ${monthNames[calMonth]}`;

  const iso = dataISO(calYear, calMonth, d);
  const consultasDia = consultas.filter(c => c.dataISO === iso && c.status !== 'cancelada');

  if (consultasDia.length === 0) {
    content.innerHTML = `
      <p style="color:var(--gray-400); font-size:.85rem">Nenhuma consulta neste dia.</p>
      <button class="btn-agendar" style="margin-top:12px; width:100%; justify-content:center" onclick="openModal('agendar')">
        <i class="bi bi-plus-lg"></i> Agendar consulta
      </button>`;
    return;
  }

  content.innerHTML = consultasDia.map(c => {
    let btnPresenca = '';

    if (c.status === 'confirmada') {
      btnPresenca = c.presencaConfirmada
        ? `<button class="btn-reagendar-sm" style="opacity:.65;cursor:default;pointer-events:none;" disabled>
             <i class="bi bi-check-circle-fill" style="color:var(--green)"></i> Presença confirmada
           </button>`
        : `<button class="btn-confirm" onclick="confirmarPresenca(${c.id})">
             <i class="bi bi-check-circle"></i> Confirmar presença
           </button>`;
    }

    return `
      <div class="cal-consult-item">
        <h5>${c.esp}</h5>
        <p>${c.medico} · ${c.hora}</p>
        <p style="margin-top:4px; font-size:.78rem; color:var(--gray-400)">
          <i class="bi bi-geo-alt-fill"></i> ${c.local}
        </p>
        <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap">
          <button class="btn-reagendar-sm" onclick="verDetalhesConsulta(${c.id})">
            <i class="bi bi-eye"></i> Ver detalhes
          </button>
          ${btnPresenca}
          <button class="btn-reagendar-sm" onclick="openModal('reagendar', ${c.id})">
            <i class="bi bi-calendar"></i> Reagendar
          </button>
          <button class="btn-cancel-sm" onclick="cancelarConsulta(${c.id})">
            <i class="bi bi-x-circle"></i> Cancelar
          </button>
        </div>
      </div>`;
  }).join('');
}

// ─── HOME / CLIMA ──────────────────────────────────
function atualizarProximaConsultaHome() {
  const content = document.getElementById('home-proxima-content');
  if (!content) return;

  const proximas = consultas
    .filter(c => c.status === 'confirmada')
    .sort((a, b) => new Date(a.dataISO + 'T' + a.hora) - new Date(b.dataISO + 'T' + b.hora));

  if (!proximas.length) {
    content.innerHTML = `<p style="opacity:.7; font-size:.88rem">Nenhuma consulta agendada.</p>`;
    return;
  }

  const c = proximas[0];
  content.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px">
      <i class="bi bi-calendar3" style="font-size:1.1rem"></i>
      <strong style="font-size:1rem">${pad2(c.dia)} de ${monthNames[mesParaIndice(c.mes)].toLowerCase()}, ${c.hora}</strong>
    </div>
    <p style="opacity:.8; font-size:.86rem; margin-bottom:10px">${c.local}</p>
    <span style="background:rgba(255,255,255,.18);padding:5px 12px;border-radius:99px;font-size:.78rem;font-weight:800">${c.esp}</span>`;
}

async function carregarClimaSaoPaulo() {
  const card = document.getElementById('home-clima');
  const preview = document.getElementById('preview-clima');

  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao buscar clima');

    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const desc = descricaoClima(data.current.weather_code);

    if (card) {
      card.innerHTML = `
        <i class="bi ${desc.icon}" style="font-size:2rem"></i>
        <div>
          <div class="temp">${temp}°C</div>
          <div class="desc">${desc.texto} – São Paulo, SP</div>
        </div>`;
    }

    if (preview) preview.textContent = `${desc.emoji} ${temp}°C – ${desc.texto}`;
  } catch (e) {
    if (card) {
      card.innerHTML = `
        <i class="bi bi-cloud-sun" style="font-size:2rem"></i>
        <div>
          <div class="temp">--°C</div>
          <div class="desc">Clima indisponível – São Paulo, SP</div>
        </div>`;
    }

    if (preview) preview.textContent = '⛅ Clima indisponível';
  }
}

function descricaoClima(code) {
  if ([0].includes(code)) return { texto: 'Ensolarado', icon: 'bi-sun-fill', emoji: '☀️' };
  if ([1, 2, 3].includes(code)) return { texto: 'Parcialmente nublado', icon: 'bi-cloud-sun-fill', emoji: '⛅' };
  if ([45, 48].includes(code)) return { texto: 'Neblina', icon: 'bi-cloud-fog-fill', emoji: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { texto: 'Chuva', icon: 'bi-cloud-rain-fill', emoji: '🌧️' };
  if ([95, 96, 99].includes(code)) return { texto: 'Tempestade', icon: 'bi-cloud-lightning-rain-fill', emoji: '⛈️' };
  return { texto: 'Nublado', icon: 'bi-cloud-fill', emoji: '☁️' };
}

// ─── CONQUISTAS ────────────────────────────────────
function renderConquistas(filter) {
  const grid = document.getElementById('conquistas-grid');
  if (!grid) return;

  const items = filter === 'todas' ? conquistas : conquistas.filter(c => c.status === filter);

  grid.innerHTML = items.map(c => {
    const isUnlocked = c.status === 'desbloqueadas';
    const inProgress = c.status === 'andamento';
    const badgeClass = isUnlocked ? 'unlocked' : inProgress ? 'in-progress' : 'locked';

    const extra = isUnlocked
      ? `<div class="unlocked-label">✅ Desbloqueada</div>`
      : inProgress
        ? `<div class="progress-sm"><div class="progress-sm-fill" style="width:${c.prog}%"></div></div>
           <div style="font-size:.72rem;color:var(--gray-400);margin-top:4px">${c.prog}/100</div>`
        : `<div style="font-size:.72rem;color:var(--gray-400);margin-top:6px">🔒 Bloqueada</div>`;

    return `
      <div class="col-sm-6 col-lg-3">
        <div class="conquista-card">
          <div class="conquista-badge ${badgeClass}">${c.emoji}</div>
          <div class="conquista-name">${c.name}</div>
          <div class="conquista-pts">⭐ ${c.pts} pontos</div>
          <div class="conquista-desc">${c.desc}</div>
          ${extra}
        </div>
      </div>`;
  }).join('');
}

function filterConquistas(filter, btn) {
  document.querySelectorAll('#conquista-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderConquistas(filter);
}

// ─── RANKING ───────────────────────────────────────
function renderRanking() {
  const list = document.getElementById('ranking-list');
  if (!list) return;

  const meIdx = rankingData.findIndex(r => r.isMe);
  if (meIdx !== -1) {
    rankingData[meIdx].name = currentUser.nome;
    rankingData[meIdx].pts = pontosUsuario;
  }

  rankingData.sort((a, b) => b.pts - a.pts);

  list.innerHTML = rankingData.map((r, i) => {
    const pos = i + 1;
    const posClass = pos === 1 ? 'top1' : pos === 2 ? 'top2' : pos === 3 ? 'top3' : '';
    const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
    const initials = r.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    return `
      <div class="ranking-row ${r.isMe ? 'rank-me' : ''}">
        <div class="rank-pos ${posClass}">${medal}</div>
        <div class="rank-av" style="background:${r.color}">${initials}</div>
        <div class="rank-name">${r.name}${r.isMe ? ' <span style="font-size:.72rem;color:var(--primary);font-weight:800">(você)</span>' : ''}</div>
        <div class="rank-pts">${r.pts.toLocaleString('pt-BR')} pts</div>
      </div>`;
  }).join('');
}

// ─── CHAT ──────────────────────────────────────────
function listarProximasConsultasChat() {
  const proximas = consultas
    .filter(c => c.status === 'confirmada')
    .sort((a, b) => new Date(a.dataISO + 'T' + a.hora) - new Date(b.dataISO + 'T' + b.hora));

  if (!proximas.length) return 'Você não possui próximas consultas agendadas no momento.';

  return `Suas próximas consultas são:<br><br>` + proximas.map(c =>
    `• <strong>${c.esp}</strong> com ${c.medico}<br>${formatarDataBR(c.dataISO)} às ${c.hora} – ${c.local}`
  ).join('<br><br>');
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, 'user');
  input.value = '';

  setTimeout(() => {
    const key = Object.keys(chatResponses).find(k => msg.toLowerCase().includes(k));
    const response = key ? chatResponses[key] : null;
    const reply = typeof response === 'function'
      ? response()
      : response || 'Entendido! Posso te ajudar com agendamentos, consultas, pontos e muito mais. O que você precisa? 😊';

    addMessage(reply, 'bot');
  }, 700);
}

function sendQuick(text) {
  document.getElementById('chat-input').value = text;
  sendChat();
}

function addMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg-bubble msg-${type}`;
  div.innerHTML = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function limparChat() {
  const msgs = document.getElementById('chat-messages');
  msgs.innerHTML = `
    <div class="msg-bubble msg-bot">
      Olá! 👋 Sou a Care, sua assistente virtual da CarePlus 💙<br/><br/>
      Estou aqui para facilitar o seu cuidado com a saúde:<br/>
      ✔ Agende ou desmarque consultas com poucos toques.<br/>
      ✔ Lembretes automáticos para você não perder nenhum horário.<br/>
      ✔ Avisos inteligentes sobre clima e trânsito no dia da consulta.<br/><br/>
      O que você gostaria de fazer hoje?
    </div>`;
}

// ─── CONFIGURAÇÕES / APARÊNCIA ─────────────────────
function showConfig(panel, btn) {
  document.querySelectorAll('.config-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.config-sidebar-item').forEach(b => b.classList.remove('active'));

  const el = document.getElementById('config-' + panel);
  if (el) el.classList.add('active');
  btn.classList.add('active');
}

function selectMode(el, mode = 'light') {
  const group = el.closest('.mode-btns');
  if (group) {
    group.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  }

  el.classList.add('selected');

  document.body.classList.remove('theme-light', 'theme-dark');

  if (mode === 'dark') {
    document.body.classList.add('theme-dark');
    toast('🌙 Modo escuro ativado!');
    return;
  }

  if (mode === 'auto') {
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.add(prefereEscuro ? 'theme-dark' : 'theme-light');
    toast('🖥️ Modo automático ativado!');
    return;
  }

  document.body.classList.add('theme-light');
  toast('☀️ Modo claro ativado!');
}

function selectSwatch(el) {
  const group = el.closest('.color-swatches');
  if (group) {
    group.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  }

  el.classList.add('selected');

  const corPrincipal = el.dataset.color || '#1e4fc2';
  const corClara = el.dataset.light || '#3b82f6';
  const corEscura = escurecerCor(corPrincipal, 45);
  const corPale = gerarCorPale(corPrincipal);

  document.documentElement.style.setProperty('--primary', corPrincipal);
  document.documentElement.style.setProperty('--primary-light', corClara);
  document.documentElement.style.setProperty('--primary-dark', corEscura);
  document.documentElement.style.setProperty('--primary-pale', corPale);

  const preview = document.getElementById('preview-card');
  if (preview) {
    preview.style.background = `linear-gradient(135deg, ${corEscura}, ${corPrincipal})`;
  }

  toast('🎨 Cor principal atualizada!');
}

function selectFont(el, size = 'medium') {
  const group = el.closest('.font-btns');
  if (group) {
    group.querySelectorAll('.font-btn').forEach(b => b.classList.remove('selected'));
  }

  el.classList.add('selected');

  const escala = size === 'small' ? 0.92 : size === 'large' ? 1.08 : 1;
  document.documentElement.style.setProperty('--font-scale', escala);

  toast('🔠 Fonte atualizada!');
}

function escurecerCor(hex, percent) {
  const numero = parseInt(hex.replace('#', ''), 16);
  let r = (numero >> 16) - percent;
  let g = ((numero >> 8) & 0x00ff) - percent;
  let b = (numero & 0x0000ff) - percent;

  r = Math.max(0, r);
  g = Math.max(0, g);
  b = Math.max(0, b);

  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function gerarCorPale(hex) {
  const numero = parseInt(hex.replace('#', ''), 16);
  const r = numero >> 16;
  const g = (numero >> 8) & 0x00ff;
  const b = numero & 0x0000ff;

  const novoR = Math.round(r + (255 - r) * 0.88);
  const novoG = Math.round(g + (255 - g) * 0.88);
  const novoB = Math.round(b + (255 - b) * 0.88);

  return `rgb(${novoR}, ${novoG}, ${novoB})`;
}

// ─── TOAST ─────────────────────────────────────────
function toast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="bi bi-check-circle-fill" style="color:var(--green)"></i> ${msg}`;
  container.appendChild(el);

  setTimeout(() => el.remove(), 3500);
}

// ─── NOTIFICAÇÕES ──────────────────────────────────
function toggleNotifPanel() {
  renderNotificacoes();
  const panel = document.getElementById('notif-panel');
  if (panel) panel.classList.toggle('open');
}

function marcarTodasLidas() {
  notificacoes.forEach(n => n.lida = true);
  renderNotificacoes();

  const dot = document.getElementById('notif-dot');
  if (dot) dot.classList.remove('visible');

  toast('Todas as notificações foram marcadas como lidas.');

  const panel = document.getElementById('notif-panel');
  if (panel) panel.classList.remove('open');
}

// ─── EVENTOS / DOMContentLoaded ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  consultas.forEach(normalizarConsulta);

  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeModal();
    });
  }

  const pwdInput = document.getElementById('login-pwd');
  if (pwdInput) {
    pwdInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  }

  const modalData = document.getElementById('modal-data');
  if (modalData) {
    modalData.min = hojeISO();
    modalData.addEventListener('change', () => {
      if (modalData.value) _esconderErroData();
    });
  }

  const style = document.createElement('style');
  style.textContent = `
    #cp-date-error {
      display: none;
      align-items: flex-start;
      gap: 9px;
      background: #fef2f2;
      border: 1.5px solid #fca5a5;
      color: #b91c1c;
      border-radius: 10px;
      padding: 11px 14px;
      font-size: .85rem;
      font-weight: 600;
      margin-top: 6px;
      margin-bottom: 2px;
      line-height: 1.45;
    }
    #cp-date-error i {
      font-size: 1rem;
      flex-shrink: 0;
      margin-top: 1px;
      color: #ef4444;
    }
    #cp-date-error strong { color: #991b1b; }
    #modal-data.cp-input-error {
      border-color: #ef4444 !important;
      background: #fff8f8 !important;
    }
    @keyframes cpShake {
      0%,100% { transform: translateX(0); }
      15% { transform: translateX(-8px); }
      30% { transform: translateX(8px); }
      45% { transform: translateX(-5px); }
      60% { transform: translateX(5px); }
      75% { transform: translateX(-2px); }
      90% { transform: translateX(2px); }
    }
    .cp-shake { animation: cpShake .38s ease; }
  `;
  document.head.appendChild(style);
});

// Fecha notificações ao clicar fora
document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');

  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) {
    panel.classList.remove('open');
  }
});
