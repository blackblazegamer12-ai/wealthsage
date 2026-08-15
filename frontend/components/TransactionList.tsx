// components/TransactionList.tsx
import { Transaction } from '../types';
import { formatCurrency } from '../lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="lg:col-span-2 bg-sage-dark p-6 rounded-xl border border-white/5">
      <h2 className="text-xl font-bold mb-6 border-b border-white/10 pb-2">Recent Transactions</h2>
      <div className="space-y-4">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center p-4 bg-sage-light/50 rounded-lg">
            <div>
              <p className="font-semibold">{tx.name}</p>
              <p className="text-sm text-text-muted">{tx.date} • {tx.category}</p>
            </div>
            <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}