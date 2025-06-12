
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShutdownStartupTable } from '@/components/tables/ShutdownStartupTable';
import { useShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Power, AlertTriangle, Clock, Activity } from 'lucide-react';

export function ShutdownStartupDashboard() {
  const { data: shutdownData, isLoading } = useShutdownStartupData();

  if (isLoading) {
    return <div>Chargement des données d'arrêts/démarrages...</div>;
  }

  const eventStats = shutdownData?.reduce((acc, event) => {
    acc[event.event_type] = (acc[event.event_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const statusStats = shutdownData?.reduce((acc, event) => {
    acc[event.status] = (acc[event.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const ongoingEvents = shutdownData?.filter(event => event.status === 'ongoing') || [];
  const plannedEvents = shutdownData?.filter(event => event.status === 'planned') || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Power className="w-6 h-6 text-red-600" />
        <h1 className="text-2xl font-bold">Arrêts et Démarrages</h1>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              En Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusStats.ongoing || 0}</div>
            <div className="text-sm text-gray-600">événements actifs</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Planifiés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statusStats.planned || 0}</div>
            <div className="text-sm text-gray-600">événements prévus</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Arrêts d'Urgence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{eventStats.emergency_shutdown || 0}</div>
            <div className="text-sm text-gray-600">ce mois</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusStats.completed || 0}</div>
            <div className="text-sm text-gray-600">événements</div>
          </CardContent>
        </Card>
      </div>

      {/* Événements en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            Événements en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ongoingEvents.map(event => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <div className="font-medium capitalize">{event.unit_name.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-600">
                    Début: {new Date(event.start_time).toLocaleString('fr-FR')}
                  </div>
                  {event.reason && (
                    <div className="text-sm text-gray-500 mt-1">{event.reason}</div>
                  )}
                </div>
                <Badge variant={
                  event.event_type === 'emergency_shutdown' ? 'destructive' :
                  event.event_type === 'startup' ? 'default' : 'secondary'
                } className={
                  event.event_type === 'startup' ? 'bg-green-500' :
                  event.event_type === 'emergency_shutdown' ? '' : 'bg-orange-500'
                }>
                  {event.event_type === 'startup' ? 'Démarrage' :
                   event.event_type === 'emergency_shutdown' ? 'Arrêt urgence' :
                   event.event_type === 'planned_shutdown' ? 'Arrêt planifié' : 'Arrêt'}
                </Badge>
              </div>
            ))}
            {ongoingEvents.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Aucun événement en cours
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Événements planifiés */}
      {plannedEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Événements Planifiés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {plannedEvents.slice(0, 5).map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">{event.unit_name.replace('_', ' ')}</div>
                    <div className="text-sm text-gray-600">
                      Prévu: {new Date(event.start_time).toLocaleString('fr-FR')}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-orange-500 text-white">
                    Planifié
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau des événements */}
      <ShutdownStartupTable />
    </div>
  );
}
