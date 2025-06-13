
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des Équipements</h1>
      
      <Tabs defaultValue="equipment" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="equipment">Équipements</TabsTrigger>
          <TabsTrigger value="problems">Problèmes</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="availability">Disponibilité</TabsTrigger>
          <TabsTrigger value="maintenance">Travaux</TabsTrigger>
        </TabsList>

        <TabsContent value="equipment">
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

        <TabsContent value="problems">
          <EquipmentProblemsForm />
        </TabsContent>

        <TabsContent value="incidents">
          <EquipmentIncidentsForm />
        </TabsContent>

        <TabsContent value="availability">
          <EquipmentAvailabilityManager />
        </TabsContent>

        <TabsContent value="maintenance">
          <EquipmentMaintenanceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}
