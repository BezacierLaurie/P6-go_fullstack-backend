// Pour IMPORTER 'jsonwebtoken' (plug-in qui permet de CREER des 'tokens' et de les VERIFIER)
const jwt = require('jsonwebtoken');

// Création d'un 'middleware' (logiciel intermédiaire) qui:
// - permet d'extraire les informations contenues dans le 'token' (et de vérifier que le 'token' est valide)
// - vérifie que l'utilisateur est connecté 
// - transmet les infos de connexion aux méthodes qui GERENT les requêtes (autres 'middlewares' ou gestionnaires de routes)

// Pour EXPORTER une fonction (qui sera le middleware)
module.exports = (req, res, next) => {
    // Pour GERER les erreurs
    try {
        // Pour RECUPERER le 'token' (récupération de l'autorisation)
        const token = req.headers.authorization.split(' ')[1]; // 'split': fonction qui permet de DIVISER une 'string' en un tableau autour de l'espace qui se trouve entre le mot-clé 'error' et le 'token' - '[1]' : position du 'token' dans le tableau
        // Pour DECODER le 'token'
        const decodedToken = jwt.verify(token, process.env.secretKey); // 'verify': fonction de ('jsonwebtoken') qui permet de DECODER le token récupéré - ('token' récupéré - clé secrète)
        // Pour RECUPERER le 'userId'
        const userId = decodedToken.userId;
        // Pour RAJOUTER le 'userId' à l'objet 'request' (qui sera transmis aux routes afin qu'elles puissent l'exploiter)
        req.auth = {
            userId: userId
        };
        next();
        /* // (identique (en mieux) que ce qu'il y a au dessus, car l'utilisateur créé la 'req' tandis que la 'res' est créée par le serveur (et donc c'est plus logique de modif la res))
        res.locals.auth = userId; // 'locals' = fonction de 'res' qui permet de STOCKER des valeurs le temps de la requête */
    } catch (error) {
        res.status(401).json({ error });
    }
};

