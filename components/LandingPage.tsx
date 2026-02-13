'use client';

interface Props {
  onStart: () => void;
}

export default function LandingPage({ onStart }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              B
            </div>
            <span className="font-bold text-gray-900 text-lg hidden sm:inline">Bürgergeld-Assistent</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
            <span className="hidden sm:inline">Daten bleiben im Browser</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="animate-fadeInUp">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></span>
            Kostenlos & datensicher
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
            Bürgergeld-Antrag<br />
            <span className="text-blue-600">in 10 Minuten</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Wir stellen die richtigen Fragen — in einfacher Sprache.<br className="hidden sm:block" />
            Sie bekommen fertige Formulare zum Ausdrucken.
          </p>
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Jetzt Antrag starten
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </section>

      {/* Value Props */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: 'Alle Formulare automatisch', desc: 'Hauptantrag, Anlagen KDU, EK, VM, KI — alles wird für Sie ausgefüllt.' },
            { icon: '💬', title: 'Einfache Sprache', desc: 'Keine Amtsdeutsch-Rätsel. Wir erklären jeden Schritt verständlich.' },
            { icon: '🔒', title: 'Kostenlos & datensicher', desc: 'Ihre Daten bleiben in Ihrem Browser. Nichts wird an Server übertragen.' },
          ].map((prop, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="text-3xl mb-3">{prop.icon}</div>
              <h3 className="font-bold text-gray-900 mb-1">{prop.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">So funktioniert&apos;s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Fragen beantworten', desc: 'Wir stellen Ihnen einfache Fragen — eine nach der anderen, wie in einem Chat.', emoji: '💬' },
              { step: '2', title: 'Formulare werden erstellt', desc: 'Aus Ihren Antworten füllen wir automatisch alle nötigen Anträge aus.', emoji: '⚙️' },
              { step: '3', title: 'PDF herunterladen', desc: 'Sie laden alles als ZIP herunter, drucken es aus und geben es beim Jobcenter ab.', emoji: '📥' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                  {s.emoji}
                </div>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Schritt {s.step}</div>
                <h3 className="font-bold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Privacy */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Ihre Daten sind sicher</h3>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            Alle Eingaben werden <strong>ausschließlich in Ihrem Browser</strong> verarbeitet. 
            Es werden keine Daten an Server übertragen oder gespeichert. 
            Nach dem Herunterladen werden alle Eingaben gelöscht.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 pb-16 text-center">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold px-8 py-4 rounded-2xl shadow-lg shadow-blue-600/25 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Jetzt kostenlos starten
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </button>
        <p className="text-sm text-gray-500 mt-3">Keine Registrierung nötig • Dauert ca. 10 Minuten</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500 space-y-2">
          <p>Ein Projekt von <strong>PromptPeak.ai</strong></p>
          <p>
            <a href="#" className="hover:text-gray-700 underline">Datenschutz</a>
            {' · '}
            <a href="#" className="hover:text-gray-700 underline">Impressum</a>
          </p>
          <p className="text-xs text-gray-400">
            Dieses Tool hilft beim Ausfüllen der offiziellen Formulare. Keine Rechtsberatung. Keine Gewähr.
          </p>
        </div>
      </footer>
    </div>
  );
}
