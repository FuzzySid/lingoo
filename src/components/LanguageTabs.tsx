type Language = 'en' | 'hi' | 'es'

interface Props {
  current: Language
  onChange: (lang: Language) => void
}

const tabs: { id: Language; label: string }[] = [
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'Hindi' },
  { id: 'es', label: 'Spanish' },
]

export default function LanguageTabs({ current, onChange }: Props) {
  return (
    <div className="bg-surface-container-high p-1.5 rounded-lg flex items-center">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 py-2.5 text-sm font-semibold transition-all rounded-sm ${
            current === id
              ? 'bg-surface-container-lowest shadow-sm text-primary'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
