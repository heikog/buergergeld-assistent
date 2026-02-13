'use client';

import { AssetData } from '@/lib/formLogic';

interface Props {
  data: AssetData;
  onChange: (data: AssetData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepAssets({ data, onChange, onNext, onBack }: Props) {
  const update = (field: keyof AssetData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">🏦 Vermögen</h2>
        <p className="text-blue-800">
          Angaben zu Ihrem Vermögen. Diese werden für die Anlage VM benötigt. Seit der Karenzzeit (erstes Jahr) gilt ein erhöhter Freibetrag.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Bankguthaben (alle Konten) €</label>
        <input
          type="text"
          value={data.bankguthaben}
          onChange={(e) => update('bankguthaben', e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          placeholder="z.B. 3000"
        />
        <p className="text-sm text-gray-500 mt-1">Summe aller Girokonten, Sparkonten, Tagesgeld etc.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">KFZ / Auto (Bezeichnung)</label>
          <input
            type="text"
            value={data.auto}
            onChange={(e) => update('auto', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. VW Golf 2018"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Geschätzter Wert €</label>
          <input
            type="text"
            value={data.autoWert}
            onChange={(e) => update('autoWert', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 7500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Lebensversicherung (Rückkaufwert) €</label>
        <input
          type="text"
          value={data.lebensversicherung}
          onChange={(e) => update('lebensversicherung', e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          placeholder="z.B. 5000"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Besitzen Sie Immobilien (außer selbst bewohnt)?</label>
        <div className="flex gap-4">
          <button
            onClick={() => update('immobilien', true)}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              data.immobilien ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Ja
          </button>
          <button
            onClick={() => update('immobilien', false)}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              !data.immobilien ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Nein
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          ← Zurück
        </button>
        <button onClick={onNext} className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          Weiter →
        </button>
      </div>
    </div>
  );
}
