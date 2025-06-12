
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface TableActionsProps {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (id: string) => void;
  editComponent?: React.ReactNode;
  canEdit?: boolean;
  canDelete?: boolean;
  isDeleting?: boolean;
}

export function TableActions({
  row,
  onEdit,
  onDelete,
  editComponent,
  canEdit = true,
  canDelete = true,
  isDeleting = false
}: TableActionsProps) {
  if (!canEdit && !canDelete) return null;

  return (
    <div className="flex gap-2">
      {canEdit && editComponent && (
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(row)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {editComponent}
          </DialogContent>
        </Dialog>
      )}
      
      {canDelete && onDelete && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onDelete(row.id)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
