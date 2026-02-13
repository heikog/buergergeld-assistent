'use client';

const STEPS = [
  { id: 'personal', label: 'Persönlich' },
  { id: 'housing', label: 'Wohnung' },
  { id: 'family', label: 'Familie' },
  { id: 'income', label: 'Einkommen' },
  { id: 'assets', label: 'Vermögen' },
  { id: 'bank', label: 'Bank' },
  { id: 'summary', label: 'Übersicht' },
];

interface Props {
  currentStep: number;
}

export default function ProgressBar({ currentStep }: Props) {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs mt-1 text-center hidden sm:block ${
                i === currentStep ? 'text-blue-600 font-semibold' : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}
