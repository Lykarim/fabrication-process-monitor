
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

export const QualityMonitoring = () => {
  const [selectedMonth, setSelectedMonth] = useState('06/2025');
  const [selectedBrut, setSelectedBrut] = useState('');

  const qualityParams = [
    { name: '95% évaporation butane', value: '', limit: { max: 2 }, unit: '' },
    { name: 'TV EL (Essence Légère)', value: '', limit: { max: 650 }, unit: '°C' },
    { name: 'Point Initial Naphta', value: '', limit: { min: 70, max: 100 }, unit: '°C' },
    { name: 'Point Final Naphta', value: '', limit: { min: 150, max: 180 }, unit: '°C' },
    { name: 'TV reformat', value: '', limit: { max: 650 }, unit: '°C' },
    { name: '10% reformat', value: '', limit: { max: 70 }, unit: '' },
    { name: 'Flash Kéro', value: '', limit: { min: 38 }, unit: '°C' },
    { name: 'Cristallisation Kéro', value: '', limit: { max: -47 }, unit: '°C' },
  ];

  const getComplianceStatus = (value: string, limits: any) => {
    if (!value) return 'pending';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'pending';
    
    if (limits.min !== undefined && limits.max !== undefined) {
      return numValue >= limits.min && numValue <= limits.max ? 'compliant' : 'non-compliant';
    } else if (limits.max !== undefined) {
      return numValue <= limits.max ? 'compliant' : 'non-compliant';
    } else if (limits.min !== undefined) {
      return numValue >= limits.min ? 'compliant' : 'non-compliant';
    }
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Exigences Qualité</h2>
        <div className="flex gap-2">
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="06/2025">06/2025</SelectItem>
              <SelectItem value="07/2025">07/2025</SelectItem>
              <SelectItem value="08/2025">08/2025</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm">Rapport Mensuel</Button>
        </div>
      </div>

      <Tabs defaultValue="commercial" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="commercial">Fenêtre Commercial</TabsTrigger>
          <TabsTrigger value="daily">Suivi Quotidien</TabsTrigger>
          <TabsTrigger value="production">Rendements</TabsTrigger>
        </TabsList>

        <TabsContent value="commercial" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Spécifications Commerciales - {selectedMonth}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Unité Distillation</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse border border-slate-300">
                        <thead>
                          <tr className="bg-slate-100">
                            <th className="border border-slate-300 p-2 text-left">Période</th>
                            <th className="border border-slate-300 p-2">Charge (t/h)</th>
                            <th className="border border-slate-300 p-2">Butane</th>
                            <th className="border border-slate-300 p-2">EL</th>
                            <th className="border border-slate-300 p-2">Naphta</th>
                            <th className="border border-slate-300 p-2">Kéro</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-slate-300 p-2">01-15/06/2025</td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-slate-300 p-2">16-30/06/2025</td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                            <td className="border border-slate-300 p-2">
                              <Input className="h-8 w-16" type="number" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Consignes Qualité</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Type de Brut</Label>
                        <Select value={selectedBrut} onValueChange={setSelectedBrut}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le brut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="brut1">Brut Léger</SelectItem>
                            <SelectItem value="brut2">Brut Moyen</SelectItem>
                            <SelectItem value="brut3">Brut Lourd</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs">TV reformat</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Min" className="h-8" />
                            <Input placeholder="Max" className="h-8" />
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">TV EL</Label>
                          <div className="flex gap-2">
                            <Input placeholder="Min" className="h-8" />
                            <Input placeholder="Max" className="h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {qualityParams.map((param, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    {param.name}
                    {getComplianceStatus(param.value, param.limit) === 'compliant' && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {getComplianceStatus(param.value, param.limit) === 'non-compliant' && (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input
                      type="number"
                      placeholder="Valeur"
                      className="h-8"
                    />
                    <div className="text-xs text-slate-600">
                      Limites: {param.limit.min && `${param.limit.min}${param.unit}`}
                      {param.limit.min && param.limit.max && ' - '}
                      {param.limit.max && `≤ ${param.limit.max}${param.unit}`}
                    </div>
                    <Badge 
                      variant={getComplianceStatus(param.value, param.limit) === 'compliant' ? 'default' : 'destructive'}
                      className="text-xs"
                    >
                      {getComplianceStatus(param.value, param.limit) === 'compliant' ? 'Conforme' : 'Hors Spec'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistiques de Conformité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-700">85%</div>
                  <div className="text-sm text-green-600">Paramètres Conformes</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-700">3</div>
                  <div className="text-sm text-red-600">Non-Conformités ce mois</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-700">12</div>
                  <div className="text-sm text-blue-600">Mesures Aujourd'hui</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Suivi Rendement/Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-4">Production Journalière</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Quantité Brut Traitée (t/h)</Label>
                      <Input type="number" className="mt-1" />
                    </div>
                    <div>
                      <Label>Quantité Brut Traitée (t/j)</Label>
                      <Input type="number" className="mt-1" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-4">Rendements (%)</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">Butane</Label>
                      <Input type="number" step="0.1" className="h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Essence Légère</Label>
                      <Input type="number" step="0.1" className="h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Naphta</Label>
                      <Input type="number" step="0.1" className="h-8 mt-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Kérosène</Label>
                      <Input type="number" step="0.1" className="h-8 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <Button className="w-full">Enregistrer Production</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
