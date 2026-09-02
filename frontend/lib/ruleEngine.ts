/**
 * WealthSage Guardian Shield — Rule Engine
 * Detects gaming scams, dark-pattern subscriptions, and unauthorized child purchases.
 */

export interface TransactionPayload {
  id?: string;
  merchant: string;
  amount: number;
  category: string;
  actor: 'parent' | 'child';
  timestamp?: string;
  type?: 'inflow' | 'outflow';
}

export interface AlertResult {
  alertLevel: 'high' | 'medium' | 'low' | 'none';
  shouldFlag: boolean;
  reason: string;
  emoji: string;
}

const GAMING_MERCHANTS = [
  'google play', 'codashop', 'krafton', 'garena', 'free fire',
  'bgmi', 'steam', 'epic games', 'midasbuy', 'supercell',
  'roblox', 'riot games', 'top-up center', 'unipin', 'razorgold',
  'probo', 'daman', 'p-tech', 'winzo'
];

const SOCIAL_MERCHANTS = [
  'meta', 'meta verified', 'instagram', 'discord', 'discord nitro',
  'snapchat', 'snapchat+', 'twitter', 'x premium', 'youtube premium',
  'telegram premium', 'tinder', 'bumble',
];

const DARK_PATTERN_KEYWORDS = [
  'auto-renewed', 'trial expired', 'price increase', 'nitro',
  'meta verified', 'snapchat+', 'x premium',
];

export function normalizeMerchant(rawMerchant: string): string {
  const m = rawMerchant.toUpperCase();
  if (m.includes('KRAFTON') || m.includes('BGMI')) return 'BGMI (Krafton)';
  if (m.includes('FREE FIRE') || m.includes('FREEFIRE')) return 'Free Fire (Garena)';
  if (m.includes('CODASHOP')) return 'Codashop (Gaming Gateway)';
  if (m.includes('WINZO')) return 'WinZO (Gaming)';
  if (m.includes('SWIGGY')) return 'Swiggy';
  if (m.includes('ZOMATO')) return 'Zomato';
  if (m.includes('UBER')) return 'Uber';
  if (m.includes('DISCORD')) return 'Discord';
  if (m.includes('NETFLIX')) return 'Netflix';
  if (m.includes('SPOTIFY')) return 'Spotify';
  
  // Strip out generic bank prefixes like "POS-TP-"
  return rawMerchant.replace(/^POS-TP-/i, '').replace(/^UPI-/i, '');
}

export function categorizeTransaction(merchant: string): string {
  const m = merchant.toLowerCase();
  if (GAMING_MERCHANTS.some((g) => m.includes(g))) return 'Gaming';
  if (SOCIAL_MERCHANTS.some((s) => m.includes(s))) return 'Social';
  if (['swiggy', 'zomato', 'uber eats', 'food', 'dominos', 'pizza', 'mcdonald'].some((f) => m.includes(f))) return 'Food';
  if (['uber', 'ola', 'rapido', 'metro', 'transport'].some((t) => m.includes(t))) return 'Transport';
  if (['rent', 'electricity', 'water', 'gas', 'broadband', 'jio', 'airtel', 'bsnl', 'tata power'].some((u) => m.includes(u))) return 'Utility';
  if (['school', 'tuition', 'college', 'education', 'coaching'].some((e) => m.includes(e))) return 'Education';
  if (['salary', 'income', 'deposit', 'employer'].some((i) => m.includes(i))) return 'Income';
  return 'General';
}

export function evaluateTransaction(tx: TransactionPayload, currentLedger: any[] = []): AlertResult {
  const cat = tx.category || categorizeTransaction(tx.merchant);
  const m = tx.merchant.toLowerCase();

  // 1. Anti-Mule Activity Sentry
  // Detects if current transaction is a massive outflow (>90% of a recent massive inflow >10k)
  if (tx.amount >= 9000 && (!tx.type || tx.type === 'outflow')) {
    const recentLargeInflow = currentLedger.find((l) => l.type === 'inflow' && l.amount > 10000);
    if (recentLargeInflow && tx.amount >= recentLargeInflow.amount * 0.9) {
      return {
        alertLevel: 'high',
        shouldFlag: true,
        reason: '⚠️ Anti-Mule Alert: Unverified pass-through funds risk bank account freezing under cybercrime investigations.',
        emoji: '🚨',
      };
    }
  }

  // 2. Disguised Merchant & Gaming MCC Decoder
  const disguisedMatch = ['google play', 'codashop', 'krafton', 'bgmi', 'free fire', 'probo', 'daman', 'steam', 'unipin', 'p-tech', 'winzo'].some((k) => m.includes(k));
  
  // 3. Late-Night Gaming & Risk Heuristic
  let isLateNight = false;
  if (tx.timestamp) {
    const d = new Date(tx.timestamp);
    const hour = d.getHours();
    // Late night: 11 PM (23) to 5 AM (5)
    if (hour >= 23 || hour <= 5) {
      isLateNight = true;
    }
  }

  if (disguisedMatch) {
    const extraTag = isLateNight ? ' [🌙 Late-Night High-Risk Debit]' : '';
    return {
      alertLevel: 'high',
      shouldFlag: true,
      reason: `[⚠️ Disguised Gaming/Betting Gateway] Detected ${normalizeMerchant(tx.merchant)}${extraTag}`,
      emoji: '🎮',
    };
  }

  // HIGH: Gaming purchase by child
  if (cat === 'Gaming' && tx.actor === 'child') {
    const extraTag = isLateNight ? ' [🌙 Late-Night High-Risk Debit]' : '';
    return {
      alertLevel: 'high',
      shouldFlag: true,
      reason: `Gaming purchase detected: ${normalizeMerchant(tx.merchant)} by child account${extraTag}`,
      emoji: '🎮',
    };
  }

  // HIGH: Gaming purchase > ₹500
  if (cat === 'Gaming' && tx.amount > 500) {
    return {
      alertLevel: 'high',
      shouldFlag: true,
      reason: `High-value gaming purchase: ₹${tx.amount.toLocaleString('en-IN')} on ${tx.merchant}`,
      emoji: '🎮',
    };
  }

  // MEDIUM: Social/subscription by child
  if (cat === 'Social' && tx.actor === 'child') {
    return {
      alertLevel: 'medium',
      shouldFlag: true,
      reason: `Social platform charge by child: ${tx.merchant}`,
      emoji: '📱',
    };
  }

  // MEDIUM: Any child purchase > ₹500
  if (tx.actor === 'child' && tx.amount > 500) {
    return {
      alertLevel: 'medium',
      shouldFlag: true,
      reason: `Large child purchase: ₹${tx.amount.toLocaleString('en-IN')} at ${tx.merchant}`,
      emoji: '⚠️',
    };
  }

  // LOW: Gaming purchase by parent (informational)
  if (cat === 'Gaming') {
    return {
      alertLevel: 'low',
      shouldFlag: false,
      reason: `Gaming purchase noted: ${tx.merchant}`,
      emoji: '🎮',
    };
  }

  return {
    alertLevel: 'none',
    shouldFlag: false,
    reason: '',
    emoji: getCategoryEmoji(cat),
  };
}

export function getCategoryEmoji(category: string): string {
  const c = (category || '').toLowerCase();
  if (c === 'gaming') return '🎮';
  if (c === 'social') return '📱';
  if (c === 'food') return '🍔';
  if (c === 'transport') return '🚗';
  if (c === 'utility' || c === 'rent') return '🏠';
  if (c === 'education') return '📚';
  if (c === 'salary' || c === 'income') return '💰';
  if (c === 'investments') return '📈';
  return '💳';
}

export function isDarkPatternSubscription(merchantName: string): boolean {
  const m = merchantName.toLowerCase();
  return DARK_PATTERN_KEYWORDS.some((dp) => m.includes(dp));
}
