# 📱 GUIDE COMPLET : Publier GAMLY sur Google Play Store

## Prérequis
- Un compte Google Play Console (25$ une seule fois)
- Un compte Expo gratuit
- Le code de votre application (téléchargé depuis Emergent)

---

## ÉTAPE 1 : Créer votre compte Google Play Console

1. Allez sur : https://play.google.com/console
2. Connectez-vous avec votre compte Gmail
3. Cliquez sur **"Créer un compte développeur"**
4. Payez les **25$** (paiement unique)
5. Remplissez vos informations personnelles
6. Attendez la validation (1-2 jours)

---

## ÉTAPE 2 : Créer votre compte Expo

1. Allez sur : https://expo.dev
2. Cliquez sur **"Sign Up"** (S'inscrire)
3. Créez un compte avec votre email
4. Confirmez votre email

---

## ÉTAPE 3 : Télécharger le code de votre application

1. Dans Emergent, cliquez sur le bouton **"Download"** ou **"Télécharger"**
2. Vous obtenez un fichier **ZIP**
3. **Décompressez** ce fichier sur votre ordinateur
4. Vous aurez un dossier avec le code de l'application

---

## ÉTAPE 4 : Utiliser EAS Build en ligne

### Option A : Via Snack Expo (Plus simple)

1. Allez sur : https://snack.expo.dev
2. Cliquez sur **"Import"** puis **"From local file"**
3. Uploadez le dossier **frontend** de votre projet
4. Le code s'affiche dans l'éditeur
5. Cliquez sur le menu et sélectionnez **"Export to EAS"**

### Option B : Via GitHub (Recommandé)

1. Créez un compte sur https://github.com
2. Créez un nouveau repository (projet)
3. Uploadez le dossier **frontend** de votre projet
4. Allez sur https://expo.dev
5. Connectez votre compte GitHub
6. Importez votre projet
7. Cliquez sur **"Build"** → **"Android"**

---

## ÉTAPE 5 : Lancer le Build Android

1. Dans Expo Dashboard, allez dans votre projet
2. Cliquez sur **"Builds"** dans le menu
3. Cliquez sur **"Build for Android"**
4. Sélectionnez **"Android App Bundle (.aab)"**
5. Cliquez sur **"Build"**
6. **Attendez 15-20 minutes** ⏱️
7. Une fois terminé, cliquez sur **"Download"** pour télécharger le fichier .aab

---

## ÉTAPE 6 : Créer votre application sur Google Play Console

1. Connectez-vous à https://play.google.com/console
2. Cliquez sur **"Créer une application"**
3. Remplissez les informations :
   - **Nom** : Gamly
   - **Langue** : Français
   - **Type** : Application
   - **Gratuit ou Payant** : Gratuit (avec achats intégrés)
4. Acceptez les conditions
5. Cliquez sur **"Créer"**

---

## ÉTAPE 7 : Configurer votre application

### 7.1 - Fiche Play Store
- **Titre** : Gamly - Rencontres Gamers
- **Description courte** : Trouve ton partenaire de jeu idéal !
- **Description longue** : 
```
Gamly est l'application de rencontres pour les gamers ! 🎮

Trouve des joueurs qui partagent ta passion :
✅ Swipe pour découvrir des profils de gamers
✅ Match avec des joueurs sur Xbox, PlayStation, PC et Nintendo Switch
✅ Discute avec tes matchs en temps réel
✅ Filtre par pays, langue et plateforme

Que tu cherches un ami casual, un coéquipier régulier ou un partenaire de jeu, Gamly est fait pour toi !

Télécharge maintenant et rejoins la communauté gaming !
```

### 7.2 - Captures d'écran
Vous avez besoin de :
- **2 captures minimum** pour téléphone (1080x1920 px)
- Prenez des screenshots de l'app sur votre téléphone

### 7.3 - Icône
- Taille : **512x512 px**
- Utilisez le logo Gamly

### 7.4 - Catégorie
- Catégorie principale : **Social**
- Catégorie secondaire : **Jeux**

---

## ÉTAPE 8 : Uploader le fichier .aab

1. Dans Google Play Console, allez dans **"Version"** → **"Production"**
2. Cliquez sur **"Créer une version"**
3. Cliquez sur **"Télécharger"**
4. Sélectionnez le fichier **.aab** téléchargé depuis Expo
5. Attendez l'upload (peut prendre quelques minutes)
6. Ajoutez les **notes de version** : "Version initiale de Gamly"
7. Cliquez sur **"Enregistrer"**

---

## ÉTAPE 9 : Configurer l'abonnement Premium

1. Dans Google Play Console, allez dans **"Monétisation"** → **"Produits"** → **"Abonnements"**
2. Cliquez sur **"Créer un abonnement"**
3. Remplissez :
   - **ID produit** : `gamly_premium_weekly`
   - **Nom** : Gamly Premium
4. Ajoutez un **forfait de base** :
   - Prix : **7,99 €** / semaine
   - Période : **1 semaine**
5. Cliquez sur **"Activer"**

---

## ÉTAPE 10 : Politique de confidentialité

Google exige une politique de confidentialité. Vous pouvez :

1. Utiliser un générateur gratuit : https://www.freeprivacypolicy.com
2. Héberger la page sur un site gratuit (Google Sites, Notion, etc.)
3. Copier l'URL et la coller dans Google Play Console

---

## ÉTAPE 11 : Questionnaire de contenu

Google vous posera des questions sur votre app :
- **Contient des publicités ?** Non
- **Contient des achats intégrés ?** Oui
- **Contenu pour adultes ?** Non (c'est une app de rencontres gaming, pas de contenu explicite)
- **Collecte des données ?** Oui (email, photos)

---

## ÉTAPE 12 : Soumettre pour révision

1. Vérifiez que tous les éléments sont complétés (✅ vert partout)
2. Allez dans **"Version"** → **"Production"**
3. Cliquez sur **"Envoyer la version pour examen"**
4. Confirmez

---

## ÉTAPE 13 : Attendre la validation

- **Délai** : 1 à 7 jours (généralement 2-3 jours)
- Google vérifie que votre app respecte leurs règles
- Vous recevrez un email quand l'app sera publiée

---

## 🎉 FÉLICITATIONS !

Une fois approuvée, votre application sera disponible sur le Google Play Store !

**Lien de votre app** : `https://play.google.com/store/apps/details?id=com.gamly.app`

---

## 📞 Support

Si vous rencontrez des problèmes :
- **Documentation Expo** : https://docs.expo.dev
- **Support Google Play** : https://support.google.com/googleplay/android-developer

---

## ⚠️ IMPORTANT

### Base de données
L'application actuelle utilise une base de données temporaire. Pour la production, vous devrez :
1. Créer une base de données MongoDB Atlas (gratuit)
2. Mettre à jour l'URL dans le code
3. Refaire un build

### Backend
Le backend doit être hébergé sur un serveur permanent. Options gratuites :
- Render.com
- Railway.app
- Fly.io

Je peux vous aider à configurer cela si vous le souhaitez !
