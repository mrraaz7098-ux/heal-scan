import { API_BASE_URL } from './config';

async function request(path, body) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export async function scanHealth(image, prompt) {
  const data = await request('/api/scan/health', { image, prompt });
  return data.result;
}

export async function scanFood(image, prompt) {
  const data = await request('/api/scan/food', { image, prompt });
  return data.result;
}

export async function pingServer() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    const data = await res.json();
    return data.ok === true;
  } catch (e) {
    return false;
  }
}
