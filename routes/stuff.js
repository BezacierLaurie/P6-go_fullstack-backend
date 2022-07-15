const express =require('express');

// Pour CREER un routeur 
const router = express.Router();

//Pour IMPORTER le modèle 'Thing'
const Thing = require('../models/Thing');

// Route 'GET' : Pour RECUPERER un 'thing' individuel dans MongoDB (BdD)
// L'argument "/api/stuff" est l'URL visée par l'application ("endpoint" = route vers l'API) -> Elle est remplacée par seulement un '/' car le router remplace le chemin
// REMPLACER 'use' par 'get' (pour RECUPERER seulement (CIBLER) les requêtes 'get') (idem avec 'post', 'put' et 'delete')
router.get('/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.findOne({ _id: req.params.id }) // 'Thing' (de mongoose)
        .then(resultFindOne => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> : renvoie du 'thing' présent dans MongoDB (BdD))
        .catch(error => res.status(404).json({ error })); // Error (objet non trouvé)
});

// Route 'GET' : Pour TROUVER / RECUPERER la liste complète des 'things' dans MongoDB (BdD)
router.get('/', (req, res, next) => {
    // Pour TROUVER / RECUPERER la liste complète des 'Things' dans MongoDB (BdD)
    Thing.find() // 'Thing' (de mongoose)
        .then(resultFind => res.status(200).json(resultFind)) // Retour d'une promesse (=> : renvoie d'un tableau contenant tous les 'Things' présents dans MongoDB (BdD))
        .catch(error => res.status(400).json({ error })); // Error
});

// Route 'POST' : Pour ENREGISTRER un 'thing' dans MongoDB (BdD)
router.post('/', (req, res, next) => {
    // Pour SUPPRIMER le champs '_id' (car 'faux id' envoyé par le front-end : pas le bon, du fait d'être généré automatiquement par MongoDB (BdD))
    delete req.body._id;
    const thing = new Thing({
        // '...' : opérateur 'spread' (raccourci permettant de détailler le contenu du corps de la requête)
        ...req.body
    });
    // Pour ENREGISTRER un 'thing' dans MongoDB (BdD)
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Retour d'une promesse (=> : renvoie d'une réponse au front-end sinon expiration de la requête)
        .catch(error => res.status(400).json({ error })); // Error
});

// Route 'PUT' : Pour MODIFIER un 'thing' dans MongoDB (BdD)
router.put('/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite modifier) : {id envoyé dans les paramètres de requête}, nouvelle version de l'objet : {'thing' qui est dans le corps de la requête, id (pris dans la route) correspondant à celui des paramètres (important : car celui présent dans le corps de la requête ne sera pas forcément le bon)}
    .then(() => res.status(200).json({ message: 'Objet modifié !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
    .catch(error => res.status(400).json({ error })); // Error
});

// Route 'DELETE' : Pour supprimer un 'thing' dans MongoDB (BdD)
router.delete('/:id', (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.deleteOne({ _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite supprimer) : {id envoyé dans les paramètres de requête}
    .then(() => res.status(200).json({ message: 'Objet supprimé !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
    .catch(error => res.status(400).json({ error })); // Error
});

// Pour RE-EXPORTER le router (de ce fichier)
module.exports = router;