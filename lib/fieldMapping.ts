// Maps user data to PDF field names for each form
import { FormData } from './formLogic';

type FieldMap = Record<string, string | boolean>;

function today(): string {
  const d = new Date();
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

export function mapHauptantrag(data: FormData): FieldMap {
  const p = data.personal;
  const f = data.family;
  const h = data.housing;
  const b = data.bank;

  const fields: FieldMap = {};

  // Personal info
  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;
  fields['txtfPersonStaatsangehoerigkeit'] = p.staatsangehoerigkeit;
  fields['txtfPersonStr'] = p.strasse;
  fields['txtfPersonHausnr'] = p.hausnummer;
  fields['txtfPersonPlz'] = p.plz;
  fields['txtfPersonOrt'] = p.ort;
  fields['txtfPersonTel'] = p.telefon;

  // Gender checkboxes
  if (p.geschlecht === 'maennlich') fields['chbxPersonMaennlich'] = true;
  if (p.geschlecht === 'weiblich') fields['chbxPersonWeiblich'] = true;
  if (p.geschlecht === 'divers') fields['chbxPersonDivers'] = true;

  // Bank
  fields['txtfKontoinhaber'] = b.kontoinhaber;
  fields['txtfIBAN'] = b.iban;

  // Familienstand
  const famMap: Record<string, string> = {
    'ledig': 'chbxPersonFamStandLedig',
    'verheiratet': 'chbxPersonFamStandVerheiratet',
    'verwitwet': 'chbxPersonFamStandVerwitwet',
    'lebenspartnerschaft': 'chbxPersonFamStandEingetrLeben',
    'getrennt': 'chbxPersonFamStandGetrennt',
    'geschieden': 'chbxPersonFamStandGeschieden',
  };
  if (f.familienstand && famMap[f.familienstand]) {
    fields[famMap[f.familienstand]] = true;
  }

  // Antrag sofort
  fields['chbxPersonAntragBUEGSofort'] = true;

  // Living situation
  if (f.hatPartner) fields['chbxPersonWohnenEhegatte'] = true;
  if (f.kinder.length > 0) fields['chbxPersonWohnenKind'] = true;

  // Date
  fields['dateUnterschriftPerson'] = today();

  return fields;
}

export function mapAnlageKDU(data: FormData): FieldMap {
  const p = data.personal;
  const h = data.housing;
  const fields: FieldMap = {};

  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;
  fields['txtfPersonStr'] = p.strasse;
  fields['txtfPersonHausNr'] = p.hausnummer;
  fields['txtfPersonPlz'] = p.plz;
  fields['txtfPersonOrt'] = p.ort;

  // Number of persons
  const totalPersons = 1 + (data.family.hatPartner ? 1 : 0) + data.family.kinder.length;
  fields['numfUnterkunftAnzahlPersonen'] = totalPersons.toString();
  fields['numfUnterkunftAnzahlRaum'] = h.anzahlRaeume || '';
  fields['numfUnterkunftGesamt'] = h.wohnflaeche || '';

  // Miete / Eigentum
  if (h.wohnart === 'miete') {
    fields['chbxWohnenMiete'] = true;
    if (h.grundmiete) {
      fields['chbxBedarfGrundmiete'] = true;
      fields['numfBedarfGrundmiete'] = h.grundmiete;
    }
    if (h.nebenkosten) {
      fields['chbxBedarfNebenkosten'] = true;
      fields['numfBedarfNebenkosten'] = h.nebenkosten;
    }
    if (h.heizkosten) {
      fields['chbxBedarfHeizkosten'] = true;
      fields['numfBedarfHeizkosten'] = h.heizkosten;
    }
  } else if (h.wohnart === 'eigentum') {
    fields['chbxWohnenEigentum'] = true;
  }

  // Energy
  if (h.energiequelle === 'gas') fields['chbxEnergiequellenGas'] = true;
  if (h.energiequelle === 'strom') fields['chbxEnergiequellenStrom'] = true;
  if (h.energiequelle === 'oel') fields['chbxEnergiequellenOel'] = true;
  if (h.energiequelle === 'fernwaerme') fields['chbxEnergiequellenFernwaerme'] = true;

  // Heating
  if (h.heizungsart === 'zentral') fields['chbxHeizungZentralheizung'] = true;
  if (h.heizungsart === 'einzel') fields['chbxHeizungsartEinzelofen'] = true;

  fields['dateUnterschriftPerson'] = today();

  return fields;
}

export function mapAnlageVM(data: FormData): FieldMap {
  const p = data.personal;
  const a = data.assets;
  const fields: FieldMap = {};

  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;

  // Bank assets - use the table rows
  if (a.bankguthaben) {
    fields['txtareaTabVermoegen_Z1_S2'] = 'Bankguthaben';
    fields['numfTabVermoegen_Z2_S2'] = a.bankguthaben;
  }

  if (a.lebensversicherung) {
    fields['txtareaTabVermoegen_Z1_S3'] = 'Lebensversicherung';
    fields['numfTabVermoegen_Z2_S3'] = a.lebensversicherung;
  }

  // Car
  if (a.auto) {
    fields['txtareaTabKFZ_Z1_S2'] = a.auto;
    if (a.autoWert) fields['numfTabKFZ_Z2_S2'] = a.autoWert;
  }

  fields['dateUnterschriftPerson'] = today();

  return fields;
}

export function mapAnlageEK(data: FormData, forPartner: boolean = false): FieldMap {
  const p = data.personal;
  const inc = data.income;
  const fields: FieldMap = {};

  // Applicant info (always the main applicant on header)
  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;

  if (forPartner && data.family.partner) {
    // The EK form is for the partner
    fields['txtfBGVorname'] = data.family.partner.vorname;
    fields['txtfBGNachname'] = data.family.partner.nachname;
    fields['dateBGGebDatum'] = data.family.partner.geburtsdatum;
    if (inc.partnerArbeitgeber) fields['txtfAGName'] = inc.partnerArbeitgeber;
  } else {
    fields['txtfBGVorname'] = p.vorname;
    fields['txtfBGNachname'] = p.nachname;
    fields['dateBGGebDatum'] = p.geburtsdatum;
    if (inc.arbeitgeber) fields['txtfAGName'] = inc.arbeitgeber;
  }

  // Income type checkboxes
  if (inc.kindergeld) fields['chbxEinnahmeKindergeld'] = true;
  if (inc.unterhalt) fields['chbxEinnahmeUnterhalt'] = true;

  fields['dateUnterschriftPerson'] = today();

  return fields;
}

export function mapAnlageKI(data: FormData, kindIndex: number): FieldMap {
  const p = data.personal;
  const kind = data.family.kinder[kindIndex];
  const fields: FieldMap = {};

  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;

  if (kind) {
    fields['txtfKindVorname'] = kind.vorname;
    fields['txtfKindNachname'] = kind.nachname;
    fields['dateKindGebDatum'] = kind.geburtsdatum;
    fields['txtfKindStaatsangehoerigkeit'] = 'deutsch';

    if (kind.geschlecht === 'maennlich') fields['chbxBGMaennlich'] = true;
    if (kind.geschlecht === 'weiblich') fields['chbxBGWeiblich'] = true;
    if (kind.geschlecht === 'divers') fields['chbxBGDivers'] = true;

    fields['chbxKindLeiblich'] = true;
  }

  fields['dateUnterschriftPerson'] = today();

  return fields;
}

export function mapAnlageWEP(data: FormData, forPartner: boolean, kindIndex?: number): FieldMap {
  const p = data.personal;
  const fields: FieldMap = {};

  // Header: main applicant
  fields['txtfPersonVorname'] = p.vorname;
  fields['txtfPersonNachname'] = p.nachname;
  fields['datePersonGebDatum'] = p.geburtsdatum;

  if (forPartner && data.family.partner) {
    const partner = data.family.partner;
    fields['txtfBGVorname'] = partner.vorname;
    fields['txtfBGNachname'] = partner.nachname;
    fields['dateBGGebDatum'] = partner.geburtsdatum;
    fields['txtfBGStaatsangehoerigkeit'] = partner.staatsangehoerigkeit || 'deutsch';

    if (partner.geschlecht === 'maennlich') fields['chbxBGMaennlich'] = true;
    if (partner.geschlecht === 'weiblich') fields['chbxBGWeiblich'] = true;
    if (partner.geschlecht === 'divers') fields['chbxBGDivers'] = true;

    // Familienstand
    const f = data.family.familienstand;
    if (f === 'verheiratet') fields['chbxFamilienstandVerheiratet'] = true;
    if (f === 'lebenspartnerschaft') fields['chbxFamilienstandLebenspartnerschaft'] = true;
    if (f === 'ledig') fields['chbxFamilienstandLedig'] = true;
  } else if (kindIndex !== undefined) {
    const kind = data.family.kinder[kindIndex];
    if (kind) {
      fields['txtfBGVorname'] = kind.vorname;
      fields['txtfBGNachname'] = kind.nachname;
      fields['dateBGGebDatum'] = kind.geburtsdatum;
      fields['txtfBGStaatsangehoerigkeit'] = 'deutsch';

      if (kind.geschlecht === 'maennlich') fields['chbxBGMaennlich'] = true;
      if (kind.geschlecht === 'weiblich') fields['chbxBGWeiblich'] = true;
      if (kind.geschlecht === 'divers') fields['chbxBGDivers'] = true;

      fields['chbxFamilienstandLedig'] = true;
    }
  }

  fields['dateUnterschriftPerson'] = today();

  return fields;
}
