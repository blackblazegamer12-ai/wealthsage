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
    <div className="lg:col-span-2 bg-sage-dark p-6 rounded-xl border border-white/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold border-b border-white/10 pb-2">Recent Transactions</h2>
        <input
          type="text"
          placeholder="Search transactions..."
          onChange={(e) => handleSearch(e.target.value)}
          className="px-3 py-1.5 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-white/30"
        />
      </div>
      <div className="space-y-4">
        {filteredTransactions.map((tx) => (
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