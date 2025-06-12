
import React from 'react';
import { Card } from '@/components/ui/card';
import { Droplets, FlaskConical, Settings, Wrench, TrendingUp, Shield } from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const menuItems = [
    {
      id: 'water-treatment',
      label: 'Traitement des Eaux',
      icon: Droplets,
      color: 'text-blue-600'
    },
    {
      id: 'quality',
      label: 'Exigences Qualité',
      icon: FlaskConical,
      color: 'text-green-600'
    },
    {
      id: 'reforming',
      label: 'Reforming',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      id: 'equipment',
      label: 'Gestion Équipements',
      icon: Settings,
      color: 'text-orange-600'
    },
    {
      id: 'maintenance',
      label: 'Travaux MDP',
      icon: Wrench,
      color: 'text-red-600'
    },
    {
      id: 'security',
      label: 'Sécurités',
      icon: Shield,
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2">FABRICATION</h2>
        <p className="text-sm text-slate-600">Procédés Industriels</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeModule === item.id
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${item.color}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
