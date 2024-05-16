# Mon Application Vue.js

Ceci est une application web développée avec Vue.js pour l'examen FOREACH. Elle utilise Vue 3 et Vite.

## Configuration de l'IDE recommandée

Nous recommandons d'utiliser [VSCode](https://code.visualstudio.com/).

## Configuration du projet

Pour installer les dépendances du projet, exécutez la commande suivante :

```sh
npm install
```

Pour démarrer le serveur de développement avec le rechargement à chaud, exécutez la commande suivante :

```sh
npm run dev
```

Pour construire votre application pour la production, exécutez la commande suivante :

```sh
npm run build
```

L'application est en correlation avec l'API JAVA Spring boot. Une page Admin de ce projet communique en WebSocket. Par défaut, l'API accepte la connection websocket pour http://localhost:5173. Si vous lancez votre application via un autre port, attention à bien autoriser ce port dans l'API, ce sans quoi le WebSocket ne pourra pas être fonctionnel

Retrouvez les variables pour l'API dans le .env fourni. Par défaut, notre APi tourne sur le port 8080. Si ce n'est pas votre cas, veuillez corriger les url

## Utilisation  

Pour les clients, les routes ci-dessous sont disponible. Elles sont pensées pour le format téléphone. (ouvrir depuis un desktop formattera la vue comme téléphone) : 
/ 
/panier
/commande
/commande-success/:numero (numero étant le numero de votre commande créé)

Pour les employés, les routes ci-dessous sont disponible.Elles sont pensées pour le format Tablette à l'horizontal. :
/admin/login
/admin/commandes
/admin/commandes/:id
/admin/categorie
/admin/boisson
/admin/boisson/ajouter


## Docker 
Depuis la racine du projet vous pouvez saisir ces commande pour l'execution de l'application dans un container docker : 
Toutefois, pour une raison inconnu, les routes /admin ne seront pas accessible

docker build -t image-kukla-barapp-front  .      
docker run -it -p 5173:8080 --name container-kukla-barapp-front image-kukla-barapp-front



