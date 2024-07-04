// Charger les variables d'environnement
require('dotenv').config();

// Importer les dependances
const express = require('express');
const cors = require('cors');
const router = require('./src/routes/index');

// Création de l'application Express
const app = express();

// Autoriser les requêtes provenant de n'importe quelle origine
app.use(
  cors({
    origin: '*', // à modifier par la suite
  })
);

// Analyser les requêtes entrantes avec des données JSON (remplace body-parser)
app.use(express.json());

// Permettre l'utilisation de la methode POST
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier "media"
app.use('/media', express.static('media'));

// Utiliser le routeur défini dans le dossier 'routes'
app.use('/api', router);

// Gérer les routes non définies en dehors de '/api'
app.use((_, res) => {
  res.status(404).json({ error: 'route not defined' });
});

// Port sur lequel le serveur écoutera
const port = process.env.PORT || 3000;

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
