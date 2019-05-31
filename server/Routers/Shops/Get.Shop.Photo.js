const request = require('request')
require('dotenv').config()

function GetShopPhoto(req,res){
    const options = {
      method: "GET",
      url: process.env.API_PLACES_PHOTOS_BASE_ADDRESS,
      qs: {
        maxwidth: 200,
        photoreference: req.params.id,
        key: process.env.API_KEY
      },
      resolveWithFullResponse: true,
      encoding: null
    };
    let photo = {
      contentType: "",
      data: null
    }
    request(options , (err, resp, buffer) => {
      if( resp.statusCode === 200 ){
        photo.contentType = resp.headers["content-type"];
        photo.data = Buffer.from(buffer, "binary").toString("base64");
        res.send(photo);
      } else {
        res.status(500).send("Trouble retrieving the shop photo")
      }
      
    });
  }

  module.exports = GetShopPhoto 