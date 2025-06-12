
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TrendData {
  date: string;
  conformityRate: number;
  totalDataPoints: number;
}

interface TrendChartsProps {
  data: TrendData[];
}

export function TrendCharts({ data }: TrendChartsProps) {
  return (
    <div className="space-y-6">
      <div className="w-full">
        <h4 className="text-sm font-medium mb-2">Évolution de la Conformité Qualité</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Conformité']}
              />
              <Line 
                type="monotone" 
                dataKey="conformityRate" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="w-full">
        <h4 className="text-sm font-medium mb-2">Volume de Données Collectées</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalDataPoints" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
