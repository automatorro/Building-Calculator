import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const model = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';

console.log('Testing Gemini with key:', apiKey?.slice(0, 10) + '...');
console.log('Using model:', model);

const client = new GoogleGenAI({
  apiKey: apiKey,
});

async function test() {
  try {
    console.log('Listing models...');
    const models = await client.models.list();
    for await (const model of models) {
      console.log('Model name:', model.name);
    }

    const modelToUse = 'gemini-3-flash-preview'; 
    console.log('Testing generateContent with:', modelToUse);

    const result = await client.models.generateContent({
      model: modelToUse,
      contents: [{ role: 'user', parts: [{ text: 'Say hello in Romanian' }] }],
    });
    
    console.log('Result:', result.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
