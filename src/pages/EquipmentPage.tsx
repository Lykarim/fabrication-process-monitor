
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { EquipmentTable } from "@/components/tables/EquipmentTable";
import { EquipmentModal } from "@/components/modals/EquipmentModal";
import { useEquipmentData } from "@/hooks/useEquipmentData";
import { equipmentCharts } from "@/config/chartConfigs";

export default function EquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: equipmentData } = useEquipmentData();

  return (
    <ModulePage
      title="Gestion des Équipements"
      data={equipmentData || []}
      charts={equipmentCharts}
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
  );
}
