# Générateur de Fiches Pédagogiques / مولد البطاقات التعليمية

Une plateforme moderne pour générer des fiches pédagogiques professionnelles avec l'intelligence artificielle, disponible en français et en arabe.

## Fonctionnalités

- Génération automatique de fiches pédagogiques complètes avec l'IA (Claude d'Anthropic)
- Support bilingue (Français et Arabe) avec interface RTL pour l'arabe
- Structure pédagogique complète :
  - Révision
  - Imprégnation/Mise en situation
  - Analyse/Production Dirigée
  - Consolidation/Fixation
  - Correction/Évaluation
- Téléchargement en PDF avec impression optimisée
- Sauvegarde automatique dans la base de données Supabase
- Interface moderne et responsive

## Prérequis

1. Un compte Supabase (gratuit) - [Créer un compte](https://supabase.com)
2. Une clé API Anthropic - [Obtenir une clé](https://console.anthropic.com)

## Configuration

1. Créez un fichier `.env` à la racine du projet en copiant `.env.example` :
   ```bash
   cp .env.example .env
   ```

2. Remplissez les variables d'environnement dans `.env` :
   ```
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
   ```

3. Installez les dépendances :
   ```bash
   npm install
   ```

## Démarrage

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## Utilisation

1. Remplissez le formulaire avec les informations de votre leçon :
   - Niveau (CI, CP, CE1, etc.)
   - Activité (Grammaire, Mathématiques, etc.)
   - Leçon
   - Objectif spécifique
   - Durée
   - Compétence de base (facultatif)
   - Informations supplémentaires (facultatif)

2. Entrez votre clé API Anthropic

3. Cliquez sur "Générer la fiche"

4. Une fois générée, vous pouvez :
   - Télécharger la fiche en PDF
   - Créer une nouvelle fiche
   - Changer la langue (FR/AR)

## Structure du projet

```
src/
├── components/
│   ├── SheetForm.tsx        # Formulaire de saisie
│   └── SheetDisplay.tsx     # Affichage de la fiche générée
├── lib/
│   ├── supabase.ts          # Client Supabase
│   └── translations.ts      # Traductions FR/AR
├── types.ts                 # Types TypeScript
├── App.tsx                  # Composant principal
└── main.tsx                 # Point d'entrée

supabase/
└── functions/
    └── generate-educational-sheet/
        └── index.ts         # Edge function pour l'IA
```

## Base de données

La base de données Supabase contient une table `educational_sheets` qui stocke :
- Les informations de la leçon
- Le contenu généré
- La langue utilisée
- La date de création

## Technologies utilisées

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (Base de données + Edge Functions)
- Claude AI (Anthropic)
- Lucide React (Icônes)

## Licence

MIT
