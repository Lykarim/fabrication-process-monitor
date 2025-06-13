
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { ProductQualityTable } from "@/components/tables/ProductQualityTable";
import { ProductQualityModal } from "@/components/modals/ProductQualityModal";
import { useProductQualityData } from "@/hooks/useProductQualityData";

export default function ProductQualityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: qualityData } = useProductQualityData();

  const productQualityCharts = qualityData && qualityData.length > 0 ? [
    {
      title: "Évolution des paramètres qualité",
      xAxisKey: "test_date",
      yAxisKey: "test_value",
      groupByKey: "product_name",
      chartType: "line" as const,
      colorScheme: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      data: qualityData
    },
    {
      title: "Tests par produit",
      xAxisKey: "product_name",
      yAxisKey: "test_value",
      groupByKey: "test_parameter",
      chartType: "bar" as const,
      colorScheme: ["#06b6d4", "#f97316", "#ec4899"],
      data: qualityData.filter((data: any) => data.test_value > 0)
    }
  ] : [];

  return (
    <ModulePage
      title="Qualité des Produits"
      data={qualityData || []}
      charts={productQualityCharts}
      tableComponent={<ProductQualityTable />}
      modalComponent={
        <ProductQualityModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      }
      addButtonText="Ajouter un test"
      isModalOpen={isModalOpen}
      onModalToggle={setIsModalOpen}
    />
  );
}
