
import React, { useState } from 'react';
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdvancedMetricsChart } from "@/components/charts/AdvancedMetricsChart";
import { MonthNavigator } from "@/components/MonthNavigator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChartConfig {
  data: any[];
  title: string;
  xAxisKey: string;
  yAxisKey: string;
  groupByKey?: string;
  chartType?: 'line' | 'bar';
  colorScheme?: string[];
  filterFn?: (data: any[]) => any[];
}

interface ModulePageProps {
  title: string;
  data: any[];
  charts: ChartConfig[];
  tableComponent: React.ReactNode;
  modalComponent: React.ReactNode;
  addButtonText: string;
  isModalOpen: boolean;
  onModalToggle: (open: boolean) => void;
}

export function ModulePage({
  title,
  data,
  charts,
  tableComponent,
  modalComponent,
  addButtonText,
  isModalOpen,
  onModalToggle
}: ModulePageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | Date>('today');

  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2 flex-1">
            <h1 className="text-lg font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-4">
              <MonthNavigator 
                currentDate={selectedPeriod}
                onDateChange={setSelectedPeriod}
              />
              <Button onClick={() => onModalToggle(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {addButtonText}
              </Button>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4">
          {charts.map((chart, index) => {
            const chartData = chart.filterFn ? chart.filterFn(data || []) : data || [];
            return (
              <div key={index} className="w-full">
                <AdvancedMetricsChart
                  data={chartData}
                  title={chart.title}
                  xAxisKey={chart.xAxisKey}
                  yAxisKey={chart.yAxisKey}
                  groupByKey={chart.groupByKey}
                  chartType={chart.chartType || 'line'}
                  colorScheme={chart.colorScheme || ["#8884d8", "#82ca9d", "#ffc658"]}
                />
              </div>
            );
          })}
          
          <div className="w-full">
            {tableComponent}
          </div>
        </div>
      </SidebarInset>
      
      {modalComponent}
    </div>
  );
}
