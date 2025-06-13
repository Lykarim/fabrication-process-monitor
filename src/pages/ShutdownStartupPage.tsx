
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ShutdownStartupTable } from "@/components/tables/ShutdownStartupTable";
import { ComprehensiveShutdownStartupForm } from "@/components/forms/ComprehensiveShutdownStartupForm";
import { ShutdownStartupSynthesis } from "@/components/ShutdownStartupSynthesis";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ShutdownStartupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-lg font-semibold">Gestion des Arrêts/Démarrages</h1>
            <div className="ml-auto">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un événement
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                  <ComprehensiveShutdownStartupForm
                    onSuccess={() => setIsModalOpen(false)}
                    onCancel={() => setIsModalOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <Tabs defaultValue="events" className="w-full">
            <TabsList>
              <TabsTrigger value="events">Événements</TabsTrigger>
              <TabsTrigger value="synthesis">Synthèse</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events" className="space-y-4">
              <ShutdownStartupTable />
            </TabsContent>
            
            <TabsContent value="synthesis" className="space-y-4">
              <ShutdownStartupSynthesis />
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </div>
  );
}
