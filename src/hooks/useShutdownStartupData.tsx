
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ShutdownStartupData = Tables<'shutdown_startup_events'>;
type ShutdownStartupInsert = TablesInsert<'shutdown_startup_events'>;
type ShutdownStartupUpdate = TablesUpdate<'shutdown_startup_events'>;

export const useShutdownStartupData = () => {
  return useQuery({
    queryKey: ['shutdown-startup-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shutdown_startup_events')
        .select('*')
        .order('start_time', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateShutdownStartupData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<ShutdownStartupInsert, 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('shutdown_startup_events')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shutdown-startup-data'] });
    },
  });
};

export const useUpdateShutdownStartupData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: ShutdownStartupUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('shutdown_startup_events')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shutdown-startup-data'] });
    },
  });
};

export const useDeleteShutdownStartupData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('shutdown_startup_events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shutdown-startup-data'] });
    },
  });
};
