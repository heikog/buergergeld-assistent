'use client';

import { useState } from 'react';
import { FormData, emptyFormData } from '@/lib/formLogic';
import ProgressBar from './ProgressBar';
import StepPersonal from './StepPersonal';
import StepHousing from './StepHousing';
import StepFamily from './StepFamily';
import StepIncome from './StepIncome';
import StepAssets from './StepAssets';
import StepBank from './StepBank';
import Summary from './Summary';

export default function ChatWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(emptyFormData);

  return (
    <div className="max-w-2xl mx-auto">
      <ProgressBar currentStep={step} />

      {step === 0 && (
        <StepPersonal
          data={data.personal}
          onChange={(personal) => setData({ ...data, personal })}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <StepHousing
          data={data.housing}
          onChange={(housing) => setData({ ...data, housing })}
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        />
      )}
      {step === 2 && (
        <StepFamily
          data={data.family}
          onChange={(family) => setData({ ...data, family })}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <StepIncome
          data={data.income}
          hasPartner={data.family.hatPartner}
          onChange={(income) => setData({ ...data, income })}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <StepAssets
          data={data.assets}
          onChange={(assets) => setData({ ...data, assets })}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <StepBank
          data={data.bank}
          applicantName={`${data.personal.vorname} ${data.personal.nachname}`}
          onChange={(bank) => setData({ ...data, bank })}
          onNext={() => setStep(6)}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <Summary data={data} onBack={() => setStep(5)} />
      )}
    </div>
  );
}
