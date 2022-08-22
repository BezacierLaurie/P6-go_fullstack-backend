// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour CREER un routeur 
const router = express.Router();

// Pour IMPORTER 'auth' (Middleware 'authentification')
const auth = require('../middleware/auth');

// Pour IMPORTER 'multer' (Middleware 'enregistreur de fichiers')
const multer = require('../middleware/multer-config');

// Pour IMPORTER 'stuff' (Controller 'stuff') 
const stuffController = require('../controllers/stuff'); // 'stuffController' : Permet la gestion de la route

// Infos (générales) :
// - L'argument '/api/stuff' est le 'endpoint' visé par l'application ('endpoint' = URL / URI (route vers l'API) -> Il est remplacé par seulement un '/' car le router remplace le début du chemin)
// - REMPLACER 'use' par 'un verbe HTTP' (pour CIBLER les différents types de requêtes)

// Route 'GET' : Pour RECUPERER un 'thing' individuel dans MongoDB (BdD)
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