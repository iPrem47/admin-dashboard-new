import { useMemo } from 'react';
import { ProfitLossEntry, Statistics } from '../types';

export const useStatistics = (entries: ProfitLossEntry[], filterTag: string): Statistics => {
  return useMemo(() => {
    const filteredEntries = filterTag === 'All' ? entries : entries.filter(entry => entry.tag === filterTag);
    
    const totalProfit = filteredEntries
      .filter(entry => entry.amount > 0)
      .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalLoss = Math.abs(filteredEntries
      .filter(entry => entry.amount < 0)
      .reduce((sum, entry) => sum + entry.amount, 0));
    
    const netAmount = totalProfit - totalLoss;
    const totalTransactions = filteredEntries.length;
    const profitTransactions = filteredEntries.filter(entry => entry.amount > 0).length;
    const lossTransactions = filteredEntries.filter(entry => entry.amount < 0).length;
    const pendingTransactions = filteredEntries.filter(entry => entry.status === 'Pending').length;
    
    const profitPercentage = totalTransactions > 0 ? (profitTransactions / totalTransactions) * 100 : 0;
    const avgProfit = profitTransactions > 0 ? totalProfit / profitTransactions : 0;
    const avgLoss = lossTransactions > 0 ? totalLoss / lossTransactions : 0;

    return {
      totalProfit,
      totalLoss,
      netAmount,
      totalTransactions,
      profitTransactions,
      lossTransactions,
      pendingTransactions,
      profitPercentage,
      avgProfit,
      avgLoss
    };
  }, [entries, filterTag]);
};