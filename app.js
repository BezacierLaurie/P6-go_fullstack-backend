// Pour IMPORTER 'mongoose' (BdD 'MongoDB')
const mongoose = require('mongoose');

//Pour IMPORTER le modèle 'Thing'
const Thing = require('./models/Thing');

// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour CREER une application* (actuellement vide) (*l'application contient le serveur)
const app = express();

// Connexion de la BdD à l'API
mongoose.connect('mongodb+srv://Laury:G9mD5wGRGc%40m4NV@cluster0.4npgx.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

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

// Route 'POST'
app.post('/api/stuff', (req, res, next) => {
    // Pour SUPPRIMER le champs '_id' (car 'faux id' envoyé par le front-end : pas le bon, du fait d'être généré automatiquement par MongoDB) (BdD)
    delete req.body._id;
    const thing = new Thing({
        // '...' : opérateur 'spread' (raccourci permettant de détailler le contenu du corps de la requête)
        ...req.body
    });
    // Pour ENREGISTRER l'objet 'thing' dans MongoDB (BdD)
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Retour d'une promesse (=> : renvoie d'une réponse au front-end sinon expiration de la requête)
        .catch(error => res.status(400).json({ error })); // Error
});

// Pour MODIFIER un 'thing' dans MongoDB (BdD)
app.put('/api/stuff/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite modifier) : {id envoyé dans les paramètres de requête}, nouvelle version de l'objet : {'thing' qui est dans le corps de la requête, id (pris dans la route) correspondant à celui des paramètres (important : car celui présent dans le corps de la requête ne sera pas forcément le bon)}
    .then(() => res.status(200).json({ message: 'Objet modifié !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
    .catch(error => res.status(400).json({ error })); // Error
});

// Pour supprimer un 'thing' dans MongoDB (BdD)
app.delete('/api/stuff/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.deleteOne({ _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite supprimer) : {id envoyé dans les paramètres de requête}
    .then(() => res.status(200).json({ message: 'Objet supprimé !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
    .catch(error => res.status(400).json({ error })); // Error
});

// Pour RECUPERER un 'thing' individuel dans MongoDB (BdD)
app.get('/api/stuff/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing)) // Retour d'une promesse (=> : renvoie du 'thing' présent dans MongoDB (BdD))
        .catch(error => res.status(404).json({ error })); // Error (objet non trouvé)
});

// L'argument "/api/stuff" est l'URL visée par l'application ("endpoint" = route vers l'API)
// REMPLACER 'use' par 'get' (pour RECUPERER seulement (CIBLER) les requêtes 'get') (idem avec 'post')
app.get('/api/stuff', (req, res, next) => {
    // Pour TROUVER / RECUPERER la liste complète des 'Things' dans MongoDB (BdD)
    Thing.find()
        .then(things => res.status(200).json(things)) // Retour d'une promesse (=> : renvoie d'un tableau contenant tous les 'Things' présents dans MongoDB (BdD))
        .catch(error => res.status(400).json({ error })); // Error
});

// Pour EXPORTER l'application
module.exports = app;

