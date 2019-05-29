const express = require('express');
const router = express.Router();

const {   
    GetShops,
    GetShopPhoto,
    GetShop
} = require('./ShopsRouteMethods') 


router.get("/", async (req, res) => GetShops(req,res));

router.get("/photos/:id", (req, res) => GetShopPhoto(req,res));

router.get("/likedshops/:shopId", (req, res) => GetShop(req,res));

router.get("/dislikedShops/:shopId", (req, res) => GetShop(req,res));

module.exports = router;
