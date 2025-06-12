
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { ShutdownStartupTable } from "@/components/tables/ShutdownStartupTable";
import { ShutdownStartupModal } from "@/components/modals/ShutdownStartupModal";
import { useShutdownStartupData } from "@/hooks/useShutdownStartupData";

export default function ShutdownStartupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: shutdownData } = useShutdownStartupData();

  const durationData = shutdownData?.filter(item => item.duration_hours).map(item => ({
    ...item,
    date: item.start_time
  })) || [];

  const shutdownCharts = durationData.length > 0 ? [
    {
      title: "Durée des événements d'arrêt/démarrage",
      xAxisKey: "start_time",
      yAxisKey: "duration_hours",
      groupByKey: "unit_name",
      chartType: "bar" as const,
      colorScheme: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6"]
    }
  ] : [];

  return (
    <ModulePage
      title="Arrêts/Démarrages"
      data={durationData}
      charts={shutdownCharts}
      tableComponent={<ShutdownStartupTable />}
      modalComponent={
        <ShutdownStartupModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      }
      addButtonText="Ajouter un événement"
      isModalOpen={isModalOpen}
      onModalToggle={setIsModalOpen}
    />
  );
}
