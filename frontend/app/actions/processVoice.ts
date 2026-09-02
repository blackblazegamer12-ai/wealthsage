'use server';

import { z } from 'zod';

export async function processVoice(speechText: string) {
  // Deterministic NLP extraction (regex based)
  const lowerText = speechText.toLowerCase();
  
  // Extract amount (e.g. "eight hundred rupees", "500", "₹1200")
  let amount = 0;
  const numberMatch = lowerText.match(/\b(\d+(?:,\d{3})*(?:\.\d+)?)\b/);
  if (numberMatch) {
    amount = parseFloat(numberMatch[1].replace(/,/g, ''));
  } else if (lowerText.includes('eight hundred')) amount = 800;
  else if (lowerText.includes('one thousand')) amount = 1000;
  else if (lowerText.includes('five hundred')) amount = 500;
  else amount = 1800; // fallback for demo

  // Extract merchant
  let merchant = 'Unknown Merchant';
  if (lowerText.includes('free fire')) merchant = 'Free Fire Diamonds';
  else if (lowerText.includes('bgmi')) merchant = 'BGMI UC';
  else if (lowerText.includes('discord')) merchant = 'Discord Nitro';
  else if (lowerText.includes('google play')) merchant = 'Google Play';
  else if (lowerText.includes('codashop')) merchant = 'Codashop Gateway';
  else if (lowerText.includes('winzo')) merchant = 'WinZO Games';
  
  // Predict category
  let category = 'General';
  if (['free fire', 'bgmi', 'google play', 'codashop', 'winzo', 'games'].some(k => lowerText.includes(k))) {
    category = 'Gaming';
  } else if (['discord', 'subscription'].some(k => lowerText.includes(k))) {
    category = 'Social';
  }

  // Predict actor
  let actor: 'parent' | 'child' = 'child'; // Assume child for security demo

  return { amount, merchant, category, actor };
}
