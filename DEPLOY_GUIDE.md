# Guide de Déploiement - Fonction Edge Supabase

## 🚀 Option 1 : Déploiement via Dashboard (RECOMMANDÉ)

### Étapes :

1. **Accédez au Dashboard Supabase**
   - URL : https://supabase.com/dashboard/project/rjocagdqhwzniyzhgcvh
   - Connectez-vous avec votre compte

2. **Naviguez vers Edge Functions**
   - Dans le menu latéral gauche, cliquez sur **"Edge Functions"**

3. **Trouvez votre fonction**
   - Cherchez `generate-educational-sheet` dans la liste

4. **Modifiez la fonction**
   - Cliquez sur la fonction
   - Cliquez sur **"Edit"** ou **"Deploy new version"**

5. **Copiez le nouveau code**
   - Ouvrez le fichier : `supabase/functions/generate-educational-sheet/index.ts`
   - Sélectionnez TOUT le contenu (Ctrl+A)
   - Copiez-le (Ctrl+C)

6. **Collez et déployez**
   - Collez le code dans l'éditeur du dashboard
   - Cliquez sur **"Deploy"** ou **"Save"**
   - Attendez la confirmation

7. **Testez**
   - Retournez à votre application
   - Rechargez la page (F5)
   - Obtenez votre clé API Gemini : https://aistudio.google.com/apikey
   - Essayez de générer une fiche

---

## 🔧 Option 2 : Déploiement via CLI Supabase

### Installation du CLI (Windows) :

#### Via Scoop (recommandé) :
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

#### Via Chocolatey :
```bash
choco install supabase
```

### Déploiement :

1. **Connexion à Supabase**
   ```bash
   supabase login
   ```

2. **Déployer la fonction**
   ```bash
   cd "c:\Users\diawf\Desktop\Code Tons"
   supabase functions deploy generate-educational-sheet --project-ref rjocagdqhwzniyzhgcvh
   ```

---

## ✅ Vérification

Après le déploiement, vérifiez que :
- ✅ Le déploiement a réussi (message de succès)
- ✅ La fonction apparaît comme "active" dans le dashboard
- ✅ L'application peut générer des fiches sans erreur CORS

---

## 🔑 Obtenir votre clé API Gemini

1. Allez sur : https://aistudio.google.com/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur "Create API Key"
4. Copiez la clé
5. Utilisez-la dans votre application

---

## ❓ Problèmes courants

### Erreur CORS
**Symptôme** : "blocked by CORS policy"
**Solution** : La fonction n'est pas encore déployée. Suivez l'Option 1.

### Erreur 400
**Symptôme** : "Bad Request"
**Solution** : L'ancienne version de la fonction est encore active. Redéployez.

### Erreur "Gemini API error"
**Symptôme** : Erreur après avoir cliqué sur "Générer"
**Solution** : Vérifiez que votre clé API Gemini est valide.
