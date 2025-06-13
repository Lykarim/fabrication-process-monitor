
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
import { Calendar, Clock, MapPin, User, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const equipmentTypes = [
  'moteur', 'pompe', 'vanne', 'compresseur', 'échangeur', 'réacteur', 'turbine', 'ventilateur'
];

const locations = [
  'U170', 'U100', 'U140', 'U200', 'U300', 'U800', 'U400', 'U500'
];

interface EquipmentProblem {
  id: string;
  date: string;
  time: string;
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

export function EquipmentProblemsForm() {
  const [problems, setProblems] = useState<EquipmentProblem[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const watchLocation = watch('location');

  const onSubmit = (data: any) => {
    const newProblem: EquipmentProblem = {
      id: Date.now().toString(),
      date: data.date,
      time: data.time,
      equipmentType: data.equipmentType,
      tag: data.tag,
      location: data.location === 'custom' ? data.customLocation : data.location,
      plannedAction: data.plannedAction,
      responsible: data.responsible,
      completionPercentage: parseInt(data.completionPercentage) || 0,
      deadline: data.deadline,
      status: new Date(data.deadline) < new Date() ? 'overdue' : 'pending'
    };

    setProblems(prev => [...prev, newProblem]);
    reset();
    toast.success('Problème équipement enregistré avec succès');
  };

  const completedProblems = problems.filter(p => p.status === 'completed');
  const overdueProblems = problems.filter(p => p.status === 'overdue');
  const pendingProblems = problems.filter(p => p.status === 'pending');

  const updateProblemStatus = (id: string, newStatus: 'completed' | 'overdue') => {
    setProblems(prev => prev.map(p => 
      p.id === id ? { ...p, status: newStatus } : p
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Signaler un Problème d'Équipement
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
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                {...register('time', { required: true })}
                defaultValue={new Date().toTimeString().slice(0, 5)}
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
                placeholder="Décrire l'action à entreprendre"
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
                Enregistrer le Problème
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
              Actions Réalisées ({completedProblems.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Actions Réalisées</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {completedProblems.map(problem => (
                <Card key={problem.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {problem.tag}</div>
                      <div><strong>Type:</strong> {problem.equipmentType}</div>
                      <div><strong>Localisation:</strong> {problem.location}</div>
                      <div><strong>Responsable:</strong> {problem.responsible}</div>
                      <div><strong>Délai:</strong> {problem.deadline}</div>
                      <div><strong>Réalisation:</strong> 100%</div>
                      <div className="col-span-3"><strong>Action:</strong> {problem.plannedAction}</div>
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
              Délais Dépassés ({overdueProblems.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Actions avec Délai Dépassé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {overdueProblems.map(problem => (
                <Card key={problem.id} className="border-red-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {problem.tag}</div>
                      <div><strong>Type:</strong> {problem.equipmentType}</div>
                      <div><strong>Localisation:</strong> {problem.location}</div>
                      <div><strong>Responsable:</strong> {problem.responsible}</div>
                      <div><strong>Délai:</strong> {problem.deadline}</div>
                      <div><strong>Réalisation:</strong> {problem.completionPercentage}%</div>
                      <div className="col-span-3"><strong>Action:</strong> {problem.plannedAction}</div>
                      <div className="col-span-3">
                        <Button 
                          onClick={() => updateProblemStatus(problem.id, 'completed')}
                          size="sm"
                          className="mr-2"
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

      {pendingProblems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Problèmes en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingProblems.map(problem => (
                <Card key={problem.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div><strong>TAG:</strong> {problem.tag}</div>
                      <div><strong>Type:</strong> {problem.equipmentType}</div>
                      <div><strong>Localisation:</strong> {problem.location}</div>
                      <div><strong>Responsable:</strong> {problem.responsible}</div>
                      <div><strong>Délai:</strong> {problem.deadline}</div>
                      <div><strong>Réalisation:</strong> {problem.completionPercentage}%</div>
                      <div className="col-span-2"><strong>Action:</strong> {problem.plannedAction}</div>
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
