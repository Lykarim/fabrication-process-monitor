import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths, addMonths, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartData {
  [key: string]: any;
  date?: string;
  created_at?: string;
  test_date?: string;
  start_time?: string;
  timestamp?: string;
  recorded_at?: string;
}

interface AdvancedMetricsChartProps {
  data: ChartData[];
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  groupByKey?: string;
  chartType?: 'line' | 'bar';
  colorScheme?: string[];
}

export function AdvancedMetricsChart({
  data,
  title,
  xAxisKey,
  yAxisKey,
  groupByKey,
  chartType = 'line',
  colorScheme = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']
}: AdvancedMetricsChartProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [filterType, setFilterType] = useState<'month' | 'range'>('month');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // Déterminer automatiquement la clé de date
  const getDateKey = (item: ChartData): string | null => {
    const possibleKeys = ['date', 'created_at', 'test_date', 'start_time', 'timestamp', 'recorded_at'];
    for (const key of possibleKeys) {
      if (item[key]) return key;
    }
    return null;
  };

  // Obtenir toutes les valeurs uniques pour le groupement
  const groupOptions = useMemo(() => {
    if (!groupByKey) return [];
    const uniqueValues = [...new Set(data.map(item => item[groupByKey]).filter(Boolean))];
    return uniqueValues.map(value => ({ value: String(value), label: String(value) }));
  }, [data, groupByKey]);

  // Filtrer les données selon les critères sélectionnés
  const filteredData = useMemo(() => {
    let filtered = data;

    // Filtre par date
    if (filterType === 'month') {
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      
      filtered = filtered.filter(item => {
        const dateKey = getDateKey(item);
        if (!dateKey || !item[dateKey]) return false;
        
        try {
          const itemDate = parseISO(item[dateKey]);
          return isWithinInterval(itemDate, { start: monthStart, end: monthEnd });
        } catch {
          return false;
        }
      });
    } else if (filterType === 'range' && dateRange.from && dateRange.to) {
      filtered = filtered.filter(item => {
        const dateKey = getDateKey(item);
        if (!dateKey || !item[dateKey]) return false;
        
        try {
          const itemDate = parseISO(item[dateKey]);
          return isWithinInterval(itemDate, { start: dateRange.from!, end: dateRange.to! });
        } catch {
          return false;
        }
      });
    }

    // Filtre par groupe
    if (groupFilter !== 'all' && groupByKey) {
      filtered = filtered.filter(item => String(item[groupByKey]) === groupFilter);
    }

    return filtered;
  }, [data, filterType, selectedMonth, dateRange, groupFilter, groupByKey]);

  // Préparer les données pour le graphique
  const chartData = useMemo(() => {
    if (!groupByKey) {
      return filteredData.map(item => {
        const dateKey = getDateKey(item);
        return {
          ...item,
          [xAxisKey]: dateKey ? format(parseISO(item[dateKey]), 'dd/MM') : item[xAxisKey]
        };
      });
    }

    // Grouper les données
    const grouped = filteredData.reduce((acc, item) => {
      const dateKey = getDateKey(item);
      const dateValue = dateKey ? format(parseISO(item[dateKey]), 'dd/MM/yyyy') : item[xAxisKey];
      const groupValue = item[groupByKey];
      
      if (!acc[dateValue]) {
        acc[dateValue] = { [xAxisKey]: dateValue };
      }
      acc[dateValue][groupValue] = item[yAxisKey];
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [filteredData, xAxisKey, yAxisKey, groupByKey]);

  const previousMonth = () => {
    setSelectedMonth(subMonths(selectedMonth, 1));
  };

  const nextMonth = () => {
    setSelectedMonth(addMonths(selectedMonth, 1));
  };

  const ChartComponent = chartType === 'line' ? LineChart : BarChart;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        
        {/* Contrôles de filtre */}
        <div className="flex flex-wrap gap-4 items-center">
          <Select value={filterType} onValueChange={(value: 'month' | 'range') => setFilterType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Par mois</SelectItem>
              <SelectItem value="range">Plage personnalisée</SelectItem>
            </SelectContent>
          </Select>

          {filterType === 'month' ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-32 text-center">
                {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
              </span>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, 'dd/MM/yyyy') : 'Date début'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, from: date }))}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, 'dd/MM/yyyy') : 'Date fin'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange(prev => ({ ...prev, to: date }))}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {groupOptions.length > 0 && (
            <Select value={groupFilter} onValueChange={setGroupFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les groupes</SelectItem>
                {groupOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxisKey} 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              
              {groupByKey ? (
                groupOptions.map((group, index) => (
                  chartType === 'line' ? (
                    <Line
                      key={group.value}
                      type="monotone"
                      dataKey={group.value}
                      stroke={colorScheme[index % colorScheme.length]}
                      strokeWidth={2}
                    />
                  ) : (
                    <Bar
                      key={group.value}
                      dataKey={group.value}
                      fill={colorScheme[index % colorScheme.length]}
                    />
                  )
                ))
              ) : (
                chartType === 'line' ? (
                  <Line
                    type="monotone"
                    dataKey={yAxisKey}
                    stroke={colorScheme[0]}
                    strokeWidth={2}
                  />
                ) : (
                  <Bar
                    dataKey={yAxisKey}
                    fill={colorScheme[0]}
                  />
                )
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
