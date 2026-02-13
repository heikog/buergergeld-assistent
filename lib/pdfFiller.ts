import { PDFDocument, PDFCheckBox, PDFTextField, PDFRadioGroup } from 'pdf-lib';

type FieldMap = Record<string, string | boolean>;

export async function fillPdf(pdfBytes: Uint8Array, fieldValues: FieldMap): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  for (const field of fields) {
    const name = field.getName();
    const value = fieldValues[name];

    if (value === undefined || value === null || value === '') continue;

    try {
      if (typeof value === 'boolean' && value) {
        // Try as checkbox
        try {
          const cb = form.getCheckBox(name);
          cb.check();
        } catch {
          // might be radio button - skip
        }
      } else if (typeof value === 'string') {
        try {
          const tf = form.getTextField(name);
          tf.setText(value);
        } catch {
          // field type mismatch, skip
        }
      }
    } catch {
      // Skip fields that can't be set
      console.warn(`Could not set field ${name}`);
    }
  }

  // Flatten to make fields read-only (optional, comment out if you want editable)
  // form.flatten();

  const filledBytes = await pdfDoc.save();
  return filledBytes;
}
