
import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

interface UseFilteredDataProps {
  data: any[];
  dateKey: string;
  selectedPeriod: 'today' | Date;
}

export function useFilteredData({ data, dateKey, selectedPeriod }: UseFilteredDataProps) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    if (selectedPeriod === 'today') {
      const today = new Date();
      const dayStart = startOfDay(today);
      const dayEnd = endOfDay(today);
      
      return data.filter(item => {
        if (!item[dateKey]) return false;
        try {
          const itemDate = parseISO(item[dateKey]);
          return isWithinInterval(itemDate, { start: dayStart, end: dayEnd });
        } catch {
          return false;
        }
      });
    } else {
      const monthStart = startOfMonth(selectedPeriod);
      const monthEnd = endOfMonth(selectedPeriod);
      
      return data.filter(item => {
        if (!item[dateKey]) return false;
        try {
          const itemDate = parseISO(item[dateKey]);
          return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
        } catch {
          return false;
        }
      });
    }
  }, [data, dateKey, selectedPeriod]);
}
