
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type CommercialStandards = Tables<'commercial_standards'>;
type CommercialStandardsInsert = TablesInsert<'commercial_standards'>;
type CommercialStandardsUpdate = TablesUpdate<'commercial_standards'>;

export const useCommercialStandards = () => {
  return useQuery({
    queryKey: ['commercial-standards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('commercial_standards')
        .select('*')
        .order('product_name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateCommercialStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CommercialStandardsInsert) => {
      const { data: result, error } = await supabase
        .from('commercial_standards')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-standards'] });
    },
  });
};

export const useUpdateCommercialStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: CommercialStandardsUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('commercial_standards')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-standards'] });
    },
  });
};

export const useDeleteCommercialStandard = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('commercial_standards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commercial-standards'] });
    },
  });
};
