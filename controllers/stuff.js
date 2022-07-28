//Pour IMPORTER le modèle 'Thing'
const Thing = require('../models/Thing');

// Pour GERER la route 'GET' : On EXPORTE la fonction 'getOneThing' pour la récupération d'un objet ('Thing')
exports.getOneThing = (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.findOne({ _id: req.params.id }) // 'Thing' (de mongoose)
        .then(resultFindOne => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> : renvoie du 'thing' présent dans MongoDB (BdD))
        .catch(error => res.status(404).json({ error })); // Error (objet non trouvé)
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'getAllThings' pour la récupération de tous les objets ('Things')
exports.getAllThings = (req, res, next) => {
    // Pour TROUVER / RECUPERER la liste complète des 'Things' dans MongoDB (BdD)
    Thing.find() // 'Thing' (de mongoose)
        .then(resultFind => res.status(200).json(resultFind)) // Retour d'une promesse (=> : renvoie d'un tableau contenant tous les 'Things' présents dans MongoDB (BdD))
        .catch(error => res.status(400).json({ error })); // Error
};

// Pour GERER la route 'POST' : On EXPORTE la fonction 'createThing' pour la création d'un objet ('Thing')
exports.createThing = (req, res, next) => {
    /* // Pour SUPPRIMER le champs '_id' (car 'faux id' envoyé par le front-end : pas le bon, du fait d'être généré automatiquement par MongoDB (BdD))
    delete req.body._id;
    const thing = new Thing({
        // '...' : opérateur 'spread' (raccourci permettant de détailler le contenu du corps de la requête)
        ...req.body
    });
    // Pour ENREGISTRER un 'thing' dans MongoDB (BdD)
    thing.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // Retour d'une promesse (=> : renvoie d'une réponse au front-end sinon expiration de la requête)
        .catch(error => res.status(400).json({ error })); // Error */

    // Modification de 'createThing' car la route et de la gestion de la route vont être modifiées (car en ajoutant 'Multer' le format de la requête change)
    // Pour PARSER l'objet 'requête' (l'objet qui est envoyé dans la requête est maintenant envoyé en string)
    const thingObject = JSON.parse(req.body.thing);
    // Pour SUPPRIMER (dans l'objet) les champs '_id' (car l'id de l'objet va être généré automatiquement par la BdD (MongoDB)) et '_userId' (qui correspond à la personne qui a créé l'objet) (on utilise désormais le 'userId' qui vient du token d'authentification (pour être sur qu'il soit valide)) (car il ne faut JAMAIS faire confiance aux clients)
    delete thingObject._id;
    delete thingObject.user_id;
    // Pour CREER l'objet (avec ce qui a été passé (moins les 2 champs supprimés))
    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId, // ('userId extrait de l'objet 'requête' grâce au middleware 'auth')
        // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
        imageURL: "${req.protocole}://${req.get('host')}/images/${req.file.filename}"
    });
    // Pour ENREGISTRER les données dans la BdD ('MongoDB')
    thing.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) }) // Retour de la promesse
        .catch(error => { res.status(400).json({ error }) }) // Erreur
};

// Pour GERER la route 'PUT' : On EXPORTE la fonction 'modifyThing' pour la modification d'un objet ('Thing')
exports.modifyThing = (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite modifier) : {id envoyé dans les paramètres de requête}, nouvelle version de l'objet : {'thing' qui est dans le corps de la requête, id (pris dans la route) correspondant à celui des paramètres (important : car celui présent dans le corps de la requête ne sera pas forcément le bon)}
        .then(() => res.status(200).json({ message: 'Objet modifié !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
        .catch(error => res.status(400).json({ error })); // Error
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteThing' pour la suppression d'un objet ('Thing')
exports.deleteThing = (req, res, next) => { // ':id' = partie dynamique (de la route) (= req.params.id : paramètre de route dynamique)
    Thing.deleteOne({ _id: req.params.id }) // = objet de comparaison (celui que l'on souhaite supprimer) : {id envoyé dans les paramètres de requête}
        .then(() => res.status(200).json({ message: 'Objet supprimé !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
        .catch(error => res.status(400).json({ error })); // Error
};