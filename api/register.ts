import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRegistrations, saveRegistrations } from './_db';

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
