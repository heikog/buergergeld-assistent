'use client';

import { useState } from 'react';
import { FormData, getRequiredForms, getDocumentChecklist } from '@/lib/formLogic';

interface Props {
  data: FormData;
  onRestart: () => void;
}

export default function ResultsPage({ data, onRestart }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false);
  const requiredForms = getRequiredForms(data);
  const checklist = getDocumentChecklist(data);

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Unbekannter Fehler');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Buergergeld-Antrag-${data.personal.nachname || 'Formulare'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloaded(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-white">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow">
              ✓
            </div>
            <span className="font-bold text-gray-900 text-sm">Ihre Formulare sind fertig!</span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Success banner */}
        <div className="text-center animate-fadeInUp">
          <div className="text-5xl mb-3">🎉</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Ihre Formulare sind fertig!
          </h1>
          <p className="text-gray-600">
            Für <strong>{data.personal.vorname} {data.personal.nachname}</strong> wurden {requiredForms.length} Formulare erstellt.
          </p>
        </div>

        {/* Download button (primary) */}
        <div className="animate-fadeInUp" style={{ animationDelay: '100ms' }}>
          <button
            onClick={handleDownload}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white text-lg font-bold py-4 px-6 rounded-2xl shadow-lg shadow-green-600/25 hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Formulare werden erstellt…
              </>
            ) : downloaded ? (
              <>✅ Nochmal herunterladen</>
            ) : (
              <>📥 Alle Formulare herunterladen (ZIP)</>
            )}
          </button>
          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Forms list */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp" style={{ animationDelay: '200ms' }}>
          <div className="px-5 py-4 border-b border-gray-50 bg-blue-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span>📋</span> Erstellte Formulare
            </h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {requiredForms.map((form) => (
              <li key={form.id} className="px-5 py-3 flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✅</span>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{form.name}</p>
                  <p className="text-gray-500 text-xs">
                    {form.description}
                    {form.forPerson && ` — für ${form.forPerson}`}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Document checklist */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-fadeInUp" style={{ animationDelay: '300ms' }}>
          <div className="px-5 py-4 border-b border-gray-50 bg-amber-50/50">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <span>📎</span> Bitte legen Sie diese Dokumente bei
            </h2>
            <p className="text-xs text-gray-500 mt-1">Basierend auf Ihren Angaben</p>
          </div>
          <ul className="divide-y divide-gray-50">
            {checklist.map((doc, i) => (
              <li key={i} className="px-5 py-3 flex items-center gap-3">
                <span className="text-amber-400 text-lg">☐</span>
                <span className="text-gray-700 text-sm">{doc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
          <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
            <span>📝</span> So geht es weiter
          </h3>
          <ol className="text-blue-800 text-sm space-y-2">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Laden Sie die ZIP-Datei herunter und entpacken Sie diese.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Drucken Sie alle Formulare aus.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span><strong>Unterschreiben</strong> Sie alle Formulare (auf der letzten Seite).</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Sammeln Sie die oben genannten Dokumente als Kopien.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">5.</span>
              <span>Geben Sie alles persönlich bei Ihrem <strong>Jobcenter</strong> ab oder senden Sie es per Post.</span>
            </li>
          </ol>
        </div>

        {/* Privacy reminder */}
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100 animate-fadeInUp" style={{ animationDelay: '500ms' }}>
          <p className="text-green-800 text-sm flex items-start gap-2">
            <span className="text-lg">🔒</span>
            <span>
              Ihre Daten wurden <strong>ausschließlich in Ihrem Browser</strong> verarbeitet. 
              Beim Verlassen dieser Seite werden alle Eingaben gelöscht. 
              Es wurden keine Daten an Server übertragen oder gespeichert.
            </span>
          </p>
        </div>

        {/* Restart */}
        <div className="text-center pt-4 pb-8 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
          <button
            onClick={onRestart}
            className="text-gray-500 hover:text-gray-700 text-sm underline transition-colors"
          >
            Neuen Antrag starten
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center text-sm text-gray-500 space-y-1">
          <p>Ein Projekt von <strong>PromptPeak.ai</strong></p>
          <p>
            <a href="#" className="hover:text-gray-700 underline">Datenschutz</a>
            {' · '}
            <a href="#" className="hover:text-gray-700 underline">Impressum</a>
          </p>
          <p className="text-xs text-gray-400">Keine Rechtsberatung. Keine Gewähr für Vollständigkeit.</p>
        </div>
      </footer>
    </div>
  );
}
