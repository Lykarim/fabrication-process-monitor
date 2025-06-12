
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, CheckCircle, AlertTriangle, User } from 'lucide-react';
import { useCreateShutdownStartupData, useUpdateShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  required: boolean;
}

interface Phase {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
  duration?: number;
  status: 'pending' | 'in_progress' | 'completed';
  checklist: ChecklistItem[];
}

interface Anomaly {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: string;
  reportedAt: string;
  resolved: boolean;
  resolution?: string;
}

interface AdvancedShutdownStartupFormProps {
  data?: Tables<'shutdown_startup_events'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const defaultPhases: Phase[] = [
  {
    id: 'preparation',
    name: 'Préparation',
    status: 'pending',
    checklist: [
      { id: 'safety_check', description: 'Vérification des équipements de sécurité', completed: false, required: true },
      { id: 'tools_ready', description: 'Préparation des outils nécessaires', completed: false, required: true },
      { id: 'team_briefing', description: 'Briefing équipe opérationnelle', completed: false, required: true }
    ]
  },
  {
    id: 'shutdown_sequence',
    name: 'Séquence d\'arrêt',
    status: 'pending',
    checklist: [
      { id: 'reduce_flow', description: 'Réduction progressive du débit', completed: false, required: true },
      { id: 'temp_control', description: 'Contrôle de la température', completed: false, required: true },
      { id: 'valve_closure', description: 'Fermeture des vannes principales', completed: false, required: true },
      { id: 'pump_stop', description: 'Arrêt des pompes', completed: false, required: true }
    ]
  },
  {
    id: 'isolation',
    name: 'Isolation',
    status: 'pending',
    checklist: [
      { id: 'energy_isolation', description: 'Isolation énergétique', completed: false, required: true },
      { id: 'lockout_tagout', description: 'Mise en place LOTO', completed: false, required: true },
      { id: 'atmospheric_isolation', description: 'Isolation atmosphérique', completed: false, required: true }
    ]
  },
  {
    id: 'startup_sequence',
    name: 'Séquence de démarrage',
    status: 'pending',
    checklist: [
      { id: 'pre_startup_check', description: 'Vérifications pré-démarrage', completed: false, required: true },
      { id: 'gradual_startup', description: 'Démarrage progressif', completed: false, required: true },
      { id: 'parameter_monitoring', description: 'Surveillance des paramètres', completed: false, required: true },
      { id: 'normal_operation', description: 'Retour en fonctionnement normal', completed: false, required: true }
    ]
  }
];

export function AdvancedShutdownStartupForm({ data, onSuccess, onCancel }: AdvancedShutdownStartupFormProps) {
  const [formData, setFormData] = useState({
    unit_name: data?.unit_name || '',
    event_type: data?.event_type || 'shutdown',
    reason: data?.reason || '',
    start_time: data?.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '',
    operator_name: data?.operator_name || '',
    status: data?.status || 'planned',
  });

  const [phases, setPhases] = useState<Phase[]>(defaultPhases);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [currentOperator, setCurrentOperator] = useState('');
  const [supervisorValidation, setSupervisorValidation] = useState({
    validated: false,
    validatedBy: '',
    validatedAt: '',
    comments: ''
  });

  const createMutation = useCreateShutdownStartupData();
  const updateMutation = useUpdateShutdownStartupData();

  const startPhase = (phaseId: string) => {
    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? { ...phase, status: 'in_progress', startTime: new Date().toISOString() }
        : phase
    ));
  };

  const completePhase = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId);
    if (phase && phase.startTime) {
      const endTime = new Date().toISOString();
      const duration = Math.round((new Date(endTime).getTime() - new Date(phase.startTime).getTime()) / (1000 * 60));
      
      setPhases(prev => prev.map(p => 
        p.id === phaseId 
          ? { ...p, status: 'completed', endTime, duration }
          : p
      ));
    }
  };

  const toggleChecklistItem = (phaseId: string, itemId: string) => {
    if (!currentOperator) {
      toast.error('Veuillez saisir le nom de l\'opérateur');
      return;
    }

    setPhases(prev => prev.map(phase => 
      phase.id === phaseId 
        ? {
            ...phase,
            checklist: phase.checklist.map(item => 
              item.id === itemId 
                ? { 
                    ...item, 
                    completed: !item.completed,
                    completedBy: !item.completed ? currentOperator : undefined,
                    completedAt: !item.completed ? new Date().toISOString() : undefined
                  }
                : item
            )
          }
        : phase
    ));
  };

  const addAnomaly = (description: string, severity: 'low' | 'medium' | 'high' | 'critical') => {
    if (!currentOperator) {
      toast.error('Veuillez saisir le nom de l\'opérateur');
      return;
    }

    const newAnomaly: Anomaly = {
      id: Date.now().toString(),
      description,
      severity,
      reportedBy: currentOperator,
      reportedAt: new Date().toISOString(),
      resolved: false
    };

    setAnomalies(prev => [...prev, newAnomaly]);
  };

  const resolveAnomaly = (anomalyId: string, resolution: string) => {
    setAnomalies(prev => prev.map(anomaly => 
      anomaly.id === anomalyId 
        ? { ...anomaly, resolved: true, resolution }
        : anomaly
    ));
  };

  const validateBySupervisor = (validatedBy: string, comments: string) => {
    setSupervisorValidation({
      validated: true,
      validatedBy,
      validatedAt: new Date().toISOString(),
      comments
    });
  };

  const getTotalDuration = () => {
    return phases.reduce((total, phase) => total + (phase.duration || 0), 0);
  };

  const getPhaseStatus = (phase: Phase) => {
    const requiredItems = phase.checklist.filter(item => item.required);
    const completedRequired = requiredItems.filter(item => item.completed);
    
    if (phase.status === 'completed') return 'completed';
    if (phase.status === 'in_progress') return 'in_progress';
    if (completedRequired.length === requiredItems.length) return 'ready';
    return 'pending';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      unit_name: formData.unit_name,
      event_type: formData.event_type as 'shutdown' | 'startup' | 'planned_shutdown' | 'emergency_shutdown',
      reason: formData.reason || null,
      start_time: formData.start_time,
      operator_name: formData.operator_name,
      status: formData.status as 'planned' | 'ongoing' | 'completed' | 'cancelled',
      duration_hours: getTotalDuration() / 60,
      // Stocker les données avancées en JSON dans des champs dédiés
      phases: JSON.stringify(phases),
      anomalies: JSON.stringify(anomalies),
      supervisor_validation: JSON.stringify(supervisorValidation)
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
          <CardTitle>Informations Générales</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="unit_name">Unité</Label>
                <Select value={formData.unit_name} onValueChange={(value) => setFormData({ ...formData, unit_name: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une unité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distillation">Distillation</SelectItem>
                    <SelectItem value="reforming">Reforming</SelectItem>
                    <SelectItem value="hydrotraitement">Hydrotraitement</SelectItem>
                    <SelectItem value="cracking">Cracking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="event_type">Type d'événement</Label>
                <Select value={formData.event_type} onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shutdown">Arrêt</SelectItem>
                    <SelectItem value="startup">Démarrage</SelectItem>
                    <SelectItem value="planned_shutdown">Arrêt planifié</SelectItem>
                    <SelectItem value="emergency_shutdown">Arrêt d'urgence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="current_operator">Opérateur en cours</Label>
              <Input
                id="current_operator"
                value={currentOperator}
                onChange={(e) => setCurrentOperator(e.target.value)}
                placeholder="Nom de l'opérateur"
              />
            </div>

            <div>
              <Label htmlFor="reason">Raison / Commentaires</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Décrire la raison de l'arrêt/démarrage..."
              />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Phases et Checklists */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Phases et Checklists
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {phases.map((phase, index) => (
            <div key={phase.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{index + 1}. {phase.name}</span>
                  <Badge variant={
                    getPhaseStatus(phase) === 'completed' ? 'default' :
                    getPhaseStatus(phase) === 'in_progress' ? 'secondary' :
                    getPhaseStatus(phase) === 'ready' ? 'outline' : 'destructive'
                  }>
                    {getPhaseStatus(phase) === 'completed' ? 'Terminé' :
                     getPhaseStatus(phase) === 'in_progress' ? 'En cours' :
                     getPhaseStatus(phase) === 'ready' ? 'Prêt' : 'En attente'}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  {phase.status === 'pending' && getPhaseStatus(phase) === 'ready' && (
                    <Button size="sm" onClick={() => startPhase(phase.id)}>
                      <Clock className="w-4 h-4 mr-1" />
                      Démarrer
                    </Button>
                  )}
                  {phase.status === 'in_progress' && (
                    <Button size="sm" onClick={() => completePhase(phase.id)}>
                      Terminer
                    </Button>
                  )}
                </div>
              </div>

              {phase.startTime && (
                <div className="text-sm text-gray-600 mb-3">
                  <div>Début: {new Date(phase.startTime).toLocaleString('fr-FR')}</div>
                  {phase.endTime && (
                    <>
                      <div>Fin: {new Date(phase.endTime).toLocaleString('fr-FR')}</div>
                      <div>Durée: {phase.duration} minutes</div>
                    </>
                  )}
                </div>
              )}

              <div className="space-y-2">
                {phase.checklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => toggleChecklistItem(phase.id, item.id)}
                      disabled={!currentOperator}
                    />
                    <span className={`flex-1 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                      {item.description}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                    {item.completed && item.completedBy && (
                      <div className="text-xs text-gray-500">
                        <User className="w-3 h-3 inline mr-1" />
                        {item.completedBy} - {new Date(item.completedAt!).toLocaleString('fr-FR')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Anomalies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Anomalies Rencontrées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Formulaire d'ajout d'anomalie */}
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <AnomalyForm onAdd={addAnomaly} />
          </div>

          {/* Liste des anomalies */}
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="border rounded p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={
                        anomaly.severity === 'critical' ? 'destructive' :
                        anomaly.severity === 'high' ? 'secondary' :
                        anomaly.severity === 'medium' ? 'outline' : 'default'
                      }>
                        {anomaly.severity === 'critical' ? 'Critique' :
                         anomaly.severity === 'high' ? 'Élevé' :
                         anomaly.severity === 'medium' ? 'Moyen' : 'Faible'}
                      </Badge>
                      {anomaly.resolved && <Badge variant="default">Résolu</Badge>}
                    </div>
                    <p className="text-sm mb-2">{anomaly.description}</p>
                    <div className="text-xs text-gray-500">
                      Signalé par {anomaly.reportedBy} le {new Date(anomaly.reportedAt).toLocaleString('fr-FR')}
                    </div>
                    {anomaly.resolution && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                        <strong>Résolution:</strong> {anomaly.resolution}
                      </div>
                    )}
                  </div>
                  {!anomaly.resolved && (
                    <AnomalyResolutionForm 
                      anomalyId={anomaly.id} 
                      onResolve={resolveAnomaly} 
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Validation Superviseur */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Superviseur</CardTitle>
        </CardHeader>
        <CardContent>
          {!supervisorValidation.validated ? (
            <SupervisorValidationForm onValidate={validateBySupervisor} />
          ) : (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Validé par {supervisorValidation.validatedBy}</span>
              </div>
              <div className="text-sm text-gray-600">
                Le {new Date(supervisorValidation.validatedAt).toLocaleString('fr-FR')}
              </div>
              {supervisorValidation.comments && (
                <div className="mt-2 text-sm">
                  <strong>Commentaires:</strong> {supervisorValidation.comments}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{getTotalDuration()}</div>
              <div className="text-sm text-gray-600">Minutes totales</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{anomalies.length}</div>
              <div className="text-sm text-gray-600">Anomalies</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {phases.filter(p => p.status === 'completed').length}/{phases.length}
              </div>
              <div className="text-sm text-gray-600">Phases terminées</div>
            </div>
          </div>
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

// Composant pour ajouter une anomalie
function AnomalyForm({ onAdd }: { onAdd: (description: string, severity: 'low' | 'medium' | 'high' | 'critical') => void }) {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim()) {
      onAdd(description, severity);
      setDescription('');
      setSeverity('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <Label>Description de l'anomalie</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décrire l'anomalie rencontrée..."
          rows={2}
        />
      </div>
      <div className="flex gap-4 items-end">
        <div>
          <Label>Sévérité</Label>
          <Select value={severity} onValueChange={(value: any) => setSeverity(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" size="sm">
          Ajouter
        </Button>
      </div>
    </form>
  );
}

// Composant pour résoudre une anomalie
function AnomalyResolutionForm({ anomalyId, onResolve }: { anomalyId: string, onResolve: (id: string, resolution: string) => void }) {
  const [resolution, setResolution] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (resolution.trim()) {
      onResolve(anomalyId, resolution);
      setResolution('');
      setShowForm(false);
    }
  };

  if (!showForm) {
    return (
      <Button size="sm" variant="outline" onClick={() => setShowForm(true)}>
        Résoudre
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        value={resolution}
        onChange={(e) => setResolution(e.target.value)}
        placeholder="Description de la résolution..."
        rows={2}
        className="w-64"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Confirmer
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => setShowForm(false)}>
          Annuler
        </Button>
      </div>
    </form>
  );
}

// Composant pour la validation superviseur
function SupervisorValidationForm({ onValidate }: { onValidate: (validatedBy: string, comments: string) => void }) {
  const [validatedBy, setValidatedBy] = useState('');
  const [comments, setComments] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatedBy.trim()) {
      onValidate(validatedBy, comments);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Nom du superviseur</Label>
        <Input
          value={validatedBy}
          onChange={(e) => setValidatedBy(e.target.value)}
          placeholder="Nom et prénom du superviseur"
          required
        />
      </div>
      <div>
        <Label>Commentaires (optionnel)</Label>
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Commentaires sur la validation..."
          rows={3}
        />
      </div>
      <Button type="submit">
        Valider l'événement
      </Button>
    </form>
  );
}
