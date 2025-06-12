
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';

export function UserProfile() {
  const { user, profile, roles, signOut } = useAuth();

  if (!user || !profile) return null;

  const initials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase();
  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;
  const primaryRole = roles[0]?.role || 'viewer';

  const roleLabels = {
    admin: 'Administrateur',
    supervisor: 'Superviseur',
    operator: 'Opérateur',
    viewer: 'Visualiseur'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {initials || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="text-left hidden md:block">
            <div className="text-sm font-medium">{displayName}</div>
            <div className="text-xs text-gray-500">{roleLabels[primaryRole]}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-gray-500">{profile.email}</p>
          <p className="text-xs text-blue-600 mt-1">{roleLabels[primaryRole]}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          Profil
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          Paramètres
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
