
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const generateWaterTreatmentData = async () => {
  const equipmentTypes = ['circulation', 'chaudiere', 'tour_refroidissement', 'traitement_primaire'];
  const equipmentNames = [
    'Circuit Refroidissement 1', 'Circuit Refroidissement 2', 'Chaudière A', 'Chaudière B',
    'Tour Nord', 'Tour Sud', 'Traitement Principal', 'Traitement Secondaire'
  ];
  const statuses = ['operational', 'maintenance', 'normal', 'warning'];

  const data = [];
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    data.push({
      equipment_name: equipmentNames[Math.floor(Math.random() * equipmentNames.length)],
      equipment_type: equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)],
      chaudiere_number: Math.floor(Math.random() * 3) + 1,
      ph_level: 6 + Math.random() * 3,
      temperature: 20 + Math.random() * 60,
      pressure: 1 + Math.random() * 10,
      flow_rate: 10 + Math.random() * 50,
      chlore_libre: Math.random() * 5,
      phosphates: Math.random() * 20,
      sio2_level: Math.random() * 30,
      ta_level: Math.random() * 100,
      th_level: Math.random() * 50,
      tac_level: Math.random() * 200,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      timestamp: timestamp.toISOString()
    });
  }

  const { error } = await supabase.from('water_treatment_data').insert(data);
  if (error) throw error;
};

const generateProductQualityData = async () => {
  const products = ['Essence 95', 'Essence 98', 'Gasoil', 'Kérosène', 'Fuel Lourd'];
  const qualityStatuses = ['conforming', 'non_conforming', 'pending'];
  const colors = ['Incolore', 'Jaune pâle', 'Jaune', 'Ambré'];
  const residueTypes = ['Distillat', 'Résidu', 'Mélange'];

  const data = [];
  const now = new Date();

  for (let i = 0; i < 80; i++) {
    const testDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const product = products[Math.floor(Math.random() * products.length)];
    
    data.push({
      product_name: product,
      batch_number: `LOT${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      test_date: testDate.toISOString(),
      density: 0.7 + Math.random() * 0.3,
      viscosity: product.includes('Gasoil') ? 2 + Math.random() * 4 : null,
      sulfur_content: Math.random() * 0.001,
      octane_rating: product.includes('Essence') ? 90 + Math.random() * 10 : null,
      cetane: product.includes('Gasoil') ? 45 + Math.random() * 10 : null,
      point_initial: -10 + Math.random() * 20,
      point_final: 150 + Math.random() * 200,
      cristallisation: product.includes('Gasoil') ? -5 + Math.random() * 15 : null,
      trouble: Math.random() * 5,
      indice: 80 + Math.random() * 20,
      evaporation_95: product.includes('Essence') ? 50 + Math.random() * 50 : null,
      ecoulement: Math.random() * 10,
      couleur: colors[Math.floor(Math.random() * colors.length)],
      residue_type: residueTypes[Math.floor(Math.random() * residueTypes.length)],
      quality_status: qualityStatuses[Math.floor(Math.random() * qualityStatuses.length)]
    });
  }

  const { error } = await supabase.from('product_quality_data').insert(data);
  if (error) throw error;
};

const generateEquipmentData = async () => {
  const equipmentTypes = ['Pompe', 'Compresseur', 'Échangeur', 'Réacteur', 'Colonne', 'Four'];
  const equipmentCategories = ['Raffinage', 'Utilité', 'Sécurité', 'Maintenance'];
  const locations = ['Unité 100', 'Unité 200', 'Unité 300', 'Utilités', 'Tank Farm'];
  const statuses = ['operational', 'maintenance', 'stopped', 'alarm'];

  const data = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const equipmentType = equipmentTypes[Math.floor(Math.random() * equipmentTypes.length)];
    const lastMaintenance = new Date(now.getTime() - Math.random() * 180 * 24 * 60 * 60 * 1000);
    const nextMaintenance = new Date(lastMaintenance.getTime() + (30 + Math.random() * 150) * 24 * 60 * 60 * 1000);
    
    data.push({
      equipment_id: `EQ${String(i + 1).padStart(3, '0')}`,
      equipment_name: `${equipmentType} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 99) + 1}`,
      equipment_type: equipmentType.toLowerCase(),
      equipment_category: equipmentCategories[Math.floor(Math.random() * equipmentCategories.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      operating_hours: Math.random() * 8760,
      efficiency_percentage: 70 + Math.random() * 30,
      last_maintenance: lastMaintenance.toISOString(),
      next_maintenance: nextMaintenance.toISOString(),
      tag: `${equipmentType.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      is_available: Math.random() > 0.2
    });
  }

  const { error } = await supabase.from('equipment_data').insert(data);
  if (error) throw error;
};

const generateShutdownStartupData = async () => {
  const units = ['Unité 100', 'Unité 200', 'Unité 300', 'Utilités', 'Four 1', 'Four 2'];
  const eventTypes = ['shutdown', 'startup'];
  const reasons = [
    'Maintenance préventive', 'Panne équipement', 'Inspection réglementaire',
    'Optimisation process', 'Arrêt programmé', 'Problème qualité'
  ];
  const causes = ['Technique', 'Opérationnelle', 'Réglementaire', 'Économique'];
  const impacts = ['Faible', 'Moyen', 'Élevé'];
  const statuses = ['planned', 'in_progress', 'completed', 'cancelled'];

  const data = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const startTime = new Date(now.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000);
    const duration = 2 + Math.random() * 48;
    const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
    
    data.push({
      unit_name: units[Math.floor(Math.random() * units.length)],
      event_type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      start_time: startTime.toISOString(),
      end_time: Math.random() > 0.3 ? endTime.toISOString() : null,
      duration_hours: Math.random() > 0.3 ? duration : null,
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      cause_category: causes[Math.floor(Math.random() * causes.length)],
      impact_level: impacts[Math.floor(Math.random() * impacts.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      operator_name: `Opérateur ${Math.floor(Math.random() * 20) + 1}`,
      comments: Math.random() > 0.5 ? 'Intervention réalisée selon procédure' : null
    });
  }

  const { error } = await supabase.from('shutdown_startup_events').insert(data);
  if (error) throw error;
};

export function useSimulatedData() {
  const queryClient = useQueryClient();

  const generateAllDataMutation = useMutation({
    mutationFn: async () => {
      await generateWaterTreatmentData();
      await generateProductQualityData();
      await generateEquipmentData();
      await generateShutdownStartupData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Données simulées générées avec succès !');
    },
    onError: (error) => {
      console.error('Erreur lors de la génération des données:', error);
      toast.error('Erreur lors de la génération des données simulées');
    }
  });

  return {
    generateAllData: generateAllDataMutation.mutate,
    isGenerating: generateAllDataMutation.isPending
  };
}
