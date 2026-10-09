# LearnSpace — Plateforme e-learning React

Projet frontend pédagogique construit avec React, Vite, React Router et CSS. Aucun backend ni API n'est nécessaire.

## Fonctionnalités incluses

- Accueil avec présentation, catégories, formations populaires et avantages
- Catalogue de formations avec recherche, filtres par catégorie/niveau, tri et affichage grille/liste
- Détail d'une formation avec objectifs, modules, chapitres et progression
- Lecture des chapitres avec navigation précédent/suivant et marquage comme terminé
- Progression sauvegardée dans `localStorage`
- Quiz à choix multiples, calcul du score et historique local
- Tableau de bord avec statistiques, formations commencées et résultats des quiz
- Profil étudiant modifiable et sauvegardé dans `localStorage`
- Certificat simulé quand tous les chapitres d'une formation sont terminés
- Favoris de formations sauvegardés dans `localStorage`
- Interface responsive ordinateur, tablette et mobile

## Installation

1. Installe Node.js (version LTS recommandée).
2. Ouvre ce dossier dans VS Code.
3. Ouvre le terminal intégré.
4. Installe les dépendances :

   ```bash
   npm install
   ```

5. Lance le serveur de développement :

   ```bash
   npm run dev
   ```

6. Ouvre l'adresse locale affichée par Vite, généralement `http://localhost:5173`.

## Construire la version de production

```bash
npm run build
npm run preview
```

## Routes principales

- `/` : Accueil
- `/formations` : Catalogue
- `/formations/:id` : Détail d'une formation
- `/formations/:id/cours/:chapterId` : Lecture d'un chapitre
- `/dashboard` : Tableau de bord étudiant
- `/profil` : Profil étudiant
- `/certificats/:id` : Certificat simulé

## Données et stockage

Les données d'exemple des formations se trouvent dans `src/data/courses.js`. Les données du profil, les favoris, les résultats des quiz et la progression sont stockés dans le `localStorage` du navigateur.

## Limites pédagogiques

- Le projet est frontend uniquement : il n'y a ni authentification réelle, ni serveur, ni synchronisation entre appareils.
- Les formations, les formateurs, les nombres d'étudiants et les notes sont des données de démonstration.
- Le contenu vidéo est une zone simulée ; aucun fichier vidéo n'est fourni.
- Le certificat est simulé et peut être imprimé ou enregistré en PDF depuis la fenêtre d'impression du navigateur.

## Git et GitHub

```bash
git init
git add .
git commit -m "Initialisation du projet LearnSpace"
```

Crée ensuite un dépôt GitHub et suis les instructions de GitHub pour connecter le dépôt distant puis pousser ton code.
