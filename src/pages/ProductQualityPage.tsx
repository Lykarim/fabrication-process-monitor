
import { useState } from "react";
import { ModulePage } from "@/components/common/ModulePage";
import { ProductQualityTable } from "@/components/tables/ProductQualityTable";
import { ProductQualityModal } from "@/components/modals/ProductQualityModal";
import { useProductQualityData } from "@/hooks/useProductQualityData";
import { productQualityCharts } from "@/config/chartConfigs";

export default function ProductQualityPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: qualityData } = useProductQualityData();

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
