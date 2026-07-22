import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SYSTEM_PROMPT } from '../server-prompt';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured.' });
  }

  try {
    const { history = [], message } = req.body || {};

    const openRouterHistory = Array.isArray(history)
      ? history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.parts?.[0]?.text || '',
        }))
      : [];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'https://vercel.app',
        'X-Title': 'Larinha Teachy',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openrouter/free',
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
    return res.json({ text: data.choices[0].message.content });
  } catch (error: any) {
    console.error('Error calling OpenRouter API:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }
    return res.status(500).json({ error: 'Failed to process chat message' });
  }
}
