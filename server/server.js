//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const {
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
} = require('./Routes/Routes')



//Dependencies for JWT token validation
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

//Environment variables
require("dotenv").config();

//Middleware to secure endpoints by checking if the jwt received in the authorization header is valid
//Since we're using Auth0 as an Authorization Service Provider, we'll be checking their jwks endpoint to validate the token

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksrequestPromisesPerMinute: 5,
    jwksUri: process.env.JWKS_URI
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"]
});

//Initialize the express app
const app = express();

//Use helmet for better security
app.use(helmet());

//Body-parser parses the incoming requestPromises and turns them into JSON objects.
app.use(bodyParser.json());

// enable all CORS requestPromises
app.use(cors());

// log HTTP requestPromises
app.use(morgan("combined"));

//Check jwt
app.use(checkJwt);

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

app.get("/users", (req, res) => GetUsers(req,res));

app.post("/users", (req, res) => PostUsers(req,res));

app.get("/users/:id", (req, res) => GetUser(req,res));

app.put("/users/:id/likedShops", (req, res) => PutUserLikedShops(req,res));

app.put("/users/:id/dislikedShops", (req, res) => PutUserDislikedShops(req,res));

app.delete("/users/:id/likedShops", (req, res) => DeleteUserLikedShop(req,res));

app.delete("/users/:id/dislikedShops", (req, res) => DeleteUserDislikedShop(req,res));

app.get("/users/:id/likedshopsids", (req, res) => GetUserLikedShopsIds(req,res));

app.get("/users/:id/dislikedShopsIds", (req, res) => GetUserDislikedShopsIds(req,res));

app.get("/likedshops/:shopId", (req, res) => GetShop(req,res));

app.get("/dislikedShops/:shopId", (req, res) => GetShop(req,res));

// get all shops
app.get("/shops", async (req, res) => GetShops(req,res));

app.get("/photos/:id", (req, res) => GetShopPhoto(req,res));

// start the server
let PORT = process.env.PORT || 8081
app.listen( PORT , () => {
  console.log("Listening on port: ", PORT);
});
