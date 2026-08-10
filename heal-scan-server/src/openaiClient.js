const OpenAI = require('openai');
const { HEALTH_SYSTEM_PROMPT, FOOD_SYSTEM_PROMPT } = require('./prompts');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function validateBase64Image(image) {
  if (!image || typeof image !== 'string') {
    return 'Image is required as a base64 data URL or raw base64 string.';
  }
  const match = image.match(/^data:image\/(png|jpe?g|webp);base64,(.+)$/i);
  let mime = null;
  let base64 = image;
  if (match) {
    mime = match[1].toLowerCase();
    base64 = match[2];
  }
  const sizeBytes = Buffer.from(base64, 'base64').length;
  const maxBytes = Number(process.env.MAX_IMAGE_BYTES || 8_000_000);
  if (sizeBytes > maxBytes) {
    return `Image is too large (${(sizeBytes / 1e6).toFixed(1)}MB). Max is ${(maxBytes / 1e6).toFixed(0)}MB.`;
  }
  if (!mime) mime = 'jpeg';
  return { mime, base64, sizeBytes };
}

async function analyzeImage({ systemPrompt, base64Data, mime }) {
  const content = [
    {
      type: 'text',
      text: 'Analyze this image and respond in JSON.',
    },
    {
      type: 'image_url',
      image_url: {
        url: `data:image/${mime};base64,${base64Data}`,
      },
    },
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    max_tokens: 1200,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content },
    ],
  });

  const raw = response.choices[0].message.content;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    const extracted = raw.match(/\{[\s\S]*\}/);
    if (!extracted) throw new Error('AI did not return valid JSON.');
    parsed = JSON.parse(extracted[0]);
  }
  return parsed;
}

async function analyzeHealth({ base64Data, mime }) {
  return analyzeImage({ systemPrompt: HEALTH_SYSTEM_PROMPT, base64Data, mime });
}

async function analyzeFood({ base64Data, mime }) {
  return analyzeImage({ systemPrompt: FOOD_SYSTEM_PROMPT, base64Data, mime });
}

module.exports = { validateBase64Image, analyzeHealth, analyzeFood, MODEL };
