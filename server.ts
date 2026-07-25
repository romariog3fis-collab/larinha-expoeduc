import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { SYSTEM_PROMPT } from './server-prompt.ts';

const REGISTRATIONS_FILE = path.join(process.cwd(), 'registrations.json');
const ADMIN_SECRET = 'Teachy@ExpoEduc26';

// ── Helper: load/save registrations ──────────────────────────────────
function loadRegistrations(): any[] {
  try {
    if (!fs.existsSync(REGISTRATIONS_FILE)) return [];
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveRegistrations(data: any[]): void {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ── API: Health check ────────────────────────────────────────────
  if (!process.env.OPENROUTER_API_KEY && !process.env.GEMINI_API_KEY) {
    console.warn('⚠️  [AVISO] Nenhuma chave de API (OPENROUTER_API_KEY ou GEMINI_API_KEY) foi encontrada no ambiente.');
  }

  // ── API: Register new user ────────────────────────────────────────
  app.post('/api/register', (req, res) => {
    try {
      const { name, school, city, role, contact, email, consentedAt, consentVersion } = req.body;

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

      const registrations = loadRegistrations();
      registrations.push(profile);
      saveRegistrations(registrations);

      console.log(`[REGISTER] ${profile.name} — ${profile.role} — ${profile.city}`);
      return res.status(201).json({ profile });
    } catch (error) {
      console.error('Error saving registration:', error);
      return res.status(500).json({ error: 'Erro ao salvar cadastro.' });
    }
  });

  // ── API: Admin — list registrations ──────────────────────────────
  app.get('/api/admin/registrations', (req, res) => {
    const key = req.headers['x-admin-key'];
    if (key !== ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
      const registrations = loadRegistrations();
      return res.json({ registrations, total: registrations.length });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao carregar cadastros.' });
    }
  });

  // ── API: Chat ─────────────────────────────────────────────────────
  app.post('/api/chat', async (req, res) => {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openRouterKey && !geminiKey) {
      return res.status(500).json({
        error: 'Chave de API não configurada. Defina OPENROUTER_API_KEY ou GEMINI_API_KEY no arquivo .env ou no painel da Vercel.'
      });
    }

    try {
      const { history = [], message } = req.body;

      // Personalization from registration headers
      const userName = req.headers['x-user-name'] as string | undefined;
      const userRole = req.headers['x-user-role'] as string | undefined;

      // Build personalized system prompt
      let systemPrompt = SYSTEM_PROMPT;
      if (userName || userRole) {
        const personalizationNote = `\n\n## 5. PERSONALIZAÇÃO DO USUÁRIO ATUAL\n- **Nome:** ${userName || 'Educador(a)'}\n- **Perfil:** ${userRole || 'Educador'}\n- Sempre que possível, chame o usuário pelo primeiro nome (${userName || 'educador(a)'}) nas suas respostas, de forma natural e calorosa.`;
        systemPrompt = SYSTEM_PROMPT + personalizationNote;
      }

      // Prioritize Gemini API if available via direct REST fetch
      if (geminiKey) {
        const contents = [
          ...history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.parts?.[0]?.text || '' }],
          })),
          { role: 'user', parts: [{ text: message }] }
        ];

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: {
                parts: [{ text: systemPrompt }]
              },
              contents,
              generationConfig: {
                temperature: 0.7
              }
            })
          }
        );

        if (!geminiRes.ok) {
          const errText = await geminiRes.text();
          console.error('Gemini REST API error:', errText);
          if (geminiRes.status === 429) {
            return res.status(429).json({ error: 'Quota exceeded' });
          }
          return res.status(500).json({ error: 'Erro ao comunicar com a API do Gemini.' });
        }

        const data = await geminiRes.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.json({ text });
        }
      }

      // Fallback to OpenRouter API
      if (openRouterKey) {
        const openRouterHistory = history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.parts?.[0]?.text || '',
        }));

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
            'X-Title': 'Larinha Teachy',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.0-flash-lite-001',
            messages: [
              { role: 'system', content: systemPrompt },
              ...openRouterHistory,
              { role: 'user', content: message },
            ],
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('OpenRouter API error:', errorData);
          if (response.status === 429) {
            return res.status(429).json({ error: 'Quota exceeded' });
          }
          return res.status(500).json({ error: 'Falha ao processar mensagem no OpenRouter.' });
        }

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || 'Não consegui obter uma resposta.';
        return res.json({ text: reply });
      }
    } catch (error: any) {
      console.error('Error calling AI API:', error);
      if (error?.status === 429 || error?.message?.includes('429')) {
        return res.status(429).json({ error: 'Quota exceeded' });
      }
      return res.status(500).json({ error: error?.message || 'Falha ao processar mensagem do chat' });
    }
  });

  // ── Vite / Static ─────────────────────────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
  });
}

startServer();
