import { createWorker } from 'tesseract.js';

export interface PurchaseOcrResult {
  vendorName?: string;
  vendorCui?: string;
  date?: string;
  totalAmount?: number;
  tvaAmount?: number;
  items: PurchaseItemOcr[];
  rawText?: string;
}

export interface PurchaseItemOcr {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tvaRate?: number;
}

/**
 * Perform OCR on a purchase document and parse it into structured data.
 * Now uses Gemini AI by default, falling back to Tesseract if needed.
 */
export async function processPurchaseDocument(imageFile: File): Promise<PurchaseOcrResult> {
  // Try AI first
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch('/api/ai/process-purchase', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const aiResult = await response.json();
      return {
        ...aiResult,
        rawText: 'Processed via Gemini AI'
      };
    }
    console.warn('AI Processing failed, falling back to Tesseract');
  } catch (error) {
    console.error('Error calling AI API:', error);
    console.warn('Falling back to Tesseract');
  }

  // Fallback to Tesseract
  const worker = await createWorker('ron');
  try {
    const { data } = await worker.recognize(imageFile);
    const text = data.text;
    
    // ... existing heuristic parsing ...
    const result: PurchaseOcrResult = {
      items: [],
      rawText: text
    };

    const textLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (textLines.length > 0) {
      result.vendorName = textLines[0];
    }

    const cuiMatch = text.match(/(?:CUI|CIF|COD FISCAL)[\s:]*(?:RO)?\s*(\d{7,10})/i);
    if (cuiMatch) {
      result.vendorCui = cuiMatch[1];
    }

    const dateMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (dateMatch) {
      const [_, d, m, y_raw] = dateMatch;
      let y = y_raw;
      if (y.length === 2) y = '20' + y;
      result.date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    for (let i = textLines.length - 1; i >= 0; i--) {
      const line = textLines[i].toUpperCase();
      if (line.includes('TOTAL') && !line.includes('TVA')) {
        const amountMatch = line.match(/(\d+[\s.,]\d{2})/);
        if (amountMatch) {
          result.totalAmount = parseFloat(amountMatch[1].replace(',', '.').replace(/\s/g, ''));
          break;
        }
      }
    }

    const tvaMatch = text.match(/(?:TVA|COTA TVA)[\s:]*(\d+[\s.,]\d{2})/i);
    if (tvaMatch) {
      result.tvaAmount = parseFloat(tvaMatch[1].replace(',', '.').replace(/\s/g, ''));
    }

    const lines = (data as unknown as { lines: { text: string }[] }).lines || [];
    lines.forEach((line) => {
      const content = line.text.trim();
      const itemMatch = content.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*[xX*]\s*(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)/);
      if (itemMatch) {
        const [, name, qtyStr, priceStr, totalStr] = itemMatch;
        result.items.push({
          name: name.trim(),
          quantity: parseFloat(qtyStr.replace(',', '.')),
          unitPrice: parseFloat(priceStr.replace(',', '.')),
          totalPrice: parseFloat(totalStr.replace(',', '.'))
        });
      }
    });

    return result;
  } finally {
    await worker.terminate();
  }
}
