'use client';

import { BankData } from '@/lib/formLogic';

interface Props {
  data: BankData;
  applicantName: string;
  onChange: (data: BankData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepBank({ data, applicantName, onChange, onNext, onBack }: Props) {
  const update = (field: keyof BankData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const canProceed = data.kontoinhaber && data.iban;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">🏧 Bankverbindung</h2>
        <p className="text-blue-800">
          Auf dieses Konto werden die Leistungen überwiesen. Fast geschafft!
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Kontoinhaber/in *</label>
        <input
          type="text"
          value={data.kontoinhaber}
          onChange={(e) => update('kontoinhaber', e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          placeholder={applicantName || 'Vorname Nachname'}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">IBAN *</label>
        <input
          type="text"
          value={data.iban}
          onChange={(e) => update('iban', e.target.value.toUpperCase())}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg font-mono"
          placeholder="DE89 3704 0044 0532 0130 00"
          maxLength={27}
        />
        <p className="text-sm text-gray-500 mt-1">Die IBAN finden Sie auf Ihrer Bankkarte oder im Online-Banking.</p>
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          ← Zurück
        </button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          Zur Übersicht →
        </button>
      </div>
    </div>
  );
}
