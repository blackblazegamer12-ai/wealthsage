export interface SubscriptionTrap {
  merchant: string;
  cycle: 'Monthly' | 'Annual' | 'Unknown';
  latestAmount: number;
  tags: string[];
}

export interface AuditSummary {
  totalLeakage: number;
  traps: SubscriptionTrap[];
}

export function detectSubscriptionTraps(transactions: any[]): AuditSummary {
  const defaultSummary: AuditSummary = { totalLeakage: 0, traps: [] };

  if (!transactions || !transactions.length) return defaultSummary;

  // 1. Filter Outflows and group by merchant
  const outflows = transactions.filter(t => t.type === 'outflow' || Number(t.amount) > 0);
  
  const merchantGroups: Record<string, any[]> = {};
  
  outflows.forEach(tx => {
    // Basic normalization: remove casing, strip generic suffixes if any
    const rawMerchant = tx.merchant || tx.description || 'Unknown';
    if (rawMerchant === 'Unknown') return;
    const normalized = rawMerchant.trim().toLowerCase();
    
    if (!merchantGroups[normalized]) {
      merchantGroups[normalized] = [];
    }
    merchantGroups[normalized].push(tx);
  });

  const traps: SubscriptionTrap[] = [];
  let totalLeakage = 0;

  // 2. Analyze each merchant group for frequency and variance
  Object.keys(merchantGroups).forEach(merchantKey => {
    const group = merchantGroups[merchantKey];
    if (group.length < 2) return; // Need at least 2 to calculate delta

    // Sort by date ascending (oldest first)
    group.sort((a, b) => {
      const dateA = a.date || a.created_at;
      const dateB = b.date || b.created_at;
      if (!dateA || !dateB) return 0;
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    let isMonthly = false;
    let isAnnual = false;
    let silentHike = false;
    let initialAmount = Number(group[0].amount);
    let latestAmount = Number(group[group.length - 1].amount);

    for (let i = 1; i < group.length; i++) {
      const date1 = new Date(group[i - 1].date || group[i - 1].created_at);
      const date2 = new Date(group[i].date || group[i].created_at);
      
      const diffDays = (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24);
      
      if (diffDays >= 27 && diffDays <= 33) {
        isMonthly = true;
      }
      if (diffDays >= 355 && diffDays <= 370) {
        isAnnual = true;
      }

      const amt1 = Number(group[i - 1].amount);
      const amt2 = Number(group[i].amount);

      if (amt2 > amt1) {
        silentHike = true;
      }
    }

    if (isMonthly || isAnnual) {
      const tags: string[] = [];
      if (silentHike) {
        tags.push(`[⚠️ Silent Price Hike: ₹${initialAmount} ➔ ₹${latestAmount}]`);
      }
      
      // Heuristic: If it's a known overlapping family trap based on naming
      if (merchantKey.includes('netflix') || merchantKey.includes('spotify') || merchantKey.includes('discord')) {
        tags.push('[⚠️ Potential Duplicate Account]');
      }

      // We consider the latest amount as leakage if it's flagged as an unoptimized trap 
      // For this audit, we'll sum up the latest amounts of all detected subscriptions as the 'leakable' surface area.
      totalLeakage += latestAmount;

      traps.push({
        merchant: group[0].merchant || group[0].description, // use original casing
        cycle: isAnnual ? 'Annual' : 'Monthly',
        latestAmount: latestAmount,
        tags
      });
    }
  });

  return { totalLeakage, traps };
}
