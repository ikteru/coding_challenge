const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const UserSchema = new Schema({
    userId:{
        type: String,
        unique: true
    },
    searchedLocations: Array,
    name: String,
    nickname: String,
    likedShopsIds: Array,
    dislikedShopsIds: Array
});

const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
