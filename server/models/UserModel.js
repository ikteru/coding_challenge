const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    username: String,
    email: String,
    likedShops: Array,
    dislikedShops: Array
});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
