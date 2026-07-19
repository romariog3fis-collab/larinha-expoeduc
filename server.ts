import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SYSTEM_PROMPT } from './server-prompt.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Check for the OpenRouter API key, fail fast if missing
  if (!process.env.OPENROUTER_API_KEY) {
    console.warn('OPENROUTER_API_KEY is not configured. Chat will not work.');
  }

  // API Route for chat
  app.post('/api/chat', async (req, res) => {
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured.' });
    }

    try {
      const { history = [], message } = req.body;

      // Ensure the message format matches what the OpenRouter API expects
      const openRouterHistory = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.parts[0].text,
      }));

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'Larinha Teachy',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openrouter/free', // Using a free model on OpenRouter
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...openRouterHistory,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
         const errorData = await response.text();
         console.error('OpenRouter API error:', errorData);
         if (response.status === 429) {
            return res.status(429).json({ error: 'Quota exceeded' });
         }
         return res.status(500).json({ error: 'Failed to process chat message' });
      }

      const data = await response.json();
      res.json({ text: data.choices[0].message.content });
    } catch (error: any) {
      console.error('Error calling OpenRouter API:', error);
      if (error?.status === 429 || error?.message?.includes('429')) {
        res.status(429).json({ error: 'Quota exceeded' });
      } else {
        res.status(500).json({ error: 'Failed to process chat message' });
      }
    }
  });

  // Vite middleware for development
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
  });
}

startServer();
