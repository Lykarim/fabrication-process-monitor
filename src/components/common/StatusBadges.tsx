
import React from 'react';
import { Badge } from '@/components/ui/badge';

export function QualityStatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case 'conforming':
      return <Badge variant="default" className="bg-green-500">Conforme</Badge>;
    case 'non_conforming':
      return <Badge variant="destructive">Non conforme</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-500">En attente</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
}

export function WaterStatusBadge({ status }: { status: string | null }) {
  switch (status) {
    case 'normal':
      return <Badge variant="default" className="bg-green-500">Normal</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-orange-500">Attention</Badge>;
    case 'critical':
      return <Badge variant="destructive">Critique</Badge>;
    case 'maintenance':
      return <Badge variant="outline">Maintenance</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
}

export function EventTypeBadge({ eventType }: { eventType: string }) {
  switch (eventType) {
    case 'startup':
      return <Badge variant="default" className="bg-green-500">Démarrage</Badge>;
    case 'shutdown':
      return <Badge variant="secondary" className="bg-orange-500">Arrêt</Badge>;
    case 'planned_shutdown':
      return <Badge variant="outline" className="bg-blue-500">Arrêt planifié</Badge>;
    case 'emergency_shutdown':
      return <Badge variant="destructive">Arrêt d'urgence</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
}

export function GeneralStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'planned':
      return <Badge variant="outline">Planifié</Badge>;
    case 'ongoing':
      return <Badge variant="secondary" className="bg-yellow-500">En cours</Badge>;
    case 'completed':
      return <Badge variant="default" className="bg-green-500">Terminé</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Annulé</Badge>;
    default:
      return <Badge variant="outline">Inconnu</Badge>;
  }
}

export function ImpactBadge({ impact }: { impact: string | null }) {
  switch (impact) {
    case 'low':
      return <Badge variant="outline" className="bg-green-100">Faible</Badge>;
    case 'medium':
      return <Badge variant="secondary" className="bg-yellow-500">Moyen</Badge>;
    case 'high':
      return <Badge variant="secondary" className="bg-orange-500">Élevé</Badge>;
    case 'critical':
      return <Badge variant="destructive">Critique</Badge>;
    default:
      return <Badge variant="outline">-</Badge>;
  }
}
