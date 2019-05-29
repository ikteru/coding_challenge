const requestPromise = require('request-promise')
const { checkSuccess, synthesizeShops } = require('../../Utils')
require('dotenv').config()

async function GetShops(req,res){
    const { lat, lng, userId } = req.query;
    const options = {
      method: "GET",
      url: process.env.API_PLACES_BASE_ADDRESS,
      qs: {
        location: `${lat}, ${lng}`,
        //location: "33.995521, -6.8500229,16",
        radius: 1500,
        //type: req.query.shopType,
        type: "restaurant" ,
        key: process.env.API_KEY
      },
      json: true
    };
  
    let googlePlacesApiResponse = await checkSuccess(requestPromise(options));
    let synthesizedShopsList = await checkSuccess(synthesizeShops(googlePlacesApiResponse));
    if(synthesizedShopsList.success){
      res.send(synthesizedShopsList)
    }else{
      res.status(404).send(synthesizedShopsList.data)
    }
  }

  module.exports = GetShops 