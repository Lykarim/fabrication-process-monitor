
import { useState } from 'react';
import { AdvancedDataTable } from './AdvancedDataTable';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useProductQualityData, useDeleteProductQualityData } from '@/hooks/useProductQualityData';
import { ProductQualityForm } from '@/components/forms/ProductQualityForm';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

export function ProductQualityTable() {
  const { data: qualityData, isLoading } = useProductQualityData();
  const deleteMutation = useDeleteProductQualityData();
  const { hasRole } = useAuth();
  const [editingData, setEditingData] = useState<Tables<'product_quality_data'> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = hasRole('operator', 'product_quality') || hasRole('admin') || hasRole('supervisor');
  const canDelete = hasRole('admin') || hasRole('supervisor');

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Données supprimées avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const getQualityStatusBadge = (status: string | null) => {
    switch (status) {
      case 'conforming':
        return <Badge variant="default" className="bg-green-500">Conforme</Badge>;
      case 'non_conforming':
        return <Badge variant="destructive">Non conforme</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const columns = [
    {
      key: 'product_name',
      label: 'Produit',
      sortable: true,
      filterable: true,
      type: 'text' as const
    },
    {
      key: 'batch_number',
      label: 'N° Lot',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => <span className="font-mono">{value}</span>
    },
    {
      key: 'density',
      label: 'Densité',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'viscosity',
      label: 'Viscosité',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'sulfur_content',
      label: 'Soufre',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'octane_rating',
      label: 'Octane',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'cetane',
      label: 'Cétane',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'point_initial',
      label: 'Point initial',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}°C` : '-'
    },
    {
      key: 'point_final',
      label: 'Point final',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}°C` : '-'
    },
    {
      key: 'cristallisation',
      label: 'Cristallisation',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}°C` : '-'
    },
    {
      key: 'trouble',
      label: 'Trouble',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}°C` : '-'
    },
    {
      key: 'couleur',
      label: 'Couleur',
      sortable: true,
      filterable: true,
      type: 'text' as const,
      render: (value: any) => value || '-'
    },
    {
      key: 'evaporation_95',
      label: 'Évaporation 95%',
      sortable: true,
      filterable: true,
      type: 'number' as const,
      render: (value: any) => value ? `${value}%` : '-'
    },
    {
      key: 'quality_status',
      label: 'Statut',
      sortable: true,
      filterable: true,
      type: 'status' as const,
      render: (value: any) => getQualityStatusBadge(value)
    },
    {
      key: 'test_date',
      label: 'Date test',
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
          <ProductQualityForm 
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
        data={qualityData || []}
        columns={columns}
        title="Données de Qualité des Produits"
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
              Ajouter un test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ProductQualityForm 
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
