
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { WaterTreatmentTable } from "@/components/tables/WaterTreatmentTable";
import { WaterTreatmentModal } from "@/components/modals/WaterTreatmentModal";
import { useWaterTreatmentData } from "@/hooks/useWaterTreatmentData";

export default function WaterTreatmentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: waterData } = useWaterTreatmentData();

  const waterTreatmentCharts = waterData && waterData.length > 0 ? [
    {
      title: "pH des eaux",
      xAxisKey: "measured_at",
      yAxisKey: "ph_level",
      groupByKey: "water_type",
      chartType: "line" as const,
      colorScheme: ["#3b82f6", "#10b981", "#f59e0b"],
      data: waterData
    },
    {
      title: "Conductivité",
      xAxisKey: "measured_at",
      yAxisKey: "conductivity",
      groupByKey: "water_type",
      chartType: "line" as const,
      colorScheme: ["#8b5cf6", "#06b6d4", "#f97316"],
      data: waterData.filter((data: any) => data.conductivity)
    }
  ] : [];

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
