export interface AgentAOutput {
  status: 'PASS' | 'FLAG';
  threatLevel: 'HIGH' | 'NONE';
  code: 'MCC_DECODER' | 'NONE';
}

export interface AgentBOutput {
  status: 'PASS' | 'FLAG';
  anomalyType: 'VELOCITY' | 'LATE_NIGHT' | 'NONE';
}

export interface AgentCOutput {
  status: 'REASONING' | 'RESOLVED' | 'FAILED';
  confidenceScore: number;
  plainTextVerdict: string;
  actionableNextStep: string;
}

export interface MultiAgentAnalysisResult {
  agentA: AgentAOutput;
  agentB: AgentBOutput;
  agentC: AgentCOutput;
  isFlagged: boolean;
}

// Gaming keywords for Agent A
const DISGUISED_MERCHANTS = ['Codashop', 'Krafton', 'Free Fire', 'Probo', 'WinZO', 'Discord Nitro'];

// SYNCHRONOUS EDGE PASS
export function analyzeTransactionMultiAgent(tx: any, currentLedger: any[] = []): MultiAgentAnalysisResult {
  // ---------------------------------------------------------
  // AGENT A: Deterministic Sentinel (MCC / String Decoder)
  // ---------------------------------------------------------
  let agentA: AgentAOutput = { status: 'PASS', threatLevel: 'NONE', code: 'NONE' };
  
  const rawMerchant = (tx.merchant || tx.description || '').toLowerCase();
  const isGaming = DISGUISED_MERCHANTS.some(brand => rawMerchant.includes(brand.toLowerCase()));
  
  if (isGaming) {
    agentA = { status: 'FLAG', threatLevel: 'HIGH', code: 'MCC_DECODER' };
  }

  // ---------------------------------------------------------
  // AGENT B: Behavioral Anomaly Engine (Velocity & Time)
  // ---------------------------------------------------------
  let agentB: AgentBOutput = { status: 'PASS', anomalyType: 'NONE' };
  
  const txDate = new Date(tx.date || tx.created_at || new Date());
  const hour = txDate.getHours();
  const isLateNight = hour >= 23 || hour < 5;
  
  const twoHoursAgo = new Date(txDate.getTime() - 2 * 60 * 60 * 1000);
  
  const recentInflows = currentLedger.filter(t => 
    t.type === 'inflow' && 
    new Date(t.date || t.created_at) > twoHoursAgo && 
    new Date(t.date || t.created_at) < txDate
  );
  
  let isVelocityAnomaly = false;
  const currentAmount = Number(tx.amount) || 0;
  
  if (currentAmount > 10000 && tx.type === 'outflow') {
    for (const inflow of recentInflows) {
      const inAmt = Number(inflow.amount) || 0;
      if (inAmt > 15000 && (currentAmount / inAmt) >= 0.90) {
        isVelocityAnomaly = true;
        break;
      }
    }
  }

  if (isVelocityAnomaly) {
    agentB = { status: 'FLAG', anomalyType: 'VELOCITY' };
  } else if (isLateNight && tx.type === 'outflow') {
    agentB = { status: 'FLAG', anomalyType: 'LATE_NIGHT' };
  }

  const aFlag = agentA.status === 'FLAG';
  const bFlag = agentB.status === 'FLAG';
  const isFlagged = aFlag || bFlag;

  // Initialize Agent C in REASONING state if flagged, else RESOLVED
  const agentC: AgentCOutput = isFlagged 
    ? { status: 'REASONING', confidenceScore: 0, plainTextVerdict: '...', actionableNextStep: '...' }
    : { status: 'RESOLVED', confidenceScore: 12, plainTextVerdict: 'Transaction falls within normal expected variance. Authorized.', actionableNextStep: 'None required.' };

  return { agentA, agentB, agentC, isFlagged };
}

// ASYNCHRONOUS EXECUTIVE PASS
export async function synthesizeExecutiveVerdictAsync(agentA: AgentAOutput, agentB: AgentBOutput, tx: any, currentLedger: any[] = []): Promise<AgentCOutput> {
  const fallback: AgentCOutput = {
    status: 'RESOLVED',
    confidenceScore: 0,
    plainTextVerdict: '',
    actionableNextStep: ''
  };

  const aFlag = agentA.status === 'FLAG';
  const bFlag = agentB.status === 'FLAG';

  if (aFlag && bFlag) {
    fallback.confidenceScore = 99;
    if (agentB.anomalyType === 'VELOCITY') {
      fallback.plainTextVerdict = 'Critical Threat: Coordinated influx and immediate massive outflow detected to disguised gaming/crypto entity.';
      fallback.actionableNextStep = 'FILE MHA 1930 DISPUTE & FREEZE ACCOUNT';
    } else {
      fallback.plainTextVerdict = 'High Threat: Late-night debit matching known disguised gaming micro-transaction dark patterns.';
      fallback.actionableNextStep = 'REVOKE MANDATE & CHALLENGE WITH BANK';
    }
  } else if (aFlag) {
    fallback.confidenceScore = 94;
    fallback.plainTextVerdict = 'High Threat: Match found in known disguised gaming/trap merchant database (MCC_DECODER).';
    fallback.actionableNextStep = 'REVOKE SUBSCRIPTION/MANDATE';
  } else if (bFlag) {
    fallback.confidenceScore = 85;
    if (agentB.anomalyType === 'VELOCITY') {
      fallback.plainTextVerdict = 'Medium Threat: Suspicious monetary velocity indicating potential mule pattern (Rapid In-Out).';
      fallback.actionableNextStep = 'REQUIRE BIOMETRIC APPROVAL TO PROCEED';
    } else {
      fallback.plainTextVerdict = 'Medium Threat: Outflow occurring outside normal operating hours (11 PM - 5 AM).';
      fallback.actionableNextStep = 'NOTIFY PARENTAL DEVICE';
    }
  } else {
    fallback.confidenceScore = 12;
    fallback.plainTextVerdict = 'Transaction falls within normal expected variance. Authorized.';
    fallback.actionableNextStep = 'None required.';
    return fallback;
  }

  // LLM Fetch with strict AbortController (2500ms max)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  // Calculate 30-day baseline stats using IQR and Median (Resilient to outliers)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentLedger = currentLedger.filter(t => new Date(t.date || t.created_at) > thirtyDaysAgo);
  
  let medianSpend = 0;
  if (recentLedger.length > 0) {
    const amounts = recentLedger.map(t => Number(t.amount) || 0).sort((a, b) => a - b);
    const mid = Math.floor(amounts.length / 2);
    medianSpend = amounts.length % 2 !== 0 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2;
    
    // IQR Calculation (optional for passing to LLM if needed, but median is the core fix)
    const q1 = amounts[Math.floor(amounts.length * 0.25)];
    const q3 = amounts[Math.floor(amounts.length * 0.75)];
    const iqr = q3 - q1;
    // We can pass the IQR bounds to the LLM to give it statistical context
    var upperFence = q3 + (1.5 * iqr);
  } else {
    var upperFence = 5000; // Default fallback upper bound
  }

  // Ensure fail-closed fallback if LLM times out: minimum score is 85 if it reached here
  if (fallback.confidenceScore < 85) fallback.confidenceScore = 85;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user', 
          content: `Analyze this flagged transaction within the user's historical context. 
Agent A Status: ${agentA.code}
Agent B Status: ${agentB.anomalyType}
Transaction Details: ${JSON.stringify(tx)}
Context: Over the last 30 days, this user's median transaction amount was ₹${medianSpend.toFixed(2)}, with an upper statistical outlier fence (IQR) of ₹${upperFence.toFixed(2)}. 
Is this transaction truly anomalous for this specific user's cash flow history? 
Return a strictly formatted JSON object with exactly these three keys: "confidenceScore" (number), "plainTextVerdict" (string), "actionableNextStep" (string).`
        }]
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) return fallback;
    
    const text = await response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      return {
        status: 'RESOLVED',
        confidenceScore: parsed.confidenceScore || fallback.confidenceScore,
        plainTextVerdict: parsed.plainTextVerdict || fallback.plainTextVerdict,
        actionableNextStep: parsed.actionableNextStep || fallback.actionableNextStep
      };
    }
    
    return fallback;
  } catch (err) {
    // Catches AbortError (timeout) or network failure
    return fallback;
  }
}
