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

## 🚀 Demo

Testez le dashboard avec notre créateur de test :
```
https://harryjmg.github.io/rebrandlytracker/dashboard.html?ref=test
```

## 🔗 Stack technique

- **Liens** : Rebrandly
- **Base de données** : Supabase
- **Automatisation** : Make.com
- **Front-end** : GitHub Pages (HTML/CSS/JS)

## 📋 Process d'onboarding

1. Créer un lien Rebrandly (slashtag = pseudo)
2. Ajouter dans Supabase :
   ```sql
   INSERT INTO affiliates_stats (pseudo, rebrandly_link, click_rate)
   VALUES ('pseudo', 'https://rebrand.ly/pseudo', 0.50);
   ```
3. Communiquer le lien du dashboard au créateur :
   ```
   https://harryjmg.github.io/rebrandlytracker/dashboard.html?ref=pseudo
   ```

## 📂 Structure du projet

```
/docs                     # Site GitHub Pages
  ├── index.html          # Redirection vers dashboard
  ├── dashboard.html      # Page principale
  ├── style.css           # Styles CSS
  ├── app.js              # Logique JavaScript
  └── README.md           # Documentation

ACTION_PLAN.md            # Plan d'action global
TASKS.md                  # Liste des tâches
make_scenario.json        # Configuration Make.com
```

## ⚙️ Configuration Make.com

Un scénario est configuré pour synchroniser les données de Rebrandly vers Supabase toutes les heures.

## 🔒 RLS Supabase

La sécurité des données est assurée par Row Level Security :
- Lecture publique sur `affiliates_stats`
- Écriture restreinte au service role (Make.com)

## 📱 Responsive Design

Le dashboard est optimisé pour tous les appareils (mobile, tablette, desktop).

---

Made with ❤️ for content creators 