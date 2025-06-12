
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendData {
  waterMeasures: number;
  conformityRate: number;
  equipmentEfficiency: number;
  shutdownEvents: number;
}

interface TrendIndicatorsProps {
  latestData?: TrendData;
  previousData?: TrendData;
}

const getTrendIcon = (current: number, previous: number) => {
  if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-500" />;
};

export function TrendIndicators({ latestData, previousData }: TrendIndicatorsProps) {
  if (!latestData) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Mesures Eau</div>
          <div className="text-lg font-semibold">{latestData.waterMeasures || 0}</div>
        </div>
        {previousData && getTrendIcon(latestData.waterMeasures || 0, previousData.waterMeasures)}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Conformité (%)</div>
          <div className="text-lg font-semibold">{(latestData.conformityRate || 0).toFixed(1)}%</div>
        </div>
        {previousData && getTrendIcon(latestData.conformityRate || 0, previousData.conformityRate)}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Efficacité (%)</div>
          <div className="text-lg font-semibold">{(latestData.equipmentEfficiency || 0).toFixed(1)}%</div>
        </div>
        {previousData && getTrendIcon(latestData.equipmentEfficiency || 0, previousData.equipmentEfficiency)}
      </div>
      
      <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
        <div>
          <div className="text-sm text-gray-600">Événements</div>
          <div className="text-lg font-semibold">{latestData.shutdownEvents || 0}</div>
        </div>
        {previousData && getTrendIcon(previousData.shutdownEvents, latestData.shutdownEvents || 0)}
      </div>
    </div>
  );
}
