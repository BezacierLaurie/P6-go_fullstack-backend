// Pour IMPORTER 'Express'
const express = require('express');

// Pour CREER une application* (actuellement vide) (*l'application contient le serveur)
const app = express();

// Pour INTERCEPTER toutes les requêtes qui contiennent du json et METTRE à disposition ce contenu (ACCEDER au corps de la requête) sur l'objet 'requête' (dans req.body)
// (identique à 'body-parser')
app.use(express.json());

// Pour IMPLEMENTER "CORS" (appels sécurisés vers l'application) (pas d'URL précisée pour permettre une application à toutes les routes)
app.use((req, res, next) => {
    // Pour accéder à l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pour ajouter les headers mentionnés aux requêtes envoyées vers l'API
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Pour envoyer des requêtes avec différentes méthodes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// * Mentorat : Voir ensemble les 2 méthodes

// Méthode 2 : Laisser 'use' et insérer ce middleware : (?)
app.post('/api/stuff', (req, res, next) => {
    // Pour AFFICHER le corps de la requête
    console.log(req.body);
    // Pour ENVOYER la réponse (à la requête (+ PRECISER le status (que l'on souhaite) de la réponse)
    res.status(201).json({ message: 'Objet créé !' }); // 201 : création de ressources (dans la BdD)
});

// L'argument "/api/stuff" est l'URL visée par l'application ("endpoint" = route vers l'API)
// Méthode 1 : REMPLACER 'use' par 'get' (pour RECUPERER seulement (CIBLER) les requêtes 'get') (idem avec 'post') : (?)
app.get('/api/stuff', (req, res, next) => {
    const stuff = [
        {
            _id: 'oeihfzeoi',
            title: 'Mon premier objet',
            description: 'Les infos de mon premier objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 4900,
            userId: 'qsomihvqios',
        },
        {
            _id: 'oeihfzeomoihi',
            title: 'Mon deuxième objet',
            description: 'Les infos de mon deuxième objet',
            imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
            price: 2900,
            userId: 'qsomihvqios',
        },
    ];
    res.status(200).json(stuff);
});

// Pour EXPORTER l'application
module.exports = app;