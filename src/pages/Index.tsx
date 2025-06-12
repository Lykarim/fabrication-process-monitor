
import React from 'react';
import { Sidebar } from '@/components/Sidebar';
import { WaterTreatmentDashboard } from '@/components/WaterTreatmentDashboard';
import { QualityMonitoring } from '@/components/QualityMonitoring';
import { EquipmentManagement } from '@/components/EquipmentManagement';
import { useState } from 'react';

const Index = () => {
  const [activeModule, setActiveModule] = useState('water-treatment');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'water-treatment':
        return <WaterTreatmentDashboard />;
      case 'quality':
        return <QualityMonitoring />;
      case 'equipment':
        return <EquipmentManagement />;
      default:
        return <WaterTreatmentDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Système de Monitoring - Procédés de Fabrication
            </h1>
            <p className="text-slate-600">
              Surveillance en temps réel des paramètres de production et qualité
            </p>
          </header>
          {renderActiveModule()}
        </div>
      </main>
    </div>
  );
};

export default Index;
