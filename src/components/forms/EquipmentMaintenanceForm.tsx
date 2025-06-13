
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wrench, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const equipmentTypes = [
  'moteur', 'pompe', 'vanne', 'compresseur', 'échangeur', 'réacteur', 'turbine', 'ventilateur'
];

const locations = [
  'U170', 'U100', 'U140', 'U200', 'U300', 'U800', 'U400', 'U500'
];

interface MaintenanceWork {
  id: string;
  date: string;
  equipmentType: string;
  tag: string;
  location: string;
  customLocation?: string;
  plannedAction: string;
  responsible: string;
  completionPercentage: number;
  deadline: string;
  status: 'pending' | 'completed' | 'overdue';
}

export function EquipmentMaintenanceForm() {
  const [maintenanceWorks, setMaintenanceWorks] = useState<MaintenanceWork[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const watchLocation = watch('location');

  const onSubmit = (data: any) => {
    const newWork: MaintenanceWork = {
      id: Date.now().toString(),
      date: data.date,
      equipmentType: data.equipmentType,
      tag: data.tag,
      location: data.location === 'custom' ? data.customLocation : data.location,
      plannedAction: data.plannedAction,
      responsible: data.responsible,
      completionPercentage: parseInt(data.completionPercentage) || 0,
      deadline: data.deadline,
      status: new Date(data.deadline) < new Date() ? 'overdue' : 'pending'
    };

    setMaintenanceWorks(prev => [...prev, newWork]);
    reset();
    toast.success('Travaux d\'équipement enregistrés avec succès');
  };

  const completedWorks = maintenanceWorks.filter(w => w.status === 'completed');
  const overdueWorks = maintenanceWorks.filter(w => w.status === 'overdue');
  const pendingWorks = maintenanceWorks.filter(w => w.status === 'pending');

  const updateWorkStatus = (id: string, newStatus: 'completed' | 'overdue') => {
    setMaintenanceWorks(prev => prev.map(w => 
      w.id === id ? { ...w, status: newStatus } : w
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Planifier des Travaux d'Équipement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                {...register('date', { required: true })}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <Label htmlFor="equipmentType">Type d'équipement</Label>
              <Select onValueChange={(value) => setValue('equipmentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {equipmentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tag">TAG de l'équipement</Label>
              <Input
                id="tag"
                {...register('tag', { required: true })}
                placeholder="Ex: P-101"
              />
            </div>

            <div>
              <Label htmlFor="location">Localisation</Label>
              <Select onValueChange={(value) => setValue('location', value)}>
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
                  {...register('customLocation')}
                  placeholder="Préciser le lieu"
                />
              </div>
            )}

            <div className="col-span-2">
              <Label htmlFor="plannedAction">Action prévue</Label>
              <Textarea
                id="plannedAction"
                {...register('plannedAction', { required: true })}
                placeholder="Décrire les travaux à effectuer"
              />
            </div>

            <div>
              <Label htmlFor="responsible">Responsable</Label>
              <Input
                id="responsible"
                {...register('responsible', { required: true })}
                placeholder="Nom du responsable"
              />
            </div>

            <div>
              <Label htmlFor="completionPercentage">Réalisation (%)</Label>
              <Input
                id="completionPercentage"
                type="number"
                min="0"
                max="100"
                {...register('completionPercentage')}
                defaultValue="0"
              />
            </div>

            <div>
              <Label htmlFor="deadline">Délai</Label>
              <Input
                id="deadline"
                type="date"
                {...register('deadline', { required: true })}
              />
            </div>

            <div className="col-span-2">
              <Button type="submit" className="w-full">
                Enregistrer les Travaux
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Dialog open={showCompleted} onOpenChange={setShowCompleted}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Travaux Réalisés ({completedWorks.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Travaux Réalisés</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {completedWorks.map(work => (
                <Card key={work.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {work.tag}</div>
                      <div><strong>Type:</strong> {work.equipmentType}</div>
                      <div><strong>Localisation:</strong> {work.location}</div>
                      <div><strong>Responsable:</strong> {work.responsible}</div>
                      <div><strong>Délai:</strong> {work.deadline}</div>
                      <div><strong>Réalisation:</strong> 100%</div>
                      <div className="col-span-3"><strong>Action:</strong> {work.plannedAction}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showOverdue} onOpenChange={setShowOverdue}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Délais Dépassés ({overdueWorks.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Travaux avec Délai Dépassé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {overdueWorks.map(work => (
                <Card key={work.id} className="border-red-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {work.tag}</div>
                      <div><strong>Type:</strong> {work.equipmentType}</div>
                      <div><strong>Localisation:</strong> {work.location}</div>
                      <div><strong>Responsable:</strong> {work.responsible}</div>
                      <div><strong>Délai:</strong> {work.deadline}</div>
                      <div><strong>Réalisation:</strong> {work.completionPercentage}%</div>
                      <div className="col-span-3"><strong>Action:</strong> {work.plannedAction}</div>
                      <div className="col-span-3">
                        <Button 
                          onClick={() => updateWorkStatus(work.id, 'completed')}
                          size="sm"
                        >
                          Marquer comme Réalisé
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pendingWorks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Travaux en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingWorks.map(work => (
                <Card key={work.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div><strong>TAG:</strong> {work.tag}</div>
                      <div><strong>Type:</strong> {work.equipmentType}</div>
                      <div><strong>Localisation:</strong> {work.location}</div>
                      <div><strong>Responsable:</strong> {work.responsible}</div>
                      <div><strong>Délai:</strong> {work.deadline}</div>
                      <div><strong>Réalisation:</strong> {work.completionPercentage}%</div>
                      <div className="col-span-2"><strong>Action:</strong> {work.plannedAction}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
