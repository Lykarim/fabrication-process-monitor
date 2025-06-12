
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesUpdate } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;
type UserProfileUpdate = TablesUpdate<'profiles'>;

// Type pour les utilisateurs avec leurs rôles
export interface UserWithRole extends UserProfile {
  user_roles?: Tables<'user_roles'>[];
}

// Définir les types pour les options de recherche et de filtre
export interface UseUsersDataOptions {
  searchTerm?: string;
  filters?: {
    department?: string | null;
  };
  sort?: {
    column: keyof Tables<'profiles'>;
    direction: 'asc' | 'desc';
  } | null;
}

// Modifier le hook pour accepter les options et récupérer les rôles
export const useUsersData = (options?: UseUsersDataOptions) => {
  const { searchTerm, filters, sort } = options || {};

  return useQuery({
    queryKey: ['user-profiles', searchTerm, filters, sort],
    queryFn: async () => {
      // D'abord récupérer tous les profils
      let profilesQuery = supabase.from('profiles').select('*');

      // Ajouter la logique de recherche si un terme est présent
      if (searchTerm) {
        profilesQuery = profilesQuery.or(`first_name.ilike.%${searchTerm}%, last_name.ilike.%${searchTerm}%, email.ilike.%${searchTerm}%`);
      }

      // Ajouter la logique de filtre par département si un département est sélectionné
      if (filters?.department) {
        profilesQuery = profilesQuery.eq('department', filters.department);
      }

      // Appliquer l'ordre
      if (sort) {
        profilesQuery = profilesQuery.order(sort.column, { ascending: sort.direction === 'asc' });
      } else {
        // Tri par défaut si aucun tri n'est spécifié, par exemple par nom de famille ascendant
        profilesQuery = profilesQuery.order('last_name', { ascending: true });
      }

      const { data: profiles, error: profilesError } = await profilesQuery;

      if (profilesError) throw profilesError;

      // Ensuite récupérer tous les rôles utilisateur
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      // Combiner les données
      const usersWithRoles: UserWithRole[] = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.id) || []
      })) || [];

      return usersWithRoles;
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UserProfileUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
    },
  });
};

// Nouveau hook pour supprimer un utilisateur
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
    },
  });
}; 
