// import { OPEN_AI_BASE_URL } from '../constants/openAI.js';
// import { IGptResponse } from '../interfaces/responses/gpt-api.js';
// import dotenv from 'dotenv';
// dotenv.config();

async function openAIRequest(prompt: string) {
  return fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', //'gpt-3.5-turbo-0125',//'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 1,
      max_tokens: 16383,
      top_p: 1,
      response_format: {
        type: 'json_object',
      },
    }),
  })
    .then((gptData) => gptData.json())
    .then((gptRes: any) => {
      const gptMessageString = gptRes.choices[0].message.content;
      return gptMessageString;
    })
    .catch((err) => err);
}

export default openAIRequest