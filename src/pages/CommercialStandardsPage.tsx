
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { CommercialStandardsTable } from "@/components/tables/CommercialStandardsTable";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CommercialStandardForm } from "@/components/forms/CommercialStandardForm";

export default function CommercialStandardsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h1 className="text-lg font-semibold">Normes Commerciales</h1>
            <div className="ml-auto">
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une norme
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Gestion des Spécifications Commerciales</h3>
            <p className="text-sm text-blue-700">
              Interface pour la mise à jour mensuelle des normes par le service commercial.
              Définition des valeurs min/max de rendement par produit selon les standards en vigueur.
            </p>
          </div>
          
          <CommercialStandardsTable />
        </div>
      </SidebarInset>
      
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <CommercialStandardForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
