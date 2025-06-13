
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, XCircle, Plus, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const locations = [
  'U170', 'U100', 'U140', 'U200', 'U300', 'U800', 'U400', 'U500'
];

interface CriticalEquipment {
  id: string;
  name: string;
  tag: string;
  location: string;
  isAvailable: boolean;
  lastStatusChange?: string;
  totalDowntime: number; // in hours
  availabilityRate: number; // percentage
}

interface AvailabilityChange {
  id: string;
  equipmentId: string;
  date: string;
  time: string;
  tag: string;
  location: string;
  newStatus: boolean;
  customLocation?: string;
}

export function EquipmentAvailabilityManager() {
  const [equipment, setEquipment] = useState<CriticalEquipment[]>([
    {
      id: '1',
      name: 'Pompe Principale',
      tag: 'P-101',
      location: 'U170',
      isAvailable: true,
      totalDowntime: 24,
      availabilityRate: 95.5
    },
    {
      id: '2',
      name: 'Compresseur Air',
      tag: 'C-201',
      location: 'U200',
      isAvailable: false,
      lastStatusChange: '2024-01-10T08:30',
      totalDowntime: 72,
      availabilityRate: 87.2
    }
  ]);

  const [availabilityChanges, setAvailabilityChanges] = useState<AvailabilityChange[]>([]);
  const [showAddEquipment, setShowAddEquipment] = useState(false);
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [showAvailabilityStats, setShowAvailabilityStats] = useState(false);
  
  const addEquipmentForm = useForm();
  const changeStatusForm = useForm();
  const { watch: watchChangeStatus } = changeStatusForm;
  const watchLocation = watchChangeStatus('location');

  const onAddEquipment = (data: any) => {
    const newEquipment: CriticalEquipment = {
      id: Date.now().toString(),
      name: data.name,
      tag: data.tag,
      location: data.location === 'custom' ? data.customLocation : data.location,
      isAvailable: true,
      totalDowntime: 0,
      availabilityRate: 100
    };

    setEquipment(prev => [...prev, newEquipment]);
    addEquipmentForm.reset();
    setShowAddEquipment(false);
    toast.success('Équipement critique ajouté avec succès');
  };

  const onChangeStatus = (data: any) => {
    const change: AvailabilityChange = {
      id: Date.now().toString(),
      equipmentId: data.equipmentId,
      date: data.date,
      time: data.time,
      tag: data.tag,
      location: data.location === 'custom' ? data.customLocation : data.location,
      newStatus: data.newStatus === 'available'
    };

    setAvailabilityChanges(prev => [...prev, change]);

    // Update equipment status
    setEquipment(prev => prev.map(eq => {
      if (eq.id === data.equipmentId) {
        return {
          ...eq,
          isAvailable: change.newStatus,
          lastStatusChange: new Date(`${data.date}T${data.time}`).toISOString()
        };
      }
      return eq;
    }));

    changeStatusForm.reset();
    setShowChangeStatus(false);
    toast.success('Statut de disponibilité mis à jour');
  };

  const calculateDowntimeDuration = (equipmentId: string) => {
    const eq = equipment.find(e => e.id === equipmentId);
    if (!eq || eq.isAvailable || !eq.lastStatusChange) return 0;
    
    const downSince = new Date(eq.lastStatusChange);
    const now = new Date();
    return Math.round((now.getTime() - downSince.getTime()) / (1000 * 60 * 60)); // hours
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Disponibilité des Équipements Critiques</h2>
        <div className="flex gap-2">
          <Dialog open={showAddEquipment} onOpenChange={setShowAddEquipment}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Ajouter Équipement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Équipement Critique</DialogTitle>
              </DialogHeader>
              <form onSubmit={addEquipmentForm.handleSubmit(onAddEquipment)} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l'équipement</Label>
                  <Input
                    id="name"
                    {...addEquipmentForm.register('name', { required: true })}
                    placeholder="Ex: Pompe de circulation"
                  />
                </div>
                <div>
                  <Label htmlFor="tag">TAG</Label>
                  <Input
                    id="tag"
                    {...addEquipmentForm.register('tag', { required: true })}
                    placeholder="Ex: P-101"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Select onValueChange={(value) => addEquipmentForm.setValue('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                      <SelectItem value="custom">Autre lieu...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Ajouter</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showChangeStatus} onOpenChange={setShowChangeStatus}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Changer Statut
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Changer le Statut de Disponibilité</DialogTitle>
              </DialogHeader>
              <form onSubmit={changeStatusForm.handleSubmit(onChangeStatus)} className="space-y-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...changeStatusForm.register('date', { required: true })}
                    defaultValue={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    {...changeStatusForm.register('time', { required: true })}
                    defaultValue={new Date().toTimeString().slice(0, 5)}
                  />
                </div>
                <div>
                  <Label htmlFor="equipmentId">Équipement</Label>
                  <Select onValueChange={(value) => changeStatusForm.setValue('equipmentId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'équipement" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map(eq => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.tag} - {eq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tag">TAG</Label>
                  <Input
                    id="tag"
                    {...changeStatusForm.register('tag', { required: true })}
                    placeholder="TAG de l'équipement"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Localisation</Label>
                  <Select onValueChange={(value) => changeStatusForm.setValue('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner la localisation" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                      <SelectItem value="custom">Autre lieu...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {watchLocation === 'custom' && (
                  <div>
                    <Label htmlFor="customLocation">Lieu personnalisé</Label>
                    <Input
                      id="customLocation"
                      {...changeStatusForm.register('customLocation')}
                      placeholder="Préciser le lieu"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="newStatus">Nouveau Statut</Label>
                  <Select onValueChange={(value) => changeStatusForm.setValue('newStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="unavailable">Indisponible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Mettre à Jour</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={showAvailabilityStats} onOpenChange={setShowAvailabilityStats}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Statistiques
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Statistiques de Disponibilité</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-green-600">
                        {equipment.filter(eq => eq.isAvailable).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Équipements Disponibles</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-red-600">
                        {equipment.filter(eq => !eq.isAvailable).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Équipements Indisponibles</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.round(equipment.reduce((acc, eq) => acc + eq.availabilityRate, 0) / equipment.length)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Taux Moyen Disponibilité</p>
                    </CardContent>
                  </Card>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Équipement</TableHead>
                      <TableHead>Temps d'Arrêt Total</TableHead>
                      <TableHead>Taux de Disponibilité</TableHead>
                      <TableHead>Temps d'Arrêt Actuel</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipment.map(eq => (
                      <TableRow key={eq.id}>
                        <TableCell>{eq.tag} - {eq.name}</TableCell>
                        <TableCell>{eq.totalDowntime}h</TableCell>
                        <TableCell>
                          <Badge variant={eq.availabilityRate >= 95 ? "default" : eq.availabilityRate >= 90 ? "secondary" : "destructive"}>
                            {eq.availabilityRate}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {eq.isAvailable ? 'N/A' : `${calculateDowntimeDuration(eq.id)}h`}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Base de Données des Équipements Critiques</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>TAG</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Taux Disponibilité</TableHead>
                <TableHead>Dernière Modification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipment.map(eq => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.name}</TableCell>
                  <TableCell>{eq.tag}</TableCell>
                  <TableCell>{eq.location}</TableCell>
                  <TableCell>
                    {eq.isAvailable ? (
                      <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        Disponible
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" />
                        Indisponible
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={eq.availabilityRate >= 95 ? "default" : eq.availabilityRate >= 90 ? "secondary" : "destructive"}>
                      {eq.availabilityRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {eq.lastStatusChange 
                      ? new Date(eq.lastStatusChange).toLocaleString('fr-FR')
                      : 'N/A'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
