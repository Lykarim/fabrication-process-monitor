import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendIndicators } from '@/components/trends/TrendIndicators';
import { TrendCharts } from '@/components/trends/TrendCharts';

export function HistoricalTrends() {
  const [period, setPeriod] = useState<'7days' | '30days' | '90days'>('7days');

  const { data: trendsData, isLoading } = useQuery({
    queryKey: ['historical-trends', period],
    queryFn: async () => {
      const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
      const endDate = new Date();
      const startDate = subDays(endDate, days);

      // Récupérer les données par jour
      const dailyData = [];
      for (let i = 0; i < days; i++) {
        const date = subDays(endDate, i);
        const dayStart = startOfDay(date);
        const dayEnd = endOfDay(date);

        // Données traitement des eaux
        const { data: waterData } = await supabase
          .from('water_treatment_data')
          .select('*')
          .gte('timestamp', dayStart.toISOString())
          .lte('timestamp', dayEnd.toISOString());

        // Données qualité produits
        const { data: qualityData } = await supabase
          .from('product_quality_data')
          .select('*')
          .gte('test_date', dayStart.toISOString())
          .lte('test_date', dayEnd.toISOString());

        // Données équipements
        const { data: equipmentData } = await supabase
          .from('equipment_data')
          .select('efficiency_percentage')
          .gte('created_at', dayStart.toISOString())
          .lte('created_at', dayEnd.toISOString());

        // Événements arrêts/démarrages
        const { data: shutdownData } = await supabase
          .from('shutdown_startup_events')
          .select('*')
          .gte('start_time', dayStart.toISOString())
          .lte('start_time', dayEnd.toISOString());

        const conformTests = qualityData?.filter(q => q.quality_status === 'conforme').length || 0;
        const totalTests = qualityData?.length || 0;
        const avgEfficiency = equipmentData?.length > 0 
          ? equipmentData.reduce((sum, eq) => sum + (eq.efficiency_percentage || 0), 0) / equipmentData.length 
          : 0;

        dailyData.push({
          date: format(date, 'dd/MM', { locale: fr }),
          fullDate: date,
          waterMeasures: waterData?.length || 0,
          qualityTests: totalTests,
          conformityRate: totalTests > 0 ? (conformTests / totalTests) * 100 : 0,
          equipmentEfficiency: avgEfficiency,
          shutdownEvents: shutdownData?.length || 0,
          totalDataPoints: (waterData?.length || 0) + (qualityData?.length || 0) + (shutdownData?.length || 0)
        });
      }

      return dailyData.reverse(); // Plus récent en dernier
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Tendances Historiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Chargement des données historiques...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const latestData = trendsData?.[trendsData.length - 1];
  const previousData = trendsData?.[trendsData.length - 2];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Tendances Historiques
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={period === '7days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('7days')}
          >
            7 jours
          </Button>
          <Button
            variant={period === '30days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('30days')}
          >
            30 jours
          </Button>
          <Button
            variant={period === '90days' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('90days')}
          >
            90 jours
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {trendsData && (
          <div className="space-y-6">
            <TrendIndicators latestData={latestData} previousData={previousData} />
            <TrendCharts data={trendsData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
