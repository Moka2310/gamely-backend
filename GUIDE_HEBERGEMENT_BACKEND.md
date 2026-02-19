# 🚀 GUIDE : Héberger le Backend GAMLY en Production

Ce guide vous explique comment héberger gratuitement le backend de GAMLY pour que votre application fonctionne sur le Google Play Store.

---

## PARTIE 1 : Créer une base de données MongoDB Atlas (Gratuit)

### Étape 1.1 : Créer un compte MongoDB Atlas

1. Allez sur : https://www.mongodb.com/cloud/atlas
2. Cliquez sur **"Try Free"** (Essayer gratuitement)
3. Créez un compte avec votre email
4. Confirmez votre email

### Étape 1.2 : Créer un cluster gratuit

1. Après connexion, cliquez sur **"Build a Database"**
2. Sélectionnez **"M0 FREE"** (Gratuit - 512 MB)
3. Choisissez une région proche de vous (ex: Paris, Frankfurt)
4. Cliquez sur **"Create"**
5. Attendez 1-2 minutes que le cluster soit créé

### Étape 1.3 : Configurer l'accès

1. **Créer un utilisateur de base de données** :
   - Allez dans **"Database Access"** (menu gauche)
   - Cliquez sur **"Add New Database User"**
   - Username : `gamly_user`
   - Password : Choisissez un mot de passe fort (notez-le !)
   - Cliquez sur **"Add User"**

2. **Autoriser les connexions** :
   - Allez dans **"Network Access"** (menu gauche)
   - Cliquez sur **"Add IP Address"**
   - Cliquez sur **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Cliquez sur **"Confirm"**

### Étape 1.4 : Obtenir l'URL de connexion

1. Allez dans **"Database"** (menu gauche)
2. Cliquez sur **"Connect"**
3. Sélectionnez **"Connect your application"**
4. Copiez l'URL qui ressemble à :
   ```
   mongodb+srv://gamly_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Remplacez `<password>` par votre mot de passe
6. **Gardez cette URL**, vous en aurez besoin !

---

## PARTIE 2 : Héberger le Backend sur Render.com (Gratuit)

### Étape 2.1 : Créer un compte Render

1. Allez sur : https://render.com
2. Cliquez sur **"Get Started for Free"**
3. Connectez-vous avec GitHub ou créez un compte

### Étape 2.2 : Préparer le code

1. Créez un compte sur https://github.com (si pas déjà fait)
2. Créez un nouveau repository appelé **"gamly-backend"**
3. Uploadez le dossier **backend** de votre projet
   - server.py
   - requirements.txt
   - Procfile
   - .env (NE PAS UPLOADER CE FICHIER !)

### Étape 2.3 : Créer le service sur Render

1. Sur Render.com, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre compte GitHub
3. Sélectionnez le repository **"gamly-backend"**
4. Configurez :
   - **Name** : gamly-backend
   - **Region** : Frankfurt (EU) ou la plus proche
   - **Branch** : main
   - **Runtime** : Python 3
   - **Build Command** : `pip install -r requirements.txt`
   - **Start Command** : `uvicorn server:app --host 0.0.0.0 --port $PORT`

### Étape 2.4 : Configurer les variables d'environnement

1. Dans les paramètres du service, allez dans **"Environment"**
2. Ajoutez ces variables :

| Variable | Valeur |
|----------|--------|
| `MONGO_URL` | Votre URL MongoDB Atlas (étape 1.4) |
| `DB_NAME` | `gamly` |
| `JWT_SECRET` | `votre-secret-tres-long-et-securise-2024` |

3. Cliquez sur **"Save Changes"**

### Étape 2.5 : Déployer

1. Cliquez sur **"Manual Deploy"** → **"Deploy latest commit"**
2. Attendez 2-3 minutes
3. Une fois déployé, vous obtiendrez une URL comme :
   ```
   https://gamly-backend.onrender.com
   ```
4. **Notez cette URL !**

---

## PARTIE 3 : Mettre à jour l'application mobile

### Étape 3.1 : Modifier le fichier .env du frontend

Ouvrez le fichier `frontend/.env` et modifiez :

```
EXPO_PUBLIC_BACKEND_URL=https://gamly-backend.onrender.com
```

Remplacez l'URL par celle de votre backend sur Render.

### Étape 3.2 : Rebuilder l'application

Refaites le build de l'application avec EAS Build (voir guide Google Play).

---

## 📊 Récapitulatif des services

| Service | Utilité | Coût | Limite gratuite |
|---------|---------|------|-----------------|
| MongoDB Atlas | Base de données | Gratuit | 512 MB |
| Render.com | Hébergement backend | Gratuit | 750h/mois |
| Expo EAS | Build de l'app | Gratuit | 30 builds/mois |
| Google Play | Distribution | 25$ (une fois) | - |

---

## ⚠️ Limitations du plan gratuit Render

- Le serveur **s'éteint après 15 minutes** d'inactivité
- Le premier accès peut prendre **30-60 secondes** (cold start)
- Pour éviter cela, vous pouvez upgrader à 7$/mois

### Solution gratuite pour éviter le cold start :
Utilisez un service de ping gratuit comme **UptimeRobot** :
1. Allez sur https://uptimerobot.com
2. Créez un compte gratuit
3. Ajoutez un moniteur HTTP
4. URL : `https://gamly-backend.onrender.com/api/health`
5. Intervalle : 5 minutes

Cela gardera votre serveur actif !

---

## 🔧 Dépannage

### Le backend ne démarre pas ?
- Vérifiez les logs sur Render.com
- Vérifiez que toutes les variables d'environnement sont configurées

### Erreur de connexion MongoDB ?
- Vérifiez que l'IP 0.0.0.0/0 est autorisée dans Network Access
- Vérifiez que le mot de passe dans l'URL est correct

### L'app mobile ne se connecte pas ?
- Vérifiez que l'URL du backend est correcte dans le .env
- Vérifiez que l'URL commence par `https://`

---

## ✅ Checklist finale

- [ ] Compte MongoDB Atlas créé
- [ ] Cluster M0 gratuit créé
- [ ] Utilisateur de base de données créé
- [ ] Accès réseau configuré (0.0.0.0/0)
- [ ] URL de connexion copiée
- [ ] Compte Render créé
- [ ] Repository GitHub créé
- [ ] Code backend uploadé
- [ ] Service Web créé sur Render
- [ ] Variables d'environnement configurées
- [ ] Backend déployé et fonctionnel
- [ ] URL du backend mise à jour dans l'app mobile
- [ ] Application reconstruite avec EAS Build

---

## 🎉 Félicitations !

Votre backend est maintenant en production et votre application peut fonctionner sur le Google Play Store !

**URLs importantes à conserver :**
- Backend : `https://gamly-backend.onrender.com`
- Base de données : `mongodb+srv://...` (ne jamais partager !)
