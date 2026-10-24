import OpenAI from 'openai';
import knowledge from '../lib/site-knowledge.mjs';
import { createChatHandler } from '../lib/chat-handler.mjs';

export default createChatHandler({
  knowledge,
  isConfigured: () => Boolean(process.env.OPENAI_API_KEY),
  complete: async messages => {
    // Netlify AI Gateway injects provider credentials at request time only.
    const client = new OpenAI({ timeout: 25000, maxRetries: 0 });
    const result = await client.chat.completions.create({
      model: process.env.CHAT_MODEL || 'gpt-4.1-mini',
      messages,
      max_completion_tokens: 650
    });
    return result.choices[0]?.message?.content;
  }
});

export const config = {
  path: '/api/chat',
  rateLimit: { action: 'rate_limit', aggregateBy: 'ip', windowSize: 60, windowLimit: 10 }
};
