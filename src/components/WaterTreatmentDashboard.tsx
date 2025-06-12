
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export const WaterTreatmentDashboard = () => {
  const [coolingWaterParams, setCoolingWaterParams] = useState({
    ph: '',
    ta: '',
    tac: '',
    cond: '',
    th: '',
    sio2: '',
    chlore: ''
  });

  const [boilerParams, setBoilerParams] = useState({
    ph: '',
    ta: '',
    tac: '',
    cond: '',
    sio2: '',
    phosphate: ''
  });

  const coolingWaterLimits = {
    ph: { min: 8.1, max: 8.3 },
    ta: { min: 20, max: 40 },
    tac: { min: 40, max: 70 },
    cond: { max: 1500 },
    th: { max: 0.2 },
    sio2: { max: 150 },
    chlore: { max: 0.2 }
  };

  const boilerLimits = {
    ph: { min: 10.5, max: 12 },
    ta: { min: 30, max: 60 },
    tac: { min: 60, max: 120 },
    cond: { max: 5000 },
    sio2: { min: 20, max: 40 },
    phosphate: { min: 30, max: 60 }
  };

  const getStatusColor = (value: string, limits: any) => {
    if (!value) return 'secondary';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'secondary';
    
    if (limits.min !== undefined && limits.max !== undefined) {
      return numValue >= limits.min && numValue <= limits.max ? 'default' : 'destructive';
    } else if (limits.max !== undefined) {
      return numValue <= limits.max ? 'default' : 'destructive';
    } else if (limits.min !== undefined) {
      return numValue >= limits.min ? 'default' : 'destructive';
    }
    return 'secondary';
  };

  const sampleData = [
    { time: '08:00', ph: 8.2, ta: 35, tac: 55 },
    { time: '12:00', ph: 8.1, ta: 38, tac: 60 },
    { time: '16:00', ph: 8.3, ta: 42, tac: 65 },
    { time: '20:00', ph: 8.2, ta: 36, tac: 58 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Traitement des Eaux</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-green-700 border-green-300">
            Système Normal
          </Badge>
          <Button size="sm">Génerer Rapport</Button>
        </div>
      </div>

      <Tabs defaultValue="cooling" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cooling">Eau de Refroidissement</TabsTrigger>
          <TabsTrigger value="boiler">Eaux de Chaudières</TabsTrigger>
        </TabsList>

        <TabsContent value="cooling" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Paramètres du Jour
                  <Badge variant="outline" className="ml-auto">
                    {new Date().toLocaleDateString('fr-FR')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ph">pH (8.1-8.3)</Label>
                    <Input
                      id="ph"
                      type="number"
                      step="0.1"
                      value={coolingWaterParams.ph}
                      onChange={(e) => setCoolingWaterParams(prev => ({ ...prev, ph: e.target.value }))}
                      className="mt-1"
                    />
                    <Badge 
                      variant={getStatusColor(coolingWaterParams.ph, coolingWaterLimits.ph)}
                      className="mt-1 text-xs"
                    >
                      {getStatusColor(coolingWaterParams.ph, coolingWaterLimits.ph) === 'default' ? 'Conforme' : 'Hors Spec'}
                    </Badge>
                  </div>
                  <div>
                    <Label htmlFor="ta">TA °F (20-40)</Label>
                    <Input
                      id="ta"
                      type="number"
                      value={coolingWaterParams.ta}
                      onChange={(e) => setCoolingWaterParams(prev => ({ ...prev, ta: e.target.value }))}
                      className="mt-1"
                    />
                    <Badge 
                      variant={getStatusColor(coolingWaterParams.ta, coolingWaterLimits.ta)}
                      className="mt-1 text-xs"
                    >
                      {getStatusColor(coolingWaterParams.ta, coolingWaterLimits.ta) === 'default' ? 'Conforme' : 'Hors Spec'}
                    </Badge>
                  </div>
                  <div>
                    <Label htmlFor="tac">TAC °F (40-70)</Label>
                    <Input
                      id="tac"
                      type="number"
                      value={coolingWaterParams.tac}
                      onChange={(e) => setCoolingWaterParams(prev => ({ ...prev, tac: e.target.value }))}
                      className="mt-1"
                    />
                    <Badge 
                      variant={getStatusColor(coolingWaterParams.tac, coolingWaterLimits.tac)}
                      className="mt-1 text-xs"
                    >
                      {getStatusColor(coolingWaterParams.tac, coolingWaterLimits.tac) === 'default' ? 'Conforme' : 'Hors Spec'}
                    </Badge>
                  </div>
                  <div>
                    <Label htmlFor="cond">COND µs/cm (max 1500)</Label>
                    <Input
                      id="cond"
                      type="number"
                      value={coolingWaterParams.cond}
                      onChange={(e) => setCoolingWaterParams(prev => ({ ...prev, cond: e.target.value }))}
                      className="mt-1"
                    />
                    <Badge 
                      variant={getStatusColor(coolingWaterParams.cond, coolingWaterLimits.cond)}
                      className="mt-1 text-xs"
                    >
                      {getStatusColor(coolingWaterParams.cond, coolingWaterLimits.cond) === 'default' ? 'Conforme' : 'Hors Spec'}
                    </Badge>
                  </div>
                </div>
                <Button className="w-full mt-4">Enregistrer Mesures</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendances pH - Dernières 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={sampleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={[7.5, 8.5]} />
                    <Tooltip />
                    <ReferenceLine y={8.1} stroke="red" strokeDasharray="2 2" label="Min" />
                    <ReferenceLine y={8.3} stroke="red" strokeDasharray="2 2" label="Max" />
                    <Line 
                      type="monotone" 
                      dataKey="ph" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommandations Journalières</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Maintenir le pH entre 8.1 et 8.3 pour optimiser l'efficacité du traitement
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Surveiller la conductivité - valeur élevée peut indiquer une concentration excessive
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
                    Vérifier le dosage des produits chimiques si TAC sort des limites
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="boiler" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {['H302N', 'H341', 'E143', 'D242'].map((tag) => (
              <Card key={tag}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Générateur {tag}
                    <Badge variant="outline" className="text-green-700 border-green-300">
                      En Service
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">pH (10.5-12)</Label>
                      <Input type="number" step="0.1" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">TA °F (30-60)</Label>
                      <Input type="number" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">TAC °F (60-120)</Label>
                      <Input type="number" className="h-8" />
                    </div>
                    <div>
                      <Label className="text-xs">Phosphate (30-60)</Label>
                      <Input type="number" className="h-8" />
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Enregistrer</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
