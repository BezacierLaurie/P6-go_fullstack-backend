// Pour IMPORTER 'Express'
const express = require('express');

// Pour CREER un application (actuellement vide)
const app = express();

// Pour RENVOYER une réponse (en format 'json') à la requête envoyée
app.use((req, res) => {
    res.json({message : 'Votre requête a bien été reçue !'})
});

// Pour EXPORTER l'application
module.exports = app;