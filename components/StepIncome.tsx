'use client';

import { IncomeData } from '@/lib/formLogic';

interface Props {
  data: IncomeData;
  hasPartner: boolean;
  onChange: (data: IncomeData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepIncome({ data, hasPartner, onChange, onNext, onBack }: Props) {
  const update = (field: keyof IncomeData, value: string | boolean) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">💰 Einkommen</h2>
        <p className="text-blue-800">
          Angaben zu Ihrem Einkommen. Falls Sie oder Ihr/e Partner/in Einkommen haben, wird die Anlage EK erstellt.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Sind Sie derzeit erwerbstätig?</label>
        <div className="flex gap-4">
          <button
            onClick={() => update('hatEinkommen', true)}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              data.hatEinkommen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Ja
          </button>
          <button
            onClick={() => update('hatEinkommen', false)}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              !data.hatEinkommen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Nein
          </button>
        </div>
      </div>

      {data.hatEinkommen && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Ihr Einkommen</h3>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Arbeitgeber</label>
            <input
              type="text"
              value={data.arbeitgeber}
              onChange={(e) => update('arbeitgeber', e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              placeholder="Name des Arbeitgebers"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bruttoeinkommen € / Monat</label>
              <input
                type="text"
                value={data.brutto}
                onChange={(e) => update('brutto', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="z.B. 1200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nettoeinkommen € / Monat</label>
              <input
                type="text"
                value={data.netto}
                onChange={(e) => update('netto', e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="z.B. 950"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Kindergeld € / Monat</label>
          <input
            type="text"
            value={data.kindergeld}
            onChange={(e) => update('kindergeld', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 250"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Unterhalt € / Monat</label>
          <input
            type="text"
            value={data.unterhalt}
            onChange={(e) => update('unterhalt', e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
            placeholder="z.B. 300"
          />
        </div>
      </div>

      {hasPartner && (
        <div className="border-t pt-4 space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ist Ihr/e Partner/in erwerbstätig?</label>
          <div className="flex gap-4">
            <button
              onClick={() => update('partnerHatEinkommen', true)}
              className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
                data.partnerHatEinkommen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Ja
            </button>
            <button
              onClick={() => update('partnerHatEinkommen', false)}
              className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
                !data.partnerHatEinkommen ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Nein
            </button>
          </div>

          {data.partnerHatEinkommen && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Arbeitgeber Partner/in</label>
                <input
                  type="text"
                  value={data.partnerArbeitgeber}
                  onChange={(e) => update('partnerArbeitgeber', e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Brutto € / Monat</label>
                  <input
                    type="text"
                    value={data.partnerBrutto}
                    onChange={(e) => update('partnerBrutto', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Netto € / Monat</label>
                  <input
                    type="text"
                    value={data.partnerNetto}
                    onChange={(e) => update('partnerNetto', e.target.value)}
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
