import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import WaterTreatmentPage from "./pages/WaterTreatmentPage";
import ProductQualityPage from "./pages/ProductQualityPage";
import EquipmentPage from "./pages/EquipmentPage";
import ShutdownStartupPage from "./pages/ShutdownStartupPage";
import SettingsPage from "./pages/SettingsPage";
import AdminUsersPage from "@/pages/AdminUsersPage.tsx";
import CommercialStandardsPage from "./pages/CommercialStandardsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <Index />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/water-treatment" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <WaterTreatmentPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product-quality" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <ProductQualityPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/commercial-standards" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <CommercialStandardsPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/equipment" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <EquipmentPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/shutdown-startup" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <ShutdownStartupPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <SettingsPage />
                  </SidebarProvider>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin-users"
              element={
                  <ProtectedRoute>
                      <SidebarProvider>
                      <AdminUsersPage />
                      </SidebarProvider>
                  </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
