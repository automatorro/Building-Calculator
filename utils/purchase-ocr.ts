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
 */
export async function processPurchaseDocument(imageFile: File): Promise<PurchaseOcrResult> {
  const worker = await createWorker('ron'); // Romanian language
  
  try {
    const { data } = await worker.recognize(imageFile);
    const text = data.text;
    const lines = (data as any).lines || [];
    
    // Basic Parsing Logic
    const result: PurchaseOcrResult = {
      items: [],
      rawText: text
    };

    const textLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    // 1. Extract Vendor (usually the first few lines)
    if (textLines.length > 0) {
      result.vendorName = textLines[0];
    }

    // 2. Extract CUI/CIF
    // Matches "CIF: 12345678", "CUI: RO12345678", etc.
    const cuiMatch = text.match(/(?:CUI|CIF|COD FISCAL)[\s:]*(?:RO)?\s*(\d{7,10})/i);
    if (cuiMatch) {
      result.vendorCui = cuiMatch[1];
    }

    // 3. Extract Date
    // Matches "22.04.2024", "22-04-2024", "2024/04/22"
    const dateMatch = text.match(/(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})/);
    if (dateMatch) {
      let [_, d, m, y] = dateMatch;
      if (y.length === 2) y = '20' + y;
      result.date = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // 4. Extract Total Amount
    // Look for lines containing "TOTAL" followed by a number
    // We search from bottom up because the last TOTAL is usually the final one
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

    // 5. Extract TVA
    const tvaMatch = text.match(/(?:TVA|COTA TVA)[\s:]*(\d+[\s.,]\d{2})/i);
    if (tvaMatch) {
      result.tvaAmount = parseFloat(tvaMatch[1].replace(',', '.').replace(/\s/g, ''));
    }

    // 6. Extract Items (Simplified heuristic)
    // Looking for lines with like: "NAME X QTY PRICE"
    // This part is complex and often depends on layout. 
    // We look for patterns like "1.5 X 10,00" or similar.
    lines.forEach((line: any) => {
      const content = line.text.trim();
      // Heuristic: line contains a number followed by 'X' or '*', then another number
      const itemMatch = content.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*[xX*]\s*(\d+(?:[.,]\d+)?)\s+(\d+(?:[.,]\d+)?)/);
      if (itemMatch) {
        const [_, name, qtyStr, priceStr, totalStr] = itemMatch;
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
