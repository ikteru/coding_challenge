const express = require('express');
const router = express.Router();

const {
    GetUsers,
    PostUsers,
    GetUserLikedShopsIds,
    PutUserLikedShops,
    GetUser,
    GetUserDislikedShopsIds,
    PutUserDislikedShops,
    DeleteUserLikedShop,
    DeleteUserDislikedShop
} = require('./UsersRouteMethods');


router.get("/", (req, res) => GetUsers(req,res));

router.post("/", (req, res) => PostUsers(req,res));

router.get("/:userId", (req, res) => GetUser(req,res));

router.put("/:userId/likedShops/:shopId", (req, res) => PutUserLikedShops(req,res));

router.put("/:userId/dislikedShops/:shopId", (req, res) => PutUserDislikedShops(req,res));

router.delete("/:userId/likedShops/:shopId", (req, res) => DeleteUserLikedShop(req,res));

router.delete("/:userId/dislikedShops/:shopId", (req, res) => DeleteUserDislikedShop(req,res));

router.get("/:userId/likedshopsids", (req, res) => GetUserLikedShopsIds(req,res));

router.get("/:userId/dislikedShopsIds", (req, res) => GetUserDislikedShopsIds(req,res));

module.exports = router;