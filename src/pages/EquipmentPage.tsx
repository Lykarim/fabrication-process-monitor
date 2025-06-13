
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { EquipmentTable } from "@/components/tables/EquipmentTable";
import { EquipmentModal } from "@/components/modals/EquipmentModal";
import { useEquipmentData } from "@/hooks/useEquipmentData";

export default function EquipmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: equipmentData } = useEquipmentData();

  const equipmentCharts = equipmentData && equipmentData.length > 0 ? [
    {
      title: "État des équipements",
      xAxisKey: "name",
      yAxisKey: "maintenance_frequency",
      groupByKey: "status",
      chartType: "bar" as const,
      colorScheme: ["#10b981", "#f59e0b", "#dc2626"],
      data: equipmentData
    }
  ] : [];

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
