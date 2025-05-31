# Tâches à réaliser

## 🔥 Priorité Haute

### Supabase : Configuration RLS & Policies
- [x] Activer RLS sur la table `affiliates_stats`
- [x] Créer policy de lecture publique
- [x] Créer policy d'écriture (service role)
- [x] Tester les accès en lecture/écriture

### Make.com : Scénario de synchronisation
- [ ] Créer scénario "Sync Rebrandly Stats"
- [ ] Configurer déclencheur horaire
- [ ] Ajouter module Rebrandly "List Links"
- [ ] Ajouter Iterator
- [ ] Ajouter module "Get Link Clicks"
- [ ] Configurer connexion Supabase
- [ ] Mapper les champs (clicks, updated_at)
- [ ] Tester avec un lien existant

### GitHub Pages : Setup initial
- [x] Créer repo `rebrandlytracker`
- [x] Configurer GitHub Pages
- [x] Créer structure `/docs`
- [x] Créer `README.md` initial

### Front-end MVP
- [x] Créer `dashboard.html` basique
- [x] Créer `style.css` minimal
- [x] Créer `app.js` avec :
  - [x] Lecture paramètre `ref`
  - [x] Appel API Supabase
  - [x] Affichage clics et revenu estimé
  - [x] Message d'erreur si pseudo inconnu

## 🟡 Priorité Moyenne

### UI Historique des paiements
- [x] Ajouter section historique dans `dashboard.html`
- [x] Appel API Supabase payments
- [x] Affichage tableau paiements
- [x] Tri par date

### Make.com : Scénario Paiements
- [ ] Créer scénario "Enregistrer Paiement"
- [ ] Configurer webhook ou formulaire
- [ ] Ajouter insert dans `payments`
- [ ] Ajouter update `paid_amount`
- [ ] Tester le workflow complet

## 🟢 Priorité Faible

### Optimisations SQL
- [ ] Créer trigger recalcul `estimated_revenue`
- [ ] Créer vue `v_affiliate_balance`
- [ ] Tester les performances

### Design & UX
- [ ] Améliorer design global
- [ ] Ajouter animations/transitions
- [ ] Optimiser pour mobile
- [ ] Ajouter favicon et meta tags

## 📝 Documentation

- [ ] Documenter process d'onboarding créateur :
  1. Création lien Rebrandly
  2. Ajout dans Supabase
  3. Communication du lien dashboard
- [ ] Documenter maintenance (Make.com, Supabase)

## 🧪 Tests finaux

- [ ] Tester avec un créateur test :
  - [ ] Créer son lien Rebrandly
  - [ ] Ajouter dans Supabase
  - [ ] Vérifier mises à jour automatiques
  - [ ] Vérifier calcul du revenu

---

> Pour commencer, on passe au scénario Make.com ! 