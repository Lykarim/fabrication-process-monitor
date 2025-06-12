
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateShutdownStartupData, useUpdateShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

interface ShutdownStartupFormProps {
  data?: Tables<'shutdown_startup_events'>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ShutdownStartupForm({ data, onSuccess, onCancel }: ShutdownStartupFormProps) {
  const [formData, setFormData] = useState({
    unit_name: data?.unit_name || '',
    event_type: data?.event_type || 'shutdown',
    reason: data?.reason || '',
    start_time: data?.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '',
    end_time: data?.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : '',
    duration_hours: data?.duration_hours?.toString() || '',
    impact_level: data?.impact_level || 'medium',
    status: data?.status || 'planned',
  });

  const createMutation = useCreateShutdownStartupData();
  const updateMutation = useUpdateShutdownStartupData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      unit_name: formData.unit_name,
      event_type: formData.event_type as 'shutdown' | 'startup' | 'planned_shutdown' | 'emergency_shutdown',
      reason: formData.reason || null,
      start_time: formData.start_time,
      end_time: formData.end_time || null,
      duration_hours: formData.duration_hours ? parseFloat(formData.duration_hours) : null,
      impact_level: formData.impact_level as 'low' | 'medium' | 'high' | 'critical',
      status: formData.status as 'planned' | 'ongoing' | 'completed' | 'cancelled',
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
    <Card>
      <CardHeader>
        <CardTitle>{data ? 'Modifier' : 'Ajouter'} un événement d'arrêt/démarrage</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit_name">Nom de l'unité</Label>
              <Select value={formData.unit_name} onValueChange={(value) => setFormData({ ...formData, unit_name: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une unité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distillation">Unité Distillation</SelectItem>
                  <SelectItem value="reforming">Unité Reforming</SelectItem>
                  <SelectItem value="hydrotraitement">Unité Hydrotraitement</SelectItem>
                  <SelectItem value="cracking">Unité Cracking</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="traitement_eaux">Traitement des Eaux</SelectItem>
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
            <Label htmlFor="reason">Raison / Commentaires</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Décrire la raison de l'arrêt/démarrage..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                id="start_time"
                type="datetime-local"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_time">Heure de fin</Label>
              <Input
                id="end_time"
                type="datetime-local"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration_hours">Durée (heures)</Label>
              <Input
                id="duration_hours"
                type="number"
                step="0.1"
                min="0"
                value={formData.duration_hours}
                onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="impact_level">Niveau d'impact</Label>
              <Select value={formData.impact_level} onValueChange={(value) => setFormData({ ...formData, impact_level: value })}>
                <SelectTrigger>
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
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planifié</SelectItem>
                  <SelectItem value="ongoing">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {data ? 'Mettre à jour' : 'Créer'}
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
