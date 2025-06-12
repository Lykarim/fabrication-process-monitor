# Plateforme de Gestion d'Activité de Raffinerie

## Description de l'application

Cette application web est une plateforme de surveillance et de gestion des opérations pour une raffinerie. Elle permet de suivre en temps réel les indicateurs clés de performance, de gérer les données liées au traitement des eaux, à la qualité des produits, aux équipements, ainsi qu'aux arrêts et démarrages des unités. La plateforme est conçue pour faciliter la saisie manuelle des données journalières, alerter en cas de dépassement de seuils et fournir des tableaux de bord pour une meilleure visibilité opérationnelle.

## Fonctionnalités principales

La plateforme est organisée en modules principaux :

*   **Tableau de Bord :** Vue d'ensemble des métriques clés, alertes système et activité récente.
*   **Module Traitement des Eaux :** Saisie et suivi des paramètres des eaux de circulation et de chaudière, gestion des équipements auxiliaires.
*   **Module Suivi Qualité des Produits :** Gestion des normes commerciales, suivi des tonnages et rendements, contrôle qualité détaillé par produit.
*   **Module Gestion des Équipements :** Suivi du statut et des performances des équipements, gestion de la maintenance.
*   **Module Arrêts/Démarrages :** Journalisation et suivi des événements d'arrêts et de démarrages des unités.

Chaque module spécifique inclut des tableaux pour visualiser les données et permet, selon le rôle de l'utilisateur, d'effectuer des opérations CRUD (Créer, Lire, Modifier, Supprimer) sur les enregistrements.

## Architecture Technique

L'application suit une architecture moderne basée sur les technologies suivantes :

*   **Frontend :** Réalisé avec React et TypeScript, utilisant Vite comme outil de build.
*   **Composants UI :** Utilisation de Shadcn UI et Tailwind CSS pour une interface utilisateur cohérente et responsive.
*   **Gestion de l'état et des données :** Utilisation de React Query (`@tanstack/react-query`) pour la gestion des appels API et la mise en cache des données.
*   **Backend et Base de Données :** Supabase est utilisé comme backend as a Service (BaaS), fournissant la base de données PostgreSQL et les API pour l'authentification et les opérations CRUD.
*   **Sécurité :** La sécurité au niveau des lignes (Row-Level Security - RLS) est activée sur les tables Supabase pour contrôler finement l'accès et les modifications des données en fonction des rôles des utilisateurs.

## Gestion des Utilisateurs et Rôles

L'application définit différents rôles utilisateurs avec des niveaux d'autorisation variés. L'accès aux modules et la capacité d'effectuer des opérations CRUD sont déterminés par le rôle assigné à l'utilisateur. La vérification des rôles est effectuée côté frontend et, de manière sécurisée, renforcée par les politiques RLS côté base de données.

| Rôle        | Accès Tableau de Bord | Accès Modules Spécifiques | Créer/Modifier Données (Tables) | Supprimer Données (Tables) |
| :---------- | :-------------------- | :------------------------ | :---------------------------- | :------------------------- |
| `admin`     | Oui                   | Oui (Tous)                | Oui (Toutes tables)           | Oui (Toutes tables)        |
| `supervisor`| Oui                   | Oui (Tous)                | Oui (Toutes tables)           | Oui (Toutes tables)        |
| `operator`  | Oui                   | Oui (Selon module assigné)| Oui (Tables du module)        | Non                        |
| `viewer`    | Oui                   | Non                       | Non                           | Non                        |

*Note : L'accès aux modules spécifiques pour les rôles `operator` est configuré dans l'application pour correspondre à leur domaine de responsabilité (e.g., 'water_treatment', 'product_quality', 'equipment', 'shutdown_startup').*

## Technologies Utilisées

Ce projet est construit avec :

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- @tanstack/react-query

## Configuration et Lancement

Pour configurer et lancer le projet localement :

1.  Clonez le dépôt :

    ```sh
    git clone <YOUR_GIT_URL>
    cd <YOUR_PROJECT_NAME>
    ```

2.  Installez les dépendances :

    ```sh
    npm install # ou yarn install / pnpm install / bun install si vous utilisez un autre gestionnaire de paquets
    ```

3.  Configurez Supabase (assurez-vous que votre base de données est configurée et que les clés API sont correctement définies dans le code ou via des variables d'environnement, notamment dans `src/integrations/supabase/client.ts`). Configurez également les politiques RLS.

4.  Lancez le serveur de développement :

    ```sh
    npm run dev
    ```

L'application devrait être accessible à l'adresse indiquée par Vite (généralement `http://localhost:5173` ou un autre port disponible).

## Déploiement

Les instructions de déploiement dépendent de votre environnement cible (Vercel, Netlify, auto-hébergement, etc.). Le projet est un projet Vite standard et peut être déployé comme une application web statique après avoir construit le projet :

```sh
npm run build
```

Le contenu du dossier `dist` pourra ensuite être déployé. Assurez-vous que les variables d'environnement Supabase sont correctement configurées dans votre environnement de déploiement.

## Structure des dossiers et fichiers

Voici une vue d'ensemble de l'organisation des dossiers et fichiers principaux du projet :

```
refinery-performance-hub/
├── public/             # Fichiers statiques (images, favicon, etc.)
├── src/                # Code source de l'application
│   ├── components/     # Composants React réutilisables
│   │   ├── forms/      #  Formulaires pour les opérations CRUD
│   │   ├── tables/     #  Composants de table pour afficher les données
│   │   └── ui/         #  Composants UI de Shadcn
│   ├── hooks/          # Hooks React personnalisés (e.g., pour les données Supabase)
│   ├── integrations/   # Intégrations avec des services externes (e.g., Supabase)
│   │   └── supabase/   #  Fichiers de configuration et types Supabase
│   ├── lib/            # Fonctions utilitaires diverses
│   └── pages/          # Pages principales de l'application
├── supabase/           # Configuration liée à Supabase (potentiellement migrations, etc.)
├── ... autres fichiers de configuration à la racine (... package.json, tsconfig.json, etc.)
```

Cette structure sépare les préoccupations par type de fichier (composants, hooks, pages) et par intégration, facilitant la navigation et la maintenance du code.
