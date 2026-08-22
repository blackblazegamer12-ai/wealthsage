'use client';

import React, { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { formatCurrency } from '../../lib/utils';
import { Transaction } from '../../types'; // Adjust path if your types file is located elsewhere
interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
    }, 300),
    []
  );

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((tx) =>
    tx.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lg:col-span-2 p-6 rounded-xl royal-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold pb-2" style={{ color: 'var(--text-primary)', borderBottom: '1px solid var(--border-subtle)' }}>Recent Transactions</h2>
        <input
          type="text"
          placeholder="Search transactions..."
          onChange={(e) => handleSearch(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-sm focus:outline-none"
          style={{ backgroundColor: 'var(--surface-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}
        />
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
          <div key={tx.id} className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'var(--surface-overlay)' }}>
            <div>
              <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{tx.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{tx.date} • {tx.category}</p>
            </div>
            <p className={`font-bold ${tx.type === 'income' ? 'text-green-400' : ''}`} style={tx.type !== 'income' ? { color: 'var(--text-primary)' } : undefined}>
              {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}