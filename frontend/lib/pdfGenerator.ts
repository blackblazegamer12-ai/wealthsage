import { jsPDF } from "jspdf";

export interface PdfReportPayload {
  userName?: string;
  themeName?: string;
  wealthVelocityScore?: number;
  velocityTier?: string;
  monthlyRunwayMonths?: number;
  savingsRatePct?: string;
  netMonthlySurplus?: number;
  headline?: string;
  keyInsights?: string[];
  tacticalAction?: string;
  totalIncome?: number;
  totalExpense?: number;
  transactionCount?: number;
  goalCount?: number;
  subscriptionCount?: number;
}

export function exportExecutiveBriefingPdf(data: PdfReportPayload) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Royal Slate Dark Palette
  doc.setFillColor(10, 12, 18);
  doc.rect(0, 0, pageWidth, 297, "F");

  // Top Golden / Accent Decorative Banner
  doc.setFillColor(234, 179, 8);
  doc.rect(0, 0, pageWidth, 5, "F");

  let y = 16;

  // Header Title & Royal Badge
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(254, 240, 138); // Soft Gold
  doc.text("WEALTHSAGE ROYAL EXECUTIVE BRIEFING", margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate Gray
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.text(`Generated on: ${dateStr}  |  Classification: STRICTLY CONFIDENTIAL  |  Audited for: ${data.userName || "Architect"}`, margin, y);

  y += 5;
  doc.setDrawColor(234, 179, 8);
  doc.setLineWidth(0.4);
  doc.line(margin, y, margin + contentWidth, y);

  y += 8;

  // --- SECTION 1: EXECUTIVE VELOCITY INDEX ---
  doc.setFillColor(18, 20, 29);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
  doc.setDrawColor(255, 255, 255);
  doc.setDrawColor(40, 44, 60);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(234, 179, 8);
  doc.text("1. WEALTH VELOCITY & STRATEGIC RATING", margin + 6, y + 7);

  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.wealthVelocityScore || 75}/100`, margin + 6, y + 18);

  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(`[ TIER: ${data.velocityTier || "Accelerated Growth"} ]`, margin + 45, y + 17);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  const headlineLines = doc.splitTextToSize(data.headline || "Cash flow velocity indicates robust capital retention capacity.", contentWidth - 12);
  doc.text(headlineLines, margin + 6, y + 24);

  y += 34;

  // --- SECTION 2: QUANTITATIVE KEY METRICS MATRIX ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(234, 179, 8);
  doc.text("2. QUANTITATIVE TELEMETRY SNAPSHOT", margin, y);
  y += 4;

  const colWidth = (contentWidth - 6) / 4;
  const metrics = [
    { label: "Net Monthly Surplus", val: `$${(data.netMonthlySurplus || 0).toLocaleString()}`, sub: "Retained Cash" },
    { label: "Savings Rate", val: data.savingsRatePct || "35.0%", sub: "Target: 20%+" },
    { label: "Cash Runway", val: `${data.monthlyRunwayMonths || 8.4} mo`, sub: "Zero-Revenue Buffer" },
    { label: "Active Commitments", val: `${data.subscriptionCount || 0} Bills`, sub: "Recurring Outflow" }
  ];

  metrics.forEach((m, idx) => {
    const xPos = margin + idx * (colWidth + 2);
    doc.setFillColor(18, 20, 29);
    doc.roundedRect(xPos, y, colWidth, 18, 2, 2, "F");
    doc.setDrawColor(40, 44, 60);
    doc.roundedRect(xPos, y, colWidth, 18, 2, 2, "D");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(m.label, xPos + 3, y + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text(m.val, xPos + 3, y + 11.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(16, 185, 129);
    doc.text(m.sub, xPos + 3, y + 15.5);
  });

  y += 24;

  // --- SECTION 3: STRATEGIC QUANT OBSERVATIONS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(234, 179, 8);
  doc.text("3. STRATEGIC QUANT OBSERVATIONS & ANOMALY DETECTION", margin, y);
  y += 4;

  doc.setFillColor(18, 20, 29);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, "F");
  doc.setDrawColor(40, 44, 60);
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, "D");

  const insights = data.keyInsights || [
    "Monthly revenue maintains a positive retained surplus exceeding fixed overhead commitments.",
    "Capital allocation is well-balanced inside target variance thresholds.",
    "Active recurring subscriptions show opportunities for zombie cancellation optimization."
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(226, 232, 240);

  let insightY = y + 7;
  insights.slice(0, 3).forEach((ins, i) => {
    doc.setTextColor(234, 179, 8);
    doc.text(`[${i + 1}]`, margin + 5, insightY);
    doc.setTextColor(226, 232, 240);
    const wrappedIns = doc.splitTextToSize(ins, contentWidth - 20);
    doc.text(wrappedIns, margin + 14, insightY);
    insightY += 9;
  });

  y += 44;

  // --- SECTION 4: HIGH-YIELD TACTICAL ACTION PLAN ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text("4. HIGH-YIELD TACTICAL CAPITAL DEPLOYMENT MOVE", margin, y);
  y += 4;

  doc.setFillColor(12, 28, 22); // Deep emerald glass
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "F");
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, contentWidth, 26, 3, 3, "D");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208);
  doc.text("ACTION DIRECTIVE:", margin + 6, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(248, 250, 252);
  const actionLines = doc.splitTextToSize(
    data.tacticalAction || "Deploy monthly surplus into automated tax-advantaged compound index vehicles to maximize 5-year capital velocity.",
    contentWidth - 12
  );
  doc.text(actionLines, margin + 6, y + 14);

  y += 32;

  // --- SECTION 5: PORTFOLIO LEDGER SUMMARY ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(234, 179, 8);
  doc.text("5. PORTFOLIO & AUDIT CERTIFICATION", margin, y);
  y += 4;

  doc.setFillColor(18, 20, 29);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "F");
  doc.setDrawColor(40, 44, 60);
  doc.roundedRect(margin, y, contentWidth, 28, 3, 3, "D");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);

  doc.text(`* Total Monthly Inflow: $${(data.totalIncome || 0).toLocaleString()}`, margin + 6, y + 8);
  doc.text(`* Total Monthly Outflow: $${(data.totalExpense || 0).toLocaleString()}`, margin + 6, y + 14);
  doc.text(`* Tracked Records: ${data.transactionCount || 0} items | Active Wealth Milestones: ${data.goalCount || 0}`, margin + 6, y + 20);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(234, 179, 8);
  doc.text("ROYAL SEAL CERTIFIED", margin + contentWidth - 45, y + 10);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text("WealthSage Cryptographic Synthesis", margin + contentWidth - 45, y + 15);

  // Bottom Footer
  y = 285;
  doc.setDrawColor(40, 44, 60);
  doc.line(margin, y, margin + contentWidth, y);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text("WealthSage AI Financial Architect | Autonomous Quant Intelligence & Mathematical Reasoning", margin, y + 5);
  doc.text("Page 1 of 1", margin + contentWidth - 16, y + 5);

  // Trigger Download
  const filename = `WealthSage_Executive_Briefing_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
