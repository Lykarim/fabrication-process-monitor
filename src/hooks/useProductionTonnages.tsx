
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ProductionTonnages = Tables<'production_tonnages'>;
type ProductionTonnagesInsert = TablesInsert<'production_tonnages'>;
type ProductionTonnagesUpdate = TablesUpdate<'production_tonnages'>;

export const useProductionTonnages = () => {
  return useQuery({
    queryKey: ['production-tonnages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('production_tonnages')
        .select('*')
        .order('recorded_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProductionTonnage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<ProductionTonnagesInsert, 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('production_tonnages')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production-tonnages'] });
    },
  });
};
