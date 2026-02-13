import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import JSZip from 'jszip';
import { FormData, getRequiredForms, getDocumentChecklist } from '@/lib/formLogic';
import { fillPdf } from '@/lib/pdfFiller';
import {
  mapHauptantrag,
  mapAnlageKDU,
  mapAnlageVM,
  mapAnlageEK,
  mapAnlageKI,
  mapAnlageWEP,
} from '@/lib/fieldMapping';

async function loadPdf(filename: string): Promise<Uint8Array> {
  const filePath = path.join(process.cwd(), 'public', 'forms', filename);
  const buffer = await readFile(filePath);
  return new Uint8Array(buffer);
}

function getFieldMap(formId: string, data: FormData, kindIndex?: number) {
  if (formId === 'hauptantrag') return mapHauptantrag(data);
  if (formId === 'anlage-kdu') return mapAnlageKDU(data);
  if (formId === 'anlage-vm') return mapAnlageVM(data);
  if (formId === 'anlage-ek') return mapAnlageEK(data, false);
  if (formId === 'anlage-ek-partner') return mapAnlageEK(data, true);
  if (formId === 'anlage-wep-partner') return mapAnlageWEP(data, true);
  if (formId.startsWith('anlage-ki-')) {
    const idx = parseInt(formId.replace('anlage-ki-', ''));
    return mapAnlageKI(data, idx);
  }
  if (formId.startsWith('anlage-wep-kind-')) {
    const idx = parseInt(formId.replace('anlage-wep-kind-', ''));
    return mapAnlageWEP(data, false, idx);
  }
  return {};
}

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json();
    const requiredForms = getRequiredForms(data);
    const checklist = getDocumentChecklist(data);

    const zip = new JSZip();

    for (const form of requiredForms) {
      const pdfBytes = await loadPdf(form.filename);
      const fieldMap = getFieldMap(form.id, data);
      const filledPdf = await fillPdf(pdfBytes, fieldMap);

      // Use descriptive filename
      const outName = form.forPerson
        ? `${form.name.replace(/[/\\?%*:|"<>]/g, '-')} - ${form.forPerson}.pdf`
        : `${form.name.replace(/[/\\?%*:|"<>]/g, '-')}.pdf`;
      zip.file(outName, filledPdf);
    }

    // Add checklist as text file
    let checklistText = 'CHECKLISTE - Dokumente für Ihren Bürgergeld-Antrag\n';
    checklistText += '='.repeat(55) + '\n\n';
    checklistText += 'Bitte legen Sie folgende Unterlagen bei:\n\n';
    checklist.forEach((doc, i) => {
      checklistText += `☐ ${i + 1}. ${doc}\n`;
    });
    checklistText += '\n\nGenerierte Formulare:\n\n';
    requiredForms.forEach((f) => {
      checklistText += `✓ ${f.name}${f.forPerson ? ` (${f.forPerson})` : ''}\n`;
    });
    zip.file('Checkliste.txt', checklistText);

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });

    return new NextResponse(Buffer.from(zipBuffer), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="Buergergeld-Antrag-${data.personal.nachname || 'Formulare'}.zip"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Fehler bei der PDF-Erstellung: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
