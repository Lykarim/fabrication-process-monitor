
export const chartColorSchemes = {
  primary: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
  secondary: ["#8b5cf6", "#06b6d4", "#84cc16"],
  tertiary: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
  danger: ["#dc2626", "#f59e0b", "#10b981", "#3b82f6"],
  mixed: ["#8b5cf6", "#06b6d4", "#84cc16", "#f97316", "#ec4899"]
};

export const waterTreatmentCharts = [
  {
    title: "Évolution du pH par équipement",
    xAxisKey: "timestamp",
    yAxisKey: "ph_level",
    groupByKey: "equipment_name",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.tertiary
  },
  {
    title: "Évolution de la température",
    xAxisKey: "timestamp",
    yAxisKey: "temperature",
    groupByKey: "equipment_type",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.primary
  },
  {
    title: "Phosphates dans les chaudières",
    xAxisKey: "timestamp",
    yAxisKey: "phosphates",
    groupByKey: "equipment_name",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.mixed,
    filterFn: (data: any[]) => data.filter(d => d.equipment_type === 'chaudiere')
  }
];

export const equipmentCharts = [
  {
    title: "Efficacité par type d'équipement",
    xAxisKey: "created_at",
    yAxisKey: "efficiency_percentage",
    groupByKey: "equipment_type",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.primary
  },
  {
    title: "Heures d'opération par équipement",
    xAxisKey: "created_at",
    yAxisKey: "operating_hours",
    groupByKey: "equipment_name",
    chartType: "bar" as const,
    colorScheme: chartColorSchemes.secondary
  }
];

export const productQualityCharts = [
  {
    title: "Évolution de la densité par produit",
    xAxisKey: "test_date",
    yAxisKey: "density",
    groupByKey: "product_name",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.mixed
  },
  {
    title: "Évolution de l'indice d'octane",
    xAxisKey: "test_date",
    yAxisKey: "octane_rating",
    groupByKey: "product_name",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.primary,
    filterFn: (data: any[]) => data.filter(d => d.octane_rating && d.octane_rating > 0)
  },
  {
    title: "Viscosité par produit",
    xAxisKey: "test_date",
    yAxisKey: "viscosity",
    groupByKey: "product_name",
    chartType: "bar" as const,
    colorScheme: chartColorSchemes.primary,
    filterFn: (data: any[]) => data.filter(d => d.viscosity && d.viscosity > 0)
  },
  {
    title: "Indice de cétane (Gasoil)",
    xAxisKey: "test_date",
    yAxisKey: "cetane",
    groupByKey: "product_name",
    chartType: "line" as const,
    colorScheme: chartColorSchemes.secondary,
    filterFn: (data: any[]) => data.filter(d => d.cetane && d.cetane > 0)
  }
];
