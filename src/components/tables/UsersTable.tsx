
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown, UserPlus, Search } from 'lucide-react';
import { useUsersData, useDeleteUser, UseUsersDataOptions } from '@/hooks/useUsersData';
import { useUserRoles, useCreateUserRole, useDeleteUserRole } from '@/hooks/useUserRoles';
import { UserForm } from '@/components/forms/UserForm';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function UsersTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<UseUsersDataOptions['filters']>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortState, setSortState] = useState<{ column: keyof Tables<'profiles'>; direction: 'asc' | 'desc' } | null>(null);

  const { data: usersData, isLoading } = useUsersData({ 
    searchTerm, 
    filters, 
    sort: sortState 
  });
  
  const { data: userRoles } = useUserRoles();
  const deleteMutation = useDeleteUser();
  const createRoleMutation = useCreateUserRole();
  const deleteRoleMutation = useDeleteUserRole();
  const { hasRole } = useAuth();
  const [editingData, setEditingData] = useState<Tables<'profiles'> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const canEdit = hasRole('admin');

  // Pagination
  const totalPages = Math.ceil((usersData?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedUsers = usersData?.slice(startIndex, endIndex) || [];

  const handleHeaderClick = (column: keyof Tables<'profiles'>) => {
    setSortState(prevState => {
      if (prevState?.column === column) {
        if (prevState.direction === 'asc') return { column, direction: 'desc' };
        if (prevState.direction === 'desc') return null;
      } else {
        return { column, direction: 'asc' };
      }
      return null;
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await deleteMutation.mutateAsync(id);
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur suppression utilisateur:', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      // Supprimer les anciens rôles
      const existingRoles = userRoles?.filter(role => role.user_id === userId) || [];
      for (const role of existingRoles) {
        await deleteRoleMutation.mutateAsync(role.id);
      }
      
      // Ajouter le nouveau rôle
      await createRoleMutation.mutateAsync({
        user_id: userId,
        role: newRole as any,
        module: 'all'
      });
      
      toast.success('Rôle utilisateur mis à jour');
    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const getUserRole = (userId: string) => {
    const roles = userRoles?.filter(role => role.user_id === userId);
    return roles?.[0]?.role || 'viewer';
  };

  if (isLoading) {
    return <div>Chargement des utilisateurs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Gestion des Utilisateurs</CardTitle>
        </div>
        
        {/* Filtres */}
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select onValueChange={(value) => setFilters({ department: value === 'all' ? undefined : value })}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les départements</SelectItem>
              <SelectItem value="Production">Production</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Qualité">Qualité</SelectItem>
              <SelectItem value="Administration">Administration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleHeaderClick('first_name')}>
                Prénom {sortState?.column === 'first_name' && (sortState.direction === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleHeaderClick('last_name')}>
                Nom {sortState?.column === 'last_name' && (sortState.direction === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleHeaderClick('department')}>
                Département {sortState?.column === 'department' && (sortState.direction === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />)}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleHeaderClick('email')}>
                Email {sortState?.column === 'email' && (sortState.direction === 'asc' ? <ArrowUp className="inline w-4 h-4 ml-1" /> : <ArrowDown className="inline w-4 h-4 ml-1" />)}
              </TableHead>
              <TableHead>Rôle</TableHead>
              {canEdit && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.department || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>
                  {canEdit ? (
                    <Select
                      value={getUserRole(user.id)}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="supervisor">Superviseur</SelectItem>
                        <SelectItem value="operator">Opérateur</SelectItem>
                        <SelectItem value="viewer">Visualiseur</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary">
                      {getUserRole(user.id)}
                    </Badge>
                  )}
                </TableCell>
                {canEdit && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog open={isFormOpen && editingData?.id === user.id} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingData(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          {editingData && (
                            <UserForm 
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
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
