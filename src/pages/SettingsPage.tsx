
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Users, Database, Shield } from "lucide-react";
import { UserProfileForm } from "@/components/forms/UserProfileForm";

export default function SettingsPage() {
  return (
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h1 className="text-lg font-semibold">Configuration</h1>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="space-y-6">
            {/* Profil utilisateur */}
            <UserProfileForm />

            <div className="flex items-center gap-2">
              <Settings className="w-6 h-6 text-gray-600" />
              <h1 className="text-2xl font-bold">Configuration du Système</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Gestion des Utilisateurs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Gérer les utilisateurs, rôles et permissions d'accès aux différents modules.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Rôles disponibles:</span>
                      <ul className="mt-1 ml-4 text-gray-600">
                        <li>• Administrateur</li>
                        <li>• Superviseur</li>
                        <li>• Opérateur</li>
                        <li>• Visualiseur</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-500" />
                    Configuration des Seuils
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Définir les seuils d'alerte pour les paramètres surveillés.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Modules configurables:</span>
                      <ul className="mt-1 ml-4 text-gray-600">
                        <li>• Traitement des eaux</li>
                        <li>• Qualité produits</li>
                        <li>• Équipements</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-500" />
                    Sécurité et Accès
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Configurer les politiques de sécurité et les restrictions d'accès.
                  </p>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Fonctionnalités:</span>
                      <ul className="mt-1 ml-4 text-gray-600">
                        <li>• Authentification</li>
                        <li>• Permissions par module</li>
                        <li>• Audit des actions</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Instructions de Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Gestion des Rôles et Permissions</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Le système utilise un contrôle d'accès basé sur les rôles (RBAC) avec les niveaux suivants :
                    </p>
                    <ul className="text-sm text-gray-600 ml-4 space-y-1">
                      <li><strong>Administrateur :</strong> Accès complet à tous les modules et fonctions</li>
                      <li><strong>Superviseur :</strong> Lecture/écriture sur tous les modules, suppression limitée</li>
                      <li><strong>Opérateur :</strong> Lecture/écriture sur modules assignés</li>
                      <li><strong>Visualiseur :</strong> Lecture seule sur modules assignés</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Configuration des Alertes</h3>
                    <p className="text-sm text-gray-600">
                      Chaque paramètre surveillé peut avoir des seuils min/max configurables qui déclenchent 
                      automatiquement des alertes en cas de dépassement. Les alertes sont visibles dans les 
                      tableaux de bord respectifs de chaque module.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mentions légales et CGU */}
            <Card>
              <CardHeader>
                <CardTitle>Mentions Légales et Conditions Générales d'Utilisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-gray-600">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Mentions Légales</h4>
                    <p>
                      Cette application est développée pour la gestion des performances de la raffinerie.
                      Toutes les données sont confidentielles et propriété de l'entreprise.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Conditions Générales d'Utilisation</h4>
                    <ul className="space-y-1 ml-4">
                      <li>• L'accès à cette application est réservé au personnel autorisé</li>
                      <li>• Les utilisateurs sont responsables de la confidentialité de leurs identifiants</li>
                      <li>• Toute utilisation malveillante est strictement interdite</li>
                      <li>• Les données sont protégées conformément aux réglementations en vigueur</li>
                      <li>• L'entreprise se réserve le droit de modifier ces conditions à tout moment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Protection des Données</h4>
                    <p>
                      Les données personnelles sont traitées conformément au RGPD. 
                      Seules les informations nécessaires au fonctionnement de l'application sont collectées.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
}
