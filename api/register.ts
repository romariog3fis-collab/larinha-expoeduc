import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

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

async function saveRegistrations(registrations: any[]): Promise<void> {
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

  const filePath = process.env.VERCEL ? '/tmp/registrations.json' : path.join(process.cwd(), 'registrations.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(registrations, null, 2), 'utf-8');
  } catch (e) {
    console.error('File write error:', e);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, school, city, role, contact, email, consentedAt, consentVersion } = req.body || {};

    if (!name || !school || !city || !role || !contact) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const profile = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).trim(),
      school: String(school).trim(),
      city: String(city).trim(),
      role: String(role).trim(),
      contact: String(contact).trim(),
      email: email ? String(email).trim() : undefined,
      registeredAt: new Date().toISOString(),
      consentedAt: consentedAt || new Date().toISOString(),
      consentVersion: consentVersion || '1.0',
      ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown',
    };

    const registrations = await getRegistrations();
    registrations.push(profile);
    await saveRegistrations(registrations);

    console.log(`[VERCEL REGISTER] ${profile.name} — ${profile.role} — ${profile.city}`);
    return res.status(201).json({ profile });
  } catch (error) {
    console.error('Error saving registration:', error);
    return res.status(500).json({ error: 'Erro ao salvar cadastro.' });
  }
}
