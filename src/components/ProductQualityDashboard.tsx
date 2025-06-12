
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductQualityTable } from '@/components/tables/ProductQualityTable';
import { useProductQualityData } from '@/hooks/useProductQualityData';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

export function ProductQualityDashboard() {
  const { data: qualityData, isLoading } = useProductQualityData();

  if (isLoading) {
    return <div>Chargement des données de qualité...</div>;
  }

  const qualityStats = qualityData?.reduce((acc, item) => {
    acc[item.quality_status || 'pending'] = (acc[item.quality_status || 'pending'] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalTests = qualityData?.length || 0;
  const conformityRate = totalTests > 0 ? 
    ((qualityStats.conforming || 0) / totalTests * 100).toFixed(1) : 0;

  const recentTests = qualityData?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold">Qualité des Produits</h1>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Taux de Conformité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{conformityRate}%</div>
            <div className="text-sm text-gray-600">
              {qualityStats.conforming || 0} / {totalTests} tests
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              Non Conformes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{qualityStats.non_conforming || 0}</div>
            <div className="text-sm text-gray-600">tests</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-yellow-500" />
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{qualityStats.pending || 0}</div>
            <div className="text-sm text-gray-600">analyses</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tests Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {qualityData?.filter(item => 
                new Date(item.test_date).toDateString() === new Date().toDateString()
              ).length || 0}
            </div>
            <div className="text-sm text-gray-600">analyses effectuées</div>
          </CardContent>
        </Card>
      </div>

      {/* Tests récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Tests Récents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTests.map(test => (
              <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{test.product_name}</div>
                  <div className="text-sm text-gray-600">
                    Lot: {test.batch_number} - {new Date(test.test_date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <Badge variant={
                  test.quality_status === 'conforming' ? 'default' :
                  test.quality_status === 'non_conforming' ? 'destructive' : 'secondary'
                } className={
                  test.quality_status === 'conforming' ? 'bg-green-500' :
                  test.quality_status === 'pending' ? 'bg-yellow-500' : ''
                }>
                  {test.quality_status === 'conforming' ? 'Conforme' :
                   test.quality_status === 'non_conforming' ? 'Non conforme' : 'En attente'}
                </Badge>
              </div>
            ))}
            {recentTests.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                Aucun test récent
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tableau des données de qualité */}
      <ProductQualityTable />
    </div>
  );
}
