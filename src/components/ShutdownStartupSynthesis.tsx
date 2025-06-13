
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Calendar, BarChart3, Clock, Activity } from 'lucide-react';

export function ShutdownStartupSynthesis() {
  const { data: shutdownData } = useShutdownStartupData();
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 7)); // Mois actuel
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 7));

  const filteredData = shutdownData?.filter(event => {
    const eventDate = new Date(event.start_time);
    const start = new Date(startDate + '-01');
    const end = new Date(endDate + '-31');
    return eventDate >= start && eventDate <= end;
  }) || [];

  const shutdownEvents = filteredData.filter(event => 
    ['shutdown', 'planned_shutdown', 'emergency_shutdown'].includes(event.event_type)
  );
  
  const startupEvents = filteredData.filter(event => 
    event.event_type === 'startup'
  );

  // Calcul des heures d'arrêt par unité
  const shutdownHoursByUnit = filteredData.reduce((acc, event) => {
    if (event.duration_hours && ['shutdown', 'planned_shutdown', 'emergency_shutdown'].includes(event.event_type)) {
      acc[event.unit_name] = (acc[event.unit_name] || 0) + event.duration_hours;
    }
    return acc;
  }, {} as Record<string, number>);

  const totalShutdownHours = Object.values(shutdownHoursByUnit).reduce((sum, hours) => sum + hours, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Synthèse des Arrêts et Démarrages
          </CardTitle>
          <div className="flex gap-4 items-end">
            <div>
              <Label htmlFor="startDate">Période de</Label>
              <Input
                id="startDate"
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">à</Label>
              <Input
                id="endDate"
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Nombre d'arrêts</span>
                </div>
                <div className="text-2xl font-bold text-red-600">{shutdownEvents.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Nombre de démarrages</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{startupEvents.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">Total heures d'arrêt</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{totalShutdownHours.toFixed(1)}h</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Unités concernées</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{Object.keys(shutdownHoursByUnit).length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Détail par unité */}
          <Card>
            <CardHeader>
              <CardTitle>Heures d'arrêt par unité</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(shutdownHoursByUnit).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(shutdownHoursByUnit).map(([unit, hours]) => (
                    <div key={unit} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium capitalize">{unit.replace('_', ' ')}</span>
                      </div>
                      <Badge variant="outline" className="bg-orange-100">
                        {hours.toFixed(1)} heures
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucune donnée d'arrêt pour la période sélectionnée
                </p>
              )}
            </CardContent>
          </Card>

          {/* Répartition par type d'arrêt */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par type d'arrêt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['planned_shutdown', 'emergency_shutdown', 'shutdown'].map(type => {
                  const count = shutdownEvents.filter(event => event.event_type === type).length;
                  const label = type === 'planned_shutdown' ? 'Arrêts prévus' : 
                               type === 'emergency_shutdown' ? 'Arrêts d\'urgence' : 'Autres arrêts';
                  const color = type === 'planned_shutdown' ? 'bg-blue-100' : 
                               type === 'emergency_shutdown' ? 'bg-red-100' : 'bg-orange-100';
                  
                  return (
                    <div key={type} className="flex items-center justify-between p-2">
                      <span>{label}</span>
                      <Badge variant="outline" className={color}>
                        {count} événement{count > 1 ? 's' : ''}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
