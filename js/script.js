
// ──────────────────────────────────────────────────
// 1. ESTADO GLOBAL
// ──────────────────────────────────────────────────
const STORAGE_USERS_KEY = 'careplus_usuarios';
const PROFESSOR_CPF = '12345678900';
const PROFESSOR_SENHA = '12345678900';

let currentUser = {
  nome: 'Lucas Oliveira',
  cpf: '123.456.789-00',
  email: 'lucas.oliveira@email.com',
  nascimento: '15/05/1998'
};

let pontosUsuario = 850;
let notificacoes = [];
let filtroConsultaAtual = 'todas';
let modalContext = { mode: 'agendar', consultaId: null };

const hojeSistema = new Date();
let calYear = hojeSistema.getFullYear();
let calMonth = hojeSistema.getMonth();
let selectedDay = hojeSistema.getDate();

const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const monthShort = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
const weekShort = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

// ──────────────────────────────────────────────────
// 2. UTILITÁRIOS
// ──────────────────────────────────────────────────
function pad2(value) {
  return String(value).padStart(2, '0');
}

function limparCPF(cpf) {
  return String(cpf || '').replace(/\D/g, '').slice(0, 11);
}

function formatarCPF(cpf) {
  const n = limparCPF(cpf);
  return n
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function hojeISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function addDaysISO(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function parseISODate(iso) {
  return new Date(`${iso}T00:00:00`);
}

function dataHoraConsulta(consulta) {
  return new Date(`${consulta.dataISO}T${consulta.hora || '00:00'}:00`);
}

function isDataPassada(dataISO) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const data = parseISODate(dataISO);
  data.setHours(0, 0, 0, 0);
  return data < hoje;
}

function formatarDataLonga(dataISO) {
  return parseISODate(dataISO).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function especialidadeInfo(esp) {
  const map = {
    'Cardiologista': { icon: 'bi-heart-pulse-fill', iconBg: '#e8f0fe', iconColor: '#1e4fc2', stripe: 'stripe-blue' },
    'Clínico Geral': { icon: 'bi-stethoscope', iconBg: '#dcfce7', iconColor: '#22c55e', stripe: 'stripe-green' },
    'Oftalmologista': { icon: 'bi-eye-fill', iconBg: '#e0f2fe', iconColor: '#0ea5e9', stripe: 'stripe-green' },
    'Ortopedista': { icon: 'bi-bandaid-fill', iconBg: '#fee2e2', iconColor: '#ef4444', stripe: 'stripe-red' },
    'Dermatologista': { icon: 'bi-droplet-fill', iconBg: '#fef3c7', iconColor: '#f59e0b', stripe: 'stripe-blue' },
    'Neurologista': { icon: 'bi-cpu-fill', iconBg: '#ede9fe', iconColor: '#8b5cf6', stripe: 'stripe-blue' }
  };
  return map[esp] || map['Clínico Geral'];
}

function normalizarConsulta(c) {
  const data = parseISODate(c.dataISO);
  const info = especialidadeInfo(c.esp);
  c.dia = data.getDate();
  c.mes = monthShort[data.getMonth()];
  c.semana = weekShort[data.getDay()];
  c.icon = info.icon;
  c.iconBg = info.iconBg;
  c.iconColor = info.iconColor;
  c.stripe = c.status === 'cancelada' ? 'stripe-red' : info.stripe;

  if (c.status === 'confirmada' && dataHoraConsulta(c) < new Date()) {
    c.status = 'realizada';
    c.presencaConfirmada = true;
    c.stripe = 'stripe-green';
  }

  c.filter = ['todas'];
  if (c.status === 'confirmada') c.filter.push('proximas', 'confirmadas');
  if (c.status === 'realizada') c.filter.push('realizadas');
  if (c.status === 'cancelada') c.filter.push('canceladas');
  return c;
}

function aplicarMascaraCPF(input) {
  if (!input) return;
  input.addEventListener('input', () => {
    input.value = formatarCPF(input.value);
  });
}

function escurecerCor(hex, percent = 35) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = Math.max(0, (num >> 16) - percent);
  const g = Math.max(0, ((num >> 8) & 0xff) - percent);
  const b = Math.max(0, (num & 0xff) - percent);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function gerarCorPale(hex) {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const r = num >> 16;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const nr = Math.round(r + (255 - r) * 0.88);
  const ng = Math.round(g + (255 - g) * 0.88);
  const nb = Math.round(b + (255 - b) * 0.88);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

// ──────────────────────────────────────────────────
// 3. DADOS
// ──────────────────────────────────────────────────
const consultas = [
  {
    id: 1,
    dataISO: addDaysISO(12),
    esp: 'Cardiologista',
    medico: 'Dr. Carlos Henrique',
    local: 'Hospital Sírio-Libanês',
    hora: '09:30',
    dur: '30 min',
    status: 'confirmada',
    presencaConfirmada: false
  },
  {
    id: 2,
    dataISO: addDaysISO(-1),
    esp: 'Clínico Geral',
    medico: 'Dra. Mariana Lopes',
    local: 'Hospital Sancta Maggiore',
    hora: '10:00',
    dur: '30 min',
    status: 'realizada',
    presencaConfirmada: true
  },
  {
    id: 3,
    dataISO: addDaysISO(-6),
    esp: 'Ortopedista',
    medico: 'Dr. Felipe Andrade',
    local: 'Hospital Albert Einstein',
    hora: '14:00',
    dur: '30 min',
    status: 'cancelada',
    presencaConfirmada: false
  },
  {
    id: 4,
    dataISO: addDaysISO(-28),
    esp: 'Oftalmologista',
    medico: 'Dra. Juliana Ribeiro',
    local: 'Hospital das Clínicas',
    hora: '11:15',
    dur: '30 min',
    status: 'realizada',
    presencaConfirmada: true
  }
].map(normalizarConsulta);

let nextConsultaId = Math.max(...consultas.map(c => c.id)) + 1;

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
  'agendar consulta': 'Claro! Clique em “Agendar consulta” no topo da tela para escolher especialidade, médico, data e horário. 📅',
  'ver próximas consultas': () => listarProximasConsultasChat(),
  'reagendar': 'Para reagendar, acesse a aba Consultas ou Calendário e clique em “Reagendar” na consulta desejada. 🗓️',
  'falar sobre pontos': () => `Você está com ${pontosUsuario} pontos. Você ganha pontos ao agendar, confirmar presença e reagendar com antecedência, e perde pontos ao cancelar consultas. 🏆`,
  'clima no dia da consulta': 'A previsão de São Paulo aparece em tempo real na Home. No dia da consulta, saia com antecedência e acompanhe o trânsito. ⛅',
  'saber sobre o trajeto': 'Para São Paulo hoje: clima exibido na Home, trens/metrô simulados como funcionando normalmente e vias sem ocorrências críticas no momento. 🚆🚗'
};

// ──────────────────────────────────────────────────
// 4. AUTENTICAÇÃO
// ──────────────────────────────────────────────────
function getUsuariosCarePlus() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function salvarUsuariosCarePlus(usuarios) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usuarios));
    return true;
  } catch (e) {
    console.error('Erro ao salvar usuários no localStorage:', e);
    return false;
  }
}

function entrarNoApp(cpf, usuario = {}) {
  currentUser.nome = usuario.nome || currentUser.nome || 'Usuário CarePlus';
  currentUser.cpf = formatarCPF(cpf);

  const loginPage = document.getElementById('page-login');
  const appPage = document.getElementById('page-app');

  if (loginPage) loginPage.classList.remove('active');
  if (appPage) appPage.classList.add('active');

  initApp();
}

function mostrarAuthMsg(id, texto, tipo = 'erro') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = `auth-message ${tipo}`;
  el.style.display = 'block';
}

function limparAuthMsgs() {
  document.querySelectorAll('.auth-message').forEach(msg => {
    msg.textContent = '';
    msg.className = 'auth-message';
    msg.style.display = 'none';
  });
}

function abrirModalCadastro(event) {
  if (event) event.preventDefault();
  limparAuthMsgs();
  const modal = document.getElementById('auth-modal');
  const cadastro = document.getElementById('auth-cadastro');
  const senha = document.getElementById('auth-senha');
  if (!modal || !cadastro || !senha) return;
  modal.classList.add('open');
  cadastro.style.display = 'block';
  senha.style.display = 'none';
  document.getElementById('cadastro-cpf').value = '';
  document.getElementById('cadastro-senha').value = '';
}

function abrirModalSenha(event) {
  if (event) event.preventDefault();
  limparAuthMsgs();
  const modal = document.getElementById('auth-modal');
  const cadastro = document.getElementById('auth-cadastro');
  const senha = document.getElementById('auth-senha');
  if (!modal || !cadastro || !senha) return;
  modal.classList.add('open');
  cadastro.style.display = 'none';
  senha.style.display = 'block';
  document.getElementById('recuperar-cpf').value = '';
  document.getElementById('nova-senha').value = '';
}

function fecharModalAuth() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('open');
}

function criarCadastro() {
  const cpfInput = document.getElementById('cadastro-cpf');
  const senhaInput = document.getElementById('cadastro-senha');
  const cpf = limparCPF(cpfInput ? cpfInput.value : '');
  const senha = senhaInput ? senhaInput.value.trim() : '';

  if (cpf.length !== 11) {
    mostrarAuthMsg('cadastro-msg', 'Não será possível continuar. Um CPF precisa ter 11 dígitos.', 'erro');
    if (cpfInput) cpfInput.focus();
    return;
  }

  if (!senha) {
    mostrarAuthMsg('cadastro-msg', 'Crie uma senha para finalizar o cadastro.', 'erro');
    if (senhaInput) senhaInput.focus();
    return;
  }

  if (cpf === PROFESSOR_CPF) {
    mostrarAuthMsg('cadastro-msg', 'Este CPF é reservado para acesso do professor. Use o login padrão.', 'erro');
    if (cpfInput) cpfInput.focus();
    return;
  }

  const usuarios = getUsuariosCarePlus();
  const jaExistia = Boolean(usuarios[cpf]);

  usuarios[cpf] = {
    ...(usuarios[cpf] || {}),
    cpf,
    senha,
    nome: usuarios[cpf]?.nome || 'Usuário CarePlus',
    atualizadoEm: new Date().toISOString()
  };

  if (!salvarUsuariosCarePlus(usuarios)) {
    mostrarAuthMsg('cadastro-msg', 'Não foi possível salvar o cadastro neste navegador. Verifique se o armazenamento local está habilitado.', 'erro');
    return;
  }

  const usuarioSalvo = getUsuariosCarePlus()[cpf];

  if (!usuarioSalvo || usuarioSalvo.senha !== senha) {
    mostrarAuthMsg('cadastro-msg', 'O cadastro não foi salvo corretamente. Tente novamente.', 'erro');
    return;
  }

  const loginCpf = document.getElementById('login-cpf');
  const loginSenha = document.getElementById('login-pwd');
  if (loginCpf) loginCpf.value = formatarCPF(cpf);
  if (loginSenha) loginSenha.value = senha;

  mostrarAuthMsg(
    'cadastro-msg',
    jaExistia
      ? 'CPF já encontrado. Senha atualizada e acesso liberado!'
      : 'Cadastro criado com sucesso! Entrando na sua conta...',
    'sucesso'
  );

  setTimeout(() => {
    fecharModalAuth();
    entrarNoApp(cpf, usuarioSalvo);
  }, 700);
}

function alterarSenha() {
  const cpf = limparCPF(document.getElementById('recuperar-cpf').value);
  const novaSenha = document.getElementById('nova-senha').value.trim();
  const usuarios = getUsuariosCarePlus();

  if (cpf.length !== 11) {
    mostrarAuthMsg('senha-msg', 'Informe um CPF válido com 11 dígitos.', 'erro');
    return;
  }

  if (!novaSenha) {
    mostrarAuthMsg('senha-msg', 'Digite uma nova senha para continuar.', 'erro');
    return;
  }

  if (cpf !== PROFESSOR_CPF && !usuarios[cpf]) {
    mostrarAuthMsg('senha-msg', 'CPF não encontrado. Cadastre-se antes de alterar a senha.', 'erro');
    return;
  }

  usuarios[cpf] = usuarios[cpf] || { cpf, nome: 'Professor' };
  usuarios[cpf].senha = novaSenha;
  usuarios[cpf].alteradoEm = new Date().toISOString();
  salvarUsuariosCarePlus(usuarios);

  document.getElementById('login-cpf').value = formatarCPF(cpf);
  document.getElementById('login-pwd').value = novaSenha;
  mostrarAuthMsg('senha-msg', 'Senha alterada com sucesso!', 'sucesso');
  setTimeout(fecharModalAuth, 900);
}

function doLogin() {
  const cpf = limparCPF(document.getElementById('login-cpf').value);
  const senha = document.getElementById('login-pwd').value.trim();

  if (!cpf || !senha) {
    toast('⚠️ Preencha CPF e senha.');
    return;
  }

  const usuarios = getUsuariosCarePlus();
  const professorPadrao = cpf === PROFESSOR_CPF && senha === PROFESSOR_SENHA;
  const usuarioSalvo = usuarios[cpf];
  const senhaSalvaOk = usuarioSalvo && usuarioSalvo.senha === senha;

  if (!professorPadrao && !senhaSalvaOk) {
    if (usuarioSalvo || cpf === PROFESSOR_CPF) {
      toast('❌ Senha incorreta. Tente novamente ou clique em Esqueci minha senha.');
    } else {
      toast('⚠️ CPF não encontrado. Faça seu cadastro para acessar.');
    }
    return;
  }

  const usuarioLogin = professorPadrao
    ? { nome: 'Professor CarePlus', cpf: PROFESSOR_CPF }
    : usuarioSalvo;

  entrarNoApp(cpf, usuarioLogin);
}

function doLogout() {
  document.getElementById('page-app').classList.remove('active');
  document.getElementById('page-login').classList.add('active');
  document.getElementById('login-cpf').value = '';
  document.getElementById('login-pwd').value = '';
}

// ──────────────────────────────────────────────────
// 5. NAVEGAÇÃO
// ──────────────────────────────────────────────────
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

  const view = document.getElementById(`view-${name}`);
  if (view) view.classList.add('active');

  const labelMap = {
    inicio: 'início', consultas: 'consultas', calendario: 'calendário',
    chat: 'chat', conquistas: 'conquistas', ranking: 'ranking', configuracoes: 'configurações'
  };
  const label = labelMap[name] || name;
  const btn = [...document.querySelectorAll('.nav-item-cp')]
    .find(b => b.textContent.trim().toLowerCase().includes(label));
  if (btn) btn.classList.add('active');

  const [title, sub] = viewTitles[name] || ['CarePlus', ''];
  document.getElementById('page-title').textContent = title;
  document.getElementById('page-sub').textContent = sub;

  if (name === 'calendario') renderCalendar();
  if (name === 'consultas') renderConsultas(filtroConsultaAtual);
  if (name === 'ranking') renderRanking();

  if (window.innerWidth < 900) document.getElementById('sidebar').classList.remove('open');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ──────────────────────────────────────────────────
// 6. PERFIL / HOME / PONTOS
// ──────────────────────────────────────────────────
function syncUserName() {
  const nome = currentUser.nome.trim() || 'Lucas Oliveira';
  const primeiroNome = nome.split(' ')[0];
  const iniciais = nome.split(' ').filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 2).join('') || 'LO';

  document.querySelectorAll('[data-user-name]').forEach(el => { el.textContent = nome; });
  document.querySelectorAll('[data-user-firstname]').forEach(el => { el.textContent = primeiroNome; });
  document.querySelectorAll('[data-user-initials]').forEach(el => { el.textContent = iniciais; });

  const preview = document.getElementById('preview-nome');
  if (preview) preview.textContent = `Olá, ${primeiroNome}! 👋`;
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
  renderRanking();
  toast(`✅ Dados salvos! Bem-vindo(a), ${novoNome.split(' ')[0]}!`);
}

function atualizarPontos(delta, motivo) {
  pontosUsuario = Math.max(0, pontosUsuario + delta);
  const me = rankingData.find(r => r.isMe);
  if (me) me.pts = pontosUsuario;
  renderRanking();
  atualizarCardsHome();
  addNotification(delta >= 0 ? 'Pontos adicionados' : 'Pontos descontados', `${motivo} (${delta >= 0 ? '+' : ''}${delta} pontos)`, delta >= 0 ? 'bi-trophy-fill' : 'bi-exclamation-triangle-fill');
}

function atualizarCardsHome() {
  document.querySelectorAll('.points-card span').forEach(span => {
    if (/^\d/.test(span.textContent.trim())) span.textContent = pontosUsuario;
  });
  document.querySelectorAll('.ranking-badge').forEach(el => {
    if (el.textContent.includes('Meus pontos')) el.innerHTML = `<i class="bi bi-trophy-fill"></i> Meus pontos: ${pontosUsuario}`;
  });

  const proxima = consultas
    .map(normalizarConsulta)
    .filter(c => c.status === 'confirmada')
    .sort((a, b) => dataHoraConsulta(a) - dataHoraConsulta(b))[0];

  const box = document.getElementById('home-proxima-content');
  if (box) {
    if (proxima) {
      box.innerHTML = `
        <div style="font-weight:800; font-size:1.05rem; margin-bottom:8px">
          <i class="bi bi-calendar3"></i> ${formatarDataLonga(proxima.dataISO).replace(' de ', ' ')} · ${proxima.hora}
        </div>
        <div style="opacity:.8; font-size:.88rem; margin-bottom:10px">${proxima.local}</div>
        <div class="ranking-badge" style="background:rgba(255,255,255,.2); color:#fff">${proxima.esp}</div>`;
    } else {
      box.innerHTML = '<p style="opacity:.7; font-size:.88rem">Nenhuma consulta agendada.</p>';
    }
  }
}

// ──────────────────────────────────────────────────
// 7. CONSULTAS
// ──────────────────────────────────────────────────
function renderConsultaStats() {
  const container = document.getElementById('consultas-stats');
  if (!container) return;
  const normalizadas = consultas.map(normalizarConsulta);
  const proxima = normalizadas.filter(c => c.status === 'confirmada').sort((a,b) => dataHoraConsulta(a) - dataHoraConsulta(b))[0];
  const confirmadas = normalizadas.filter(c => c.status === 'confirmada').length;
  const realizadas = normalizadas.filter(c => c.status === 'realizada').length;
  const canceladas = normalizadas.filter(c => c.status === 'cancelada').length;

  container.innerHTML = `
    <div class="col-md-3"><div class="stat-card"><div class="stat-icon" style="background:var(--primary-pale);color:var(--primary)"><i class="bi bi-calendar-check"></i></div><div><div class="stat-label">Próxima consulta</div><div class="stat-value" style="font-size:1.05rem">${proxima ? `${proxima.dia} de ${proxima.mes}` : '--'}</div><div class="stat-sub">${proxima ? `${proxima.hora} · ${proxima.esp}` : 'Sem agenda'}</div></div></div></div>
    <div class="col-md-3"><div class="stat-card"><div class="stat-icon" style="background:var(--green-pale);color:var(--green)"><i class="bi bi-check-circle-fill"></i></div><div><div class="stat-label">Consultas confirmadas</div><div class="stat-value text-green">${confirmadas}</div><div class="stat-sub">Esse ano</div></div></div></div>
    <div class="col-md-3"><div class="stat-card"><div class="stat-icon" style="background:#ede9fe;color:var(--purple)"><i class="bi bi-clock-fill"></i></div><div><div class="stat-label">Consultas realizadas</div><div class="stat-value" style="color:var(--purple)">${realizadas}</div><div class="stat-sub">Esse ano</div></div></div></div>
    <div class="col-md-3"><div class="stat-card"><div class="stat-icon" style="background:var(--red-pale);color:var(--red)"><i class="bi bi-x-circle-fill"></i></div><div><div class="stat-label">Consultas canceladas</div><div class="stat-value text-red">${canceladas}</div><div class="stat-sub">Esse ano</div></div></div></div>`;
}

function renderConsultas(filter = 'todas') {
  filtroConsultaAtual = filter;
  consultas.forEach(normalizarConsulta);
  renderConsultaStats();

  const list = document.getElementById('consultas-list');
  if (!list) return;
  const items = consultas
    .filter(c => c.filter.includes(filter))
    .sort((a, b) => dataHoraConsulta(b) - dataHoraConsulta(a));

  list.innerHTML = items.map(c => {
    let statusBadge = '';
    let actions = '';

    if (c.status === 'confirmada') {
      statusBadge = `<span class="badge-status badge-confirmada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Confirmada</span>`;
      const btnPresenca = c.presencaConfirmada
        ? `<button class="btn-outline-cp" style="opacity:.65;cursor:default;pointer-events:none;" disabled><i class="bi bi-check-circle-fill" style="color:var(--green)"></i> Presença confirmada</button>`
        : `<button class="btn-outline-green" onclick="confirmarPresenca(${c.id})"><i class="bi bi-check-circle"></i> Confirmar presença</button>`;
      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>
        ${btnPresenca}
        <button class="btn-outline-cp" onclick="openModal('reagendar', ${c.id})"><i class="bi bi-calendar"></i> Reagendar</button>
        <button class="btn-outline-red" onclick="cancelarConsulta(${c.id})"><i class="bi bi-x-circle"></i> Cancelar</button>`;
    } else if (c.status === 'realizada') {
      statusBadge = `<span class="badge-status badge-realizada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Realizada</span>`;
      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>
        <button class="btn-outline-cp" onclick="openModal('agendar')"><i class="bi bi-calendar-plus"></i> Novo agendamento</button>`;
    } else {
      statusBadge = `<span class="badge-status badge-cancelada"><i class="bi bi-circle-fill" style="font-size:.5rem"></i> Cancelada</span>`;
      actions = `
        <button class="btn-outline-cp" onclick="verDetalhesConsulta(${c.id})"><i class="bi bi-eye"></i> Ver detalhes</button>
        <button class="btn-outline-red" onclick="openModal('agendar')"><i class="bi bi-calendar-plus"></i> Agendar novamente</button>`;
    }

    return `
      <div class="consulta-item">
        <div class="consulta-stripe ${c.stripe}"></div>
        <div class="consulta-date"><div class="day">${pad2(c.dia)}</div><div class="month">${c.mes}</div><div class="weekday">${c.semana}</div></div>
        <div class="consulta-icon-wrap" style="background:${c.iconBg}"><i class="bi ${c.icon}" style="color:${c.iconColor}"></i></div>
        <div class="consulta-info"><h4>${c.esp}</h4><div class="doctor">${c.medico}</div><div class="place"><i class="bi bi-geo-alt-fill"></i>${c.local}</div></div>
        <div class="consulta-meta"><span><i class="bi bi-clock"></i>${c.hora}</span><span><i class="bi bi-stopwatch"></i>${c.dur}</span></div>
        <div style="min-width:120px; text-align:center">${statusBadge}</div>
        <div class="consulta-actions">${actions}</div>
      </div>`;
  }).join('') || `<div style="padding:40px; text-align:center; color:var(--gray-400)"><i class="bi bi-calendar-x" style="font-size:2rem; display:block; margin-bottom:10px"></i>Nenhuma consulta encontrada.</div>`;
}

function filterConsultas(filter, btn) {
  document.querySelectorAll('#consulta-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderConsultas(filter);
}

function confirmarPresenca(consultaId) {
  const c = consultas.find(x => x.id === Number(consultaId));
  if (!c) return;
  if (c.presencaConfirmada) {
    toast('ℹ️ Presença já confirmada para esta consulta.');
    return;
  }
  c.presencaConfirmada = true;
  atualizarPontos(50, 'Presença confirmada');
  toast('✅ Presença confirmada! +50 pontos adicionados.');
  renderConsultas(filtroConsultaAtual);
  renderCalendar();
  if (selectedDay) selectDay(selectedDay);
}

function cancelarConsulta(consultaId) {
  const c = consultas.find(x => x.id === Number(consultaId));
  if (!c || c.status === 'cancelada') return;
  c.status = 'cancelada';
  c.presencaConfirmada = false;
  normalizarConsulta(c);
  atualizarPontos(-80, 'Consulta cancelada');
  toast('❌ Consulta cancelada. -80 pontos.');
  addNotification('Consulta cancelada', `${c.esp} em ${formatarDataLonga(c.dataISO)} foi cancelada.`, 'bi-x-circle-fill');
  renderConsultas(filtroConsultaAtual);
  renderCalendar();
  if (selectedDay) selectDay(selectedDay);
}

function verDetalhesConsulta(consultaId) {
  const c = consultas.find(x => x.id === Number(consultaId));
  if (!c) return;
  toast(`👁️ ${c.esp} com ${c.medico} em ${formatarDataLonga(c.dataISO)} às ${c.hora}.`);
}

// ──────────────────────────────────────────────────
// 8. MODAL AGENDAR / REAGENDAR
// ──────────────────────────────────────────────────
function openModal(mode = 'agendar', consultaId = null) {
  modalContext = { mode, consultaId };
  _esconderErroData();

  const modalTitle = document.getElementById('modal-title');
  const modalSub = document.getElementById('modal-subtitle');
  const modalMode = document.getElementById('modal-mode');
  const modalId = document.getElementById('modal-consulta-id');
  const dataInput = document.getElementById('modal-data');

  if (modalMode) modalMode.value = mode;
  if (modalId) modalId.value = consultaId || '';
  if (dataInput) {
    dataInput.min = hojeISO();
    dataInput.value = hojeISO();
  }

  if (mode === 'reagendar' && consultaId) {
    const c = consultas.find(x => x.id === Number(consultaId));
    if (c) {
      modalTitle.textContent = 'Reagendar consulta';
      modalSub.textContent = 'Escolha uma nova data e horário para sua consulta.';
      document.getElementById('modal-esp').value = c.esp;
      document.getElementById('modal-medico').value = c.medico;
      document.getElementById('modal-local').value = c.local;
      document.getElementById('modal-data').value = c.dataISO;
      document.getElementById('modal-hora').value = c.hora;
    }
  } else {
    modalTitle.textContent = 'Agendar consulta';
    modalSub.textContent = 'Preencha os dados para agendar sua consulta.';
    document.getElementById('modal-esp').value = 'Cardiologista';
    document.getElementById('modal-medico').value = 'Dr. Carlos Henrique';
    document.getElementById('modal-local').value = 'Hospital Sírio-Libanês';
    document.getElementById('modal-hora').value = '08:00';
  }

  document.getElementById('modal-overlay').classList.add('open');
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
    if (dataField) dataField.insertAdjacentElement('afterend', errEl);
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
  const esp = document.getElementById('modal-esp').value;
  const medico = document.getElementById('modal-medico').value;
  const local = document.getElementById('modal-local').value;
  const dataISO = document.getElementById('modal-data').value;
  const hora = document.getElementById('modal-hora').value;
  const mode = document.getElementById('modal-mode').value || modalContext.mode;
  const consultaId = Number(document.getElementById('modal-consulta-id').value || modalContext.consultaId);

  if (!dataISO) {
    _mostrarErroData('Selecione uma data para o agendamento.');
    return;
  }

  if (isDataPassada(dataISO)) {
    _mostrarErroData(`Data inválida: <strong>${formatarDataLonga(dataISO)}</strong> já passou. Escolha uma data atual ou futura.`);
    return;
  }

  if (mode === 'reagendar' && consultaId) {
    const c = consultas.find(x => x.id === consultaId);
    if (c) {
      Object.assign(c, { esp, medico, local, dataISO, hora, status: 'confirmada', presencaConfirmada: false });
      normalizarConsulta(c);
      atualizarPontos(20, 'Consulta reagendada com antecedência');
      toast('🗓️ Consulta reagendada com sucesso! +20 pontos.');
      addNotification('Consulta reagendada', `${esp} foi reagendada para ${formatarDataLonga(dataISO)} às ${hora}.`, 'bi-calendar-event-fill');
    }
  } else {
    const nova = normalizarConsulta({
      id: nextConsultaId++, esp, medico, local, dataISO, hora,
      dur: '30 min', status: 'confirmada', presencaConfirmada: false
    });
    consultas.push(nova);
    atualizarPontos(50, 'Nova consulta agendada');
    toast('✅ Consulta agendada com sucesso! +50 pontos.');
    addNotification('Consulta agendada', `${esp} em ${formatarDataLonga(dataISO)} às ${hora}.`, 'bi-calendar-plus-fill');
  }

  closeModal();
  renderConsultas(filtroConsultaAtual);
  renderCalendar();
  atualizarCardsHome();
}

// ──────────────────────────────────────────────────
// 9. CALENDÁRIO
// ──────────────────────────────────────────────────
function renderCalendar() {
  consultas.forEach(normalizarConsulta);
  const title = document.getElementById('cal-month-title');
  if (title) title.textContent = `${monthNames[calMonth]} ${calYear}`;

  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const total = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  let html = weekShort.map(d => `<div class="cal-day-header">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty other-month"></div>';

  for (let d = 1; d <= total; d++) {
    const isToday = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    const hasEvent = consultas.some(c => c.status !== 'cancelada' && parseISODate(c.dataISO).getDate() === d && parseISODate(c.dataISO).getMonth() === calMonth && parseISODate(c.dataISO).getFullYear() === calYear);
    const selected = d === selectedDay && calMonth === today.getMonth() && calYear === today.getFullYear();
    html += `<div class="cal-day${isToday ? ' today' : ''}${hasEvent ? ' has-event' : ''}${selected ? ' selected' : ''}" onclick="selectDay(${d})">${d}</div>`;
  }
  grid.innerHTML = html;
}

function changeMonth(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0) { calMonth = 11; calYear--; }
  selectedDay = null;
  renderCalendar();
}

function selectDay(d) {
  selectedDay = d;
  document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
  document.querySelectorAll('.cal-day:not(.empty)').forEach(el => {
    if (parseInt(el.textContent, 10) === d) el.classList.add('selected');
  });

  const titleEl = document.getElementById('cal-detail-title');
  const content = document.getElementById('cal-detail-content');
  if (!titleEl || !content) return;

  titleEl.textContent = `${d} de ${monthNames[calMonth]}`;
  const consultasDia = consultas
    .map(normalizarConsulta)
    .filter(c => c.status !== 'cancelada' && parseISODate(c.dataISO).getDate() === d && parseISODate(c.dataISO).getMonth() === calMonth && parseISODate(c.dataISO).getFullYear() === calYear);

  if (consultasDia.length === 0) {
    content.innerHTML = `<p style="color:var(--gray-400); font-size:.85rem">Nenhuma consulta neste dia.</p><button class="btn-agendar" style="margin-top:12px; width:100%; justify-content:center" onclick="openModal('agendar')"><i class="bi bi-plus-lg"></i> Agendar consulta</button>`;
    return;
  }

  content.innerHTML = consultasDia.map(c => {
    const btnPresenca = c.status === 'confirmada'
      ? (c.presencaConfirmada
        ? `<button class="btn-reagendar-sm" disabled style="opacity:.65;cursor:default"><i class="bi bi-check-circle-fill" style="color:var(--green)"></i> Presença confirmada</button>`
        : `<button class="btn-confirm" onclick="confirmarPresenca(${c.id})"><i class="bi bi-check-circle"></i> Confirmar presença</button>`)
      : '';
    return `<div class="cal-consult-item"><h5>${c.esp}</h5><p>${c.medico} · ${c.hora}</p><p style="margin-top:4px; font-size:.78rem; color:var(--gray-400)"><i class="bi bi-geo-alt-fill"></i> ${c.local}</p><div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap">${btnPresenca}<button class="btn-reagendar-sm" onclick="openModal('reagendar', ${c.id})"><i class="bi bi-calendar"></i> Reagendar</button><button class="btn-cancel-sm" onclick="cancelarConsulta(${c.id})"><i class="bi bi-x-circle"></i> Cancelar</button></div></div>`;
  }).join('');
}

// ──────────────────────────────────────────────────
// 10. CHAT
// ──────────────────────────────────────────────────
function listarProximasConsultasChat() {
  const proximas = consultas.map(normalizarConsulta).filter(c => c.status === 'confirmada').sort((a,b) => dataHoraConsulta(a) - dataHoraConsulta(b));
  if (proximas.length === 0) return 'Você ainda não tem consultas futuras agendadas. Use o botão “Agendar consulta” para marcar uma. 📅';
  return 'Suas próximas consultas:<br>' + proximas.map(c => `• ${c.esp} com ${c.medico}, ${formatarDataLonga(c.dataISO)} às ${c.hora}, em ${c.local}.`).join('<br>');
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addMessage(msg, 'user');
  input.value = '';
  setTimeout(() => {
    const key = Object.keys(chatResponses).find(k => msg.toLowerCase().includes(k));
    const response = key ? chatResponses[key] : 'Entendido! Posso te ajudar com agendamentos, consultas, pontos e muito mais. O que você precisa? 😊';
    addMessage(typeof response === 'function' ? response() : response, 'bot');
  }, 500);
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
  msgs.innerHTML = `<div class="msg-bubble msg-bot">Olá! 👋 Sou a Care, sua assistente virtual da CarePlus 💙<br/><br/>Estou aqui para facilitar o seu cuidado com a saúde:<br/>✔ Agende ou desmarque consultas com poucos toques.<br/>✔ Lembretes automáticos para você não perder nenhum horário.<br/>✔ Avisos inteligentes sobre clima e trânsito no dia da consulta.<br/><br/>O que você gostaria de fazer hoje?</div>`;
}

// ──────────────────────────────────────────────────
// 11. CONQUISTAS E RANKING
// ──────────────────────────────────────────────────
function renderConquistas(filter = 'todas') {
  const grid = document.getElementById('conquistas-grid');
  if (!grid) return;
  const items = filter === 'todas' ? conquistas : conquistas.filter(c => c.status === filter);
  grid.innerHTML = items.map(c => {
    const isUnlocked = c.status === 'desbloqueadas';
    const inProgress = c.status === 'andamento';
    const badgeClass = isUnlocked ? 'unlocked' : inProgress ? 'in-progress' : 'locked';
    const extra = isUnlocked
      ? '<div class="unlocked-label">✅ Desbloqueada</div>'
      : inProgress
        ? `<div class="progress-sm"><div class="progress-sm-fill" style="width:${c.prog}%"></div></div><div style="font-size:.72rem;color:var(--gray-400);margin-top:4px">${c.prog}/100</div>`
        : '<div style="font-size:.72rem;color:var(--gray-400);margin-top:6px">🔒 Bloqueada</div>';
    return `<div class="col-sm-6 col-lg-3"><div class="conquista-card"><div class="conquista-badge ${badgeClass}">${c.emoji}</div><div class="conquista-name">${c.name}</div><div class="conquista-pts">⭐ ${c.pts} pontos</div><div class="conquista-desc">${c.desc}</div>${extra}</div></div>`;
  }).join('');
}

function filterConquistas(filter, btn) {
  document.querySelectorAll('#conquista-tabs .filter-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderConquistas(filter);
}

function renderRanking() {
  const list = document.getElementById('ranking-list');
  if (!list) return;
  const meIdx = rankingData.findIndex(r => r.isMe);
  if (meIdx !== -1) {
    rankingData[meIdx].name = currentUser.nome;
    rankingData[meIdx].pts = pontosUsuario;
  }
  list.innerHTML = [...rankingData]
    .sort((a, b) => b.pts - a.pts)
    .map((r, i) => {
      const pos = i + 1;
      const posClass = pos === 1 ? 'top1' : pos === 2 ? 'top2' : pos === 3 ? 'top3' : '';
      const medal = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : pos;
      const initials = r.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
      return `<div class="ranking-row ${r.isMe ? 'rank-me' : ''}"><div class="rank-pos ${posClass}">${medal}</div><div class="rank-av" style="background:${r.color}">${initials}</div><div class="rank-name">${r.name}${r.isMe ? ' <span style="font-size:.72rem;color:var(--primary);font-weight:800">(você)</span>' : ''}</div><div class="rank-pts">${r.pts.toLocaleString('pt-BR')} pts</div></div>`;
    }).join('');
}

// ──────────────────────────────────────────────────
// 12. CONFIGURAÇÕES / APARÊNCIA
// ──────────────────────────────────────────────────
function showConfig(panel, btn) {
  document.querySelectorAll('.config-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.config-sidebar-item').forEach(b => b.classList.remove('active'));
  const el = document.getElementById(`config-${panel}`);
  if (el) el.classList.add('active');
  if (btn) btn.classList.add('active');
}

function selectMode(el, mode = 'light') {
  el.closest('.mode-btns').querySelectorAll('.mode-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  document.body.classList.remove('theme-light', 'theme-dark');

  if (mode === 'dark') {
    document.body.classList.add('theme-dark');
    toast('🌙 Modo escuro ativado!');
    return;
  }

  if (mode === 'auto') {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
    toast('🖥️ Modo automático ativado!');
    return;
  }

  document.body.classList.add('theme-light');
  toast('☀️ Modo claro ativado!');
}

function selectSwatch(el) {
  el.closest('.color-swatches').querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');

  const primary = el.dataset.color || '#1e4fc2';
  const light = el.dataset.light || '#3b82f6';
  const dark = escurecerCor(primary, 45);
  const pale = gerarCorPale(primary);

  document.documentElement.style.setProperty('--primary', primary);
  document.documentElement.style.setProperty('--primary-light', light);
  document.documentElement.style.setProperty('--primary-dark', dark);
  document.documentElement.style.setProperty('--primary-pale', pale);

  const preview = document.getElementById('preview-card');
  if (preview) preview.style.background = `linear-gradient(135deg, ${dark}, ${primary})`;
  toast('🎨 Cor principal atualizada!');
}

function selectFont(el, size = 'medium') {
  el.closest('.font-btns').querySelectorAll('.font-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  const scale = size === 'small' ? 0.92 : size === 'large' ? 1.08 : 1;
  document.documentElement.style.setProperty('--font-scale', scale);
  toast('🔠 Tamanho da fonte atualizado!');
}

// ──────────────────────────────────────────────────
// 13. NOTIFICAÇÕES / TOAST
// ──────────────────────────────────────────────────
function addNotification(title, text, icon = 'bi-bell-fill') {
  notificacoes.unshift({ title, text, icon, unread: true, date: new Date() });
  renderNotifications();
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  const dot = document.getElementById('notif-dot');
  if (!list) return;
  if (notificacoes.length === 0) {
    list.innerHTML = '<div class="notif-empty">Nenhuma notificação no momento.</div>';
  } else {
    list.innerHTML = notificacoes.map(n => `<div class="notif-item ${n.unread ? 'unread' : ''}"><div class="notif-icon" style="background:var(--primary-pale);color:var(--primary)"><i class="bi ${n.icon}"></i></div><div class="notif-text"><strong>${n.title}</strong><span>${n.text}</span></div></div>`).join('');
  }
  if (dot) dot.classList.toggle('visible', notificacoes.some(n => n.unread));
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (panel) panel.classList.toggle('open');
}

function marcarTodasLidas() {
  notificacoes = notificacoes.map(n => ({ ...n, unread: false }));
  renderNotifications();
  toast('Todas as notificações foram marcadas como lidas.');
}

function toast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ──────────────────────────────────────────────────
// 14. CLIMA EM TEMPO REAL
// ──────────────────────────────────────────────────
function weatherIcon(code) {
  if ([0, 1].includes(code)) return 'bi-sun-fill';
  if ([2, 3].includes(code)) return 'bi-cloud-sun-fill';
  if ([45, 48].includes(code)) return 'bi-cloud-fog-fill';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'bi-cloud-rain-fill';
  if ([95, 96, 99].includes(code)) return 'bi-cloud-lightning-rain-fill';
  return 'bi-cloud-fill';
}

function weatherDesc(code) {
  if ([0, 1].includes(code)) return 'Ensolarado — São Paulo, SP';
  if ([2, 3].includes(code)) return 'Parcialmente nublado — São Paulo, SP';
  if ([45, 48].includes(code)) return 'Neblina — São Paulo, SP';
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return 'Chuva — São Paulo, SP';
  if ([95, 96, 99].includes(code)) return 'Tempestade — São Paulo, SP';
  return 'Clima atual — São Paulo, SP';
}

async function carregarClimaSaoPaulo() {
  const card = document.getElementById('home-clima');
  const preview = document.getElementById('preview-clima');
  if (!card) return;
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=-23.55&longitude=-46.63&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo';
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Falha no clima');
    const data = await resp.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    card.innerHTML = `<i class="bi ${weatherIcon(code)}" style="font-size:2rem"></i><div><div class="temp">${temp}°C</div><div class="desc">${weatherDesc(code)}</div></div>`;
    if (preview) preview.textContent = `${temp}°C — São Paulo, SP`;
  } catch {
    card.innerHTML = '<i class="bi bi-cloud" style="font-size:2rem"></i><div><div class="temp">--°C</div><div class="desc">Clima indisponível — São Paulo, SP</div></div>';
    if (preview) preview.textContent = 'Clima indisponível';
  }
}

// ──────────────────────────────────────────────────
// 15. INICIALIZAÇÃO
// ──────────────────────────────────────────────────
function initApp() {
  consultas.forEach(normalizarConsulta);
  renderConsultas('todas');
  renderConquistas('todas');
  renderRanking();
  renderCalendar();
  selectedDay = new Date().getDate();
  selectDay(selectedDay);
  syncUserName();
  atualizarCardsHome();
  renderNotifications();
  carregarClimaSaoPaulo();
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarMascaraCPF(document.getElementById('login-cpf'));
  aplicarMascaraCPF(document.getElementById('cadastro-cpf'));
  aplicarMascaraCPF(document.getElementById('recuperar-cpf'));

  const pwdInput = document.getElementById('login-pwd');
  if (pwdInput) pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

  const cadastroSenha = document.getElementById('cadastro-senha');
  if (cadastroSenha) cadastroSenha.addEventListener('keydown', e => { if (e.key === 'Enter') criarCadastro(); });

  const novaSenha = document.getElementById('nova-senha');
  if (novaSenha) novaSenha.addEventListener('keydown', e => { if (e.key === 'Enter') alterarSenha(); });

  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

  const authModal = document.getElementById('auth-modal');
  if (authModal) authModal.addEventListener('click', e => { if (e.target === authModal) fecharModalAuth(); });

  const modalData = document.getElementById('modal-data');
  if (modalData) modalData.addEventListener('change', () => { if (modalData.value) _esconderErroData(); });

  renderNotifications();

  const style = document.createElement('style');
  style.textContent = `
    #cp-date-error{display:none;align-items:flex-start;gap:9px;background:#fef2f2;border:1.5px solid #fca5a5;color:#b91c1c;border-radius:10px;padding:11px 14px;font-size:.85rem;font-weight:600;margin-top:6px;margin-bottom:2px;line-height:1.45}#cp-date-error i{font-size:1rem;flex-shrink:0;margin-top:1px;color:#ef4444}#cp-date-error strong{color:#991b1b}#modal-data.cp-input-error{border-color:#ef4444!important;background:#fff8f8!important}@keyframes cpShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-8px)}30%{transform:translateX(8px)}45%{transform:translateX(-5px)}60%{transform:translateX(5px)}75%{transform:translateX(-2px)}90%{transform:translateX(2px)}}.cp-shake{animation:cpShake .38s ease}`;
  document.head.appendChild(style);
});

document.addEventListener('click', e => {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  if (panel && btn && !panel.contains(e.target) && !btn.contains(e.target)) panel.classList.remove('open');
});
