
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { WaterTreatmentTable } from "@/components/tables/WaterTreatmentTable";
import { WaterTreatmentModal } from "@/components/modals/WaterTreatmentModal";
import { useWaterTreatmentData } from "@/hooks/useWaterTreatmentData";
import { waterTreatmentCharts } from "@/config/chartConfigs";

export default function WaterTreatmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: waterData } = useWaterTreatmentData();

  // Add data property to charts configuration
  const chartsWithData = waterTreatmentCharts.map(chart => ({
    ...chart,
    data: waterData || []
  }));

  return (
    <ModulePage
      title="Traitement des Eaux"
      data={waterData || []}
      charts={chartsWithData}
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
