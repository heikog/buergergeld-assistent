// Conversational question definitions with smart flow logic
import { FormData } from './formLogic';

export type QuestionType = 'text' | 'select' | 'date' | 'number' | 'choice' | 'iban' | 'phone' | 'info';

export interface QuestionOption {
  value: string;
  label: string;
  emoji?: string;
}

export interface Question {
  id: string;
  section: number; // 0-7 for progress
  sectionLabel: string;
  text: string;
  subtext?: string;
  explanation?: string;
  tooltip?: { term: string; definition: string };
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  required?: boolean;
  // Maps answer to FormData path
  field: string;
  // If true, show this question; function receives current data
  condition?: (data: FormData) => boolean;
  // Transform input before storing
  transform?: (value: string) => string;
  // Auto-fill from existing data
  autoFill?: (data: FormData) => string;
}

export const questions: Question[] = [
  // === Section 0: Begrüßung + Name + Geburtsdatum ===
  {
    id: 'vorname',
    section: 0,
    sectionLabel: 'Persönliche Daten',
    text: 'Wie heißen Sie mit Vornamen?',
    subtext: 'Wir beginnen mit den Grundlagen für Ihren Antrag.',
    type: 'text',
    placeholder: 'z.B. Maria',
    required: true,
    field: 'personal.vorname',
  },
  {
    id: 'nachname',
    section: 0,
    sectionLabel: 'Persönliche Daten',
    text: 'Und Ihr Nachname?',
    type: 'text',
    placeholder: 'z.B. Müller',
    required: true,
    field: 'personal.nachname',
  },
  {
    id: 'geburtsdatum',
    section: 0,
    sectionLabel: 'Persönliche Daten',
    text: 'Wann sind Sie geboren?',
    subtext: 'Bitte im Format TT.MM.JJJJ eingeben.',
    type: 'date',
    placeholder: 'z.B. 15.03.1985',
    required: true,
    field: 'personal.geburtsdatum',
  },
  {
    id: 'geschlecht',
    section: 0,
    sectionLabel: 'Persönliche Daten',
    text: 'Welches Geschlecht soll im Antrag stehen?',
    type: 'choice',
    options: [
      { value: 'weiblich', label: 'Weiblich', emoji: '♀️' },
      { value: 'maennlich', label: 'Männlich', emoji: '♂️' },
      { value: 'divers', label: 'Divers', emoji: '⚧️' },
    ],
    required: true,
    field: 'personal.geschlecht',
  },
  {
    id: 'staatsangehoerigkeit',
    section: 0,
    sectionLabel: 'Persönliche Daten',
    text: 'Welche Staatsangehörigkeit haben Sie?',
    type: 'text',
    placeholder: 'z.B. deutsch',
    required: true,
    field: 'personal.staatsangehoerigkeit',
  },

  // === Section 1: Adresse + Kontakt ===
  {
    id: 'strasse',
    section: 1,
    sectionLabel: 'Adresse & Kontakt',
    text: 'In welcher Straße wohnen Sie?',
    subtext: 'Ihre Adresse wird für alle Formulare benötigt.',
    type: 'text',
    placeholder: 'z.B. Hauptstraße',
    required: true,
    field: 'personal.strasse',
  },
  {
    id: 'hausnummer',
    section: 1,
    sectionLabel: 'Adresse & Kontakt',
    text: 'Hausnummer?',
    type: 'text',
    placeholder: 'z.B. 42a',
    required: true,
    field: 'personal.hausnummer',
  },
  {
    id: 'plz',
    section: 1,
    sectionLabel: 'Adresse & Kontakt',
    text: 'Postleitzahl?',
    type: 'text',
    placeholder: 'z.B. 10115',
    required: true,
    field: 'personal.plz',
  },
  {
    id: 'ort',
    section: 1,
    sectionLabel: 'Adresse & Kontakt',
    text: 'Ort?',
    type: 'text',
    placeholder: 'z.B. Berlin',
    required: true,
    field: 'personal.ort',
  },
  {
    id: 'telefon',
    section: 1,
    sectionLabel: 'Adresse & Kontakt',
    text: 'Unter welcher Telefonnummer sind Sie erreichbar?',
    subtext: 'Das Jobcenter kontaktiert Sie ggf. telefonisch.',
    type: 'phone',
    placeholder: 'z.B. 0170 1234567',
    required: false,
    field: 'personal.telefon',
  },

  // === Section 2: Wohnsituation ===
  {
    id: 'wohnart',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Wohnen Sie zur Miete oder im Eigentum?',
    subtext: 'Ihre Wohnkosten werden im Antrag berücksichtigt.',
    tooltip: { term: 'Kosten der Unterkunft', definition: 'Das Jobcenter übernimmt angemessene Miet- und Heizkosten. In der Karenzzeit (erste 12 Monate) werden die tatsächlichen Kosten übernommen.' },
    type: 'choice',
    options: [
      { value: 'miete', label: 'Zur Miete', emoji: '🏢' },
      { value: 'eigentum', label: 'Eigentum', emoji: '🏠' },
    ],
    required: true,
    field: 'housing.wohnart',
  },
  {
    id: 'grundmiete',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Wie hoch ist Ihre Kaltmiete pro Monat?',
    subtext: 'Die Grundmiete ohne Nebenkosten und Heizung.',
    type: 'number',
    placeholder: 'z.B. 450',
    required: true,
    field: 'housing.grundmiete',
    condition: (data) => data.housing.wohnart === 'miete',
  },
  {
    id: 'nebenkosten',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Wie hoch sind die Nebenkosten pro Monat?',
    subtext: 'Wasser, Müll, Hausmeister usw. — ohne Heizung.',
    type: 'number',
    placeholder: 'z.B. 120',
    required: true,
    field: 'housing.nebenkosten',
    condition: (data) => data.housing.wohnart === 'miete',
  },
  {
    id: 'heizkosten',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Und die Heizkosten pro Monat?',
    tooltip: { term: 'Warmmiete', definition: 'Kaltmiete + Nebenkosten + Heizkosten zusammen ergeben die Warmmiete.' },
    type: 'number',
    placeholder: 'z.B. 80',
    required: true,
    field: 'housing.heizkosten',
    condition: (data) => data.housing.wohnart === 'miete',
  },
  {
    id: 'wohnflaeche',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Wie groß ist Ihre Wohnung in m²?',
    type: 'number',
    placeholder: 'z.B. 65',
    field: 'housing.wohnflaeche',
  },
  {
    id: 'anzahlRaeume',
    section: 2,
    sectionLabel: 'Wohnsituation',
    text: 'Wie viele Zimmer hat die Wohnung?',
    subtext: 'Ohne Küche und Bad.',
    type: 'number',
    placeholder: 'z.B. 3',
    field: 'housing.anzahlRaeume',
  },

  // === Section 3: Haushalt ===
  {
    id: 'familienstand',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Wie ist Ihr Familienstand?',
    type: 'choice',
    options: [
      { value: 'ledig', label: 'Ledig', emoji: '👤' },
      { value: 'verheiratet', label: 'Verheiratet', emoji: '💍' },
      { value: 'lebenspartnerschaft', label: 'Lebenspartnerschaft', emoji: '💑' },
      { value: 'getrennt', label: 'Getrennt lebend', emoji: '↔️' },
      { value: 'geschieden', label: 'Geschieden', emoji: '📋' },
      { value: 'verwitwet', label: 'Verwitwet', emoji: '🕊️' },
    ],
    required: true,
    field: 'family.familienstand',
  },
  {
    id: 'hatPartner',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Leben Sie mit einem Partner oder einer Partnerin zusammen?',
    subtext: 'Auch ohne Ehe — wenn Sie zusammen wohnen und wirtschaften, bilden Sie eine Bedarfsgemeinschaft.',
    tooltip: { term: 'Bedarfsgemeinschaft', definition: 'Alle Personen, die mit Ihnen zusammen leben und wirtschaften. Deren Einkommen und Vermögen wird mitberücksichtigt.' },
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja, mit Partner/in', emoji: '👫' },
      { value: 'false', label: 'Nein, allein', emoji: '👤' },
    ],
    required: true,
    field: 'family.hatPartner',
  },
  {
    id: 'partner_vorname',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Wie heißt Ihr/e Partner/in mit Vornamen?',
    type: 'text',
    placeholder: 'Vorname',
    required: true,
    field: 'family.partner.vorname',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'partner_nachname',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Nachname Ihres Partners / Ihrer Partnerin?',
    type: 'text',
    placeholder: 'Nachname',
    required: true,
    field: 'family.partner.nachname',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'partner_geburtsdatum',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Geburtsdatum Ihres Partners / Ihrer Partnerin?',
    type: 'date',
    placeholder: 'TT.MM.JJJJ',
    required: true,
    field: 'family.partner.geburtsdatum',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'partner_geschlecht',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Geschlecht Ihres Partners / Ihrer Partnerin?',
    type: 'choice',
    options: [
      { value: 'weiblich', label: 'Weiblich', emoji: '♀️' },
      { value: 'maennlich', label: 'Männlich', emoji: '♂️' },
      { value: 'divers', label: 'Divers', emoji: '⚧️' },
    ],
    required: true,
    field: 'family.partner.geschlecht',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'partner_staatsangehoerigkeit',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Staatsangehörigkeit Ihres Partners / Ihrer Partnerin?',
    type: 'text',
    placeholder: 'z.B. deutsch',
    field: 'family.partner.staatsangehoerigkeit',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'hatKinder',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Haben Sie Kinder, die bei Ihnen leben?',
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja', emoji: '👶' },
      { value: 'false', label: 'Nein', emoji: '—' },
    ],
    required: true,
    field: '_hatKinder',
  },
  {
    id: 'anzahlKinder',
    section: 3,
    sectionLabel: 'Haushalt & Familie',
    text: 'Wie viele Kinder leben bei Ihnen?',
    type: 'number',
    placeholder: 'z.B. 2',
    required: true,
    field: '_anzahlKinder',
    condition: (data) => data.family.kinder.length > 0 || false, // Will be controlled by hatKinder
  },

  // === Section 4: Einkommen ===
  {
    id: 'hatEinkommen',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Sind Sie derzeit erwerbstätig?',
    subtext: 'Also haben Sie einen Job, Minijob oder sind selbstständig?',
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja, ich arbeite', emoji: '💼' },
      { value: 'false', label: 'Nein', emoji: '—' },
    ],
    required: true,
    field: 'income.hatEinkommen',
  },
  {
    id: 'arbeitgeber',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Bei wem sind Sie angestellt?',
    type: 'text',
    placeholder: 'Name des Arbeitgebers',
    required: true,
    field: 'income.arbeitgeber',
    condition: (data) => data.income.hatEinkommen === true,
  },
  {
    id: 'brutto',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Wie hoch ist Ihr Bruttoeinkommen pro Monat?',
    type: 'number',
    placeholder: 'z.B. 1200',
    required: true,
    field: 'income.brutto',
    condition: (data) => data.income.hatEinkommen === true,
  },
  {
    id: 'netto',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Und das Nettoeinkommen?',
    subtext: 'Der Betrag, der auf Ihrem Konto ankommt.',
    type: 'number',
    placeholder: 'z.B. 950',
    required: true,
    field: 'income.netto',
    condition: (data) => data.income.hatEinkommen === true,
  },
  {
    id: 'kindergeld',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Erhalten Sie Kindergeld?',
    subtext: 'Falls ja, geben Sie den monatlichen Gesamtbetrag ein. Falls nein, lassen Sie das Feld leer.',
    type: 'number',
    placeholder: 'z.B. 500',
    field: 'income.kindergeld',
    condition: (data) => data.family.kinder.length > 0,
  },
  {
    id: 'unterhalt',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Erhalten Sie Unterhaltszahlungen?',
    subtext: 'Falls ja, monatlicher Betrag. Falls nein, überspringen.',
    type: 'number',
    placeholder: 'z.B. 300',
    field: 'income.unterhalt',
  },
  {
    id: 'partnerHatEinkommen',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Ist Ihr/e Partner/in erwerbstätig?',
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja', emoji: '💼' },
      { value: 'false', label: 'Nein', emoji: '—' },
    ],
    field: 'income.partnerHatEinkommen',
    condition: (data) => data.family.hatPartner === true,
  },
  {
    id: 'partnerArbeitgeber',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Bei wem ist Ihr/e Partner/in angestellt?',
    type: 'text',
    placeholder: 'Name des Arbeitgebers',
    field: 'income.partnerArbeitgeber',
    condition: (data) => data.income.partnerHatEinkommen === true,
  },
  {
    id: 'partnerBrutto',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Bruttoeinkommen Ihres Partners / Ihrer Partnerin?',
    type: 'number',
    placeholder: 'z.B. 1500',
    field: 'income.partnerBrutto',
    condition: (data) => data.income.partnerHatEinkommen === true,
  },
  {
    id: 'partnerNetto',
    section: 4,
    sectionLabel: 'Einkommen',
    text: 'Nettoeinkommen Ihres Partners / Ihrer Partnerin?',
    type: 'number',
    placeholder: 'z.B. 1100',
    field: 'income.partnerNetto',
    condition: (data) => data.income.partnerHatEinkommen === true,
  },

  // === Section 5: Vermögen ===
  {
    id: 'hatVermoegen',
    section: 5,
    sectionLabel: 'Vermögen',
    text: 'Besitzen Sie oder Ihre Bedarfsgemeinschaft Vermögen über 40.000 €?',
    subtext: 'In der Karenzzeit (erstes Jahr) gilt ein Freibetrag von 40.000 € für die erste Person + 15.000 € für jede weitere.',
    tooltip: { term: 'Karenzzeit', definition: 'In den ersten 12 Monaten des Bürgergeld-Bezugs wird Vermögen bis 40.000 € (+ 15.000 € je weitere Person) nicht berücksichtigt.' },
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja, über 40.000 €', emoji: '💰' },
      { value: 'false', label: 'Nein, darunter', emoji: '✓' },
    ],
    required: true,
    field: '_hatVermoegen',
  },
  {
    id: 'bankguthaben',
    section: 5,
    sectionLabel: 'Vermögen',
    text: 'Wie hoch ist Ihr gesamtes Bankguthaben?',
    subtext: 'Alle Konten zusammen (Girokonto, Sparkonto, etc.).',
    type: 'number',
    placeholder: 'z.B. 2500',
    field: 'assets.bankguthaben',
  },
  {
    id: 'auto',
    section: 5,
    sectionLabel: 'Vermögen',
    text: 'Besitzen Sie ein Auto?',
    subtext: 'Ein angemessenes KFZ (bis ca. 15.000 €) wird nicht angerechnet.',
    type: 'choice',
    options: [
      { value: 'true', label: 'Ja', emoji: '🚗' },
      { value: 'false', label: 'Nein', emoji: '—' },
    ],
    field: 'assets.auto',
  },
  {
    id: 'autoWert',
    section: 5,
    sectionLabel: 'Vermögen',
    text: 'Ungefährer Wert des Autos?',
    type: 'number',
    placeholder: 'z.B. 8000',
    field: 'assets.autoWert',
    condition: (data) => data.assets.auto === 'true' || (!!data.assets.auto && data.assets.auto !== 'false' && data.assets.auto !== ''),
  },
  {
    id: 'lebensversicherung',
    section: 5,
    sectionLabel: 'Vermögen',
    text: 'Haben Sie eine Lebensversicherung? Wenn ja, aktueller Rückkaufswert?',
    subtext: 'Falls nein, einfach überspringen.',
    type: 'number',
    placeholder: 'z.B. 5000',
    field: 'assets.lebensversicherung',
  },

  // === Section 6: Bankverbindung ===
  {
    id: 'kontoinhaber',
    section: 6,
    sectionLabel: 'Bankverbindung',
    text: 'Auf welches Konto soll das Bürgergeld überwiesen werden?',
    subtext: 'Name des Kontoinhabers (meistens Ihr eigener Name).',
    type: 'text',
    placeholder: 'z.B. Maria Müller',
    required: true,
    field: 'bank.kontoinhaber',
    autoFill: (data) => data.personal.vorname && data.personal.nachname ? `${data.personal.vorname} ${data.personal.nachname}` : '',
  },
  {
    id: 'iban',
    section: 6,
    sectionLabel: 'Bankverbindung',
    text: 'Wie lautet Ihre IBAN?',
    subtext: 'Die IBAN finden Sie auf Ihrer Bankkarte oder im Online-Banking.',
    type: 'iban',
    placeholder: 'DE89 3704 0044 0532 0130 00',
    required: true,
    field: 'bank.iban',
  },
];

// Get filtered questions based on current data state
export function getActiveQuestions(data: FormData, answeredIds: Set<string>): Question[] {
  return questions.filter(q => {
    if (!q.condition) return true;
    return q.condition(data);
  });
}

export function getTotalSections(): number {
  return 8; // 0-7 (including summary)
}
