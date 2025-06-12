
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ProductQualityData = Tables<'product_quality_data'>;
type ProductQualityInsert = TablesInsert<'product_quality_data'>;
type ProductQualityUpdate = TablesUpdate<'product_quality_data'>;

export const useProductQualityData = () => {
  return useQuery({
    queryKey: ['product-quality-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_quality_data')
        .select('*')
        .order('test_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateProductQualityData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<ProductQualityInsert, 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('product_quality_data')
        .insert([{ ...data, created_by: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-quality-data'] });
    },
  });
};

export const useUpdateProductQualityData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: ProductQualityUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('product_quality_data')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-quality-data'] });
    },
  });
};

export const useDeleteProductQualityData = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('product_quality_data')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product-quality-data'] });
    },
  });
};
