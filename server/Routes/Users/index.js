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

router.get("/:id", (req, res) => GetUser(req,res));

router.put("/:id/likedShops", (req, res) => PutUserLikedShops(req,res));

router.put("/:id/dislikedShops", (req, res) => PutUserDislikedShops(req,res));

router.delete("/:id/likedShops", (req, res) => DeleteUserLikedShop(req,res));

router.delete("/:id/dislikedShops", (req, res) => DeleteUserDislikedShop(req,res));

router.get("/:id/likedshopsids", (req, res) => GetUserLikedShopsIds(req,res));

router.get("/:id/dislikedShopsIds", (req, res) => GetUserDislikedShopsIds(req,res));

module.exports = router;