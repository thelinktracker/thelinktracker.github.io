# Dashboard d'affiliation Rebrandly

> Dashboard simple pour suivre les clics et revenus des liens d'affiliation Rebrandly

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Actif-brightgreen)
![Supabase](https://img.shields.io/badge/Supabase-Connecté-blue)
![Make.com](https://img.shields.io/badge/Make.com-Automatisé-orange)

## 🎯 Fonctionnalités

- Affichage en temps réel des clics et revenus
- Calcul automatique du reste à payer
- Historique des paiements
- Design responsive et moderne
- Mise à jour automatique via Make.com
- **🔐 Interface admin sécurisée avec authentification**

## 🚀 Demo

Testez le dashboard avec notre créateur de test :
```
https://thelinktracker.github.io/dashboard.html?ref=test
```

## 🔐 Accès Admin

L'interface d'administration est protégée par authentification :
```
https://thelinktracker.github.io/login.html
```

Fonctionnalités admin :
- Ajouter de nouveaux créateurs
- Supprimer des créateurs existants
- Vue d'ensemble de tous les créateurs
- Gestion sécurisée via Supabase Auth

Voir [SETUP_AUTH.md](SETUP_AUTH.md) pour configurer l'authentification.

## 🔗 Stack technique

- **Liens** : Rebrandly
- **Base de données** : Supabase
- **Authentification** : Supabase Auth
- **Automatisation** : Make.com
- **Front-end** : GitHub Pages (HTML/CSS/JS)

## 📋 Process d'onboarding

1. Créer un lien Rebrandly (slashtag = pseudo)
2. Se connecter à l'interface admin
3. Ajouter le créateur via le formulaire
4. Communiquer le lien du dashboard au créateur :
   ```
   https://thelinktracker.github.io/dashboard.html?ref=pseudo
   ```

## 📂 Structure du projet

```
/                         # Racine (GitHub Pages)
├── index.html            # Redirection vers dashboard
├── dashboard.html        # Page principale
├── admin.html            # Interface admin (protégée)
├── login.html            # Page de connexion
├── style.css             # Styles CSS
├── app.js                # Logique JavaScript
├── .nojekyll             # Configuration GitHub Pages
├── ACTION_PLAN.md        # Plan d'action global
├── TASKS.md              # Liste des tâches
├── SETUP_AUTH.md         # Guide d'authentification
└── make_scenario.json    # Configuration Make.com
```

## ⚙️ Configuration Make.com

Un scénario est configuré pour synchroniser les données de Rebrandly vers Supabase toutes les heures.

## 🔒 RLS Supabase

La sécurité des données est assurée par Row Level Security :
- Lecture publique sur `affiliates_stats` et `payments`
- Écriture restreinte aux utilisateurs authentifiés
- Clés anon exposées avec permissions limitées

## 📱 Responsive Design

Le dashboard est optimisé pour tous les appareils (mobile, tablette, desktop).

---

Made with ❤️ for content creators 