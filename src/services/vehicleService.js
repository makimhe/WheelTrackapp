import BASE_URL from './api';
export async function getVehicles(){const r=await fetch(`${BASE_URL}/vehicles`); if(!r.ok) throw new Error('Erro ao buscar veículos'); return await r.json();}
