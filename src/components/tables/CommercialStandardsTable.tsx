
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useCommercialStandards, useDeleteCommercialStandard } from '@/hooks/useCommercialStandards';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { CommercialStandardForm } from '@/components/forms/CommercialStandardForm';

export function CommercialStandardsTable() {
  const { data: standards, isLoading } = useCommercialStandards();
  const { mutate: deleteStandard } = useDeleteCommercialStandard();
  const [editingStandard, setEditingStandard] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette norme ?')) {
      deleteStandard(id, {
        onSuccess: () => {
          toast.success('Norme supprimée avec succès');
        },
        onError: (error) => {
          console.error('Erreur suppression norme:', error);
          toast.error('Erreur lors de la suppression');
        },
      });
    }
  };

  const handleEdit = (standard: any) => {
    setEditingStandard(standard);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return <div>Chargement des normes commerciales...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Paramètre</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Unité</TableHead>
              <TableHead>Valide du</TableHead>
              <TableHead>Valide jusqu'au</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {standards?.map((standard) => (
              <TableRow key={standard.id}>
                <TableCell className="font-medium">{standard.product_name}</TableCell>
                <TableCell>{standard.parameter_name}</TableCell>
                <TableCell>{standard.min_value || '-'}</TableCell>
                <TableCell>{standard.max_value || '-'}</TableCell>
                <TableCell>{standard.unit || '-'}</TableCell>
                <TableCell>{standard.valid_from ? new Date(standard.valid_from).toLocaleDateString('fr-FR') : '-'}</TableCell>
                <TableCell>{standard.valid_to ? new Date(standard.valid_to).toLocaleDateString('fr-FR') : 'Indéfini'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(standard)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(standard.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          {editingStandard && (
            <CommercialStandardForm
              data={editingStandard}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setEditingStandard(null);
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingStandard(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
