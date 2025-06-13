
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCreateShutdownStartupData, useUpdateShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { Plus, Trash2, Download, Calendar } from 'lucide-react';

interface Task {
  id: string;
  task: string;
  service: string;
  responsible: string;
  duration: number;
  startDate: string;
  endDate: string;
}

interface Observation {
  id: string;
  point: string;
  description: string;
}

interface ComprehensiveShutdownStartupFormProps {
  data?: Tables<'shutdown_startup_events'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ComprehensiveShutdownStartupForm({ data, onSuccess, onCancel }: ComprehensiveShutdownStartupFormProps) {
  const [eventType, setEventType] = useState<'shutdown' | 'startup'>(data?.event_type === 'startup' ? 'startup' : 'shutdown');
  const [formData, setFormData] = useState({
    date: data?.start_time ? new Date(data.start_time).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
    time: data?.start_time ? new Date(data.start_time).toISOString().slice(11, 16) : new Date().toISOString().slice(11, 16),
    shutdownType: data?.event_type === 'planned_shutdown' ? 'planned' : 'unplanned',
    unit: data?.unit_name || '',
    customUnit: '',
    causes: data?.reason || '',
    plannedWork: 'no'
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [showTaskDialog, setShowTaskDialog] = useState(false);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [newTask, setNewTask] = useState({
    task: '',
    service: '',
    responsible: '',
    duration: 0,
    startDate: '',
    endDate: ''
  });
  const [newObservation, setNewObservation] = useState({
    point: '',
    description: ''
  });

  const createMutation = useCreateShutdownStartupData();
  const updateMutation = useUpdateShutdownStartupData();

  const units = [
    { value: 'distillation', label: 'Distillation' },
    { value: 'reforming', label: 'Reforming' },
    { value: 'hydrotraitement', label: 'Hydrotraitement' },
    { value: 'cracking', label: 'Cracking' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'traitement_eaux', label: 'Traitement des eaux' },
    { value: 'custom', label: 'Autre (à préciser)' }
  ];

  const addTask = () => {
    if (!newTask.task || !newTask.service || !newTask.responsible) return;
    
    const endDate = new Date(newTask.startDate);
    endDate.setHours(endDate.getHours() + newTask.duration);
    
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      endDate: endDate.toISOString().slice(0, 16)
    };
    
    setTasks([...tasks, task]);
    setNewTask({
      task: '',
      service: '',
      responsible: '',
      duration: 0,
      startDate: '',
      endDate: ''
    });
    setShowTaskDialog(false);
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addObservation = () => {
    if (!newObservation.point || !newObservation.description) return;
    
    const observation: Observation = {
      id: Date.now().toString(),
      ...newObservation
    };
    
    setObservations([...observations, observation]);
    setNewObservation({ point: '', description: '' });
    setShowObservationDialog(false);
  };

  const removeObservation = (id: string) => {
    setObservations(observations.filter(obs => obs.id !== id));
  };

  const exportTasksToPDF = () => {
    // Simulation d'export PDF - en pratique, vous utiliseriez une libraire comme jsPDF
    const content = tasks.map(task => 
      `${task.task} | ${task.service} | ${task.responsible} | ${task.duration}h | ${task.startDate} | ${task.endDate}`
    ).join('\n');
    
    const blob = new Blob([`Liste des travaux:\n\n${content}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travaux_${formData.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Liste des travaux exportée');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const unitName = formData.unit === 'custom' ? formData.customUnit : formData.unit;
    const startTime = new Date(`${formData.date}T${formData.time}`).toISOString();
    
    const eventTypeValue = eventType === 'shutdown' 
      ? (formData.shutdownType === 'planned' ? 'planned_shutdown' : 'shutdown')
      : 'startup';
    
    const submitData = {
      unit_name: unitName,
      event_type: eventTypeValue,
      reason: eventType === 'shutdown' ? formData.causes : observations.map(obs => `${obs.point}: ${obs.description}`).join('\n'),
      start_time: startTime,
      status: 'planned',
      impact_level: 'medium'
    };

    try {
      if (data?.id) {
        await updateMutation.mutateAsync({ ...submitData, id: data.id });
        toast.success('Événement mis à jour avec succès');
      } else {
        await createMutation.mutateAsync(submitData);
        toast.success('Événement créé avec succès');
      }
      onSuccess?.();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>
          {data ? 'Modifier' : 'Ajouter'} un événement d'arrêt/démarrage
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant={eventType === 'shutdown' ? 'default' : 'outline'}
            onClick={() => setEventType('shutdown')}
          >
            Arrêt
          </Button>
          <Button 
            type="button" 
            variant={eventType === 'startup' ? 'default' : 'outline'}
            onClick={() => setEventType('startup')}
          >
            Démarrage
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Heure</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Type d'arrêt (seulement pour les arrêts) */}
          {eventType === 'shutdown' && (
            <div>
              <Label htmlFor="shutdownType">Type d'arrêt</Label>
              <Select value={formData.shutdownType} onValueChange={(value) => setFormData({ ...formData, shutdownType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Prévu</SelectItem>
                  <SelectItem value="unplanned">Imprévu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Unité concernée */}
          <div>
            <Label htmlFor="unit">Unité concernée</Label>
            <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.value} value={unit.value}>
                    {unit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.unit === 'custom' && (
              <div className="mt-2">
                <Input
                  placeholder="Préciser l'unité"
                  value={formData.customUnit}
                  onChange={(e) => setFormData({ ...formData, customUnit: e.target.value })}
                  required
                />
              </div>
            )}
          </div>

          {/* Causes (pour arrêt) */}
          {eventType === 'shutdown' && (
            <>
              <div>
                <Label htmlFor="causes">Cause(s)</Label>
                <Textarea
                  id="causes"
                  value={formData.causes}
                  onChange={(e) => setFormData({ ...formData, causes: e.target.value })}
                  placeholder="Décrire les causes de l'arrêt..."
                  rows={3}
                />
              </div>

              {/* Travaux prévus */}
              <div>
                <Label htmlFor="plannedWork">Travaux prévus</Label>
                <Select value={formData.plannedWork} onValueChange={(value) => setFormData({ ...formData, plannedWork: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Oui</SelectItem>
                    <SelectItem value="no">Non</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gestion des travaux */}
              {formData.plannedWork === 'yes' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Liste des travaux
                      <div className="flex gap-2">
                        <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
                          <DialogTrigger asChild>
                            <Button type="button" size="sm">
                              <Plus className="w-4 h-4 mr-2" />
                              Ajouter
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Ajouter une tâche</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Tâche</Label>
                                <Input
                                  value={newTask.task}
                                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Service</Label>
                                <Input
                                  value={newTask.service}
                                  onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Responsable(s)</Label>
                                <Input
                                  value={newTask.responsible}
                                  onChange={(e) => setNewTask({ ...newTask, responsible: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label>Durée (heures)</Label>
                                <Input
                                  type="number"
                                  value={newTask.duration}
                                  onChange={(e) => setNewTask({ ...newTask, duration: parseFloat(e.target.value) })}
                                />
                              </div>
                              <div>
                                <Label>Date de début</Label>
                                <Input
                                  type="datetime-local"
                                  value={newTask.startDate}
                                  onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                                />
                              </div>
                              <Button onClick={addTask}>Ajouter la tâche</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {tasks.length > 0 && (
                          <Button type="button" size="sm" variant="outline" onClick={exportTasksToPDF}>
                            <Download className="w-4 h-4 mr-2" />
                            Export PDF
                          </Button>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tâches</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Responsable(s)</TableHead>
                            <TableHead>Durée</TableHead>
                            <TableHead>Date début</TableHead>
                            <TableHead>Date fin</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell>{task.task}</TableCell>
                              <TableCell>{task.service}</TableCell>
                              <TableCell>{task.responsible}</TableCell>
                              <TableCell>{task.duration}h</TableCell>
                              <TableCell>{new Date(task.startDate).toLocaleString('fr-FR')}</TableCell>
                              <TableCell>{new Date(task.endDate).toLocaleString('fr-FR')}</TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeTask(task.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucune tâche ajoutée</p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Observations (pour démarrage) */}
          {eventType === 'startup' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Observations particulières
                  <Dialog open={showObservationDialog} onOpenChange={setShowObservationDialog}>
                    <DialogTrigger asChild>
                      <Button type="button" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Ajouter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une observation</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Point d'observation</Label>
                          <Input
                            value={newObservation.point}
                            onChange={(e) => setNewObservation({ ...newObservation, point: e.target.value })}
                            placeholder="Ex: Température, Pression, Débit..."
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={newObservation.description}
                            onChange={(e) => setNewObservation({ ...newObservation, description: e.target.value })}
                            placeholder="Décrire l'observation..."
                            rows={3}
                          />
                        </div>
                        <Button onClick={addObservation}>Ajouter l'observation</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {observations.length > 0 ? (
                  <div className="space-y-3">
                    {observations.map((obs) => (
                      <div key={obs.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <Badge variant="outline" className="mb-2">{obs.point}</Badge>
                            <p className="text-sm">{obs.description}</p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            onClick={() => removeObservation(obs.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Aucune observation ajoutée</p>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {data ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
