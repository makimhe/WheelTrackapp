import BASE_URL from './api';
export async function getNotifications(){const r=await fetch(`${BASE_URL}/notifications`); if(!r.ok) throw new Error('Erro ao buscar notificações'); return await r.json();}
