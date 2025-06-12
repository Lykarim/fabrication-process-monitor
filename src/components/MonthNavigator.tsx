
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MonthNavigatorProps {
  currentDate: Date | 'today';
  onDateChange: (date: Date | 'today') => void;
}

export function MonthNavigator({ currentDate, onDateChange }: MonthNavigatorProps) {
  const isToday = currentDate === 'today';
  const displayDate = isToday ? new Date() : currentDate;

  const goToPreviousMonth = () => {
    if (isToday) {
      onDateChange(subMonths(new Date(), 1));
    } else {
      onDateChange(subMonths(currentDate, 1));
    }
  };

  const goToNextMonth = () => {
    const nextMonth = isToday ? new Date() : addMonths(currentDate, 1);
    const now = new Date();
    
    // Ne pas aller au-delà du mois actuel
    if (nextMonth.getMonth() <= now.getMonth() && nextMonth.getFullYear() <= now.getFullYear()) {
      if (nextMonth.getMonth() === now.getMonth() && nextMonth.getFullYear() === now.getFullYear()) {
        onDateChange('today');
      } else {
        onDateChange(nextMonth);
      }
    }
  };

  const goToToday = () => {
    onDateChange('today');
  };

  const canGoNext = () => {
    if (isToday) return false;
    const now = new Date();
    return currentDate.getMonth() < now.getMonth() || currentDate.getFullYear() < now.getFullYear();
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-2 min-w-40 justify-center">
        <Calendar className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isToday ? 'Aujourd\'hui' : format(displayDate, 'MMMM yyyy', { locale: fr })}
        </span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={goToNextMonth}
        disabled={!canGoNext()}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      
      {!isToday && (
        <Button variant="default" size="sm" onClick={goToToday}>
          Aujourd'hui
        </Button>
      )}
    </div>
  );
}
