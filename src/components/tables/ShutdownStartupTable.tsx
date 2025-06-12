
import { useState } from 'react';
import { AdvancedDataTable } from './AdvancedDataTable';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useShutdownStartupData, useDeleteShutdownStartupData } from '@/hooks/useShutdownStartupData';
import { ShutdownStartupForm } from '@/components/forms/ShutdownStartupForm';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export function ShutdownStartupTable() {
  const { data: shutdownData, isLoading } = useShutdownStartupData();
  const deleteMutation = useDeleteShutdownStartupData();
  const { hasRole } = useAuth();
  const [editingData, setEditingData] = useState<Tables<'shutdown_startup_events'> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = hasRole('operator', 'shutdown_startup') || hasRole('admin') || hasRole('supervisor');
  const canDelete = hasRole('admin') || hasRole('supervisor');

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Événement supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getEventTypeBadge = (eventType: string) => {
    switch (eventType) {
      case 'startup':
        return <Badge variant="default" className="bg-green-500">Démarrage</Badge>;
      case 'shutdown':
        return <Badge variant="secondary" className="bg-orange-500">Arrêt</Badge>;
      case 'planned_shutdown':
        return <Badge variant="outline" className="bg-blue-500">Arrêt planifié</Badge>;
      case 'emergency_shutdown':
        return <Badge variant="destructive">Arrêt d'urgence</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge variant="outline">Planifié</Badge>;
      case 'ongoing':
        return <Badge variant="secondary" className="bg-yellow-500">En cours</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulé</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getImpactBadge = (impact: string | null) => {
    switch (impact) {
      case 'low':
        return <Badge variant="outline" className="bg-green-100">Faible</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-500">Moyen</Badge>;
      case 'high':
        return <Badge variant="secondary" className="bg-orange-500">Élevé</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const columns = [
    {
      key: 'unit_name',
      label: 'Unité',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => <span className="capitalize">{value.replace('_', ' ')}</span>
    },
    {
      key: 'event_type',
      label: 'Type',
      sortable: true,
      filterable: true,
      type: 'status' as const,
      render: (value: any) => getEventTypeBadge(value)
    },
    {
      key: 'operator_name',
      label: 'Opérateur',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'start_time',
      label: 'Début',
      sortable: true,
      filterable: true,
      type: 'date' as const
    },
    {
      key: 'end_time',
      label: 'Fin',
      sortable: true,
      filterable: true,
      type: 'date' as const,
      render: (value: any) => value ? new Date(value).toLocaleString('fr-FR') : '-'
    },
    {
      key: 'duration_hours',
      label: 'Durée',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}h` : '-'
    },
    {
      key: 'impact_level',
      label: 'Impact',
      sortable: true,
      filterable: true,
      type: 'status' as const,
      render: (value: any) => getImpactBadge(value)
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      filterable: true,
      type: 'status' as const,
      render: (value: any) => getStatusBadge(value)
    },
    {
      key: 'cause_category',
      label: 'Catégorie cause',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'reason',
      label: 'Raison',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any, row: any) => (
        <span className="max-w-xs truncate" title={value || ''}>
          {value || '-'}
        </span>
      )
    }
  ];

  const actions = canEdit ? (row: any) => (
    <div className="flex gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setEditingData(row)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <ShutdownStartupForm 
            data={editingData} 
            onSuccess={() => setEditingData(null)}
            onCancel={() => setEditingData(null)}
          />
        </DialogContent>
      </Dialog>
      {canDelete && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleDelete(row.id)}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  ) : undefined;

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <AdvancedDataTable
        data={shutdownData || []}
        columns={columns}
        title="Événements d'Arrêts/Démarrages"
        enableSearch={true}
        enableFilters={true}
        enableExport={true}
        pageSize={15}
        actions={actions}
      />
      
      {canEdit && (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button 
              className="mt-4"
              onClick={() => setEditingData(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un événement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ShutdownStartupForm 
              data={editingData} 
              onSuccess={() => {
                setIsFormOpen(false);
                setEditingData(null);
              }}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingData(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
