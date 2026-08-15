// components/MetricCard.tsx
import { formatCurrency } from '../lib/utils';

interface CardProps {
  title: string;
  value: number;
  icon: string;
}

export default function MetricCard({ title, value, icon }: CardProps) {
  return (
    <div className="bg-sage-light p-6 rounded-xl border border-gold/20 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-text-muted font-medium">{title}</h3>
        <span className="text-gold text-xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-white">{formatCurrency(value)}</p>
    </div>
  );
}