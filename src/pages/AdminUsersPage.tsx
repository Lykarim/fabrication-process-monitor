
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UsersTable } from "@/components/tables/UsersTable";
import { Button } from "@/components/ui/button";
import { useSimulatedData } from "@/hooks/useSimulatedData";
import { Database, Users } from "lucide-react";

export default function AdminUsersPage() {
  const { generateAllData, isGenerating } = useSimulatedData();

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <Users className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Administration des Utilisateurs</h1>
            <div className="ml-auto">
              <Button 
                onClick={() => generateAllData()}
                disabled={isGenerating}
                variant="outline"
              >
                <Database className="w-4 h-4 mr-2" />
                {isGenerating ? 'Génération...' : 'Générer données simulées'}
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <UsersTable />
        </div>
      </SidebarInset>
    </div>
  );
}
