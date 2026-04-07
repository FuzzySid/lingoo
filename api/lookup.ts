import type { VercelRequest, VercelResponse } from '@vercel/node'

export interface DictionaryEntry {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  synonyms: string[]
  antonyms: string[]
  exampleSentence: string
}

export interface HindiEntry {
  word: string
  phonetic: string
  meaning: string
  synonyms: string[]
  antonyms: string[]
  sampleSentence: string
  hindiNuance: string
}

export interface SpanishEntry {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  synonyms: string[]
  antonyms: string[]
  exampleSentence: string
}

export interface TrilingualEntry {
  en: DictionaryEntry
  hi: HindiEntry
  es: SpanishEntry
}

const SYSTEM_PROMPT = `You are a trilingual dictionary API. When given a word (in any language), respond with ONLY a valid JSON object — no markdown, no commentary.

The JSON must have exactly three top-level keys: "en", "hi", and "es", following this schema:

{
  "en": {
    "word": "the English word",
    "phonetic": "IPA pronunciation string",
    "partOfSpeech": "Noun | Verb | Adjective | Adverb | etc.",
    "definition": "A clear, concise English definition (1–2 sentences)",
    "synonyms": ["up to 5 English synonyms"],
    "antonyms": ["up to 3 English antonyms"],
    "exampleSentence": "A natural English example sentence"
  },
  "hi": {
    "word": "the Hindi equivalent written in Hindi script (Devanagari)",
    "phonetic": "romanised transliteration of the Hindi word",
    "meaning": "the English meaning of the Hindi word (1–2 sentences)",
    "synonyms": ["up to 4 Hindi synonyms in Devanagari script"],
    "antonyms": ["up to 2 Hindi antonyms in Devanagari script"],
    "sampleSentence": "A complete, natural sentence in Hindi using the word",
    "hindiNuance": "Explain the grammatical gender of the Hindi word (masculine/feminine with the Hindi term स्त्रीलिंग or पुल्लिंग) and explicitly compare it to the Spanish equivalent's gender. Example format: 'In Hindi, [word] ([Devanagari]) is grammatically feminine (स्त्रीलिंग). Interestingly, while the English word is gender-neutral, the Spanish equivalent [spanish word] is masculine (masculino), yet they express the same idea.'"
  },
  "es": {
    "word": "the Spanish equivalent",
    "phonetic": "IPA pronunciation string",
    "partOfSpeech": "Spanish grammatical category (e.g. Sustantivo, Verbo, Adjetivo)",
    "definition": "A concise definition written in Spanish",
    "synonyms": ["up to 3 Spanish synonyms"],
    "antonyms": ["up to 2 Spanish antonyms"],
    "exampleSentence": "A natural example sentence in Spanish"
  }
}`

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { word } = req.body as { word?: string }
  if (!word || typeof word !== 'string' || !word.trim()) {
    return res.status(400).json({ error: 'Missing or invalid "word" in request body.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Server misconfiguration: OPENAI_API_KEY is not set.' })
  }

  const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: word.trim() },
      ],
      temperature: 0.2,
    }),
  })

  if (!openaiRes.ok) {
    const err = await openaiRes.json().catch(() => ({}))
    return res.status(openaiRes.status).json({
      error: (err as any)?.error?.message ?? `OpenAI API error: ${openaiRes.status}`,
    })
  }

  const json = await openaiRes.json()
  const content = json.choices?.[0]?.message?.content

  if (!content) {
    return res.status(502).json({ error: 'Empty response from OpenAI.' })
  }

  const entry: TrilingualEntry = JSON.parse(content)
  return res.status(200).json(entry)
}
