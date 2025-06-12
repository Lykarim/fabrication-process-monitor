
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type MaintenanceTasks = Tables<'maintenance_tasks'>;
type MaintenanceTasksInsert = TablesInsert<'maintenance_tasks'>;
type MaintenanceTasksUpdate = TablesUpdate<'maintenance_tasks'>;

export const useMaintenanceTasks = () => {
  return useQuery({
    queryKey: ['maintenance-tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_tasks')
        .select(`
          *,
          equipment_data (
            equipment_name,
            equipment_id,
            location
          )
        `)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateMaintenanceTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: MaintenanceTasksInsert) => {
      const { data: result, error } = await supabase
        .from('maintenance_tasks')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
    },
  });
};

export const useUpdateMaintenanceTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: MaintenanceTasksUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('maintenance_tasks')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
    },
  });
};

export const useDeleteMaintenanceTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('maintenance_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
    },
  });
};
