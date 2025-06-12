
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type WaterParameterLimits = Tables<'water_parameter_limits'>;
type WaterParameterLimitsInsert = TablesInsert<'water_parameter_limits'>;
type WaterParameterLimitsUpdate = TablesUpdate<'water_parameter_limits'>;

export const useWaterParameterLimits = () => {
  return useQuery({
    queryKey: ['water-parameter-limits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('water_parameter_limits')
        .select('*')
        .order('equipment_type', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateWaterParameterLimits = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: WaterParameterLimitsUpdate & { id: string }) => {
      const { data: result, error } = await supabase
        .from('water_parameter_limits')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water-parameter-limits'] });
    },
  });
};
