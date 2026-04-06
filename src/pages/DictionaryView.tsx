import { useState } from 'react'
import { Search, Volume2, Info, Loader2 } from 'lucide-react'
import LanguageTabs from '../components/LanguageTabs'
import { useDictionary } from '../hooks/useDictionary'
import type { DictionaryEntry, HindiEntry, SpanishEntry } from '../services/dictionaryService'

type Language = 'en' | 'hi' | 'es'

function playAudio(word: string, lang = 'en-US') {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel()
  }
  const utterance = new SpeechSynthesisUtterance(word)
  utterance.lang = lang
  window.speechSynthesis.speak(utterance)
}

export default function DictionaryView() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en')
  const [query, setQuery] = useState('')
  const { data, loading, error, lookup } = useDictionary()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    lookup(query)
  }

  return (
    <div className="max-w-xl mx-auto px-6 mt-8">
      {/* Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center bg-surface-container-high rounded-xl p-1.5 focus-within:bg-surface-container-lowest focus-within:shadow-[0_20px_50px_-20px_rgba(53,37,205,0.15)] transition-all duration-300 mb-10"
      >
        <div className="pl-4 pr-3 text-on-surface-variant">
          <Search size={20} />
        </div>
        <input
          className="w-full bg-transparent border-none outline-none text-lg font-medium placeholder:text-on-surface-variant/50 py-3"
          placeholder="Search for a word..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Search
        </button>
      </form>

      {/* Language Tabs */}
      <div className="mb-12">
        <LanguageTabs current={currentLanguage} onChange={setCurrentLanguage} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-on-surface-variant">
          <Loader2 size={32} className="animate-spin text-primary" />
          <span className="text-sm font-medium tracking-wide">Looking it up...</span>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-error-container text-on-error-container px-6 py-4 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* Language-specific content */}
      {!loading && !error && (
        <>
          {currentLanguage === 'en' && <EnglishContent data={data?.en ?? null} />}
          {currentLanguage === 'hi' && <HindiContent data={data?.hi ?? null} />}
          {currentLanguage === 'es' && <SpanishContent data={data?.es ?? null} />}
        </>
      )}
    </div>
  )
}

/* ── English ───────────────────────────────────────────────── */

const HARDCODED_EN: DictionaryEntry = {
  word: 'Journey',
  phonetic: '/ˈdʒɜːni/',
  partOfSpeech: 'Noun',
  definition: 'An act of travelling from one place to another, especially when they are far apart.',
  synonyms: ['trip', 'expedition', 'voyage', 'trek'],
  antonyms: ['stagnation', 'stay', 'halt'],
  exampleSentence: 'The journey of a thousand miles begins with one step.',
}

function EnglishContent({ data }: { data: DictionaryEntry | null }) {
  const entry = data ?? HARDCODED_EN

  return (
    <article className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary/60">
            English Vocabulary
          </span>
          <h2 className="text-6xl font-black text-on-surface tracking-tighter leading-none">
            {entry.word}
          </h2>
          <div className="flex items-center gap-3 pt-2 text-on-surface-variant">
            <span className="text-lg font-medium italic">{entry.phonetic}</span>
            <button onClick={() => playAudio(entry.word, 'en-US')} className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary-fixed transition-colors text-primary active:scale-90">
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Definition */}
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 bg-surface-container-highest text-on-surface-variant rounded text-[11px] font-bold uppercase tracking-widest">
          {entry.partOfSpeech}
        </div>
        <p className="text-2xl leading-relaxed text-on-surface font-light">
          {entry.definition}
        </p>
      </div>

      {/* Synonyms & Antonyms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Synonyms
          </h3>
          <div className="flex flex-wrap gap-3">
            {entry.synonyms.map((w) => (
              <span key={w} className="px-5 py-2.5 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors cursor-pointer">
                {w}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
            Antonyms
          </h3>
          <div className="flex flex-wrap gap-3">
            {entry.antonyms.map((w) => (
              <span key={w} className="px-5 py-2.5 bg-red-50 text-red-700 rounded-full text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Quote / Example Card */}
      <div className="mt-8 rounded-lg overflow-hidden relative aspect-[16/9] bg-surface-container-high">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container/80 flex items-end p-8">
          <p className="text-white text-lg font-medium italic">
            "{entry.exampleSentence}"
          </p>
        </div>
      </div>
    </article>
  )
}

/* ── Hindi ─────────────────────────────────────────────────── */

const HARDCODED_HI: HindiEntry = {
  word: 'यात्रा',
  phonetic: 'Yātrā',
  meaning: 'The act of traveling from one place to another, especially over a long distance. A journey or voyage.',
  synonyms: ['सफ़र', 'भ्रमण', 'दौरा', 'पर्यटन'],
  antonyms: ['विराम', 'ठहराव'],
  sampleSentence: 'सफ़र की अपनी एक खूबसूरती होती है।',
  hindiNuance: "In Hindi, Yatra (यात्रा) is grammatically feminine (स्त्रीलिंग). Interestingly, while the English 'journey' is gender-neutral, the Spanish equivalent 'el viaje' is masculine (masculino), yet they express the exact same conceptual essence of movement.",
}

function HindiContent({ data }: { data: HindiEntry | null }) {
  const entry = data ?? HARDCODED_HI

  return (
    <section className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
          <span className="block text-primary font-bold tracking-widest text-[11px] uppercase mb-2">
            Noun • /{entry.phonetic}/
          </span>
          <h2 className="text-[3.5rem] font-black leading-none tracking-tighter text-on-surface">
            {entry.word}
          </h2>
        </div>
        <button onClick={() => playAudio(entry.word, 'hi-IN')} className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_20px_40px_-10px_rgba(53,37,205,0.3)] active:scale-95 transition-transform">
          <Volume2 size={24} />
        </button>
      </div>

      <div className="bg-surface-container-low p-8 rounded-lg">
        <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">
          Meaning
        </h3>
        <p className="text-xl leading-relaxed text-on-surface font-medium">
          {entry.meaning}
        </p>
      </div>

      <div className="bg-primary-container/10 p-8 rounded-lg border-l-4 border-primary">
        <div className="flex items-center gap-3 mb-4">
          <Info size={20} className="text-primary" />
          <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Hindi Nuance</h3>
        </div>
        <p className="text-lg text-on-surface leading-relaxed">
          {entry.hindiNuance}
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Synonyms (समानार्थी)
          </h3>
          <div className="flex flex-wrap gap-3">
            {entry.synonyms.map((w) => (
              <span key={w} className="px-6 py-3 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-semibold hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-colors cursor-pointer">
                {w}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
            Antonyms (विलोम)
          </h3>
          <div className="flex flex-wrap gap-3">
            {entry.antonyms.map((w) => (
              <span key={w} className="px-6 py-3 bg-surface-container-highest text-on-surface-variant rounded-full text-sm font-semibold hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-colors cursor-pointer">
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden h-64 relative bg-surface-container-high">
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 to-transparent flex items-end p-8">
          <p className="text-surface-container-lowest font-medium text-lg italic">
            "{entry.sampleSentence}"
          </p>
        </div>
      </div>
    </section>
  )
}

/* ── Spanish ───────────────────────────────────────────────── */

const HARDCODED_ES: SpanishEntry = {
  word: 'Viaje',
  phonetic: '/ˈbja.xe/',
  partOfSpeech: 'Sustantivo',
  definition: 'Acción y efecto de viajar. Recorrido que se hace de un lugar a otro por cualquier medio de locomoción.',
  synonyms: ['Trayecto', 'Recorrido', 'Expedición'],
  antonyms: ['Permanencia', 'Estadía'],
  exampleSentence: 'El viaje es tan importante como el destino.',
}

function SpanishContent({ data }: { data: SpanishEntry | null }) {
  const entry = data ?? HARDCODED_ES

  return (
    <article className="space-y-10">
      <header className="flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-[3.5rem] font-black tracking-tighter leading-none text-on-surface">
            {entry.word}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant font-medium tracking-wide text-sm">
              {entry.phonetic}
            </span>
            <span className="bg-surface-container-low px-3 py-0.5 rounded-full text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              {entry.partOfSpeech}
            </span>
          </div>
        </div>
        <button onClick={() => playAudio(entry.word, 'es-ES')} className="p-5 bg-primary-container text-on-primary-container rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_-10px_rgba(79,70,229,0.3)]">
          <Volume2 size={22} />
        </button>
      </header>

      <section className="space-y-4">
        <label className="text-[11px] font-medium tracking-wide uppercase text-on-surface-variant/70">
          Definición
        </label>
        <div className="bg-surface-container-low p-8 rounded-lg">
          <p className="text-xl text-on-surface leading-relaxed font-normal">
            {entry.definition}
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-surface-container-high">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 to-secondary/70 flex items-end p-6">
            <p className="text-white text-sm italic font-medium">
              "{entry.exampleSentence}"
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <label className="text-[11px] font-medium tracking-wide uppercase text-on-surface-variant/70">
              Sinónimos
            </label>
            <div className="flex flex-wrap gap-2">
              {entry.synonyms.map((w) => (
                <span key={w} className="bg-surface-variant text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-colors cursor-pointer">
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="text-[11px] font-medium tracking-wide uppercase text-on-surface-variant/70">
              Antónimos
            </label>
            <div className="flex flex-wrap gap-2">
              {entry.antonyms.map((w) => (
                <span key={w} className="bg-surface-variant text-on-surface-variant px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-colors cursor-pointer">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
