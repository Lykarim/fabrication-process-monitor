
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useCreateCommercialStandard, useUpdateCommercialStandard } from '@/hooks/useCommercialStandards';

const commercialStandardSchema = z.object({
  product_name: z.string().min(1, "Le nom du produit est requis"),
  parameter_name: z.string().min(1, "Le nom du paramètre est requis"),
  min_value: z.number().optional(),
  max_value: z.number().optional(),
  unit: z.string().optional(),
  valid_from: z.string().optional(),
  valid_to: z.string().optional(),
});

type CommercialStandardFormValues = z.infer<typeof commercialStandardSchema>;

interface CommercialStandardFormProps {
  data?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CommercialStandardForm({ data, onSuccess, onCancel }: CommercialStandardFormProps) {
  const { mutate: createStandard, isPending: isCreating } = useCreateCommercialStandard();
  const { mutate: updateStandard, isPending: isUpdating } = useUpdateCommercialStandard();

  const form = useForm<CommercialStandardFormValues>({
    resolver: zodResolver(commercialStandardSchema),
    defaultValues: {
      product_name: data?.product_name || '',
      parameter_name: data?.parameter_name || '',
      min_value: data?.min_value || undefined,
      max_value: data?.max_value || undefined,
      unit: data?.unit || '',
      valid_from: data?.valid_from || '',
      valid_to: data?.valid_to || '',
    },
  });

  const onSubmit = (values: CommercialStandardFormValues) => {
    const submitData = {
      product_name: values.product_name,
      parameter_name: values.parameter_name,
      min_value: values.min_value,
      max_value: values.max_value,
      unit: values.unit,
      valid_from: values.valid_from,
      valid_to: values.valid_to,
    };

    if (data?.id) {
      updateStandard({
        id: data.id,
        ...submitData,
      }, {
        onSuccess: () => {
          toast.success('Norme commerciale mise à jour');
          onSuccess();
        },
        onError: (error) => {
          console.error('Erreur mise à jour norme:', error);
          toast.error('Erreur lors de la mise à jour');
        },
      });
    } else {
      createStandard(submitData, {
        onSuccess: () => {
          toast.success('Norme commerciale créée');
          onSuccess();
        },
        onError: (error) => {
          console.error('Erreur création norme:', error);
          toast.error('Erreur lors de la création');
        },
      });
    }
  };

  const isPending = isCreating || isUpdating;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <DialogHeader>
        <DialogTitle>
          {data ? 'Modifier la norme commerciale' : 'Ajouter une norme commerciale'}
        </DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="product_name" className="text-right">Produit</Label>
        <Input
          id="product_name"
          {...form.register('product_name')}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parameter_name" className="text-right">Paramètre</Label>
        <Input
          id="parameter_name"
          {...form.register('parameter_name')}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="min_value" className="text-right">Valeur Min</Label>
        <Input
          id="min_value"
          type="number"
          step="0.01"
          {...form.register('min_value', { valueAsNumber: true })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="max_value" className="text-right">Valeur Max</Label>
        <Input
          id="max_value"
          type="number"
          step="0.01"
          {...form.register('max_value', { valueAsNumber: true })}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="unit" className="text-right">Unité</Label>
        <Input
          id="unit"
          {...form.register('unit')}
          className="col-span-3"
        />
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Sauvegarde...' : 'Sauvegarder'}
        </Button>
      </DialogFooter>
    </form>
  );
}
