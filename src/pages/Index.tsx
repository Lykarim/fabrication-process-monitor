import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Droplets, 
  FlaskConical, 
  Wrench, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Database,
  Activity,
  Calendar,
  RefreshCw
} from "lucide-react";
import { WaterTreatmentDashboard } from "@/components/WaterTreatmentDashboard";
import { ProductQualityDashboard } from "@/components/ProductQualityDashboard";
import { EquipmentDashboard } from "@/components/EquipmentDashboard";
import { ShutdownStartupDashboard } from "@/components/ShutdownStartupDashboard";
import { HistoricalTrends } from "@/components/HistoricalTrends";
import { MonthNavigator } from "@/components/MonthNavigator";
import { useAuth } from "@/hooks/useAuth";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useState } from "react";
import AdminUsersPage from "@/pages/AdminUsersPage";

const Index = () => {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [dashboardPeriod, setDashboardPeriod] = useState<'today' | Date>('today');
  const { user, hasRole } = useAuth();
  
  const { data: dashboardStats, isLoading, refetch } = useDashboardData(dashboardPeriod);

  const getStatusBadge = (normal: number, warning: number, critical: number) => {
    if (critical > 0) return <Badge variant="destructive">Critique</Badge>;
    if (warning > 0) return <Badge variant="secondary" className="bg-yellow-500">Surveillance</Badge>;
    return <Badge variant="default" className="bg-green-500">Normal</Badge>;
  };

  const getPeriodLabel = () => {
    if (dashboardPeriod === 'today') return 'aujourd\'hui';
    return 'ce mois';
  };

  const renderContent = () => {
    switch (activeModule) {
      case "water-treatment":
        return <WaterTreatmentDashboard />;
      case "product-quality":
        return <ProductQualityDashboard />;
      case "equipment":
        return <EquipmentDashboard />;
      case "shutdown-startup":
        return <ShutdownStartupDashboard />;
      case "admin-users":
        return <AdminUsersPage />;
      case "historical":
        return <HistoricalTrends />;
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Plateforme de Gestion - Raffinerie</h1>
              </div>
              <div className="flex items-center gap-4">
                <MonthNavigator 
                  currentDate={dashboardPeriod}
                  onDateChange={setDashboardPeriod}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3">
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {/* Vue d'ensemble des modules */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("water-treatment")}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        Traitement des Eaux
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">État général</span>
                          {getStatusBadge(
                            dashboardStats?.waterTreatmentStats.normal || 0,
                            dashboardStats?.waterTreatmentStats.warning || 0,
                            dashboardStats?.waterTreatmentStats.critical || 0
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mesures {getPeriodLabel()}</span>
                          <Badge variant="outline">{dashboardStats?.waterTreatmentStats.total || 0}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("product-quality")}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FlaskConical className="w-5 h-5 text-green-500" />
                        Qualité Produits
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Conformité</span>
                          <Badge variant="default" className="bg-green-500">
                            {(dashboardStats?.productQualityStats.conformityRate || 0).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tests en cours</span>
                          <Badge variant="secondary">{dashboardStats?.productQualityStats.testsInProgress || 0}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("equipment")}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-purple-500" />
                        Équipements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Disponibilité</span>
                          <Badge variant="default" className="bg-green-500">
                            {(dashboardStats?.equipmentStats.availability || 0).toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">En maintenance</span>
                          <Badge variant="secondary" className="bg-orange-500">
                            {dashboardStats?.equipmentStats.inMaintenance || 0}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveModule("shutdown-startup")}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Arrêts/Démarrages
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Événements {getPeriodLabel()}</span>
                          <Badge variant="secondary">{dashboardStats?.shutdownStats.eventsToday || 0}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Planifiés</span>
                          <Badge variant="outline">{dashboardStats?.shutdownStats.planned || 0}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Alertes système */}
                {dashboardStats?.alertsCount && dashboardStats.alertsCount > 0 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Alertes Système Active ({dashboardStats.alertsCount})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div>
                          <div className="font-medium">Alertes non acquittées</div>
                          <div className="text-sm text-gray-600">
                            {dashboardStats.alertsCount} alerte(s) nécessite(nt) votre attention
                          </div>
                        </div>
                        <Badge variant="destructive">Urgent</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-green-500" />
                        Système Opérationnel
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">Aucune alerte active</div>
                          <div className="text-sm text-gray-600">
                            Tous les systèmes fonctionnent normalement
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-500">Normal</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        Performance Globale
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {((dashboardStats?.equipmentStats.availability || 0) + 
                          (dashboardStats?.productQualityStats.conformityRate || 0)) / 2 > 0 
                          ? (((dashboardStats?.equipmentStats.availability || 0) + 
                             (dashboardStats?.productQualityStats.conformityRate || 0)) / 2).toFixed(1) 
                          : '0.0'}%
                      </div>
                      <div className="text-sm text-gray-600">Efficacité opérationnelle</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        Utilisateurs Système
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{dashboardStats?.activeUsers || 0}</div>
                      <div className="text-sm text-gray-600">Comptes configurés</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Database className="w-4 h-4 text-purple-500" />
                        Données Collectées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-purple-600">{dashboardStats?.dataCollected || 0}</div>
                      <div className="text-sm text-gray-600">
                        Mesures {getPeriodLabel()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bouton pour voir l'historique */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Analyse Historique</h3>
                        <p className="text-gray-600">Consultez les tendances et l'évolution des performances</p>
                      </div>
                      <Button onClick={() => setActiveModule("historical")}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Voir l'historique
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">Tableau de Bord Principal</h1>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              {renderContent()}
            </div>
          </SidebarInset>
          
          <div className="flex-1 p-6">
            <nav className="mb-6">
              <div className="flex gap-2 border-b">
                <button
                  onClick={() => setActiveModule("dashboard")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "dashboard" 
                      ? "border-blue-500 text-blue-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Vue d'ensemble
                </button>
                <button
                  onClick={() => setActiveModule("historical")}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "historical" 
                      ? "border-blue-500 text-blue-600" 
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Historique
                </button>
                {(hasRole('operator', 'water_treatment') || hasRole('admin') || hasRole('supervisor')) && (
                  <button
                    onClick={() => setActiveModule("water-treatment")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "water-treatment" 
                        ? "border-blue-500 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Traitement des Eaux
                  </button>
                )}
                {(hasRole('operator', 'product_quality') || hasRole('admin') || hasRole('supervisor')) && (
                  <button
                    onClick={() => setActiveModule("product-quality")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "product-quality" 
                        ? "border-blue-500 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Qualité Produits
                  </button>
                )}
                {(hasRole('operator', 'equipment') || hasRole('admin') || hasRole('supervisor')) && (
                  <button
                    onClick={() => setActiveModule("equipment")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "equipment" 
                        ? "border-blue-500 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Équipements
                  </button>
                )}
                {(hasRole('operator', 'shutdown_startup') || hasRole('admin') || hasRole('supervisor')) && (
                  <button
                    onClick={() => setActiveModule("shutdown-startup")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "shutdown-startup" 
                        ? "border-blue-500 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Arrêts/Démarrages
                  </button>
                )}
                {hasRole('admin') && (
                  <button
                    onClick={() => setActiveModule("admin-users")}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${ activeModule === "admin-users" 
                        ? "border-blue-500 text-blue-600" 
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Administration Utilisateurs
                  </button>
                )}
              </div>
            </nav>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
