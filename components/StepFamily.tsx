'use client';

import { FamilyData } from '@/lib/formLogic';

interface Props {
  data: FamilyData;
  onChange: (data: FamilyData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepFamily({ data, onChange, onNext, onBack }: Props) {
  const canProceed = data.familienstand !== '';

  const addChild = () => {
    onChange({
      ...data,
      kinder: [...data.kinder, { vorname: '', nachname: '', geburtsdatum: '', geschlecht: '' }],
    });
  };

  const removeChild = (index: number) => {
    const newKinder = [...data.kinder];
    newKinder.splice(index, 1);
    onChange({ ...data, kinder: newKinder });
  };

  const updateChild = (index: number, field: string, value: string) => {
    const newKinder = [...data.kinder];
    newKinder[index] = { ...newKinder[index], [field]: value };
    onChange({ ...data, kinder: newKinder });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h2 className="text-xl font-bold text-blue-900 mb-1">👨‍👩‍👧‍👦 Familie</h2>
        <p className="text-blue-800">
          Angaben zu Ihrem Familienstand und Ihrer Bedarfsgemeinschaft. Partner und Kinder ab 15 werden als weitere Personen erfasst.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Familienstand *</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { value: 'ledig', label: 'Ledig' },
            { value: 'verheiratet', label: 'Verheiratet' },
            { value: 'geschieden', label: 'Geschieden' },
            { value: 'getrennt', label: 'Getrennt lebend' },
            { value: 'verwitwet', label: 'Verwitwet' },
            { value: 'lebenspartnerschaft', label: 'Eingetragene LP' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...data, familienstand: opt.value as FamilyData['familienstand'] })}
              className={`p-3 rounded-lg border-2 text-sm font-semibold transition-colors ${
                data.familienstand === opt.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Leben Sie mit einem/einer Partner/in zusammen?
        </label>
        <div className="flex gap-4">
          <button
            onClick={() => onChange({ ...data, hatPartner: true, partner: data.partner || { vorname: '', nachname: '', geburtsdatum: '', geschlecht: '', staatsangehoerigkeit: 'deutsch' } })}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              data.hatPartner ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Ja
          </button>
          <button
            onClick={() => onChange({ ...data, hatPartner: false, partner: undefined })}
            className={`flex-1 p-4 rounded-lg border-2 text-lg font-semibold transition-colors ${
              !data.hatPartner ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            Nein
          </button>
        </div>
      </div>

      {data.hatPartner && data.partner && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold text-gray-700">Partner/in</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Vorname</label>
              <input
                type="text"
                value={data.partner.vorname}
                onChange={(e) => onChange({ ...data, partner: { ...data.partner!, vorname: e.target.value } })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nachname</label>
              <input
                type="text"
                value={data.partner.nachname}
                onChange={(e) => onChange({ ...data, partner: { ...data.partner!, nachname: e.target.value } })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Geburtsdatum</label>
              <input
                type="text"
                value={data.partner.geburtsdatum}
                onChange={(e) => onChange({ ...data, partner: { ...data.partner!, geburtsdatum: e.target.value } })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                placeholder="TT.MM.JJJJ"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Geschlecht</label>
              <select
                value={data.partner.geschlecht}
                onChange={(e) => onChange({ ...data, partner: { ...data.partner!, geschlecht: e.target.value as 'maennlich' | 'weiblich' | 'divers' } })}
                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-lg bg-white"
              >
                <option value="">Bitte wählen</option>
                <option value="maennlich">Männlich</option>
                <option value="weiblich">Weiblich</option>
                <option value="divers">Divers</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-semibold text-gray-700">Kinder in Ihrem Haushalt</label>
          <button
            onClick={addChild}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 text-sm font-semibold transition-colors"
          >
            + Kind hinzufügen
          </button>
        </div>

        {data.kinder.map((kind, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg mb-3 space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-gray-700">Kind {i + 1}</h4>
              <button onClick={() => removeChild(i)} className="text-red-500 hover:text-red-700 text-sm font-semibold">
                Entfernen
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={kind.vorname}
                onChange={(e) => updateChild(i, 'vorname', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Vorname"
              />
              <input
                type="text"
                value={kind.nachname}
                onChange={(e) => updateChild(i, 'nachname', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Nachname"
              />
              <input
                type="text"
                value={kind.geburtsdatum}
                onChange={(e) => updateChild(i, 'geburtsdatum', e.target.value)}
                className="p-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="TT.MM.JJJJ"
              />
            </div>
          </div>
        ))}
        {data.kinder.length === 0 && (
          <p className="text-gray-500 text-sm">Keine Kinder angegeben.</p>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={onBack} className="px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          ← Zurück
        </button>
        <button onClick={onNext} disabled={!canProceed} className="flex-1 sm:flex-none px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
          Weiter →
        </button>
      </div>
    </div>
  );
}
