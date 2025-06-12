
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import { useCreateShutdownStartupData, useUpdateShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { Tables } from '@/integrations/supabase/types';

type ShutdownStartupData = Tables<'shutdown_startup_events'>;

interface ShutdownStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  shutdownStartup?: ShutdownStartupData;
}

export function ShutdownStartupModal({ isOpen, onClose, shutdownStartup }: ShutdownStartupModalProps) {
  const [formData, setFormData] = useState({
    unit_name: '',
    event_type: 'planned_shutdown',
    reason: '',
    start_time: new Date().toISOString().slice(0, 16),
    end_time: '',
    duration_hours: 0,
    impact_level: 'low',
    status: 'planned'
  });

  const createMutation = useCreateShutdownStartupData();
  const updateMutation = useUpdateShutdownStartupData();

  useEffect(() => {
    if (shutdownStartup) {
      setFormData({
        unit_name: shutdownStartup.unit_name,
        event_type: shutdownStartup.event_type,
        reason: shutdownStartup.reason || '',
        start_time: new Date(shutdownStartup.start_time).toISOString().slice(0, 16),
        end_time: shutdownStartup.end_time ? new Date(shutdownStartup.end_time).toISOString().slice(0, 16) : '',
        duration_hours: shutdownStartup.duration_hours || 0,
        impact_level: shutdownStartup.impact_level || 'low',
        status: shutdownStartup.status
      });
    } else {
      setFormData({
        unit_name: '',
        event_type: 'planned_shutdown',
        reason: '',
        start_time: new Date().toISOString().slice(0, 16),
        end_time: '',
        duration_hours: 0,
        impact_level: 'low',
        status: 'planned'
      });
    }
  }, [shutdownStartup, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const dataToSubmit = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null
      };

      if (shutdownStartup) {
        await updateMutation.mutateAsync({
          id: shutdownStartup.id,
          ...dataToSubmit
        });
      } else {
        await createMutation.mutateAsync(dataToSubmit);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {shutdownStartup ? 'Modifier l\'événement' : 'Ajouter un événement'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="unit_name">Unité</Label>
            <Select 
              value={formData.unit_name} 
              onValueChange={(value) => setFormData({...formData, unit_name: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une unité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distillation">Distillation</SelectItem>
                <SelectItem value="reforming">Reforming</SelectItem>
                <SelectItem value="hydrotraitement">Hydrotraitement</SelectItem>
                <SelectItem value="cracking">Cracking</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="traitement_eaux">Traitement des eaux</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="event_type">Type d'événement</Label>
            <Select 
              value={formData.event_type} 
              onValueChange={(value) => setFormData({...formData, event_type: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned_shutdown">Arrêt planifié</SelectItem>
                <SelectItem value="emergency_shutdown">Arrêt d'urgence</SelectItem>
                <SelectItem value="shutdown">Arrêt</SelectItem>
                <SelectItem value="startup">Démarrage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Raison</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="start_time">Heure de début</Label>
            <Input
              id="start_time"
              type="datetime-local"
              value={formData.start_time}
              onChange={(e) => setFormData({...formData, start_time: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="end_time">Heure de fin</Label>
            <Input
              id="end_time"
              type="datetime-local"
              value={formData.end_time}
              onChange={(e) => setFormData({...formData, end_time: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="duration_hours">Durée (heures)</Label>
            <Input
              id="duration_hours"
              type="number"
              step="0.5"
              value={formData.duration_hours}
              onChange={(e) => setFormData({...formData, duration_hours: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <Label htmlFor="impact_level">Niveau d'impact</Label>
            <Select 
              value={formData.impact_level} 
              onValueChange={(value) => setFormData({...formData, impact_level: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Faible</SelectItem>
                <SelectItem value="medium">Moyen</SelectItem>
                <SelectItem value="high">Élevé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({...formData, status: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planned">Planifié</SelectItem>
                <SelectItem value="ongoing">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {shutdownStartup ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
