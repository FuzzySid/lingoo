// NOTE: Vite exposes VITE_* env vars to the browser bundle.
// For a production app, proxy this call through a backend to keep the key server-side.
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY

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
  word: string           // in Hindi script, e.g. "यात्रा"
  phonetic: string       // romanised transliteration, e.g. "Yātrā"
  meaning: string        // English meaning
  synonyms: string[]     // Hindi script words
  antonyms: string[]     // Hindi script words
  sampleSentence: string // complete Hindi sentence
  hindiNuance: string    // grammatical gender note comparing Hindi & Spanish
}

export interface SpanishEntry {
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string     // Spanish definition
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

export async function lookupWord(word: string): Promise<TrilingualEntry> {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('OpenAI API key is not configured. Add VITE_OPENAI_API_KEY to your .env file.')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
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

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `API error: ${response.status}`)
  }

  const json = await response.json()
  const content = json.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('Empty response from OpenAI.')
  }

  return JSON.parse(content) as TrilingualEntry
}
