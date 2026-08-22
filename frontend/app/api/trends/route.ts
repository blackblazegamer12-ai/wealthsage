import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/trends — Generate detailed financial trend analysis
 * Body: { transactions: [], goals: [], subscriptions: [], period?: "month" | "quarter" | "year" }
 */
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { transactions = [], goals = [], subscriptions = [], period = "all" } = body;

  const income = transactions
    .filter((t: any) => t.type === "income")
    .reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const expense = transactions
    .filter((t: any) => t.type === "expense")
    .reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0);
  const net = income - expense;
  const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : "0";

  // Category breakdown
  const catSpend: Record<string, number> = {};
  const catCount: Record<string, number> = {};
  transactions
    .filter((t: any) => t.type === "expense")
    .forEach((t: any) => {
      const c = t.category || "General";
      catSpend[c] = (catSpend[c] || 0) + (Number(t.amount) || 0);
      catCount[c] = (catCount[c] || 0) + 1;
    });

  const categoryBreakdown = Object.entries(catSpend)
    .sort((a, b) => b[1] - a[1])
    .map(([category, total]) => ({
      category,
      total,
      count: catCount[category] || 0,
      percentage: expense > 0 ? ((total / expense) * 100).toFixed(1) : "0",
      avgPerTransaction: catCount[category] ? (total / catCount[category]).toFixed(2) : "0",
    }));

  // Income breakdown
  const incomeCat: Record<string, number> = {};
  transactions
    .filter((t: any) => t.type === "income")
    .forEach((t: any) => {
      const c = t.category || "General";
      incomeCat[c] = (incomeCat[c] || 0) + (Number(t.amount) || 0);
    });

  const incomeBreakdown = Object.entries(incomeCat)
    .sort((a, b) => b[1] - a[1])
    .map(([category, total]) => ({
      category,
      total,
      percentage: income > 0 ? ((total / income) * 100).toFixed(1) : "0",
    }));

  // Subscription commitment analysis
  const totalSubCost = subscriptions.reduce((s: number, sub: any) => s + (Number(sub.amount) || 0), 0);
  const subBreakdown = subscriptions.map((sub: any) => ({
    name: sub.name,
    amount: Number(sub.amount) || 0,
    cycle: sub.cycle || "Monthly",
    annualCost: (Number(sub.amount) || 0) * 12,
    pctOfIncome: income > 0 ? (((Number(sub.amount) || 0) / income) * 100).toFixed(1) : "0",
    isZombie: (sub.status || "").toLowerCase() === "unused",
  }));

  // Goals progress
  const goalsProgress = goals.map((g: any) => ({
    name: g.name,
    target: Number(g.target) || 0,
    current: Number(g.current) || 0,
    progress: Number(g.target) > 0 ? Math.round(((Number(g.current) || 0) / Number(g.target)) * 100) : 0,
    remaining: Math.max(0, (Number(g.target) || 0) - (Number(g.current) || 0)),
    icon: g.icon || "🎯",
  }));

  // Velocity metrics
  const monthlyVelocity = net;
  const wealthScore = Math.max(10, Math.min(99, Math.round(
    50 + (income > 0 ? ((net / income) * 40) : 0) + (transactions.length > 5 ? 10 : 0)
  )));

  // Trend direction
  const recentTx = [...transactions].sort((a: any, b: any) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  const recentExpenses = recentTx
    .filter((t: any) => t.type === "expense")
    .slice(0, Math.ceil(transactions.filter((t: any) => t.type === "expense").length / 2));
  const olderExpenses = recentTx
    .filter((t: any) => t.type === "expense")
    .slice(Math.ceil(transactions.filter((t: any) => t.type === "expense").length / 2));

  const recentAvg = recentExpenses.length > 0
    ? recentExpenses.reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0) / recentExpenses.length
    : 0;
  const olderAvg = olderExpenses.length > 0
    ? olderExpenses.reduce((s: number, t: any) => s + (Number(t.amount) || 0), 0) / olderExpenses.length
    : 0;

  const expenseTrend = recentAvg > olderAvg * 1.1 ? "increasing"
    : recentAvg < olderAvg * 0.9 ? "decreasing"
    : "stable";

  const zombieSubs = subscriptions.filter((s: any) => (s.status || "").toLowerCase() === "unused");
  const monthlyWaste = zombieSubs.reduce((s: number, sub: any) => s + (Number(sub.amount) || 0), 0);

  return NextResponse.json({
    summary: {
      totalTransactions: transactions.length,
      totalIncome: income,
      totalExpense: expense,
      netSurplus: net,
      savingsRate: `${savingsRate}%`,
      wealthVelocityScore: wealthScore,
      monthlyCommitments: totalSubCost,
      zombieSubCount: zombieSubs.length,
      monthlyWaste,
      annualWaste: monthlyWaste * 12,
    },
    expenseBreakdown: categoryBreakdown,
    incomeBreakdown,
    subscriptionAnalysis: subBreakdown,
    goalsProgress,
    trends: {
      expenseDirection: expenseTrend,
      recentAvgExpense: recentAvg.toFixed(2),
      olderAvgExpense: olderAvg.toFixed(2),
      savingsRate: parseFloat(savingsRate),
      netMonthlyVelocity: net,
    },
    insights: generateInsights(income, expense, net, categoryBreakdown, zombieSubs, goals),
  });
}

function generateInsights(
  income: number,
  expense: number,
  net: number,
  categories: any[],
  zombieSubs: any[],
  goals: any[]
): string[] {
  const insights: string[] = [];

  if (income > 0) {
    const rate = ((net / income) * 100).toFixed(1);
    insights.push(`Savings rate is ${rate}% — ${parseFloat(rate) >= 20 ? "above" : "below"} the recommended 20% threshold.`);
  }

  if (categories.length > 0) {
    insights.push(`Top expense category is "${categories[0].category}" at $${categories[0].total.toFixed(2)} (${categories[0].percentage}% of total spend).`);
  }

  if (zombieSubs.length > 0) {
    const waste = zombieSubs.reduce((s: number, z: any) => s + (Number(z.amount) || 0), 0);
    insights.push(`${zombieSubs.length} zombie subscriptions detected — $${waste.toFixed(2)}/mo ($${(waste * 12).toFixed(2)}/yr) in recoverable waste.`);
  }

  const unmetGoals = goals.filter((g: any) => {
    const progress = Number(g.target) > 0 ? (Number(g.current) || 0) / Number(g.target) : 0;
    return progress < 1;
  });
  if (unmetGoals.length > 0) {
    insights.push(`${unmetGoals.length} goals still in progress. Maintain current velocity to hit targets.`);
  }

  if (net > 0) {
    const surplusRate = net / 12;
    const futureVal = surplusRate * ((Math.pow(1 + 0.08 / 12, 60) - 1) / (0.08 / 12));
    insights.push(`At current surplus, 5-year compound projection: $${futureVal.toFixed(0)}`);
  }

  return insights;
}
