# Plan d'action – Dashboard d'affiliation (Version simplifiée)

> Objectif : Permettre à chaque créateur de contenu de consulter en temps réel ses clics et son revenu estimé via une page GitHub Pages, alimentée par Supabase et automatisée par Make.com.

---

## 1. Pré-requis

| Outil | Statut | Notes |
|-------|--------|-------|
| Supabase project | ✅ Créé (`rebrandly tracker`) | DB en Europe (eu-central-2) |
| Rebrandly | ✅ Connecté à Make | Un lien unique par créateur |
| Make.com | ✅ Compte existant | Scénario de sync |
| GitHub | ✅ Compte + accès Pages | Pour héberger le dashboard |

---

## 2. Base de données Supabase

### 2.1 Table unique
`affiliates_stats`
- id (uuid, PK)
- pseudo (text, unique)
- rebrandly_link (text)
- click_rate (numeric) – tarif/clic
- clicks (int, default 0)
- updated_at (timestamptz, default now())

### 2.2 Policies (RLS)
- Lecture publique sur `affiliates_stats`
- Écriture restreinte au service role (Make.com)

---

## 3. Automation Make.com

### Scénario « Sync Rebrandly → Supabase » (toutes les heures)
1. **Rebrandly → List Links**
2. **Iterator** (pour chaque lien)
3. **Rebrandly → Get Link Clicks**
4. **Supabase → Update `affiliates_stats`**
   - Match : `pseudo`
   - Update : `clicks` et `updated_at`

---

## 4. GitHub Pages

### Structure
```text
/docs
├── dashboard.html
├── assets/
│   ├── style.css
│   └── app.js
└── README.md
```

### Fonctionnalités minimales
- Lire `?ref=` dans l'URL
- Appeler Supabase : `/rest/v1/affiliates_stats?pseudo=eq.<ref>`
- Afficher :
  - Nombre de clics
  - Revenu estimé (`clicks * click_rate`)
  - Dernière mise à jour

---

## 5. Process d'onboarding créateur

1. **Créer lien Rebrandly**
   - Slashtag = pseudo du créateur

2. **Ajouter dans Supabase**
   ```sql
   INSERT INTO affiliates_stats (pseudo, rebrandly_link, click_rate)
   VALUES ('lucas', 'https://rebrand.ly/lucas', 0.10);
   ```

3. **Communiquer lien dashboard**
   ```
   https://<user>.github.io/rebrandlytracker/dashboard.html?ref=lucas
   ```

---

## 6. Roadmap & estimation

| Étape | Durée est. | Priorité |
|-------|-----------|----------|
| Config RLS Supabase | ✅ Fait | Haute |
| Make – Sync basique | 30 min | Haute |
| GitHub Pages setup | 15 min | Haute |
| Dashboard minimal | 1 h | Haute |

Total ≈ **2 h** pour MVP minimal.

---

## 7. Checklist rapide

- [x] RLS activé + policy créée
- [ ] Scénario Make de sync opérationnel
- [ ] Repo GitHub + Pages publié
- [ ] Dashboard affiche les données basiques

---

**Go !** 🚀 