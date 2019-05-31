//Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

//Dependencies for JWT token validation
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
//Routers 
const { usersRouter, shopsRouter } = require('./Routers/Routers')

//Environment variables
require("dotenv").config();

//Middleware to secure endpoints by checking if the jwt received in the authorization header is valid
//Since we're using Auth0 as an Authorization Service Provider, 
//we'll be checking their jwks endpoint to validate the token

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWKS_URI
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"]
});

//Initialize the express app
const app = express();

//Use helmet for better security
app.use(helmet());

//Body-parser parses the incoming requests and turns them into JSON objects.
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan("combined"));

//Check and validate jwt
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

// ============================================================================= //

app.use("/shops", shopsRouter);
app.use("/users", usersRouter);

// ============================================================================= //


// start the server
let PORT = process.env.PORT || 8081
app.listen( PORT , () => {
  console.log("Listening on port: ", PORT);
});
