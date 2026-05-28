import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.15.71:8081';

async function authHeaders() {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.erro || 'Erro ao comunicar com o servidor.');
  }

  return data;
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export async function loginApi(email, senha) {
  return requestJson('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha }),
  });
}

// ─── USUÁRIO ──────────────────────────────────────────────────────────────────
export async function getVeiculosDoUsuario(idUsuario) {
  const headers = await authHeaders();
  return requestJson(`/usuario/${idUsuario}/veiculos`, { headers });
}

// ─── BLINDAGEM ────────────────────────────────────────────────────────────────
export async function getBlindagens() {
  const headers = await authHeaders();
  return requestJson('/blindagem', { headers });
}

export async function getBlindagemPorPlaca(placa) {
  const todas = await getBlindagens();
  return todas.find((b) => b.veiculo?.placa === placa || b.placa_veiculo === placa) || null;
}

// ─── ETAPAS ───────────────────────────────────────────────────────────────────
export async function getEtapasPorBlindagem(idBlindagem) {
  const headers = await authHeaders();
  const todas = await requestJson('/etapa_blindagem', { headers });

  return todas.filter((e) => {
    const etapaBlindagemId = e.id_blindagem || e.blindagem_id || e.blindagem?.id;
    return String(etapaBlindagemId) === String(idBlindagem);
  });
}

// ─── MANUTENÇÃO ───────────────────────────────────────────────────────────────
export async function getManutencoesDoVeiculo(placa) {
  const headers = await authHeaders();
  const todas = await requestJson('/manutencao', { headers });

  return todas.filter((m) => {
    const placaManutencao = m.placa_veiculo || m.veiculo?.placa || m.placa;
    return placaManutencao === placa;
  });
}

// ─── DOCUMENTOS ───────────────────────────────────────────────────────────────
export async function getDocumentosPorBlindagem(idBlindagem) {
  const headers = await authHeaders();
  const todos = await requestJson('/documento', { headers });

  return todos.filter((doc) => {
    const docBlindagemId = doc.id_blindagem || doc.blindagem_id || doc.blindagem?.id;
    return String(docBlindagemId) === String(idBlindagem);
  });
}

export async function getDocumentosPorPlaca(placa) {
  const headers = await authHeaders();
  return requestJson(`/documento/veiculo/${encodeURIComponent(placa)}`, { headers });
}

export function getDocumentoDownloadUrl(idDocumento) {
  return `${API_URL}/documento/download/${idDocumento}`;
}

// ─── NOTIFICAÇÕES ─────────────────────────────────────────────────────────────
export async function getNotificacoesDoUsuario(idUsuario) {
  const headers = await authHeaders();
  return requestJson(`/usuario/${idUsuario}/notificacoes`, { headers });
}

export default API_URL;