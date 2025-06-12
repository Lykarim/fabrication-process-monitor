
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUpdateUser } from '@/hooks/useUsersData';
import { useAuth } from '@/hooks/useAuth';
import { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

const userProfileSchema = z.object({
  first_name: z.string().min(1, 'Le prénom est requis'),
  last_name: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  department: z.string().optional(),
});

type UserProfileFormData = z.infer<typeof userProfileSchema>;

interface UserProfileFormProps {
  onSuccess?: () => void;
}

export function UserProfileForm({ onSuccess }: UserProfileFormProps) {
  const { profile, hasRole } = useAuth();
  const updateMutation = useUpdateUser();
  const isAdmin = hasRole('admin');
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<UserProfileFormData>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: profile?.email || '',
      department: profile?.department || '',
    }
  });

  const onSubmit = async (formData: UserProfileFormData) => {
    if (!profile?.id) return;
    
    try {
      await updateMutation.mutateAsync({
        id: profile.id,
        ...formData
      });
      toast.success('Profil mis à jour avec succès');
      onSuccess?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  if (!profile) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Mon Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                {...register('first_name')}
                placeholder="Votre prénom"
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                {...register('last_name')}
                placeholder="Votre nom"
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="votre.email@example.com"
                disabled={!isAdmin}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
              {!isAdmin && (
                <p className="text-xs text-gray-500">
                  Seul un administrateur peut modifier l'email
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select 
                value={watch('department')} 
                onValueChange={(value) => setValue('department', value)}
                disabled={!isAdmin}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un département" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Qualité">Qualité</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="HSE">HSE</SelectItem>
                  <SelectItem value="Logistique">Logistique</SelectItem>
                </SelectContent>
              </Select>
              {!isAdmin && (
                <p className="text-xs text-gray-500">
                  Seul un administrateur peut modifier le département
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
