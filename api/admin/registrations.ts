import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRegistrations } from '../_db';

const ADMIN_SECRET = 'Teachy@ExpoEduc26';

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
