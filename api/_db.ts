import fs from 'fs';
import path from 'path';

// Storage paths
const LOCAL_FILE = path.join(process.cwd(), 'registrations.json');
const TMP_FILE = '/tmp/registrations.json';

function getFilePath(): string {
  // If running on Vercel / serverless (/tmp is writable)
  if (process.env.VERCEL) {
    return TMP_FILE;
  }
  return LOCAL_FILE;
}

export async function getRegistrations(): Promise<any[]> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl}/get/larinha_registrations`, {
        headers: { Authorization: `Bearer ${kvToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
        }
      }
    } catch (e) {
      console.error('KV Read Error:', e);
    }
  }

  // Fallback to file system
  const filePath = getFilePath();
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveRegistrations(registrations: any[]): Promise<void> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl}/set/larinha_registrations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${kvToken}` },
        body: JSON.stringify(registrations),
      });
      return;
    } catch (e) {
      console.error('KV Write Error:', e);
    }
  }

  // Fallback to file system
  const filePath = getFilePath();
  try {
    fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2), 'utf-8');
  } catch (e) {
    console.error('File write error:', e);
  }
}
