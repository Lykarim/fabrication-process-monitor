
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';

interface MetricsChartProps {
  data: any[];
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  lineColor?: string;
}

export function MetricsChart({ data, title, xAxisKey, yAxisKey, lineColor = "#8884d8" }: MetricsChartProps) {
  const [dateRange, setDateRange] = useState<string>('7d');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const filterDataByRange = (data: any[]) => {
    const now = new Date();
    let filteredData = [...data];

    if (dateRange === 'custom' && startDate && endDate) {
      filteredData = data.filter(item => {
        const itemDate = new Date(item[xAxisKey]);
        return itemDate >= startDate && itemDate <= endDate;
      });
    } else {
      const days = parseInt(dateRange.replace('d', ''));
      const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filteredData = data.filter(item => {
        const itemDate = new Date(item[xAxisKey]);
        return itemDate >= cutoffDate;
      });
    }

    return filteredData.sort((a, b) => new Date(a[xAxisKey]).getTime() - new Date(b[xAxisKey]).getTime());
  };

  const chartData = filterDataByRange(data);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 jours</SelectItem>
                <SelectItem value="30d">30 jours</SelectItem>
                <SelectItem value="90d">90 jours</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
            
            {dateRange === 'custom' && (
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {startDate ? format(startDate, 'dd/MM/yyyy', { locale: fr }) : 'Début'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {endDate ? format(endDate, 'dd/MM/yyyy', { locale: fr }) : 'Fin'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey={xAxisKey}
              tickFormatter={(value) => format(new Date(value), 'dd/MM', { locale: fr })}
            />
            <YAxis />
            <Tooltip 
              labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: fr })}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={yAxisKey} 
              stroke={lineColor} 
              strokeWidth={2}
              dot={{ fill: lineColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
