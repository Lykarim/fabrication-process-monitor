
import { useState } from 'react';
import { AdvancedDataTable } from './AdvancedDataTable';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useWaterTreatmentData, useDeleteWaterTreatmentData } from '@/hooks/useWaterTreatmentData';
import { WaterTreatmentForm } from '@/components/forms/WaterTreatmentForm';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export function WaterTreatmentTable() {
  const { data: waterData, isLoading } = useWaterTreatmentData();
  const deleteMutation = useDeleteWaterTreatmentData();
  const { hasRole } = useAuth();
  const [editingData, setEditingData] = useState<Tables<'water_treatment_data'> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = hasRole('operator', 'water_treatment') || hasRole('admin') || hasRole('supervisor');
  const canDelete = hasRole('admin') || hasRole('supervisor');

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette mesure ?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Mesure supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'normal':
        return <Badge variant="default" className="bg-green-500">Normal</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-orange-500">Attention</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critique</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const columns = [
    {
      key: 'equipment_name',
      label: 'Équipement',
      sortable: true,
      filterable: true,
      type: 'text' as const
    },
    {
      key: 'equipment_type',
      label: 'Type',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => <span className="capitalize">{value.replace('_', ' ')}</span>
    },
    {
      key: 'chaudiere_number',
      label: 'N° Chaudière',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'ph_level',
      label: 'pH',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'temperature',
      label: 'Température (°C)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(1) : '-'
    },
    {
      key: 'pressure',
      label: 'Pression (bar)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'flow_rate',
      label: 'Débit (L/min)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(1) : '-'
    },
    {
      key: 'chlore_libre',
      label: 'Chlore libre (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'phosphates',
      label: 'Phosphates (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'sio2_level',
      label: 'SiO2 (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'ta_level',
      label: 'TA (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'th_level',
      label: 'TH (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'tac_level',
      label: 'TAC (mg/L)',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? value.toFixed(2) : '-'
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
      key: 'timestamp',
      label: 'Date/Heure',
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <WaterTreatmentForm 
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
        data={waterData || []}
        columns={columns}
        title="Données de Traitement des Eaux"
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
              Ajouter une mesure
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <WaterTreatmentForm 
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
