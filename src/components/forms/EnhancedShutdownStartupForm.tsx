
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, Trash2, Calendar, Clock } from 'lucide-react';
import { useCreateShutdownStartupData, useUpdateShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface WorkTask {
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
  description: string;
  timestamp: string;
}

interface EnhancedShutdownStartupFormProps {
  data?: Tables<'shutdown_startup_events'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EnhancedShutdownStartupForm({ data, onSuccess, onCancel }: EnhancedShutdownStartupFormProps) {
  const [formData, setFormData] = useState({
    unit_name: data?.unit_name || '',
    event_type: data?.event_type || 'shutdown',
    shutdown_type: 'planned', // prévu/imprévu
    reason: data?.reason || '',
    start_time: data?.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '',
    operator_name: data?.operator_name || '',
    status: data?.status || 'planned',
    planned_work: false
  });

  const [customUnit, setCustomUnit] = useState('');
  const [showCustomUnit, setShowCustomUnit] = useState(false);
  const [workTasks, setWorkTasks] = useState<WorkTask[]>([]);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [showWorkModal, setShowWorkModal] = useState(false);
  const [showObservationModal, setShowObservationModal] = useState(false);

  const createMutation = useCreateShutdownStartupData();
  const updateMutation = useUpdateShutdownStartupData();

  const predefinedUnits = [
    'distillation',
    'reforming',
    'hydrotraitement',
    'cracking',
    'utilities',
    'traitement_eaux'
  ];

  const addWorkTask = (task: WorkTask) => {
    setWorkTasks(prev => [...prev, task]);
  };

  const removeWorkTask = (taskId: string) => {
    setWorkTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addObservation = (observation: Observation) => {
    setObservations(prev => [...prev, observation]);
  };

  const removeObservation = (obsId: string) => {
    setObservations(prev => prev.filter(obs => obs.id !== obsId));
  };

  const exportWorkTasksToPDF = () => {
    // Simple CSV export for now - could be enhanced to actual PDF
    const csv = [
      ['Tâches', 'Service', 'Responsable(s)', 'Durée (h)', 'Date début', 'Date fin'],
      ...workTasks.map(task => [
        task.task,
        task.service,
        task.responsible,
        task.duration.toString(),
        new Date(task.startDate).toLocaleDateString('fr-FR'),
        new Date(task.endDate).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `travaux_${formData.unit_name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalUnit = showCustomUnit ? customUnit : formData.unit_name;
    
    const submitData = {
      unit_name: finalUnit,
      event_type: formData.event_type as 'shutdown' | 'startup' | 'planned_shutdown' | 'emergency_shutdown',
      reason: formData.reason || null,
      start_time: formData.start_time,
      operator_name: formData.operator_name,
      status: formData.status as 'planned' | 'ongoing' | 'completed' | 'cancelled',
      // Store structured data as JSON
      work_tasks: JSON.stringify(workTasks),
      observations: JSON.stringify(observations),
      shutdown_type: formData.shutdown_type,
      planned_work: formData.planned_work
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl font-bold">
              {formData.event_type === 'shutdown' ? 'Gestion des Arrêts' : 'Gestion des Démarrages'}
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_type">Type d'événement</Label>
                <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shutdown">Arrêt</SelectItem>
                    <SelectItem value="startup">Démarrage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="start_time">Date et Heure</Label>
                <Input
                  id="start_time"
                  type="datetime-local"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
            </div>

            {formData.event_type === 'shutdown' && (
              <div>
                <Label htmlFor="shutdown_type">Type d'arrêt</Label>
                <Select value={formData.shutdown_type} onValueChange={(value) => setFormData({ ...formData, shutdown_type: value })}>
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

            <div>
              <Label htmlFor="unit_name">Unité concernée</Label>
              <div className="space-y-2">
                <Select 
                  value={showCustomUnit ? 'custom' : formData.unit_name} 
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setShowCustomUnit(true);
                    } else {
                      setShowCustomUnit(false);
                      setFormData({ ...formData, unit_name: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedUnits.map(unit => (
                      <SelectItem key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Autre unité...</SelectItem>
                  </SelectContent>
                </Select>
                
                {showCustomUnit && (
                  <Input
                    placeholder="Nom de la nouvelle unité"
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="reason">
                {formData.event_type === 'shutdown' ? 'Cause(s)' : 'Observation(s)'}
              </Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={formData.event_type === 'shutdown' ? 'Décrire les causes de l\'arrêt...' : 'Observations générales...'}
                rows={3}
              />
            </div>

            {formData.event_type === 'shutdown' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="planned_work"
                    checked={formData.planned_work}
                    onChange={(e) => setFormData({ ...formData, planned_work: e.target.checked })}
                  />
                  <Label htmlFor="planned_work">Travaux prévus</Label>
                </div>

                {formData.planned_work && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Travaux Prévus</CardTitle>
                        <div className="flex gap-2">
                          <Dialog open={showWorkModal} onOpenChange={setShowWorkModal}>
                            <DialogTrigger asChild>
                              <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Ajouter
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <WorkTaskForm onAdd={addWorkTask} onClose={() => setShowWorkModal(false)} />
                            </DialogContent>
                          </Dialog>
                          {workTasks.length > 0 && (
                            <Button size="sm" variant="outline" onClick={exportWorkTasksToPDF}>
                              <Download className="w-4 h-4 mr-2" />
                              Export PDF
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {workTasks.length > 0 ? (
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
                            {workTasks.map((task) => (
                              <TableRow key={task.id}>
                                <TableCell>{task.task}</TableCell>
                                <TableCell>{task.service}</TableCell>
                                <TableCell>{task.responsible}</TableCell>
                                <TableCell>{task.duration}h</TableCell>
                                <TableCell>{new Date(task.startDate).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>{new Date(task.endDate).toLocaleDateString('fr-FR')}</TableCell>
                                <TableCell>
                                  <Button size="sm" variant="outline" onClick={() => removeWorkTask(task.id)}>
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-gray-500 text-center py-4">Aucun travail planifié</p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {formData.event_type === 'startup' && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Observations Particulières</CardTitle>
                    <Dialog open={showObservationModal} onOpenChange={setShowObservationModal}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Ajouter
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ObservationForm onAdd={addObservation} onClose={() => setShowObservationModal(false)} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {observations.length > 0 ? (
                    <div className="space-y-2">
                      {observations.map((obs) => (
                        <div key={obs.id} className="flex items-start justify-between p-3 border rounded">
                          <div className="flex-1">
                            <p>{obs.description}</p>
                            <span className="text-sm text-gray-500">
                              {new Date(obs.timestamp).toLocaleString('fr-FR')}
                            </span>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => removeObservation(obs.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">Aucune observation particulière</p>
                  )}
                </CardContent>
              </Card>
            )}

            <div>
              <Label htmlFor="operator_name">Opérateur</Label>
              <Input
                id="operator_name"
                value={formData.operator_name}
                onChange={(e) => setFormData({ ...formData, operator_name: e.target.value })}
                placeholder="Nom de l'opérateur"
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending}>
          {data ? 'Mettre à jour' : 'Créer'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
      </div>
    </div>
  );
}

// Work Task Form Component
function WorkTaskForm({ onAdd, onClose }: { onAdd: (task: WorkTask) => void; onClose: () => void }) {
  const [task, setTask] = useState({
    task: '',
    service: '',
    responsible: '',
    duration: 0,
    startDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.task && task.service && task.responsible && task.duration && task.startDate) {
      const startDate = new Date(task.startDate);
      const endDate = new Date(startDate.getTime() + task.duration * 60 * 60 * 1000);
      
      const newTask: WorkTask = {
        id: Date.now().toString(),
        ...task,
        endDate: endDate.toISOString().slice(0, 16)
      };
      
      onAdd(newTask);
      onClose();
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Ajouter un Travail</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label>Tâche</Label>
          <Input
            value={task.task}
            onChange={(e) => setTask({ ...task, task: e.target.value })}
            placeholder="Description de la tâche"
            required
          />
        </div>
        <div>
          <Label>Service</Label>
          <Input
            value={task.service}
            onChange={(e) => setTask({ ...task, service: e.target.value })}
            placeholder="Service responsable"
            required
          />
        </div>
        <div>
          <Label>Responsable(s)</Label>
          <Input
            value={task.responsible}
            onChange={(e) => setTask({ ...task, responsible: e.target.value })}
            placeholder="Nom(s) du/des responsable(s)"
            required
          />
        </div>
        <div>
          <Label>Durée (heures)</Label>
          <Input
            type="number"
            value={task.duration}
            onChange={(e) => setTask({ ...task, duration: parseFloat(e.target.value) })}
            placeholder="Durée en heures"
            required
          />
        </div>
        <div>
          <Label>Date de début</Label>
          <Input
            type="datetime-local"
            value={task.startDate}
            onChange={(e) => setTask({ ...task, startDate: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Ajouter</Button>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
        </div>
      </form>
    </div>
  );
}

// Observation Form Component
function ObservationForm({ onAdd, onClose }: { onAdd: (obs: Observation) => void; onClose: () => void }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      const newObservation: Observation = {
        id: Date.now().toString(),
        description,
        timestamp: new Date().toISOString()
      };
      
      onAdd(newObservation);
      onClose();
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Ajouter une Observation</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrire l'observation particulière..."
            rows={3}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">Ajouter</Button>
          <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
        </div>
      </form>
    </div>
  );
}
