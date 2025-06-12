
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type WaterTreatmentData = Tables<'water_treatment_data'>;
type WaterTreatmentInsert = TablesInsert<'water_treatment_data'>;
type WaterTreatmentUpdate = TablesUpdate<'water_treatment_data'>;

export const useWaterTreatmentData = () => {
  return useQuery({
    queryKey: ['water-treatment-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('water_treatment_data')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateWaterTreatmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<WaterTreatmentInsert, 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('water_treatment_data')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-treatment-data'] });
    },
  });
};

export const useUpdateWaterTreatmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: WaterTreatmentUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('water_treatment_data')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-treatment-data'] });
    },
  });
};

export const useDeleteWaterTreatmentData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('water_treatment_data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-treatment-data'] });
    },
  });
};
