
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type EquipmentData = Tables<'equipment_data'>;
type EquipmentInsert = TablesInsert<'equipment_data'>;
type EquipmentUpdate = TablesUpdate<'equipment_data'>;

export const useEquipmentData = () => {
  return useQuery({
    queryKey: ['equipment-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_data')
        .select('*')
        .order('equipment_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateEquipmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<EquipmentInsert, 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('equipment_data')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-data'] });
    },
  });
};

export const useUpdateEquipmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: EquipmentUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('equipment_data')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-data'] });
    },
  });
};

export const useDeleteEquipmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipment_data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment-data'] });
    },
  });
};
