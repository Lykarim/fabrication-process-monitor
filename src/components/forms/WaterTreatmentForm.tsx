import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateWaterTreatmentData, useUpdateWaterTreatmentData } from '@/hooks/useWaterTreatmentData';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

const waterTreatmentSchema = z.object({
  equipment_name: z.string().min(1, 'Le nom de l\'équipement est requis'),
  equipment_type: z.string().min(1, 'Le type d\'équipement est requis'),
  chaudiere_number: z.number().min(1, 'Le numéro de chaudière doit être positif'),
  ph_level: z.number().min(0).max(14, 'Le pH doit être entre 0 et 14'),
  temperature: z.number().optional(),
  pressure: z.number().optional(),
  flow_rate: z.number().optional(),
  chlore_libre: z.number().optional(),
  phosphates: z.number().optional(),
  sio2_level: z.number().optional(),
  ta_level: z.number().optional(),
  th_level: z.number().optional(),
  tac_level: z.number().optional(),
  status: z.string().optional(),
});

type WaterTreatmentFormData = z.infer<typeof waterTreatmentSchema>;

export interface WaterTreatmentFormProps {
  data?: Tables<'water_treatment_data'>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function WaterTreatmentForm({ data, onSuccess, onCancel }: WaterTreatmentFormProps) {
  const createMutation = useCreateWaterTreatmentData();
  const updateMutation = useUpdateWaterTreatmentData();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<WaterTreatmentFormData>({
    resolver: zodResolver(waterTreatmentSchema),
    defaultValues: data ? {
      equipment_name: data.equipment_name,
      equipment_type: data.equipment_type || 'circulation',
      chaudiere_number: data.chaudiere_number || 1,
      ph_level: data.ph_level || 7,
      temperature: data.temperature || undefined,
      pressure: data.pressure || undefined,
      flow_rate: data.flow_rate || undefined,
      chlore_libre: data.chlore_libre || undefined,
      phosphates: data.phosphates || undefined,
      sio2_level: data.sio2_level || undefined,
      ta_level: data.ta_level || undefined,
      th_level: data.th_level || undefined,
      tac_level: data.tac_level || undefined,
      status: data.status || 'operational',
    } : {
      equipment_name: '',
      equipment_type: 'circulation',
      chaudiere_number: 1,
      ph_level: 7,
      status: 'operational',
    }
  });

  const onSubmit = async (formData: WaterTreatmentFormData) => {
    try {
      if (data?.id) {
        await updateMutation.mutateAsync({
          id: data.id,
          equipment_name: formData.equipment_name,
          equipment_type: formData.equipment_type,
          chaudiere_number: formData.chaudiere_number,
          ph_level: formData.ph_level,
          temperature: formData.temperature,
          pressure: formData.pressure,
          flow_rate: formData.flow_rate,
          chlore_libre: formData.chlore_libre,
          phosphates: formData.phosphates,
          sio2_level: formData.sio2_level,
          ta_level: formData.ta_level,
          th_level: formData.th_level,
          tac_level: formData.tac_level,
          status: formData.status,
        });
        toast.success('Données de traitement des eaux mises à jour avec succès');
      } else {
        await createMutation.mutateAsync({
          equipment_name: formData.equipment_name,
          equipment_type: formData.equipment_type,
          chaudiere_number: formData.chaudiere_number,
          ph_level: formData.ph_level,
          temperature: formData.temperature,
          pressure: formData.pressure,
          flow_rate: formData.flow_rate,
          chlore_libre: formData.chlore_libre,
          phosphates: formData.phosphates,
          sio2_level: formData.sio2_level,
          ta_level: formData.ta_level,
          th_level: formData.th_level,
          tac_level: formData.tac_level,
          status: formData.status,
        });
        toast.success('Données de traitement des eaux créées avec succès');
      }
      onSuccess();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des données');
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>
          {data ? 'Modifier' : 'Ajouter'} les données de traitement des eaux
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipment_name">Nom de l'équipement *</Label>
              <Input
                id="equipment_name"
                {...register('equipment_name')}
                placeholder="Circuit de refroidissement 1"
              />
              {errors.equipment_name && (
                <p className="text-sm text-red-500">{errors.equipment_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment_type">Type d'équipement *</Label>
              <Select 
                value={watch('equipment_type')} 
                onValueChange={(value) => setValue('equipment_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="circulation">Circulation</SelectItem>
                  <SelectItem value="chaudiere">Chaudière</SelectItem>
                  <SelectItem value="tour_refroidissement">Tour de refroidissement</SelectItem>
                  <SelectItem value="traitement_primaire">Traitement primaire</SelectItem>
                </SelectContent>
              </Select>
              {errors.equipment_type && (
                <p className="text-sm text-red-500">{errors.equipment_type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="chaudiere_number">Numéro de chaudière *</Label>
              <Input
                id="chaudiere_number"
                type="number"
                {...register('chaudiere_number', { valueAsNumber: true })}
                min="1"
              />
              {errors.chaudiere_number && (
                <p className="text-sm text-red-500">{errors.chaudiere_number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={watch('status')} 
                onValueChange={(value) => setValue('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Opérationnel</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="shutdown">Arrêt</SelectItem>
                  <SelectItem value="startup">Démarrage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ph_level">pH *</Label>
              <Input
                id="ph_level"
                type="number"
                step="0.1"
                min="0"
                max="14"
                {...register('ph_level', { valueAsNumber: true })}
              />
              {errors.ph_level && (
                <p className="text-sm text-red-500">{errors.ph_level.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Température (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                {...register('temperature', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pressure">Pression (bar)</Label>
              <Input
                id="pressure"
                type="number"
                step="0.1"
                {...register('pressure', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="flow_rate">Débit (m³/h)</Label>
              <Input
                id="flow_rate"
                type="number"
                step="0.1"
                {...register('flow_rate', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="chlore_libre">Chlore libre (mg/L)</Label>
              <Input
                id="chlore_libre"
                type="number"
                step="0.01"
                {...register('chlore_libre', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phosphates">Phosphates (mg/L)</Label>
              <Input
                id="phosphates"
                type="number"
                step="0.01"
                {...register('phosphates', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sio2_level">SiO2 (mg/L)</Label>
              <Input
                id="sio2_level"
                type="number"
                step="0.01"
                {...register('sio2_level', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ta_level">TA (mg/L)</Label>
              <Input
                id="ta_level"
                type="number"
                step="0.01"
                {...register('ta_level', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="th_level">TH (°f)</Label>
              <Input
                id="th_level"
                type="number"
                step="0.1"
                {...register('th_level', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tac_level">TAC (°f)</Label>
              <Input
                id="tac_level"
                type="number"
                step="0.1"
                {...register('tac_level', { valueAsNumber: true })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
