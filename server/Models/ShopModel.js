const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const shopSchema = new Schema({
    location: Object,
    userId: {
        type:"String",
        unique: true
    },
    name: String,
    icon: String,
    photoRef: String,
    photo : {
        contentType: String,
        //size: String,
        data: Buffer
    },
    types: Array
});

const ShopModel = mongoose.model('shop', shopSchema);
module.exports = ShopModel;
