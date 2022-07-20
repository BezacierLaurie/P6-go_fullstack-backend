// Pour IMPORTER 'express' (Application 'Express')
const express = require('express');

// Pour CREER un routeur 
const router = express.Router();

// Pour IMPORTER 'user' (Controller 'user')
const userController = require('../controllers/user');

// Routes 'POST' : Pour ENREGISTRER un 'user' dans MongoDB (BdD)
// Fonction ('signup') IMPORTEE et APPLIQUEE à la route 
router.post('/signup', userController.signup);
// Fonction ('login') IMPORTEE et APPLIQUEE à la route 
router.post('/login', userController.login);

// Pour EXPORTER le routeur (qui va être IMPORTE dans 'app.js')
module.exports = router;
