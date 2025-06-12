import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export interface DashboardStats {
  waterTreatmentStats: {
    normal: number;
    warning: number;
    critical: number;
    total: number;
  };
  productQualityStats: {
    conformityRate: number;
    testsInProgress: number;
    totalTests: number;
  };
  equipmentStats: {
    availability: number;
    inMaintenance: number;
    total: number;
  };
  shutdownStats: {
    eventsToday: number;
    planned: number;
    unplanned: number;
  };
  alertsCount: number;
  activeUsers: number;
  dataCollected: number;
}

export const useDashboardData = (period: 'today' | Date = 'today') => {
  return useQuery({
    queryKey: ['dashboard-data', period],
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      if (period === 'today') {
        startDate = startOfDay(now);
        endDate = endOfDay(now);
      } else {
        startDate = startOfMonth(period);
        endDate = endOfMonth(period);
      }

      // Statistiques traitement des eaux
      const { data: waterData } = await supabase
        .from('water_treatment_data')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .lte('timestamp', endDate.toISOString());

      const waterStats = {
        normal: waterData?.filter(w => 
          w.ph_level >= 6.5 && w.ph_level <= 8.5 && 
          w.temperature <= 80
        ).length || 0,
        warning: waterData?.filter(w => 
          (w.ph_level < 6.5 || w.ph_level > 8.5) ||
          (w.temperature > 80 && w.temperature <= 90)
        ).length || 0,
        critical: waterData?.filter(w => 
          w.temperature > 90 || w.ph_level < 6 || w.ph_level > 9
        ).length || 0,
        total: waterData?.length || 0
      };

      // Statistiques qualité produits
      const { data: qualityData } = await supabase
        .from('product_quality_data')
        .select('*')
        .gte('test_date', startDate.toISOString())
        .lte('test_date', endDate.toISOString());

      const conformTests = qualityData?.filter(q => q.quality_status === 'conforme').length || 0;
      const totalTests = qualityData?.length || 0;
      const testsInProgress = qualityData?.filter(q => q.quality_status === 'en_cours').length || 0;

      // Statistiques équipements
      const { data: equipmentData } = await supabase
        .from('equipment_data')
        .select('*');

      const availableEquipment = equipmentData?.filter(e => e.status === 'operational').length || 0;
      const maintenanceEquipment = equipmentData?.filter(e => e.status === 'maintenance').length || 0;
      const totalEquipment = equipmentData?.length || 0;

      // Statistiques arrêts/démarrages
      const { data: shutdownData } = await supabase
        .from('shutdown_startup_events')
        .select('*')
        .gte('start_time', startDate.toISOString())
        .lte('start_time', endDate.toISOString());

      const plannedEvents = shutdownData?.filter(s => s.cause_category === 'planned').length || 0;
      const unplannedEvents = shutdownData?.filter(s => s.cause_category === 'unplanned').length || 0;

      // Alertes système
      const { data: alertsData } = await supabase
        .from('system_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .gte('created_at', startDate.toISOString());

      // Utilisateurs actifs (approximation)
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*');

      // Données collectées
      const totalDataPoints = (waterData?.length || 0) + (qualityData?.length || 0) + (shutdownData?.length || 0);

      return {
        waterTreatmentStats: waterStats,
        productQualityStats: {
          conformityRate: totalTests > 0 ? (conformTests / totalTests) * 100 : 0,
          testsInProgress,
          totalTests
        },
        equipmentStats: {
          availability: totalEquipment > 0 ? (availableEquipment / totalEquipment) * 100 : 0,
          inMaintenance: maintenanceEquipment,
          total: totalEquipment
        },
        shutdownStats: {
          eventsToday: shutdownData?.length || 0,
          planned: plannedEvents,
          unplanned: unplannedEvents
        },
        alertsCount: alertsData?.length || 0,
        activeUsers: usersData?.length || 0,
        dataCollected: totalDataPoints
      };
    },
  });
};
