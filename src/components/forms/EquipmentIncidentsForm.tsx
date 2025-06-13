
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
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const equipmentTypes = [
  'moteur', 'pompe', 'vanne', 'compresseur', 'échangeur', 'réacteur', 'turbine', 'ventilateur'
];

const locations = [
  'U170', 'U100', 'U140', 'U200', 'U300', 'U800', 'U400', 'U500'
];

const units = [
  'Distillation', 'Reforming', 'Hydrotraitement', 'Isomérisation'
];

interface EquipmentIncident {
  id: string;
  date: string;
  time: string;
  equipmentType: string;
  tag: string;
  location: string;
  customLocation?: string;
  incidentType: 'sans_arret' | 'avec_arret';
  affectedUnit?: string;
  plannedAction: string;
  responsible: string;
  completionPercentage: number;
  deadline: string;
  causeAnalysis: boolean;
  causeAnalysisDate?: string;
  status: 'pending' | 'completed' | 'overdue';
}

export function EquipmentIncidentsForm() {
  const [incidents, setIncidents] = useState<EquipmentIncident[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);
  
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const watchLocation = watch('location');
  const watchIncidentType = watch('incidentType');
  const watchCauseAnalysis = watch('causeAnalysis');

  const onSubmit = (data: any) => {
    const newIncident: EquipmentIncident = {
      id: Date.now().toString(),
      date: data.date,
      time: data.time,
      equipmentType: data.equipmentType,
      tag: data.tag,
      location: data.location === 'custom' ? data.customLocation : data.location,
      incidentType: data.incidentType,
      affectedUnit: data.incidentType === 'avec_arret' ? data.affectedUnit : undefined,
      plannedAction: data.plannedAction,
      responsible: data.responsible,
      completionPercentage: parseInt(data.completionPercentage) || 0,
      deadline: data.deadline,
      causeAnalysis: data.causeAnalysis === 'oui',
      causeAnalysisDate: data.causeAnalysis === 'oui' ? data.causeAnalysisDate : undefined,
      status: new Date(data.deadline) < new Date() ? 'overdue' : 'pending'
    };

    setIncidents(prev => [...prev, newIncident]);
    reset();
    toast.success('Incident équipement enregistré avec succès');
  };

  const completedIncidents = incidents.filter(i => i.status === 'completed');
  const overdueIncidents = incidents.filter(i => i.status === 'overdue');
  const pendingIncidents = incidents.filter(i => i.status === 'pending');

  const updateIncidentStatus = (id: string, newStatus: 'completed' | 'overdue') => {
    setIncidents(prev => prev.map(i => 
      i.id === id ? { ...i, status: newStatus } : i
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Signaler un Incident d'Équipement
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

            <div>
              <Label htmlFor="incidentType">Type d'incident</Label>
              <Select onValueChange={(value) => setValue('incidentType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sans_arret">Sans arrêt</SelectItem>
                  <SelectItem value="avec_arret">Avec arrêt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {watchIncidentType === 'avec_arret' && (
              <div>
                <Label htmlFor="affectedUnit">Unité à l'arrêt</Label>
                <Select onValueChange={(value) => setValue('affectedUnit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner l'unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div>
              <Label htmlFor="causeAnalysis">Analyse des causes</Label>
              <Select onValueChange={(value) => setValue('causeAnalysis', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="oui">Oui</SelectItem>
                  <SelectItem value="non">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {watchCauseAnalysis === 'oui' && (
              <div>
                <Label htmlFor="causeAnalysisDate">Date analyse des causes</Label>
                <Input
                  id="causeAnalysisDate"
                  type="date"
                  {...register('causeAnalysisDate')}
                />
              </div>
            )}

            <div className="col-span-2">
              <Button type="submit" className="w-full">
                Enregistrer l'Incident
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Action buttons and dialogs similar to EquipmentProblemsForm */}
      <div className="flex gap-4">
        <Dialog open={showCompleted} onOpenChange={setShowCompleted}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Actions Réalisées ({completedIncidents.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Actions Réalisées - Incidents</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {completedIncidents.map(incident => (
                <Card key={incident.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {incident.tag}</div>
                      <div><strong>Type:</strong> {incident.equipmentType}</div>
                      <div><strong>Localisation:</strong> {incident.location}</div>
                      <div><strong>Type Incident:</strong> {incident.incidentType}</div>
                      <div><strong>Responsable:</strong> {incident.responsible}</div>
                      <div><strong>Réalisation:</strong> 100%</div>
                      <div className="col-span-3"><strong>Action:</strong> {incident.plannedAction}</div>
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
              Délais Dépassés ({overdueIncidents.length})
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Incidents avec Délai Dépassé</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {overdueIncidents.map(incident => (
                <Card key={incident.id} className="border-red-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div><strong>TAG:</strong> {incident.tag}</div>
                      <div><strong>Type:</strong> {incident.equipmentType}</div>
                      <div><strong>Localisation:</strong> {incident.location}</div>
                      <div><strong>Type Incident:</strong> {incident.incidentType}</div>
                      <div><strong>Responsable:</strong> {incident.responsible}</div>
                      <div><strong>Réalisation:</strong> {incident.completionPercentage}%</div>
                      <div className="col-span-3"><strong>Action:</strong> {incident.plannedAction}</div>
                      <div className="col-span-3">
                        <Button 
                          onClick={() => updateIncidentStatus(incident.id, 'completed')}
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

      {pendingIncidents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Incidents en Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingIncidents.map(incident => (
                <Card key={incident.id}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div><strong>TAG:</strong> {incident.tag}</div>
                      <div><strong>Type:</strong> {incident.equipmentType}</div>
                      <div><strong>Localisation:</strong> {incident.location}</div>
                      <div><strong>Type Incident:</strong> {incident.incidentType}</div>
                      <div><strong>Responsable:</strong> {incident.responsible}</div>
                      <div><strong>Réalisation:</strong> {incident.completionPercentage}%</div>
                      <div className="col-span-2"><strong>Action:</strong> {incident.plannedAction}</div>
                      {incident.causeAnalysis && (
                        <div className="col-span-2">
                          <Badge variant="secondary">
                            Analyse causes: {incident.causeAnalysisDate}
                          </Badge>
                        </div>
                      )}
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
