// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour CREER un routeur 
const router = express.Router();

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require('../middleware/auth');

// Pour IMPORTER 'multer' (Middleware 'enregistreur de fichiers')
const multer = require('../middleware/multer-config');

// Pour IMPORTER 'stuff' (Controller 'stuff' : gestion de la route) 
const stuffController = require('../controllers/stuff');

// Route 'GET' : Pour RECUPERER un 'thing' individuel dans MongoDB (BdD)
// L'argument '/api/stuff' est l'URL visée par l'application ('endpoint' = route vers l'API) -> Elle est remplacée par seulement un '/' car le router remplace le chemin
// REMPLACER 'use' par 'get' (pour RECUPERER seulement (CIBLER) les requêtes 'get') (idem avec 'post', 'put' et 'delete')
// Fonction 'stuffController' : permet la gestion de la route
// Fonction ('getOneThing') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.get('/:id', auth, stuffController.getOneThing);

// Route 'GET' : Pour TROUVER / RECUPERER la liste complète des 'things' dans MongoDB (BdD)
// Fonction ('getAllThings') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.get('/', auth, stuffController.getAllThings);

// Route 'POST' : Pour ENREGISTRER un 'thing' dans MongoDB (BdD)
// Fonction ('createThing') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.post('/', auth, multer, stuffController.createThing);

// Route 'PUT' : Pour MODIFIER un 'thing' dans MongoDB (BdD)
// Fonction ('modifyThing') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.put('/:id', auth, multer, stuffController.modifyThing);

// Route 'DELETE' : Pour supprimer un 'thing' dans MongoDB (BdD)
// Fonction ('deleteThing') : méthode du controller, qui est IMPORTEE et APPLIQUEE à la route 
router.delete('/:id', auth, stuffController.deleteThing);

// Pour EXPORTER le routeur
module.exports = router;