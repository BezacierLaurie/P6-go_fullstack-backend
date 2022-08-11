// Pour IMPORTER 'Thing' (modèle)
const Thing = require('../models/Thing');

// Pour IMPORTER 'fs' ('fs' : 'file system' = 'système de fichiers' - c'est un des packages de 'Node' - il permet de supprimer un fichier du système de fichiers)
const fs = require('fs');

// Pour GERER la route 'GET' : On EXPORTE la fonction 'getOneThing' pour la récupération d'un objet ('Thing')
exports.getOneThing = (req, res, next) => { 
    Thing.findOne({ _id: req.params.id }) // 'Thing' (de mongoose) - ':id' = partie dynamique (de la route) (= 'req.params.id' : paramètre de route dynamique)
        .then(resultFindOne => res.status(200).json(resultFindOne)) // Retour d'une promesse (=> : renvoie du 'thing' présent dans MongoDB (BdD))
        .catch(error => res.status(404).json({ error })); // Error (objet non trouvé)
};

// Pour GERER la route 'GET' : On EXPORTE la fonction 'getAllThings' pour la récupération de tous les objets ('Things')
exports.getAllThings = (req, res, next) => {
    // Pour TROUVER / RECUPERER la liste complète des 'Things' dans MongoDB (BdD)
    Thing.find() // 'Thing' (de mongoose)
        .then(resultFindAll => res.status(200).json(resultFindAll)) // Retour d'une promesse (=> : renvoie d'un tableau contenant tous les 'Things' présents dans MongoDB (BdD))
        .catch(error => res.status(400).json({ error })); // Error
};

// Pour GERER la route 'POST' : On EXPORTE la fonction 'createThing' pour la création d'un objet ('Thing')
exports.createThing = (req, res, next) => {
    // Ancien code
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

    // Nouveau code : Modification de 'createThing' car la route et de la gestion de la route vont être modifiées (car en ajoutant 'Multer' le format de la requête change)
    // Pour PARSER l'objet 'requête' (comme l'objet (= valeur de 'clé / valeur') est reçu sous la forme d'une string, car envoyée en 'form-data', elle est PARSEE en objet json pour pouvoir être utilisée)
    const thingObject = JSON.parse(req.body.thing);
    // Pour SUPPRIMER (dans l'objet) les champs '_id' (car l'id de l'objet va être généré automatiquement par la BdD (MongoDB)) et '_userId' (qui correspond à la personne qui a créé l'objet) (on utilise désormais le 'userId' qui vient du token d'authentification (pour être sur qu'il soit valide)) (car il ne faut JAMAIS faire confiance aux clients)
    delete thingObject._id;
    delete thingObject.user_id;
    // Pour CREER l'objet (avec ce qui a été passé (moins les 2 champs supprimés))
    const thing = new Thing({
        ...thingObject, // Déconstruction de l'objet (title, description, imageUrl, ...)
        userId: req.auth.userId, // 'userId' = extrait de l'objet 'requête' grâce au middleware 'auth'
        // Ou 'res.locals.auth.userId'à la place de "req.auth.userId"
        // Pour GENERER l'URL de l'image (par nous-même, car 'Multer' ne délivre que le nom du fichier, en utilisant des propriétés de l'objet 'requête' : protocole - nom d'hôte - nom du dossier - nom du fichier (délivré par 'Multer'))
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    // Pour ENREGISTRER les données dans la BdD ('MongoDB')
    thing.save()
        .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) }) // Retour de la promesse
        .catch(error => { res.status(400).json({ error }) }) // Erreur ('Mauvaise' requête)
};

// Pour GERER la route 'PUT' : On EXPORTE la fonction 'modifyThing' pour la modification d'un objet ('Thing')
exports.modifyThing = (req, res, next) => { 
    // 2 cas possibles : l'utilisateur peut transmettre un fichier ou non. Suivant le cas, l'objet sera récupéré d'une manière différente
    // Astuce : Pour SAVOIR si la requête a été faite avec un fichier, il faut regarder s'il y a un champ 'file' dans l'objet 'requête'
    // Pour EXTRAIRE l'objet 'requête' et VERIFIER s'il y a un fichier dans la requête
    const thingObject = req.file ?
        // Cas 1 : L'utilisateur a transmis un fichier. Pour RECUPERER l'objet : il faut PARSER la chaîne de caractères et RE-CREER l'URL
        {
            ...JSON.parse(req.body.thing),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        // Cas 2 : L'utilisateur n'a pas transmis de fichier. Pour RECUPERER l'objet : il faut RECUPERER simplement l'objet directement dans le corps de la requête
        : { ...req.body };

    // Pour SUPPRIMER le 'userId' venant de la requête (pour EVITER qu'un personne crée un objet à son nom, puis le modifie pour le réassigner à une autre personne) (mesure de sécurité)
    delete thingObject._userId;
    // Pour VERIFIER les droits de l'utilisateur. Procédé : On RECUPERE l'objet 'userId' dans la BdD ('MongoDB') (pour VERIFIER si c'est bien l'utilisateur à qui appartient cet objet qui cherche à le MODIFIER) (mesure de sécurité)
    Thing.findOne({ _id: req.params.id }) // 'Thing' (de mongoose) - ':id' = partie dynamique (de la route) (= 'req.params.id' : paramètre de route dynamique)
        .then((thing) => {
            // Soit 'Non-autorisé' (car erreur d'authentification utilisateur)
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé !' });
            }
            // Soit 'Mise à jour de l'enregistrement'
            else {
                Thing.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id }) // = (Filtre qui permet de dire quel est l'{enregistrement à mettre à jour} et avec quel {objet}) => objet de comparaison : (celui que l'on souhaite modifier (parsé)) : {'id' envoyé dans les paramètres de requête}, nouvelle version de l'objet : {le 'thing' qui est dans le corps de la requête, l'id (pris dans la route) correspondant à celui des paramètres (important : car celui présent dans le corps de la requête ne sera pas forcément le bon)}
                 
                .then(() => res.status(200).json({ message: 'Objet modifié !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
                    .catch(error => res.status(401).json({ error })); // Error
            }
        })
};

// Pour GERER la route 'DELETE' : On EXPORTE la fonction 'deleteThing' pour la suppression d'un objet ('Thing')
exports.deleteThing = (req, res, next) => {
    // Pour VERIFIER les droits de l'utilisateur. Procédé : On RECUPERE l'objet 'userId' dans la BdD ('MongoDB') (pour VERIFIER si c'est bien l'utilisateur à qui appartient cet objet qui cherche à le SUPPRIMER) (mesure de sécurité)
    Thing.findOne({ _id: req.params.id }) // 'Thing' (de mongoose) - ':id' = partie dynamique (de la route) (= 'req.params.id' : paramètre de route dynamique)
        .then(thing => {
            // Soit 'Non-autorisé' (car erreur d'authentification utilisateur)
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non-autorisé !' });
            }
            // Soit 'Suppression de l'objet dans la BdD ('MongoDB')' et 'Suppression de l'image du système de fichiers'
            else {
                // Pour RECUPERER l'URL enregistrée et RE-CREER le chemin sur le système de fichiers à partir de celle-ci
                const filename = thing.imageUrl.split('/images/')[1]; // 'split' : Permet de RECUPERER le nom de fichier (autour du répertoire 'images')
                // Partie 'Suppression de l'image du système de fichiers'
                fs.unlink(`images/${filename}`, () => { // 'unlink' (méthode de 'fs') - '() =>' : Appel de la callback (une fois que la suppression aura eu lieu) (info : la suppression dans le système de fichiers est faite de manière asynchrone)
                    // Partie 'Suppression de l'objet dans la BdD ('MongoDB')'
                    Thing.deleteOne({ _id: req.params.id }) // = Objet qui sert de filtre (sélecteur) pour DESIGNER celui que l'on souhaite SUPPRIMER) : {'id' envoyé dans les paramètres de requête}
                        .then(() => res.status(200).json({ message: 'Objet supprimé !' })) // Retour d'une promesse (=> : renvoie d'une réponse positive)
                        .catch(error => res.status(401).json({ error })); // Error
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};