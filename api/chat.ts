import type { VercelRequest, VercelResponse } from '@vercel/node';
import { SYSTEM_PROMPT } from '../server-prompt.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!openRouterKey && !geminiKey) {
    return res.status(500).json({
      error: 'Chave de API não configurada. Defina GEMINI_API_KEY ou OPENROUTER_API_KEY nas variáveis de ambiente da Vercel.'
    });
  }

  try {
    const { history = [], message } = req.body || {};

    // Personalization from registration headers
    const userName = req.headers['x-user-name'] as string | undefined;
    const userRole = req.headers['x-user-role'] as string | undefined;

    let systemPrompt = SYSTEM_PROMPT;
    if (userName || userRole) {
      const personalizationNote = `\n\n## 5. PERSONALIZAÇÃO DO USUÁRIO ATUAL\n- **Nome:** ${userName || 'Educador(a)'}\n- **Perfil:** ${userRole || 'Educador'}\n- Sempre que possível, chame o usuário pelo primeiro nome (${userName || 'educador(a)'}) nas suas respostas, de forma natural e calorosa.`;
      systemPrompt = SYSTEM_PROMPT + personalizationNote;
    }

    // 1. Prioritize Gemini API directly via fetch
    if (geminiKey) {
      const contents = [
        ...(Array.isArray(history) ? history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.parts?.[0]?.text || '' }],
        })) : []),
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

    // 2. Fallback to OpenRouter API via fetch
    if (openRouterKey) {
      const openRouterHistory = Array.isArray(history)
        ? history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.parts?.[0]?.text || '',
          }))
        : [];

      const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': process.env.APP_URL || 'https://vercel.app',
          'X-Title': 'Larinha Teachy',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-flash-lite-001',
          messages: [
            { role: 'system', content: systemPrompt },
            ...openRouterHistory,
            { role: 'user', content: message }
          ],
          temperature: 0.7,
        })
      });

      if (!openRouterRes.ok) {
        const errorData = await openRouterRes.text();
        console.error('OpenRouter API error:', errorData);
        if (openRouterRes.status === 429) {
          return res.status(429).json({ error: 'Quota exceeded' });
        }
        return res.status(500).json({ error: 'Falha ao processar mensagem no OpenRouter.' });
      }

      const data = await openRouterRes.json();
      const reply = data.choices?.[0]?.message?.content || 'Não consegui obter uma resposta.';
      return res.json({ text: reply });
    }

    return res.status(500).json({ error: 'Nenhum provedor de IA respondeu com sucesso.' });
  } catch (error: any) {
    console.error('Error calling AI API:', error);
    if (error?.status === 429 || error?.message?.includes('429')) {
      return res.status(429).json({ error: 'Quota exceeded' });
    }
    return res.status(500).json({ error: error?.message || 'Falha ao processar mensagem do chat' });
  }
}
