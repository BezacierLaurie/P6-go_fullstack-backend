// Pour IMPORTER le package http de Node
const http = require('http');
// Pour importer l'application
const app = require('./app');

// Pour INDIQUER à l'application Express sur quel port elle va tourner
app.set('port' , process.env.PORT || 3000);

// Pour PASSER l'application au serveur (app = fonction qui va recevoir la requête et la réponse et qui va apporter des modifications)
const server = http.createServer(app);

// ECOUTE du serveur (des requêtes envoyées)
server.listen(process.env.PORT || 3000);