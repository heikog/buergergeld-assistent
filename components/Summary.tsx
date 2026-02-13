'use client';

import { useState } from 'react';
import { FormData, getRequiredForms, getDocumentChecklist } from '@/lib/formLogic';

interface Props {
  data: FormData;
  onBack: () => void;
}

export default function Summary({ data, onBack }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Download');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-emerald-900 mb-1">✅ Übersicht</h2>
        <p className="text-emerald-800">
          Prüfen Sie Ihre Angaben. Anschließend können Sie alle Formulare als ZIP-Datei herunterladen.
        </p>
      </div>

      {/* Personal */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">👤 Persönliche Daten</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Name:</span>
          <span className="font-medium">{data.personal.vorname} {data.personal.nachname}</span>
          <span className="text-gray-500">Geburtsdatum:</span>
          <span className="font-medium">{data.personal.geburtsdatum}</span>
          <span className="text-gray-500">Adresse:</span>
          <span className="font-medium">{data.personal.strasse} {data.personal.hausnummer}, {data.personal.plz} {data.personal.ort}</span>
          {data.personal.telefon && <>
            <span className="text-gray-500">Telefon:</span>
            <span className="font-medium">{data.personal.telefon}</span>
          </>}
        </div>
      </div>

      {/* Housing */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">🏠 Wohnung</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Wohnart:</span>
          <span className="font-medium">{data.housing.wohnart === 'miete' ? 'Miete' : 'Eigentum'}</span>
          {data.housing.grundmiete && <>
            <span className="text-gray-500">Grundmiete:</span>
            <span className="font-medium">{data.housing.grundmiete} €</span>
          </>}
          {data.housing.nebenkosten && <>
            <span className="text-gray-500">Nebenkosten:</span>
            <span className="font-medium">{data.housing.nebenkosten} €</span>
          </>}
          {data.housing.heizkosten && <>
            <span className="text-gray-500">Heizkosten:</span>
            <span className="font-medium">{data.housing.heizkosten} €</span>
          </>}
        </div>
      </div>

      {/* Family */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">👨‍👩‍👧‍👦 Familie</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Familienstand:</span>
          <span className="font-medium capitalize">{data.family.familienstand}</span>
          {data.family.hatPartner && data.family.partner && <>
            <span className="text-gray-500">Partner/in:</span>
            <span className="font-medium">{data.family.partner.vorname} {data.family.partner.nachname}</span>
          </>}
          <span className="text-gray-500">Kinder:</span>
          <span className="font-medium">{data.family.kinder.length === 0 ? 'Keine' : data.family.kinder.map(k => k.vorname).join(', ')}</span>
        </div>
      </div>

      {/* Income */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">💰 Einkommen</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Erwerbstätig:</span>
          <span className="font-medium">{data.income.hatEinkommen ? 'Ja' : 'Nein'}</span>
          {data.income.hatEinkommen && <>
            <span className="text-gray-500">Arbeitgeber:</span>
            <span className="font-medium">{data.income.arbeitgeber}</span>
          </>}
          {data.income.kindergeld && <>
            <span className="text-gray-500">Kindergeld:</span>
            <span className="font-medium">{data.income.kindergeld} €</span>
          </>}
        </div>
      </div>

      {/* Bank */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-2">🏧 Bankverbindung</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <span className="text-gray-500">Kontoinhaber:</span>
          <span className="font-medium">{data.bank.kontoinhaber}</span>
          <span className="text-gray-500">IBAN:</span>
          <span className="font-medium font-mono">{data.bank.iban}</span>
        </div>
      </div>

      {/* Required forms */}
      <div className="bg-blue-50 border rounded-lg p-4">
        <h3 className="font-bold text-blue-900 mb-2">📋 Folgende Formulare werden erstellt:</h3>
        <ul className="space-y-1">
          {requiredForms.map((f) => (
            <li key={f.id} className="flex items-center gap-2 text-sm">
              <span className="text-blue-500">✓</span>
              <span className="font-medium">{f.name}</span>
              {f.forPerson && <span className="text-gray-500">({f.forPerson})</span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Checklist */}
      <div className="bg-amber-50 border rounded-lg p-4">
        <h3 className="font-bold text-amber-900 mb-2">📎 Dokumente-Checkliste (bitte beilegen):</h3>
        <ul className="space-y-1">
          {checklist.map((doc, i) => (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span className="text-amber-500">☐</span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button onClick={onBack} className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          ← Zurück
        </button>
        <button
          onClick={handleDownload}
          disabled={loading}
          className="flex-1 px-8 py-4 bg-emerald-600 text-white text-lg font-bold rounded-lg hover:bg-emerald-700 disabled:bg-gray-400 transition-colors shadow-lg"
        >
          {loading ? '⏳ Formulare werden erstellt...' : '📥 Alle Formulare herunterladen (ZIP)'}
        </button>
      </div>
    </div>
  );
}
