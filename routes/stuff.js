// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require('../middleware/auth');

// Pour CREER un routeur 
const router = express.Router();

// Pour IMPORTER 'stuff' (Controller 'stuff')
const stuffController = require('../controllers/stuff');

// Route 'GET' : Pour RECUPERER un 'thing' individuel dans MongoDB (BdD)
// L'argument "/api/stuff" est l'URL visée par l'application ("endpoint" = route vers l'API) -> Elle est remplacée par seulement un '/' car le router remplace le chemin
// REMPLACER 'use' par 'get' (pour RECUPERER seulement (CIBLER) les requêtes 'get') (idem avec 'post', 'put' et 'delete')
// Fonction ('getOneThing') IMPORTEE et APPLIQUEE à la route 
router.get('/:id', auth, stuffController.getOneThing);

// Route 'GET' : Pour TROUVER / RECUPERER la liste complète des 'things' dans MongoDB (BdD)
// Fonction ('getAllThings') IMPORTEE et APPLIQUEE à la route 
router.get('/', auth, stuffController.getAllThings);

// Route 'POST' : Pour ENREGISTRER un 'thing' dans MongoDB (BdD)
// Fonction ('createThing') IMPORTEE et APPLIQUEE à la route 
router.post('/', auth, stuffController.createThing);

// Route 'PUT' : Pour MODIFIER un 'thing' dans MongoDB (BdD)
// Fonction ('modifyThing') IMPORTEE et APPLIQUEE à la route 
router.put('/:id', auth, stuffController.modifyThing);

// Route 'DELETE' : Pour supprimer un 'thing' dans MongoDB (BdD)
// Fonction ('deleteThing') IMPORTEE et APPLIQUEE à la route 
router.delete('/:id', auth, stuffController.deleteThing);

// Pour EXPORTER le routeur
module.exports = router;