
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
import { Progress } from '@/components/ui/progress';
import { Edit, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useMaintenanceTasks, useDeleteMaintenanceTask } from '@/hooks/useMaintenanceTasks';
import { toast } from 'sonner';

export function MaintenanceTasksTable() {
  const { data: tasks, isLoading } = useMaintenanceTasks();
  const { mutate: deleteTask } = useDeleteMaintenanceTask();

  const handleDelete = (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(id, {
        onSuccess: () => {
          toast.success('Tâche supprimée avec succès');
        },
        onError: (error) => {
          console.error('Erreur suppression tâche:', error);
          toast.error('Erreur lors de la suppression');
        },
      });
    }
  };

  const getStatusBadge = (status: string, dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const isOverdue = due < now && status !== 'completed';

    if (isOverdue) {
      return <Badge variant="destructive">En retard</Badge>;
    }

    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Terminé</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-500">En cours</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return <div>Chargement des tâches de maintenance...</div>;
  }

  const overdueTasks = tasks?.filter(task => {
    const now = new Date();
    const due = new Date(task.due_date || '');
    return due < now && task.status !== 'completed';
  }).length || 0;

  return (
    <div className="space-y-4">
      {overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">
              {overdueTasks} tâche{overdueTasks > 1 ? 's' : ''} en retard
            </span>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tâche</TableHead>
              <TableHead>Équipement</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Progression</TableHead>
              <TableHead>Échéance</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.task_title}</div>
                    {task.description && (
                      <div className="text-sm text-gray-500">{task.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {task.equipment_data ? (
                    <div>
                      <div className="font-medium">{task.equipment_data.equipment_name}</div>
                      <div className="text-sm text-gray-500">{task.equipment_data.equipment_id}</div>
                    </div>
                  ) : (
                    'Non assigné'
                  )}
                </TableCell>
                <TableCell>{task.assigned_to || 'Non assigné'}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Progress value={task.percentage_completed || 0} className="w-20" />
                    <div className="text-xs text-gray-500">{task.percentage_completed || 0}%</div>
                  </div>
                </TableCell>
                <TableCell>
                  {task.due_date ? new Date(task.due_date).toLocaleDateString('fr-FR') : 'Non définie'}
                </TableCell>
                <TableCell>
                  {getStatusBadge(task.status || 'pending', task.due_date || '')}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(task.id)}
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
    </div>
  );
}
