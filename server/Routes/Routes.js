const GetUsers = require('./Users/Get.Users')
const PostUsers = require('./Users/Post.Users')
const GetUserLikedShopsIds = require('./Users/Get.User.LikedShopsIds')
const PutUserLikedShops = require('./Users/Put.User.LikedShops')
const GetUser = require('./Users/Get.User')
const GetUserDislikedShopsIds = require('./Users/Get.User.DislikedShopsIds')
const PutUserDislikedShops = require('./Users/Put.User.DislikedShops')
const DeleteUserLikedShop = require('./Users/Delete.User.LikedShop')
const DeleteUserDislikedShop = require('./Users/Delete.User.DislikedShop') 

const GetShops = require('./Shops/Get.Shops')
const GetShopPhoto = require('./Shops/Get.Shop.Photo')
const GetShop = require('./Shops/Get.Shop')

module.exports = {
    GetUsers,
    PostUsers,
    GetUserLikedShopsIds,
    PutUserLikedShops,
    GetUser,
    GetUserDislikedShopsIds,
    PutUserDislikedShops,
    DeleteUserLikedShop,
    DeleteUserDislikedShop,
    GetShops,
    GetShopPhoto,
    GetShop
}