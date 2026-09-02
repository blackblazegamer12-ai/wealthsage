'use server';

export async function processReceipt(base64Image: string) {
  // Deterministic OCR extraction
  // Wait artificially to simulate processing
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Determine payload based on random chance or always return a fixed fraud pattern for demo
  return {
    merchant: 'Codashop - BGMI',
    amount: 1800,
    category: 'Gaming',
    actor: 'child',
    lineItems: [
      { description: 'BGMI 1500 UC Pack', amount: 1800 }
    ]
  };
}
