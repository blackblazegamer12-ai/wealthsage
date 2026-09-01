/**
 * WealthSage Sovereign Score Engine
 * Proprietary financial health scoring algorithm (0–1000)
 * 
 * Scoring Rubric:
 * - Savings Rate:        250 pts (% of income saved)
 * - Zombie Sub Prevention: 200 pts (unused subscriptions deducted)
 * - Goal Progress:       250 pts (weighted avg completion)
 * - Compound Trajectory: 200 pts (net surplus growth MoM)
 * - Budget Discipline:   100 pts (expense variance)
 */

export type ScoreTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Sovereign';

export interface ScoreBreakdown {
  savingsRate: number;      // 0–250
  leakPrevention: number;   // 0–200
  goalProgress: number;     // 0–250
  compoundTrajectory: number; // 0–200
  budgetDiscipline: number; // 0–100
}

export interface SovereignScoreResult {
  total: number;            // 0–1000
  breakdown: ScoreBreakdown;
  tier: ScoreTier;
  tierColor: string;
  percentile: number;       // Simulated percentile (0–100)
}

function getTier(score: number): { tier: ScoreTier; color: string } {
  if (score >= 900) return { tier: 'Sovereign', color: '#FFD700' };
  if (score >= 750) return { tier: 'Platinum', color: '#E5E4E2' };
  if (score >= 550) return { tier: 'Gold', color: '#B48A5A' };
  if (score >= 300) return { tier: 'Silver', color: '#C0C0C0' };
  return { tier: 'Bronze', color: '#CD7F32' };
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function calculateSovereignScore(
  transactions: any[],
  goals: any[],
  subscriptions: any[]
): SovereignScoreResult {
  // === 1. SAVINGS RATE (250 pts) ===
  const totalIncome = transactions
    .filter((t) => t.type === 'inflow')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = transactions
    .filter((t) => t.type === 'outflow')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  let savingsRateScore = 0;
  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    if (savingsRate >= 30) savingsRateScore = 250;
    else if (savingsRate >= 20) savingsRateScore = 200;
    else if (savingsRate >= 10) savingsRateScore = 140;
    else if (savingsRate >= 5) savingsRateScore = 80;
    else if (savingsRate > 0) savingsRateScore = 40;
    else savingsRateScore = 0;
  }

  // === 2. ZOMBIE SUB / LEAK PREVENTION (200 pts) ===
  const totalSubs = subscriptions.length;
  const unusedSubs = subscriptions.filter((s) => {
    const status = s.status?.toLowerCase();
    return status === 'unused' || status === 'price hiked' || status === 'pending trial';
  }).length;
  
  let leakScore = 200;
  if (totalSubs > 0) {
    const leakRatio = unusedSubs / totalSubs;
    leakScore = Math.round(200 * (1 - leakRatio));
  }

  // === 3. GOAL PROGRESS (250 pts) ===
  let goalScore = 0;
  if (goals.length > 0) {
    const avgCompletion = goals.reduce((sum, g) => {
      const target = Number(g.target_amount || g.target) || 1;
      const current = Number(g.current_amount || g.current) || 0;
      return sum + Math.min(1, current / target);
    }, 0) / goals.length;
    goalScore = Math.round(250 * avgCompletion);
  } else {
    // No goals set = neutral (half credit for not losing points)
    goalScore = 100;
  }

  // === 4. COMPOUND TRAJECTORY (200 pts) ===
  // Based on net surplus: positive = good trajectory
  const netSurplus = totalIncome - totalExpense;
  let trajectoryScore = 100; // Neutral baseline
  if (totalIncome > 0) {
    const surplusRatio = netSurplus / totalIncome;
    if (surplusRatio >= 0.3) trajectoryScore = 200;
    else if (surplusRatio >= 0.15) trajectoryScore = 160;
    else if (surplusRatio >= 0.05) trajectoryScore = 120;
    else if (surplusRatio >= 0) trajectoryScore = 80;
    else trajectoryScore = Math.max(0, 80 + Math.round(surplusRatio * 200));
  }

  // === 5. BUDGET DISCIPLINE (100 pts) ===
  // More categories used = better tracking = more disciplined
  const categories = new Set(
    transactions.filter((t) => t.type === 'outflow').map((t) => t.category)
  );
  const categoryCount = categories.size;
  let disciplineScore = 30; // Base for having any transactions
  if (transactions.length > 0) {
    if (categoryCount >= 5) disciplineScore = 100;
    else if (categoryCount >= 3) disciplineScore = 75;
    else if (categoryCount >= 1) disciplineScore = 50;
  }

  const breakdown: ScoreBreakdown = {
    savingsRate: clamp(savingsRateScore, 0, 250),
    leakPrevention: clamp(leakScore, 0, 200),
    goalProgress: clamp(goalScore, 0, 250),
    compoundTrajectory: clamp(trajectoryScore, 0, 200),
    budgetDiscipline: clamp(disciplineScore, 0, 100),
  };

  const total = clamp(
    breakdown.savingsRate +
    breakdown.leakPrevention +
    breakdown.goalProgress +
    breakdown.compoundTrajectory +
    breakdown.budgetDiscipline,
    0,
    1000
  );

  const { tier, color } = getTier(total);

  // Simulated percentile (deterministic from score for consistency)
  const percentile = Math.min(99, Math.round(total / 10.5));

  return {
    total,
    breakdown,
    tier,
    tierColor: color,
    percentile,
  };
}
