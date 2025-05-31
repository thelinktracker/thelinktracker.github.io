# Dashboard d'affiliation Rebrandly

> Dashboard simple pour suivre les clics et revenus des liens d'affiliation Rebrandly

## 🚀 Accès au dashboard

Chaque créateur a accès à son dashboard via un lien unique :
```
https://thelinktracker.github.io/dashboard.html?ref=PSEUDO
```

Remplacez `PSEUDO` par l'identifiant du créateur.

## 📊 Fonctionnalités

- Affichage des informations du créateur (pseudo, lien, commission)
- Statistiques en temps réel (clics et revenus)
- Calcul automatique du reste à payer
- Historique des paiements
- Responsive design (mobile et desktop)
- Bouton de copie du lien d'affiliation

## 🔄 Mise à jour des données

Les données sont mises à jour automatiquement via :
- Make.com (toutes les heures pour les clics)
- Supabase (base de données en temps réel)

## 🛠️ Configuration technique

Pour ajouter un nouveau créateur :

1. Créer un lien Rebrandly avec le pseudo comme slashtag
2. Ajouter dans Supabase :
   ```sql
   INSERT INTO affiliates_stats (pseudo, rebrandly_link, click_rate)
   VALUES ('pseudo', 'https://rebrand.ly/pseudo', 0.50);
   ```

## 🧪 Test

Pour tester le dashboard, utilisez :
```
https://thelinktracker.github.io/dashboard.html?ref=test
``` 