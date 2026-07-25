import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

const ADMIN_SECRET = 'Teachy@ExpoEduc26';

async function getRegistrations(): Promise<any[]> {
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

  const filePath = process.env.VERCEL ? '/tmp/registrations.json' : path.join(process.cwd(), 'registrations.json');
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = req.headers['x-admin-key'];
  if (key !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const registrations = await getRegistrations();
    return res.json({ registrations, total: registrations.length });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao carregar cadastros.' });
  }
}
