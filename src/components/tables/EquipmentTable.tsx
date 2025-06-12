
import { useState } from 'react';
import { AdvancedDataTable } from './AdvancedDataTable';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useEquipmentData, useDeleteEquipmentData } from '@/hooks/useEquipmentData';
import { EquipmentForm } from '@/components/forms/EquipmentForm';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export function EquipmentTable() {
  const { data: equipmentData, isLoading } = useEquipmentData();
  const deleteMutation = useDeleteEquipmentData();
  const { hasRole } = useAuth();
  const [editingData, setEditingData] = useState<Tables<'equipment_data'> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = hasRole('operator', 'equipment') || hasRole('admin') || hasRole('supervisor');
  const canDelete = hasRole('admin') || hasRole('supervisor');

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Équipement supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="default" className="bg-green-500">Opérationnel</Badge>;
      case 'maintenance':
        return <Badge variant="secondary" className="bg-yellow-500">Maintenance</Badge>;
      case 'down':
        return <Badge variant="destructive">En panne</Badge>;
      case 'offline':
        return <Badge variant="outline">Hors service</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getAvailabilityBadge = (isAvailable: boolean) => {
    return isAvailable ? (
      <Badge variant="default" className="bg-green-500">Disponible</Badge>
    ) : (
      <Badge variant="destructive">Indisponible</Badge>
    );
  };

  const columns = [
    {
      key: 'equipment_name',
      label: 'Nom',
      sortable: true,
      filterable: true,
      type: 'text' as const
    },
    {
      key: 'equipment_id',
      label: 'ID Équipement',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => <span className="font-mono">{value}</span>
    },
    {
      key: 'tag',
      label: 'Tag',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'equipment_type',
      label: 'Type',
      sortable: true,
      filterable: true,
      type: 'text' as const
    },
    {
      key: 'equipment_category',
      label: 'Catégorie',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'location',
      label: 'Localisation',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
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
      key: 'is_available',
      label: 'Disponibilité',
      sortable: true,
      filterable: true,
      type: 'status' as const,
      render: (value: any) => getAvailabilityBadge(value)
    },
    {
      key: 'operating_hours',
      label: 'Heures opération',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}h` : '-'
    },
    {
      key: 'efficiency_percentage',
      label: 'Efficacité (%)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}%` : '-'
    },
    {
      key: 'last_maintenance',
      label: 'Dernière maintenance',
      sortable: true,
      filterable: true,
      type: 'date' as const
    },
    {
      key: 'next_maintenance',
      label: 'Prochaine maintenance',
      sortable: true,
      filterable: true,
      type: 'date' as const
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
        <DialogContent className="max-w-2xl">
          <EquipmentForm 
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
        data={equipmentData || []}
        columns={columns}
        title="Données des Équipements"
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
              Ajouter un équipement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <EquipmentForm 
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
