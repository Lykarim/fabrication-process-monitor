
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WaterTreatmentTable } from '@/components/tables/WaterTreatmentTable';
import { AdvancedMetricsChart } from '@/components/charts/AdvancedMetricsChart';
import { useWaterTreatmentData } from '@/hooks/useWaterTreatmentData';
import { useWaterParameterLimits } from '@/hooks/useWaterParameterLimits';
import { Droplets, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

export function WaterTreatmentDashboard() {
  const { data: waterData, isLoading } = useWaterTreatmentData();
  const { data: parameterLimits } = useWaterParameterLimits();

  const alerts = useMemo(() => {
    if (!waterData || !parameterLimits) return [];
    
    const alertList: any[] = [];
    
    waterData.forEach(record => {
      ['ph_level', 'tac_level', 'ta_level', 'th_level', 'chlore_libre', 'sio2_level', 'phosphates'].forEach(param => {
        const value = record[param as keyof typeof record] as number;
        if (value != null) {
          const limit = parameterLimits.find(l => 
            l.parameter_name === param && 
            l.equipment_type === record.equipment_type
          );
          
          if (limit) {
            if ((limit.min_value && value < limit.min_value) || 
                (limit.max_value && value > limit.max_value)) {
              alertList.push({
                equipment: record.equipment_name,
                parameter: param,
                value,
                limit,
                severity: 'high'
              });
            }
          }
        }
      });
    });
    
    return alertList;
  }, [waterData, parameterLimits]);

  const stats = useMemo(() => {
    if (!waterData) return null;

    const equipmentCount = new Set(waterData.map(r => r.equipment_name)).size;
    const normalCount = waterData.filter(r => r.status === 'normal').length;
    const warningCount = waterData.filter(r => r.status === 'warning').length;
    const alarmCount = waterData.filter(r => r.status === 'alarm').length;
    
    return {
      equipmentCount,
      normalCount,
      warningCount,
      alarmCount,
      alertsCount: alerts.length
    };
  }, [waterData, alerts]);

  const recentData = useMemo(() => {
    if (!waterData) return [];
    return waterData
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
  }, [waterData]);

  if (isLoading) {
    return <div>Chargement des données de traitement d'eau...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Droplets className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold">Traitement des Eaux</h1>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              Équipements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats?.equipmentCount || 0}</div>
            <div className="text-sm text-gray-600">actifs</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Normal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.normalCount || 0}</div>
            <div className="text-sm text-gray-600">équipements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              Avertissement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats?.warningCount || 0}</div>
            <div className="text-sm text-gray-600">équipements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Alarme
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.alarmCount || 0}</div>
            <div className="text-sm text-gray-600">équipements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Alertes Seuils
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.alertsCount || 0}</div>
            <div className="text-sm text-gray-600">dépassements</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes de paramètres */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Alertes de Paramètres
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium">{alert.equipment}</div>
                    <div className="text-sm text-gray-600">
                      {alert.parameter}: {alert.value} 
                      {alert.limit.min_value && alert.value < alert.limit.min_value && 
                        ` (< ${alert.limit.min_value})`}
                      {alert.limit.max_value && alert.value > alert.limit.max_value && 
                        ` (> ${alert.limit.max_value})`}
                    </div>
                  </div>
                  <Badge variant="destructive">Dépassement</Badge>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  Aucune alerte de paramètre en cours
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Graphiques avancés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AdvancedMetricsChart
          data={waterData || []}
          title="Évolution du pH par équipement"
          xAxisKey="timestamp"
          yAxisKey="ph_level"
          groupByKey="equipment_name"
          chartType="line"
          colorScheme={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
        />
        
        <AdvancedMetricsChart
          data={waterData || []}
          title="Évolution de la température"
          xAxisKey="timestamp"
          yAxisKey="temperature"
          groupByKey="equipment_type"
          chartType="line"
          colorScheme={["#ef4444", "#f59e0b", "#10b981"]}
        />
      </div>

      {/* Données récentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Mesures Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentData.map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{record.equipment_name}</div>
                  <div className="text-sm text-gray-600">
                    pH: {record.ph_level || '-'} | Temp: {record.temperature || '-'}°C | 
                    {new Date(record.timestamp).toLocaleString('fr-FR')}
                  </div>
                </div>
                <Badge variant={
                  record.status === 'normal' ? 'default' :
                  record.status === 'warning' ? 'secondary' : 'destructive'
                } className={
                  record.status === 'normal' ? 'bg-green-500' :
                  record.status === 'warning' ? 'bg-yellow-500' : ''
                }>
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tableau des données */}
      <WaterTreatmentTable />
    </div>
  );
}
