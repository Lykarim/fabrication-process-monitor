
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, AlertTriangle, Clock, Wrench } from 'lucide-react';

export const EquipmentManagement = () => {
  const [equipmentList] = useState([
    { tag: 'P-101', type: 'Pompe', location: 'U170', status: 'available', lastMaintenance: '2024-05-15' },
    { tag: 'M-201', type: 'Moteur', location: 'U200', status: 'unavailable', lastMaintenance: '2024-06-01' },
    { tag: 'V-301', type: 'Vanne', location: 'U300', status: 'available', lastMaintenance: '2024-05-20' },
    { tag: 'HE-401', type: 'Échangeur', location: 'U400', status: 'maintenance', lastMaintenance: '2024-06-10' },
  ]);

  const [incidents] = useState([
    {
      id: 1,
      date: '2024-06-12',
      time: '14:30',
      equipment: 'P-102',
      type: 'Pompe',
      location: 'U170',
      incidentType: 'avec arrêt',
      action: 'Remplacement joint',
      responsible: 'Équipe Maintenance',
      progress: 75,
      deadline: '2024-06-15'
    },
    {
      id: 2,
      date: '2024-06-11',
      time: '09:15',
      equipment: 'V-205',
      type: 'Vanne',
      location: 'U200',
      incidentType: 'sans arrêt',
      action: 'Ajustement actionneur',
      responsible: 'Technicien A',
      progress: 100,
      deadline: '2024-06-12'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'unavailable':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Disponible</Badge>;
      case 'unavailable':
        return <Badge variant="destructive">Indisponible</Badge>;
      case 'maintenance':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const availabilityRate = (equipmentList.filter(eq => eq.status === 'available').length / equipmentList.length * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Équipements</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-blue-700 border-blue-300">
            Disponibilité: {availabilityRate}%
          </Badge>
          <Button size="sm">Rapport Maintenance</Button>
        </div>
      </div>

      <Tabs defaultValue="availability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="maintenance">Travaux</TabsTrigger>
          <TabsTrigger value="problems">Problèmes</TabsTrigger>
        </TabsList>

        <TabsContent value="availability" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  État des Équipements Critiques
                  <div className="text-sm font-normal">
                    Taux de disponibilité: <span className="font-bold text-green-600">{availabilityRate}%</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">TAG</th>
                        <th className="text-left p-3">Type</th>
                        <th className="text-left p-3">Localisation</th>
                        <th className="text-left p-3">Statut</th>
                        <th className="text-left p-3">Dernière Maintenance</th>
                        <th className="text-left p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentList.map((equipment, index) => (
                        <tr key={index} className="border-b hover:bg-slate-50">
                          <td className="p-3 font-mono">{equipment.tag}</td>
                          <td className="p-3">{equipment.type}</td>
                          <td className="p-3">{equipment.location}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(equipment.status)}
                              {getStatusBadge(equipment.status)}
                            </div>
                          </td>
                          <td className="p-3">{equipment.lastMaintenance}</td>
                          <td className="p-3">
                            <Button size="sm" variant="outline">Modifier</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{equipmentList.filter(eq => eq.status === 'available').length}</div>
                  <div className="text-sm text-slate-600">Équipements Disponibles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">{equipmentList.filter(eq => eq.status === 'unavailable').length}</div>
                  <div className="text-sm text-slate-600">Équipements Indisponibles</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">{equipmentList.filter(eq => eq.status === 'maintenance').length}</div>
                  <div className="text-sm text-slate-600">En Maintenance</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Nouvel Incident</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Date et Heure</Label>
                    <Input type="datetime-local" className="mt-1" />
                  </div>
                  <div>
                    <Label>Type d'Équipement</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="moteur">Moteur</SelectItem>
                        <SelectItem value="pompe">Pompe</SelectItem>
                        <SelectItem value="vanne">Vanne</SelectItem>
                        <SelectItem value="echangeur">Échangeur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>TAG Équipement</Label>
                    <Input className="mt-1" placeholder="Ex: P-101" />
                  </div>
                  <div>
                    <Label>Localisation</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="U170">U170</SelectItem>
                        <SelectItem value="U100">U100</SelectItem>
                        <SelectItem value="U140">U140</SelectItem>
                        <SelectItem value="U200">U200</SelectItem>
                        <SelectItem value="U300">U300</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Action Prévue</Label>
                    <Textarea className="mt-1" placeholder="Décrire l'action à entreprendre..." />
                  </div>
                </div>
                <Button className="mt-4">Enregistrer Incident</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incidents Récents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{incident.equipment} - {incident.type}</h4>
                          <p className="text-sm text-slate-600">{incident.location} • {incident.date} {incident.time}</p>
                        </div>
                        <Badge variant={incident.incidentType === 'avec arrêt' ? 'destructive' : 'secondary'}>
                          {incident.incidentType}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Action:</span> {incident.action}
                        </div>
                        <div>
                          <span className="font-medium">Responsable:</span> {incident.responsible}
                        </div>
                        <div>
                          <span className="font-medium">Progression:</span> 
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${incident.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{incident.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Planifier Travaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label>Type d'Équipement</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="moteur">Moteur</SelectItem>
                      <SelectItem value="pompe">Pompe</SelectItem>
                      <SelectItem value="vanne">Vanne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>TAG Équipement</Label>
                  <Input className="mt-1" placeholder="Ex: P-101" />
                </div>
                <div>
                  <Label>Responsable</Label>
                  <Input className="mt-1" placeholder="Nom du responsable" />
                </div>
                <div className="md:col-span-2">
                  <Label>Action Prévue</Label>
                  <Textarea className="mt-1" placeholder="Description des travaux..." />
                </div>
              </div>
              <Button className="mt-4">Planifier Travaux</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="problems" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Signaler un Problème</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Date et Heure</Label>
                  <Input type="datetime-local" className="mt-1" />
                </div>
                <div>
                  <Label>TAG Équipement</Label>
                  <Input className="mt-1" placeholder="Ex: P-101" />
                </div>
                <div>
                  <Label>Localisation</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="U170">U170</SelectItem>
                      <SelectItem value="U100">U100</SelectItem>
                      <SelectItem value="U200">U200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Délai</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div className="md:col-span-2">
                  <Label>Description du Problème</Label>
                  <Textarea className="mt-1" placeholder="Décrire le problème rencontré..." />
                </div>
              </div>
              <Button className="mt-4">Signaler Problème</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
