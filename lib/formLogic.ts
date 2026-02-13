// Determines which forms are needed based on user data

export interface PersonData {
  vorname: string;
  nachname: string;
  geburtsdatum: string;
  geschlecht: 'maennlich' | 'weiblich' | 'divers' | '';
  staatsangehoerigkeit: string;
  telefon: string;
  strasse: string;
  hausnummer: string;
  plz: string;
  ort: string;
}

export interface HousingData {
  wohnart: 'miete' | 'eigentum' | '';
  grundmiete: string;
  nebenkosten: string;
  heizkosten: string;
  wohnflaeche: string;
  anzahlRaeume: string;
  anzahlPersonen: string;
  energiequelle: string;
  heizungsart: string;
}

export interface FamilyData {
  familienstand: 'ledig' | 'verheiratet' | 'geschieden' | 'getrennt' | 'verwitwet' | 'lebenspartnerschaft' | '';
  hatPartner: boolean;
  partner?: {
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    geschlecht: 'maennlich' | 'weiblich' | 'divers' | '';
    staatsangehoerigkeit: string;
  };
  kinder: Array<{
    vorname: string;
    nachname: string;
    geburtsdatum: string;
    geschlecht: 'maennlich' | 'weiblich' | 'divers' | '';
  }>;
}

export interface IncomeData {
  hatEinkommen: boolean;
  arbeitgeber: string;
  brutto: string;
  netto: string;
  kindergeld: string;
  unterhalt: string;
  spilestigesEinkommen: string;
  partnerHatEinkommen: boolean;
  partnerArbeitgeber: string;
  partnerBrutto: string;
  partnerNetto: string;
}

export interface AssetData {
  bankguthaben: string;
  auto: string;
  autoWert: string;
  immobilien: boolean;
  lebensversicherung: string;
}

export interface BankData {
  kontoinhaber: string;
  iban: string;
}

export interface FormData {
  personal: PersonData;
  housing: HousingData;
  family: FamilyData;
  income: IncomeData;
  assets: AssetData;
  bank: BankData;
}

export interface RequiredForm {
  id: string;
  name: string;
  filename: string;
  description: string;
  forPerson?: string; // e.g. "Max Mustermann" or "Kind: Anna"
}

function getAge(geburtsdatum: string): number {
  const parts = geburtsdatum.split('.');
  if (parts.length !== 3) return 0;
  const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
}

export function getRequiredForms(data: FormData): RequiredForm[] {
  const forms: RequiredForm[] = [];

  // Always: Hauptantrag
  forms.push({
    id: 'hauptantrag',
    name: 'Hauptantrag (HA)',
    filename: 'hauptantrag.pdf',
    description: 'Hauptantrag auf Bürgergeld',
  });

  // Always: Anlage KDU
  forms.push({
    id: 'anlage-kdu',
    name: 'Anlage KDU',
    filename: 'anlage-kdu.pdf',
    description: 'Kosten der Unterkunft und Heizung',
  });

  // Always: Anlage VM
  forms.push({
    id: 'anlage-vm',
    name: 'Anlage VM',
    filename: 'anlage-vm.pdf',
    description: 'Vermögen',
  });

  // If income: Anlage EK for applicant
  if (data.income.hatEinkommen) {
    forms.push({
      id: 'anlage-ek',
      name: 'Anlage EK',
      filename: 'anlage-ek.pdf',
      description: 'Einkommen',
      forPerson: `${data.personal.vorname} ${data.personal.nachname}`,
    });
  }

  // If partner income: Anlage EK for partner
  if (data.income.partnerHatEinkommen && data.family.partner) {
    forms.push({
      id: 'anlage-ek-partner',
      name: 'Anlage EK (Partner/in)',
      filename: 'anlage-ek.pdf',
      description: 'Einkommen Partner/in',
      forPerson: `${data.family.partner.vorname} ${data.family.partner.nachname}`,
    });
  }

  // Partner → Anlage WEP
  if (data.family.hatPartner && data.family.partner) {
    forms.push({
      id: 'anlage-wep-partner',
      name: 'Anlage WEP (Partner/in)',
      filename: 'anlage-wep.pdf',
      description: 'Weitere Personen der Bedarfsgemeinschaft',
      forPerson: `${data.family.partner.vorname} ${data.family.partner.nachname}`,
    });
  }

  // Children
  data.family.kinder.forEach((kind, index) => {
    const age = getAge(kind.geburtsdatum);
    if (age < 15) {
      forms.push({
        id: `anlage-ki-${index}`,
        name: `Anlage KI (${kind.vorname})`,
        filename: 'anlage-ki.pdf',
        description: `Kind unter 15: ${kind.vorname} ${kind.nachname}`,
        forPerson: `${kind.vorname} ${kind.nachname}`,
      });
    } else {
      forms.push({
        id: `anlage-wep-kind-${index}`,
        name: `Anlage WEP (${kind.vorname})`,
        filename: 'anlage-wep.pdf',
        description: `Kind ab 15: ${kind.vorname} ${kind.nachname}`,
        forPerson: `${kind.vorname} ${kind.nachname}`,
      });
    }
  });

  return forms;
}

export function getDocumentChecklist(data: FormData): string[] {
  const docs: string[] = [
    'Personalausweis oder Reisepass (Kopie)',
  ];

  if (data.housing.wohnart === 'miete') {
    docs.push('Mietvertrag (Kopie)');
    docs.push('Letzte Nebenkostenabrechnung');
  }

  if (data.income.hatEinkommen) {
    docs.push('Lohnabrechnungen der letzten 3 Monate');
    docs.push('Arbeitsvertrag (Kopie)');
  }

  if (data.income.kindergeld) {
    docs.push('Kindergeldbescheid');
  }

  if (data.assets.bankguthaben) {
    docs.push('Kontoauszüge der letzten 3 Monate (alle Konten)');
  }

  if (data.assets.auto) {
    docs.push('KFZ-Schein / Fahrzeugbrief (Kopie)');
  }

  if (data.assets.lebensversicherung) {
    docs.push('Nachweis Lebensversicherung');
  }

  if (data.family.hatPartner) {
    docs.push('Personalausweis Partner/in (Kopie)');
    if (data.family.familienstand === 'verheiratet') {
      docs.push('Heiratsurkunde (Kopie)');
    }
  }

  if (data.family.kinder.length > 0) {
    docs.push('Geburtsurkunde(n) der Kinder');
  }

  docs.push('Bescheid über Arbeitslosengeld I (falls vorhanden)');
  docs.push('Krankenversicherungsnachweis');

  return docs;
}

export const emptyFormData: FormData = {
  personal: {
    vorname: '',
    nachname: '',
    geburtsdatum: '',
    geschlecht: '',
    staatsangehoerigkeit: 'deutsch',
    telefon: '',
    strasse: '',
    hausnummer: '',
    plz: '',
    ort: '',
  },
  housing: {
    wohnart: '',
    grundmiete: '',
    nebenkosten: '',
    heizkosten: '',
    wohnflaeche: '',
    anzahlRaeume: '',
    anzahlPersonen: '1',
    energiequelle: '',
    heizungsart: '',
  },
  family: {
    familienstand: '',
    hatPartner: false,
    kinder: [],
  },
  income: {
    hatEinkommen: false,
    arbeitgeber: '',
    brutto: '',
    netto: '',
    kindergeld: '',
    unterhalt: '',
    spilestigesEinkommen: '',
    partnerHatEinkommen: false,
    partnerArbeitgeber: '',
    partnerBrutto: '',
    partnerNetto: '',
  },
  assets: {
    bankguthaben: '',
    auto: '',
    autoWert: '',
    immobilien: false,
    lebensversicherung: '',
  },
  bank: {
    kontoinhaber: '',
    iban: '',
  },
};
