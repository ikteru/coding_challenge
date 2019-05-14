const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const shopSchema = new Schema({
    location: Object,
    name: String,
    icon: String,
    photo: String,
    types: Array
});

const ShopModel = mongoose.model('shop', shopSchema);
module.exports = ShopModel;
