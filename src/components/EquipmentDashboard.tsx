
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EquipmentTable } from '@/components/tables/EquipmentTable';
import { useEquipmentData } from '@/hooks/useEquipmentData';
import { Wrench, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export function EquipmentDashboard() {
  const { data: equipmentData, isLoading } = useEquipmentData();

  if (isLoading) {
    return <div>Chargement des données d'équipements...</div>;
  }

  const equipmentStats = equipmentData?.reduce((acc, equipment) => {
    acc[equipment.status] = (acc[equipment.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalEquipment = equipmentData?.length || 0;
  const operationalRate = totalEquipment > 0 ? 
    ((equipmentStats.operational || 0) / totalEquipment * 100).toFixed(1) : 0;

  const avgEfficiency = equipmentData?.length ? 
    equipmentData.reduce((sum, eq) => sum + (eq.efficiency_percentage || 0), 0) / equipmentData.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="w-6 h-6 text-purple-600" />
        <h1 className="text-2xl font-bold">Gestion des Équipements</h1>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Taux de Disponibilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalRate}%</div>
            <div className="text-sm text-gray-600">
              {equipmentStats.operational || 0} / {totalEquipment} équipements
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              En Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{equipmentStats.maintenance || 0}</div>
            <div className="text-sm text-gray-600">équipements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              Arrêtés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{equipmentStats.stopped || 0}</div>
            <div className="text-sm text-gray-600">équipements</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Efficacité Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgEfficiency.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">sur tous les équipements</div>
          </CardContent>
        </Card>
      </div>

      {/* Alertes équipements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Alertes Équipements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {equipmentData?.filter(eq => eq.status === 'alarm' || eq.status === 'stopped').map(equipment => (
              <div key={equipment.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <div className="font-medium">{equipment.equipment_name}</div>
                  <div className="text-sm text-gray-600">
                    {equipment.equipment_id} - {equipment.location}
                  </div>
                </div>
                <Badge variant={equipment.status === 'alarm' ? 'destructive' : 'secondary'}>
                  {equipment.status === 'alarm' ? 'Alarme' : 'Arrêté'}
                </Badge>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">
                Aucune alerte d'équipement en cours
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tableau des équipements */}
      <EquipmentTable />
    </div>
  );
}
