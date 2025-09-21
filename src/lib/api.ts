// API utility for FastAPI backend auth
export const API_URL = 'http://localhost:8001';

export async function loginApi(email: string, password: string) {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  const res = await fetch(`${API_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json(); // { access_token, token_type }
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}
