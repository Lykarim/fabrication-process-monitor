
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { ShutdownStartupTable } from "@/components/tables/ShutdownStartupTable";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedShutdownStartupForm } from "@/components/forms/AdvancedShutdownStartupForm";
import { ShutdownStartupHistory } from "@/components/ShutdownStartupHistory";
import { useShutdownStartupData } from "@/hooks/useShutdownStartupData";
import { Plus, History, BarChart3 } from "lucide-react";

export default function ShutdownStartupPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
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
      colorScheme: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6"],
      data: durationData
    }
  ] : [];

  return (
    <div className="min-h-screen flex w-full">
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <div className="flex items-center justify-between px-6 py-4">
              <TabsList>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Tableau de bord
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Historique détaillé
                </TabsTrigger>
              </TabsList>
              
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nouvel événement
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="mt-0">
            <ModulePage
              title="Arrêts/Démarrages - Tableau de bord"
              data={durationData}
              charts={shutdownCharts}
              tableComponent={<ShutdownStartupTable />}
              modalComponent={
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    <AdvancedShutdownStartupForm
                      onSuccess={() => setIsModalOpen(false)}
                      onCancel={() => setIsModalOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              }
              addButtonText="Nouvel événement"
              isModalOpen={isModalOpen}
              onModalToggle={setIsModalOpen}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-0 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Historique détaillé des arrêts/démarrages</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvel événement
                </Button>
              </div>
              <ShutdownStartupHistory />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <AdvancedShutdownStartupForm
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
