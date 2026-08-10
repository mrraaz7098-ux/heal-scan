import { API_BASE_URL } from './config';
import { getUserId } from './storage';

async function request(path, body, method = 'POST') {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
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

export async function pushCloudScan(scan) {
  const userId = await getUserId();
  const data = await request('/api/sync/push', { userId, scan });
  return data.synced === true;
}

export async function fetchCloudHistory() {
  const userId = await getUserId();
  const res = await fetch(
    `${API_BASE_URL}/api/sync/history?userId=${encodeURIComponent(userId)}`
  );
  const data = await res.json().catch(() => ({}));
  if (data.ok === true && Array.isArray(data.scans)) {
    return data.scans;
  }
  throw new Error(data.error || 'Cloud sync unavailable');
}
