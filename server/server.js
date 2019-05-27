//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Models = require("./models/models");
const request = require('request');
const requestPromise = require("request-promise");
const {
  checkSuccess,
  getShopsPhotos,
  synthesizeShops,
  firstTimeSearching,
  saveToDb,
  getShopDetails
} = require("./utils");

//Dependencies for JWT token validation
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const fs = require("fs");

//Environment variables
require("dotenv").config();

//Middleware to secure endpoints by checking if the jwt received in the authorization header is valid
//Since we're using Auth0 as an Authorization Service Provider, we'll be checking their jwks endpoint to validate the token

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksrequestPromisesPerMinute: 5,
    jwksUri: `https://ikteru.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: "Mjwf9Ii0u8jexj8HFuKjgv0LbXnSMqYm",
  issuer: `https://ikteru.auth0.com/`,
  algorithms: ["RS256"]
});

//Initialize the express app
const app = express();

//Hard coded shops for testing
const shops = [];

//Use helmet for better security
app.use(helmet());

//Body-parser parses the incoming requestPromises and turns them into JSON objects.
app.use(bodyParser.json());

// enable all CORS requestPromises
app.use(cors());

// log HTTP requestPromises
app.use(morgan("combined"));

//Check jwt
//app.use(checkJwt);

//Catch jwt validation error
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    console.error(err);
    return;
  }
  next();
});

//Connect to the database
try {
  mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
} catch (e) {
  throw Error(
    "Couldn't connect to the database, please make sure the mongo db container is running on the port specified in the .env file."
  );
}

app.get("/test", (err, req, res) => {
  res.send(err);
});

app.get("/users", (req, res) => {
  checkSuccess(Models.UserModel.find()).then(result => {
    let users = result.data;
    result.success
      ? res.send(users)
      : res.status(500).send("Error while fetching users from db");
  });
});

app.post("/users", (req, res) => {
  const newUser = {
    userId: req.body.userId,
    name: req.body.name,
    nickname: req.body.nickname,
    likedShops: req.body.likedShops ? req.body.likedShops : [],
    dislikedShops: req.body.dislikedShops ? req.body.dislikedShops : []
  };

  checkSuccess(Models.UserModel(newUser).save()).then(result => {
    if (!result.success) {
      res.status(500).send(result);
    } else {
      res.status(200).send({
        success: true,
        message: "User successfully saved"
      });
    }
  });
});

app.get("/users/:id", (req, res) => {
  checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
    result => {
      if (result.success) {
        let user = result.data;
        user ? res.send(user) : res.status(404).send("User not found");
      } else {
        res.status(500).send("Error while fecthing user from db");
      }
    }
  );
});

app.put("/users/:id/likedShops", (req, res) => {
  checkSuccess(Models.UserModel.findOne({ userId: req.params.id }))
    .then(result => {
      if (!result.success) {
        res.status(404).send("Not found");
      } else if (result.success && result.data.length === 0) {
        res.status(404).send("Not found");
      } else {
        let doc = result.data;
        console.log("DOOOOOOOOOOOOOOOOOOCCCC :::: ", doc)
        if (doc.likedShopsIds.indexOf(req.body.shopId) !== -1) {
          res.status(400).send("Shop already liked ... ");
          return checkSuccess(Promise.reject("Shop already liked ..."));
        } else {
          doc.likedShopsIds.push(req.body.shopId);
          doc.dislikedShopsIds.pop(req.body.shopId);
          doc.save();
          return checkSuccess(Promise.resolve(doc));
        }
      }
    })
    .then(result => {
      if (result.success) {
        res.send({ success: true, data:"successfully saved likedshop" })
      } else {
        res.status(404).send({success: false, data: "Error saving shop to liked shops"})
      }
    })
    .catch(err => console.error(err));
});

app.put("/users/:id/dislikedShops", (req, res) => {
  checkSuccess(Models.UserModel.findOne({ userId: req.params.id }))
    .then(result => {
      if (result.success) {
        let doc = result.data;
        if (doc.dislikedShopsIds.indexOf(req.body.shopId) !== -1) {
          res.status(400).send("Shop already disliked ... ");
          return checkSuccess(Promise.reject("Shop already disliked ..."));
        } else {
          doc.dislikedShopsIds.push(req.body.shopId);
          doc.likedShopsIds.pop(req.body.shopId);
          doc.save();
        }
      }
      return result;
    })
    .then(result => {
      if (result.success) {
        
        res.send({success: true, data:"Successfully saved dislikedshop"})
        
      }else{
        res.status(404).send({success: false, data:"Error saving dislikedshop"})
      }
      return result;
    })
    .catch(err => console.error(err));
});

app.delete("/users/:id/likedShops", (req, res) => {
  checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
    result => {
      if (result.success) {
        let doc = result.data;
        doc.likedShopsIds.pop(req.body.shopId);
        doc.save();
        res.send(doc);
      } else {
        res.status(500).send("Error while updating liked/disliked shops data");
      }
    }
  );
});

app.delete("/users/:id/dislikedShops", (req, res) => {
  checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
    result => {
      if (result.success) {
        let doc = result.data;
        doc.dislikedShopsIds.pop(req.body.shopId);
        doc.save();
        res.send(doc);
      } else {
        res.status(500).send("Error while updating liked/disliked shops data");
      }
    }
  );
});

app.get("/users/:id/likedshopsids", async (req, res) => {
  await Models.UserModel.findOne({ userId: req.params.id }).then(
    async user => {
      if( !user ){
        res.status(404).send("Couldn't find user ... ")
      }else{
        res.send(user.likedShopsIds)
      }
    }
  )
});

app.get("/users/:id/dislikedShopsIds", async (req, res) => {
  await Models.UserModel.findOne({ userId: req.params.id }).then(
    async user => {
      if( !user ){
        res.status(404).send("Couldn't find user ... ")
      }else{
        res.send(user.dislikedShopsIds)
      }
    }
  )
});

app.get("/likedshops/:likedShopId", async (req, res) => {
  const result = await checkSuccess(getShopDetails(req.params.likedShopId))
  if(result.success){
    res.send(result.data)
  }else{
    res.status(404).send("Couldn't find likedshop")
  }
});

app.get("/dislikedShops/:dislikedShopId", async (req, res) => {
  const result = await checkSuccess(getShopDetails(req.params.dislikedShopId))
  if(result.success){
    res.send(result.data)
  }else{
    res.status(404).send("Couldn't find likedshop")
  }
});

app.get("/dislikedshopsids/:dislikedShopId", async (req, res) => {
  const result = await checkSuccess(getShopDetails(req.params.dislikedShopId))
  if(result.success){
    res.send(result.data)
  }else{
    res.status(404).send("Couldn't find dislikedshop")
  }
});

// get all shops
app.get("/shops", async (req, res) => {
  const { lat, lng, userId } = req.query;
  const options = {
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    qs: {
      location: `${lat}, ${lng}`,
      //location: "33.995521, -6.8500229,16",
      radius: 300,
      type: req.query.shopType,
      //type: "clothing_store" ,
      key: process.env.API_KEY
    },
    json: true
  };

  let googlePlacesApiResponse = await checkSuccess(requestPromise(options));
  let synthesizedShopsList = await checkSuccess(synthesizeShops(googlePlacesApiResponse));
  console.log("SYNTHESISSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
  console.log(synthesizedShopsList)
  //saveToDb(synthesizedShopsList);

  res.send(synthesizedShopsList);
});

// app.post("/shops", (req, res) => {
//   const newShop = new Models.ShopModel(req.body);
//   checkSuccess(newShop.save()).then(result => {
//     if (result.success) {
//       res.send(result);
//     } else {
//       res.status(500).send("Error while saving shop to db");
//     }
//   });
// });

// app.get("/shops/:id", (req, res) => {
//   checkSuccess(Models.ShopModel.find({ shopId: req.params.id }))
//     .lean()
//     .then(result => {
//       result.success ? res.send(result.data) : res.status(500).send(result);
//     });
// });

app.get("/photos/:id", (req, res) => {
  const options = {
    method: "GET",
    url: "https://maps.googleapis.com/maps/api/place/photo",
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
});

// start the server
app.listen(8081, () => {
  console.log("listening on port 8081");
});
