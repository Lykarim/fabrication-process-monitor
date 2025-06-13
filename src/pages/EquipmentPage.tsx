
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { EquipmentTable } from "@/components/tables/EquipmentTable";
import { EquipmentModal } from "@/components/modals/EquipmentModal";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EquipmentProblemsForm } from "@/components/forms/EquipmentProblemsForm";
import { EquipmentIncidentsForm } from "@/components/forms/EquipmentIncidentsForm";
import { EquipmentAvailabilityManager } from "@/components/forms/EquipmentAvailabilityManager";
import { EquipmentMaintenanceForm } from "@/components/forms/EquipmentMaintenanceForm";

export default function EquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: equipmentData } = useEquipmentData();

  return (
    <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">
        Gestion des Équipements
      </h1>
      
      <Tabs defaultValue="equipment" className="space-y-4 sm:space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-5 min-w-[500px] sm:min-w-full h-auto p-1">
            <TabsTrigger 
              value="equipment" 
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 data-[state=active]:bg-white"
            >
              <span className="hidden sm:inline">Équipements</span>
              <span className="sm:hidden">Équip.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="problems" 
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 data-[state=active]:bg-white"
            >
              <span className="hidden sm:inline">Problèmes</span>
              <span className="sm:hidden">Prob.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="incidents" 
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 data-[state=active]:bg-white"
            >
              Incidents
            </TabsTrigger>
            <TabsTrigger 
              value="availability" 
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 data-[state=active]:bg-white"
            >
              <span className="hidden sm:inline">Disponibilité</span>
              <span className="sm:hidden">Dispo.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="maintenance" 
              className="text-xs sm:text-sm px-2 py-2 sm:px-4 data-[state=active]:bg-white"
            >
              Travaux
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="equipment" className="mt-4 sm:mt-6">
          <ModulePage
            title=""
            data={equipmentData || []}
            charts={[]}
            tableComponent={<EquipmentTable />}
            modalComponent={
              <EquipmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            }
            addButtonText="Ajouter un équipement"
            isModalOpen={isModalOpen}
            onModalToggle={setIsModalOpen}
          />
        </TabsContent>

        <TabsContent value="problems" className="mt-4 sm:mt-6">
          <EquipmentProblemsForm />
        </TabsContent>

        <TabsContent value="incidents" className="mt-4 sm:mt-6">
          <EquipmentIncidentsForm />
        </TabsContent>

        <TabsContent value="availability" className="mt-4 sm:mt-6">
          <EquipmentAvailabilityManager />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-4 sm:mt-6">
          <EquipmentMaintenanceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
