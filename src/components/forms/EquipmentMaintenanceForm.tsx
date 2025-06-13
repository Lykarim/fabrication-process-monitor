
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
import { Wrench, CheckCircle, AlertTriangle, Calendar, User, MapPin } from 'lucide-react';
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
    toast.success('Statut mis à jour');
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Wrench className="w-5 h-5 text-blue-600" />
            Planifier des Travaux d'Équipement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Première ligne - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date', { required: true })}
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentType" className="text-sm font-medium">
                  Type d'équipement
                </Label>
                <Select onValueChange={(value) => setValue('equipmentType', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map(type => (
                      <SelectItem key={type} value={type} className="capitalize">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deuxième ligne */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag" className="text-sm font-medium">
                  TAG de l'équipement
                </Label>
                <Input
                  id="tag"
                  {...register('tag', { required: true })}
                  placeholder="Ex: P-101"
                  className="w-full font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="w-4 h-4" />
                  Localisation
                </Label>
                <Select onValueChange={(value) => setValue('location', value)}>
                  <SelectTrigger className="w-full">
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
            </div>

            {/* Lieu personnalisé */}
            {watchLocation === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customLocation" className="text-sm font-medium">
                  Lieu personnalisé
                </Label>
                <Input
                  id="customLocation"
                  {...register('customLocation')}
                  placeholder="Préciser le lieu"
                  className="w-full"
                />
              </div>
            )}

            {/* Action prévue */}
            <div className="space-y-2">
              <Label htmlFor="plannedAction" className="text-sm font-medium">
                Action prévue
              </Label>
              <Textarea
                id="plannedAction"
                {...register('plannedAction', { required: true })}
                placeholder="Décrire les travaux à effectuer"
                className="w-full min-h-[80px] resize-y"
              />
            </div>

            {/* Troisième ligne */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="responsible" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4" />
                  Responsable
                </Label>
                <Input
                  id="responsible"
                  {...register('responsible', { required: true })}
                  placeholder="Nom du responsable"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionPercentage" className="text-sm font-medium">
                  Réalisation (%)
                </Label>
                <Input
                  id="completionPercentage"
                  type="number"
                  min="0"
                  max="100"
                  {...register('completionPercentage')}
                  defaultValue="0"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium">
                  Délai
                </Label>
                <Input
                  id="deadline"
                  type="date"
                  {...register('deadline', { required: true })}
                  className="w-full"
                />
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto sm:px-8">
              <Wrench className="w-4 h-4 mr-2" />
              Enregistrer les Travaux
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Boutons d'actions - responsive */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Dialog open={showCompleted} onOpenChange={setShowCompleted}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="hidden sm:inline">Travaux Réalisés</span>
              <span className="sm:hidden">Réalisés</span>
              <Badge variant="secondary" className="ml-1">
                {completedWorks.length}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Travaux Réalisés
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {completedWorks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun travail réalisé pour le moment
                </div>
              ) : (
                completedWorks.map(work => (
                  <Card key={work.id} className="border-green-200 bg-green-50">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div><strong>TAG:</strong> <span className="font-mono">{work.tag}</span></div>
                        <div><strong>Type:</strong> {work.equipmentType}</div>
                        <div><strong>Localisation:</strong> {work.location}</div>
                        <div><strong>Responsable:</strong> {work.responsible}</div>
                        <div><strong>Délai:</strong> {work.deadline}</div>
                        <div><strong>Réalisation:</strong> 
                          <Badge className="ml-2 bg-green-600">100%</Badge>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <strong>Action:</strong> {work.plannedAction}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={showOverdue} onOpenChange={setShowOverdue}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="flex items-center justify-center gap-2 w-full sm:w-auto">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Délais Dépassés</span>
              <span className="sm:hidden">Dépassés</span>
              <Badge variant="secondary" className="ml-1 bg-white text-red-600">
                {overdueWorks.length}
              </Badge>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Travaux avec Délai Dépassé
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {overdueWorks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun délai dépassé
                </div>
              ) : (
                overdueWorks.map(work => (
                  <Card key={work.id} className="border-red-200 bg-red-50">
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mb-4">
                        <div><strong>TAG:</strong> <span className="font-mono">{work.tag}</span></div>
                        <div><strong>Type:</strong> {work.equipmentType}</div>
                        <div><strong>Localisation:</strong> {work.location}</div>
                        <div><strong>Responsable:</strong> {work.responsible}</div>
                        <div><strong>Délai:</strong> 
                          <Badge variant="destructive" className="ml-2">{work.deadline}</Badge>
                        </div>
                        <div><strong>Réalisation:</strong> 
                          <Badge variant="outline" className="ml-2">{work.completionPercentage}%</Badge>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-3">
                          <strong>Action:</strong> {work.plannedAction}
                        </div>
                      </div>
                      <Button 
                        onClick={() => updateWorkStatus(work.id, 'completed')}
                        size="sm"
                        className="w-full sm:w-auto"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Marquer comme Réalisé
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Travaux en cours */}
      {pendingWorks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Travaux en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingWorks.map(work => (
                <Card key={work.id} className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div><strong>TAG:</strong> <span className="font-mono">{work.tag}</span></div>
                      <div><strong>Type:</strong> {work.equipmentType}</div>
                      <div><strong>Localisation:</strong> {work.location}</div>
                      <div><strong>Responsable:</strong> {work.responsible}</div>
                      <div><strong>Délai:</strong> {work.deadline}</div>
                      <div><strong>Réalisation:</strong> 
                        <Badge variant="outline" className="ml-2">{work.completionPercentage}%</Badge>
                      </div>
                      <div className="sm:col-span-2 lg:col-span-4">
                        <strong>Action:</strong> {work.plannedAction}
                      </div>
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
