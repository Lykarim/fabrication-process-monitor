import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useUpdateUser } from '@/hooks/useUsersData';
import { Tables } from '@/integrations/supabase/types';

type UserProfile = Tables<'profiles'>;

const userProfileSchema = z.object({
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  department: z.string().nullable(),
  email: z.string().email("Format d'email invalide").nullable(),
});

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

interface UserFormProps {
  data: Tables<'profiles'>;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UserForm({ data, onSuccess, onCancel }: UserFormProps) {
  const { mutate: updateUser, isPending } = useUpdateUser();

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      email: data.email,
    },
  });

  const onSubmit = (values: UserProfileFormValues) => {
    updateUser({
      id: data.id,
      first_name: values.first_name,
      last_name: values.last_name,
      department: values.department,
      email: values.email,
    }, {
      onSuccess: () => {
        toast.success('Profil utilisateur mis à jour');
        onSuccess();
      },
      onError: (error) => {
        console.error('Erreur mise à jour utilisateur:', error);
        toast.error('Erreur lors de la mise à jour du profil');
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
      <DialogHeader>
        <DialogTitle>Modifier l'utilisateur : {data.first_name} {data.last_name}</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="first_name" className="text-right">
          Prénom
        </Label>
        <Input id="first_name" {...form.register('first_name')} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="last_name" className="text-right">
          Nom
        </Label>
        <Input id="last_name" {...form.register('last_name')} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">
          Département
        </Label>
        <Input id="department" {...form.register('department')} className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <Input id="email" type="email" {...form.register('email')} className="col-span-3" />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </DialogFooter>
    </form>
  );
} 