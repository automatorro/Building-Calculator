import fs from 'fs';
import path from 'path';
import { Blob } from 'buffer';

async function testApi() {
  const imagePath = 'C:\\Users\\Utilizator\\.gemini\\antigravity\\brain\\d8dd3e24-53ca-470d-bcf4-650ac4d0f9f3\\mock_romanian_receipt_1776913609860.png';
  
  if (!fs.existsSync(imagePath)) {
    console.error('Image not found at:', imagePath);
    return;
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const formData = new FormData();
  
  // Create a simulated File object
  const blob = new Blob([imageBuffer], { type: 'image/png' });
  formData.append('file', blob, 'receipt.png');

  console.log('Sending request to http://localhost:3000/api/ai/process-purchase ...');

  try {
    const response = await fetch('http://localhost:3000/api/ai/process-purchase', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    console.log('API Response:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testApi();
