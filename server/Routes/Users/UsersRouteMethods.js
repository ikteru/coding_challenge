const GetUsers = require('./Get.User')
const PostUsers = require('./Post.Users')
const GetUserLikedShopsIds = require('./Get.User.LikedShopsIds')
const PutUserLikedShops = require('./Put.User.LikedShops')
const GetUser = require('./Get.User')
const GetUserDislikedShopsIds = require('./Get.User.DislikedShopsIds')
const PutUserDislikedShops = require('./Put.User.DislikedShops')
const DeleteUserLikedShop = require('./Delete.User.LikedShop')
const DeleteUserDislikedShop = require('./Delete.User.DislikedShop') 

module.exports = {
    GetUsers,
    PostUsers,
    GetUserLikedShopsIds,
    PutUserLikedShops,
    GetUser,
    GetUserDislikedShopsIds,
    PutUserDislikedShops,
    DeleteUserLikedShop,
    DeleteUserDislikedShop
} 