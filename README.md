## Data Harmony Hub

Application front-end de type **console de supervision de données** permettant de visualiser des datasets, suivre les pipelines de traitement et consulter leurs journaux, avec un flux d’authentification simple (login / signup).

### Pages principales (`src/pages`)

- **`Index.tsx` (page d’atterrissage par défaut)**  
  Page très simple de type placeholder, qui affiche un message “Welcome to Your Blank App”. Elle sert de point d’entrée minimal si aucune autre home n’est encore câblée.

- **`HomePage.tsx` (tableau de bord)**  
  Tableau de bord qui s’appuie sur `mockData.json` pour afficher :
  - un récapitulatif des **statistiques globales** (nombre de datasets, pipelines actifs, erreurs),
  - la liste des **datasets récents** (nom, statut, date de mise à jour relative, avec badge de statut),
  - la liste des **pipelines récents** (nom, statut, durée).
  Cette page est pensée comme la vue d’ensemble de la plateforme après connexion.

- **`DatasetsPage.tsx` (liste des datasets)**  
  Page listant les datasets mockés avec :
  - une **barre de recherche** par nom,
  - des **filtres** par statut (Prêt, En cours, Erreur, En attente) et par source (CSV, JSON, Excel, BDD, API),
  - une **table** paginée (nom, source, nombre de lignes, statut, dernière mise à jour relative),
  - un bouton “Ajouter dataset” qui ouvre un **modal informatif** (fonctionnalité à venir).
  Un clic sur une ligne redirige vers la page détail `/datasets/:id`.

- **`DatasetDetailPage.tsx` (détail d’un dataset)**  
  Affiche les informations complètes d’un dataset :
  - métadonnées (propriétaire, source, dates de création / mise à jour, nombre de lignes et colonnes),
  - schéma des colonnes (nom, type, nullable),
  - aperçu des premières lignes (tableau dynamique).
  La page propose aussi des **actions simulées** : téléchargement CSV, affichage d’un endpoint API, suppression avec confirmation.

- **`PipelinesPage.tsx` (liste des pipelines)**  
  Liste paginée des pipelines de traitement, avec :
  - filtres par **statut fonctionnel** (Succès, Échec, En cours, En attente),
  - affichage d’indicateurs visuels (pastilles de couleur, badge de statut),
  - affichage des **étapes** du pipeline avec icônes de progression (terminée, en cours, à venir),
  - barre de progression lorsque le pipeline est en cours,
  - actions simulées : **relancer** un pipeline terminé, **annuler** un pipeline en cours / en attente,
  - lien vers la page des **logs** pour un pipeline donné.

- **`LogsPage.tsx` (journaux d’exécution d’un pipeline)**  
  Permet de consulter les logs associés à un pipeline :
  - résumé du pipeline (dataset, dates de début/fin, durée, statut),
  - filtres par **niveau de log** (Info, Warning, Erreur) et par texte de recherche,
  - rendu type **terminal** avec symbole et couleur suivant le niveau,
  - actions simulées : relancer un pipeline en échec, télécharger les logs.

- **`LoginPage.tsx` (connexion)**  
  Formulaire de connexion simple :
  - champs **email / mot de passe**,
  - validation très basique avec un utilisateur de démonstration (`marie@exemple.com` / `admin123` via `mockData.json`),
  - stockage de l’utilisateur courant dans `localStorage` et redirection vers `/home` en cas de succès,
  - message d’erreur en cas d’identifiants invalides,
  - lien vers la page d’inscription.

- **`SignupPage.tsx` (inscription)**  
  Formulaire d’inscription mocké :
  - champs email, mot de passe, confirmation de mot de passe, avec validations de base,
  - possibilité de **signup Google simulé** (pré-remplit l’utilisateur avec `mockData.currentUser`),
  - stockage en `localStorage` puis redirection vers `/home`,
  - messages d’erreur et de succès via `sonner`.

- **`NotFound.tsx` (404)**  
  Page d’erreur 404 générique :
  - log dans la console du chemin introuvable,
  - affichage d’un message “404 / Page not found”,
  - lien pour revenir à la racine `/`.

### Démarrage rapide

- **Développement** : `npm install` puis `npm run dev` (Vite).
- **Build de production** : `npm run build` puis `npm run preview`.

L’application est écrite en **React + TypeScript** avec **Vite**, Tailwind et des composants UI modernes (shadcn-like), et s’appuie sur des données factices dans `mockData.json` pour simuler une véritable plateforme de gestion de données.
