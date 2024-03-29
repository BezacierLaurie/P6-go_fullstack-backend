// Pour IMPORTER 'mongoose' (BdD 'MongoDB')
const mongoose = require('mongoose');

// Schéma (de données) de l'objet 'thingSchema' (de 'Mongoose')
const thingSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    userId: { type: String, required: true },
});

// Pour EXPORTER le schéma ('thingSchema') sous forme de modèle 'terminé' 
module.exports = mongoose.model('Thing', thingSchema); // 'model' = fonction de 'mongoose' - ("nom du modèle" + schéma de l'objet)