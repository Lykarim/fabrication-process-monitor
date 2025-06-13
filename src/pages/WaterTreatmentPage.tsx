
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { WaterTreatmentTable } from "@/components/tables/WaterTreatmentTable";
import { WaterTreatmentModal } from "@/components/modals/WaterTreatmentModal";
import { useWaterTreatmentData } from "@/hooks/useWaterTreatmentData";
import { waterTreatmentCharts } from "@/config/chartConfigs";

export default function WaterTreatmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: waterData } = useWaterTreatmentData();

  return (
    <ModulePage
      title="Traitement des Eaux"
      data={waterData || []}
      charts={waterTreatmentCharts}
      tableComponent={<WaterTreatmentTable />}
      modalComponent={
        <WaterTreatmentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      }
      addButtonText="Ajouter une mesure"
      isModalOpen={isModalOpen}
      onModalToggle={setIsModalOpen}
    />
  );
}
