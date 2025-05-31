# Configuration de l'authentification Supabase

## 1. Activer l'authentification par email

1. Connectez-vous à votre dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet `rebrandly tracker`
3. Allez dans "Authentication" > "Providers"
4. Activez "Email" si ce n'est pas déjà fait
5. Désactivez "Confirm email" pour simplifier le test (ou gardez-le activé pour plus de sécurité)

## 2. Créer un utilisateur admin

### Option A : Via l'interface Supabase
1. Dans "Authentication" > "Users"
2. Cliquez sur "Invite user"
3. Entrez votre email admin
4. Un email avec un lien sera envoyé

### Option B : Via SQL Editor
1. Allez dans "SQL Editor"
2. Exécutez cette requête :

```sql
-- Créer un utilisateur admin (remplacez par vos valeurs)
INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
) VALUES (
    gen_random_uuid(),
    'admin@example.com',
    crypt('votreMotDePasse', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}'
);
```

## 3. Tester l'authentification

1. Allez sur https://thelinktracker.github.io/login.html
2. Connectez-vous avec vos identifiants admin
3. Vous serez redirigé vers la page admin sécurisée

## 4. Fonctionnalités disponibles

Une fois connecté, vous pouvez :
- ✅ Voir tous les créateurs et leurs statistiques
- ✅ Ajouter de nouveaux créateurs
- ✅ Supprimer des créateurs existants
- ✅ Vous déconnecter de manière sécurisée

## 5. Sécurité

Les politiques RLS configurées assurent que :
- Tout le monde peut lire les données (pour les dashboards publics)
- Seuls les utilisateurs authentifiés peuvent modifier les données
- Les clés API exposées sont des clés "anon" avec permissions limitées

## Notes importantes

- Ne partagez jamais votre mot de passe admin
- Les clés service_role ne sont jamais exposées côté client
- Toutes les opérations d'écriture nécessitent une authentification 