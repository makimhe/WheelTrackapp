import BASE_URL from './api';
export async function login(email,password){const r=await fetch(`${BASE_URL}/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})}); if(!r.ok) throw new Error('Erro ao fazer login'); return await r.json();}
