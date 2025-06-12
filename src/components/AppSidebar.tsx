import { Calendar, Home, Settings, Droplets, FlaskConical, Wrench, AlertTriangle, Users, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/components/UserProfile';
import { Button } from '@/components/ui/button';
const modules = [{
  title: "Tableau de Bord",
  url: "/",
  icon: Home
}, {
  title: "Traitement des Eaux",
  url: "/water-treatment",
  icon: Droplets
}, {
  title: "Qualité Produits",
  url: "/product-quality",
  icon: FlaskConical
}, {
  title: "Gestion Équipements",
  url: "/equipment",
  icon: Wrench
}, {
  title: "Arrêts/Démarrages",
  url: "/shutdown-startup",
  icon: AlertTriangle
}];
const adminItems = [{
  title: "Configuration",
  url: "/settings",
  icon: Settings
}, {
  title: "Utilisateurs",
  url: "/admin-users",
  icon: Users
}];
export function AppSidebar() {
  const location = useLocation();
  const {
    hasRole,
    signOut
  } = useAuth();
  const isAdmin = hasRole('admin');
  return <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-sidebar-foreground">Raffinerie</h2>
            <p className="text-xs text-sidebar-foreground/60">Gestion Performance</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules Principaux</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {modules.map(item => <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent" isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map(item => <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="hover:bg-sidebar-accent" isActive={location.pathname === item.url}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>}
      </SidebarContent>
      
      <SidebarFooter className="border-t border-sidebar-border p-4 space-y-4">
        <UserProfile />
        
        <Button variant="outline" onClick={signOut} className="w-full justify-start text-zinc-950">
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
        
        <div className="text-xs text-sidebar-foreground/60">
          Version 1.0.0 - {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </Sidebar>;
}