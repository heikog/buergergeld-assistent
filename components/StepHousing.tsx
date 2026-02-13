'use client';

import { HousingData } from '@/lib/formLogic';

interface Props {
  data: HousingData;
  onChange: (data: HousingData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepHousing({ data, onChange, onNext, onBack }: Props) {
  const update = (field: keyof HousingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const canProceed = data.wohnart !== '';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">🏠 Wohnsituation</h2>
        <p className="text-blue-800">
          Angaben zu Ihrer Unterkunft. Diese werden für die Anlage KDU (Kosten der Unterkunft) benötigt.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Wohnen Sie zur Miete oder im Eigentum? *</label>
        <div className="flex gap-4">
          <button
            onClick={() => update('wohnart', 'miete')}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              data.wohnart === 'miete' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            🏢 Miete
          </button>
          <button
            onClick={() => update('wohnart', 'eigentum')}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              data.wohnart === 'eigentum' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            🏡 Eigentum
          </button>
        </div>
      </div>

      {data.wohnart === 'miete' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Grundmiete (kalt) €</label>
              <input
                type="text"
                value={data.grundmiete}
                onChange={(e) => update('grundmiete', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="z.B. 450"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nebenkosten €</label>
              <input
                type="text"
                value={data.nebenkosten}
                onChange={(e) => update('nebenkosten', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="z.B. 150"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Heizkosten €</label>
              <input
                type="text"
                value={data.heizkosten}
                onChange={(e) => update('heizkosten', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="z.B. 80"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Wohnfläche (m²)</label>
          <input
            type="text"
            value={data.wohnflaeche}
            onChange={(e) => update('wohnflaeche', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 65"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Anzahl Räume</label>
          <input
            type="text"
            value={data.anzahlRaeume}
            onChange={(e) => update('anzahlRaeume', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 3"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Personen im Haushalt</label>
          <input
            type="text"
            value={data.anzahlPersonen}
            onChange={(e) => update('anzahlPersonen', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Energiequelle Heizung</label>
          <select
            value={data.energiequelle}
            onChange={(e) => update('energiequelle', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white"
          >
            <option value="">Bitte wählen</option>
            <option value="gas">Gas</option>
            <option value="strom">Strom</option>
            <option value="oel">Öl</option>
            <option value="fernwaerme">Fernwärme</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Heizungsart</label>
          <select
            value={data.heizungsart}
            onChange={(e) => update('heizungsart', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white"
          >
            <option value="">Bitte wählen</option>
            <option value="zentral">Zentralheizung</option>
            <option value="einzel">Einzelofen</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors"
        >
          ← Zurück
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
