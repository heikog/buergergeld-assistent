'use client';

import { PersonData } from '@/lib/formLogic';

interface Props {
  data: PersonData;
  onChange: (data: PersonData) => void;
  onNext: () => void;
}

export default function StepPersonal({ data, onChange, onNext }: Props) {
  const update = (field: keyof PersonData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const canProceed = data.vorname && data.nachname && data.geburtsdatum && data.strasse && data.plz && data.ort;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">👋 Willkommen!</h2>
        <p className="text-blue-800">
          Lassen Sie uns mit Ihren persönlichen Daten beginnen. Diese Angaben werden für den Hauptantrag benötigt.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Vorname *</label>
          <input
            type="text"
            value={data.vorname}
            onChange={(e) => update('vorname', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. Max"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Nachname *</label>
          <input
            type="text"
            value={data.nachname}
            onChange={(e) => update('nachname', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. Mustermann"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Geburtsdatum *</label>
          <input
            type="text"
            value={data.geburtsdatum}
            onChange={(e) => update('geburtsdatum', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="TT.MM.JJJJ"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Geschlecht</label>
          <select
            value={data.geschlecht}
            onChange={(e) => update('geschlecht', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white"
          >
            <option value="">Bitte wählen</option>
            <option value="maennlich">Männlich</option>
            <option value="weiblich">Weiblich</option>
            <option value="divers">Divers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Staatsangehörigkeit</label>
          <input
            type="text"
            value={data.staatsangehoerigkeit}
            onChange={(e) => update('staatsangehoerigkeit', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. deutsch"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Telefon</label>
          <input
            type="tel"
            value={data.telefon}
            onChange={(e) => update('telefon', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 0151 12345678"
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-3">📍 Anschrift</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Straße *</label>
            <input
              type="text"
              value={data.strasse}
              onChange={(e) => update('strasse', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="z.B. Musterstraße"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nr. *</label>
            <input
              type="text"
              value={data.hausnummer}
              onChange={(e) => update('hausnummer', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="42"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">PLZ *</label>
            <input
              type="text"
              value={data.plz}
              onChange={(e) => update('plz', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="12345"
              maxLength={5}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ort *</label>
            <input
              type="text"
              value={data.ort}
              onChange={(e) => update('ort', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="z.B. Berlin"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Weiter →
      </button>
    </div>
  );
}
