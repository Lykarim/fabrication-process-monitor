
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Filter, Download, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useShutdownStartupData } from '@/hooks/useShutdownStartupData';

export function ShutdownStartupHistory() {
  const { data: shutdownData, isLoading } = useShutdownStartupData();
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    unit: 'all',
    eventType: 'all',
    status: 'all'
  });

  if (isLoading) {
    return <div>Chargement de l'historique...</div>;
  }

  const filteredData = shutdownData?.filter(event => {
    const eventDate = new Date(event.start_time);
    const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const toDate = filters.dateTo ? new Date(filters.dateTo) : null;

    if (fromDate && eventDate < fromDate) return false;
    if (toDate && eventDate > toDate) return false;
    if (filters.unit !== 'all' && event.unit_name !== filters.unit) return false;
    if (filters.eventType !== 'all' && event.event_type !== filters.eventType) return false;
    if (filters.status !== 'all' && event.status !== filters.status) return false;

    return true;
  }) || [];

  const exportData = () => {
    const csv = [
      ['Date', 'Unité', 'Type', 'Statut', 'Durée', 'Opérateur', 'Phases terminées', 'Anomalies'],
      ...filteredData.map(event => [
        new Date(event.start_time).toLocaleDateString('fr-FR'),
        event.unit_name,
        event.event_type,
        event.status,
        event.duration_hours ? `${event.duration_hours}h` : '-',
        event.operator_name || '-',
        // Safely handle potentially missing properties
        event.phases ? JSON.parse(event.phases).filter((p: any) => p.status === 'completed').length : 0,
        event.anomalies ? JSON.parse(event.anomalies).length : 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique_arrets_demarrages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <Label>Date de début</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div>
              <Label>Date de fin</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
            <div>
              <Label>Unité</Label>
              <Select value={filters.unit} onValueChange={(value) => setFilters({ ...filters, unit: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="distillation">Distillation</SelectItem>
                  <SelectItem value="reforming">Reforming</SelectItem>
                  <SelectItem value="hydrotraitement">Hydrotraitement</SelectItem>
                  <SelectItem value="cracking">Cracking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select value={filters.eventType} onValueChange={(value) => setFilters({ ...filters, eventType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="shutdown">Arrêt</SelectItem>
                  <SelectItem value="startup">Démarrage</SelectItem>
                  <SelectItem value="planned_shutdown">Arrêt planifié</SelectItem>
                  <SelectItem value="emergency_shutdown">Arrêt d'urgence</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={exportData} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="detailed">Vue détaillée</TabsTrigger>
          <TabsTrigger value="statistics">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {filteredData.map((event, index) => (
            <EventTimelineCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {filteredData.map((event, index) => (
            <DetailedEventCard key={event.id} event={event} />
          ))}
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsView data={filteredData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventTimelineCard({ event }: { event: any }) {
  // Safely handle potentially missing properties
  const phases = event.phases ? JSON.parse(event.phases) : [];
  const anomalies = event.anomalies ? JSON.parse(event.anomalies) : [];
  const supervisorValidation = event.supervisor_validation ? JSON.parse(event.supervisor_validation) : null;

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="font-semibold">
                {new Date(event.start_time).toLocaleDateString('fr-FR')}
              </span>
              <Badge variant="outline">{event.unit_name}</Badge>
              <Badge variant={
                event.event_type === 'emergency_shutdown' ? 'destructive' :
                event.event_type === 'startup' ? 'default' : 'secondary'
              }>
                {event.event_type}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="text-sm">
                  {event.duration_hours ? `${event.duration_hours}h` : 'En cours'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">
                  {phases.filter((p: any) => p.status === 'completed').length}/{phases.length} phases
                </span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-sm">
                  {anomalies.length} anomalie{anomalies.length > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {supervisorValidation?.validated && (
              <div className="mt-2">
                <Badge variant="default" className="bg-green-500">
                  Validé par {supervisorValidation.validatedBy}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailedEventCard({ event }: { event: any }) {
  // Safely handle potentially missing properties
  const phases = event.phases ? JSON.parse(event.phases) : [];
  const anomalies = event.anomalies ? JSON.parse(event.anomalies) : [];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>{event.unit_name} - {event.event_type}</span>
          <Badge variant="outline">
            {new Date(event.start_time).toLocaleDateString('fr-FR')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phases */}
        {phases.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Phases réalisées</h4>
            <div className="space-y-2">
              {phases.map((phase: any, index: number) => (
                <div key={phase.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>{phase.name}</span>
                  <div className="flex items-center gap-2">
                    {phase.startTime && (
                      <span className="text-xs text-gray-500">
                        {new Date(phase.startTime).toLocaleTimeString('fr-FR')}
                      </span>
                    )}
                    {phase.duration && (
                      <span className="text-xs text-gray-500">
                        ({phase.duration}min)
                      </span>
                    )}
                    <Badge variant={phase.status === 'completed' ? 'default' : 'outline'}>
                      {phase.status === 'completed' ? 'Terminé' : 'En cours'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anomalies */}
        {anomalies.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2">Anomalies signalées</h4>
            <div className="space-y-2">
              {anomalies.map((anomaly: any) => (
                <div key={anomaly.id} className="p-2 border rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={
                      anomaly.severity === 'critical' ? 'destructive' : 'outline'
                    }>
                      {anomaly.severity}
                    </Badge>
                    {anomaly.resolved && <Badge variant="default">Résolu</Badge>}
                  </div>
                  <p className="text-sm">{anomaly.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Par {anomaly.reportedBy} le {new Date(anomaly.reportedAt).toLocaleString('fr-FR')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatisticsView({ data }: { data: any[] }) {
  const totalEvents = data.length;
  const completedEvents = data.filter(e => e.status === 'completed').length;
  const averageDuration = data.length > 0 ? data.reduce((sum, e) => sum + (e.duration_hours || 0), 0) / totalEvents : 0;
  
  const eventsByUnit = data.reduce((acc, event) => {
    acc[event.unit_name] = (acc[event.unit_name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalAnomalies = data.reduce((sum, event) => {
    const anomalies = event.anomalies ? JSON.parse(event.anomalies) : [];
    return sum + anomalies.length;
  }, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalEvents}</div>
          <div className="text-sm text-gray-600">Événements total</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedEvents}</div>
          <div className="text-sm text-gray-600">Événements terminés</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{averageDuration.toFixed(1)}h</div>
          <div className="text-sm text-gray-600">Durée moyenne</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{totalAnomalies}</div>
          <div className="text-sm text-gray-600">Anomalies totales</div>
        </CardContent>
      </Card>

      <Card className="col-span-2 md:col-span-4">
        <CardHeader>
          <CardTitle>Répartition par unité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(eventsByUnit).map(([unit, count]) => (
              <div key={unit} className="flex justify-between items-center">
                <span className="capitalize">{unit.replace('_', ' ')}</span>
                <Badge variant="outline">{String(count)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
