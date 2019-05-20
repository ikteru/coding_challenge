//Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models/models');
const request = require('request-promise');
const {checkSuccess, addMoreDataAndSaveToDb, synthesizeShops} = require('./utils');

//Dependencies for JWT token validation 
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

//Environment variables
require('dotenv').config();

//Middleware to secure endpoints by checking if the jwt received in the authorization header is valid
//Since we're using Auth0 as an Authorization Service Provider, we'll be checking their jwks endpoint to validate the token

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://ikteru.auth0.com/.well-known/jwks.json`
    }),

    // Validate the audience and the issuer.
    audience: 'Mjwf9Ii0u8jexj8HFuKjgv0LbXnSMqYm',
    issuer: `https://ikteru.auth0.com/`,
    algorithms: ['RS256']
});

//Initialize the express app
const app = express();

//Hard coded shops for testing
const shops = [];

//Use helmet for better security
app.use(helmet());

//Body-parser parses the incoming requests and turns them into JSON objects.
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

//Check jwt 
app.use(checkJwt);

//Catch jwt validation error
app.use(function(err, req, res, next) {
    if(err.name === 'UnauthorizedError') {
      res.status(err.status).send({message:err.message});
      console.error(err);
      return;
    }
 next();
});

//Connect to the database
try{
    mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});
} catch(e){
    throw Error("Couldn't connect to the database, please make sure the mongo db container is running on the port specified in the .env file.")
}

app.get('/test', (err , req, res)=> {
    res.send(err)
})


app.get('/users', (req, res) => {
    checkSuccess(Models.UserModel.find()).then( (result) => {
        let users = result.data;
        result.success ? res.send(users) : res.status(500).send("Error while fetching users from db")
    })
});

app.post('/users', (req,res)=>{
    const newUser = {
        userId : req.body.userId,
        name: req.body.name,
        nickname: req.body.nickname,
        likedShops: req.body.likedShops ? req.body.likedShops : [],
        dislikedShops: req.body.dislikedShops ? req.body.dislikedShops : []
    }
    checkSuccess(Models.UserModel(newUser).save()).then(
        result => {
            if(!result.success){
                res.status(500).send(result)
            }else{
                res.status(200).send({
                    success: true,
                    message: "User successfully saved"
                })
            }
        }
    )
});

app.get('/users/:id', (req, res) => {
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id })).then(
        result => {
            if(result.success){
                let user = result.data
                user ? res.send(user): res.status(404).send("User not found")
            }else{
                res.status(500).send("Error while fecthing user from db")
            }
        }
    )
})

app.put('/users/:id/likedShops', (req, res)=>{
    
    checkSuccess(Models.UserModel.findOne({ userId : req.params.id }))
    .then((result)=>{
        if(!result.success){
            res.status(404).send("Not found")
        } else if( result.success && !result.data ){
            res.status(404).send("Not found")
        } else {
            let doc = result.data;
            if( doc.likedShops.indexOf(req.body.shopId) !== -1 ){
                res.status(400).send("Shop already liked ... ")
                return checkSuccess(Promise.reject("Shop already liked ..."))
            }else {
                doc.likedShops.push(req.body.shopId);
                doc.dislikedShops.pop(req.body.shopId)
                doc.save();
                return checkSuccess(Promise.resolve(doc))
            }
        }
    })
    .then(
        (result)=> {
            if(result.success){
                Models.ShopModel.findOne({ _id: req.body.shopId }).then( shop => res.send(shop))
            }else{
                return result;                
            }
        }
    ).catch( err => console.error(err))
});

app.put('/users/:id/dislikedShops', (req, res)=>{
    
    checkSuccess(Models.UserModel.findOne({ userId : req.params.id }))
    .then((result)=>{
        if(result.success){
            let doc = result.data;
            if( doc.dislikedShops.indexOf(req.body.shopId) !== -1 ){
                res.status(400).send("Shop already disliked ... ")
                return checkSuccess(Promise.reject("Shop already disliked ..."))
            } else{
                doc.dislikedShops.push(req.body.shopId);
                doc.likedShops.pop(req.body.shopId)
                doc.save();
            }
        }
        return result;
        
    }).then(
        (result)=>{
            if(result.success){
                Models.ShopModel.findOne({ _id: req.body.shopId}).then( shop => res.send(shop))
            }
            return result;
        }
    ).catch( err => console.error(err))
});

app.delete('/users/:id/likedShops', (req,res)=>{
    checkSuccess(Models.UserModel.findOne({ userId : req.params.id })).then( result =>{
        if (result.success ){
            let doc = result.data;
            doc.likedShops.pop(req.body.shopId);
            doc.save();
            res.send(doc);
        }else{
            res.status(500).send("Error while updating liked/disliked shops data")
        }
        
    })
});

app.delete('/users/:id/dislikedShops', (req, res)=>{
    
    checkSuccess(Models.UserModel.findOne({ userId : req.params.id })).then( result =>{
        if(result.success){
            let doc = result.data;
            doc.dislikedShops.pop(req.body.shopId);
            doc.save();
            res.send(doc);
        }else{
            res.status(500).send("Error while updating liked/disliked shops data")
        }
        
    })
});

app.get('/users/:id/likedshops', (req,res)=>{

    checkSuccess(Models.UserModel.findOne({ userId: req.params.id }).lean())
    .then((result)=> {
        if(result.success && result.data){
            if( result.data.length === 0 ){
                res.status(400).send("No liked shops found for this user...")
                return Promise.reject({ success: false, data: "No liked shops found for this user..."})
            }

            let user = result.data;
            checkSuccess(Models.ShopModel.find(
                    {
                        _id: {
                            $in: user.likedShops
                        } 
                    }
                ).lean()
            ).then(
                result => {
                    if(result.success){
                        let shops = result.data
                        res.send(shops)
                    }else{
                        res.status(500).send("Error while fetching user likedshop data")
                        return result
                    }
                }
            ).catch(
                result => console.log(result.data)
            )
            
        }else{
            res.status(500).send("Error while fetching user likedShops from db")
        }
        
    })
});

app.get('/users/:id/dislikedshops', (req,res)=>{
    checkSuccess(Models.UserModel.findOne({ userId: req.params.id }))
    .then((result)=> {
        if(result.success){
            let user = result.data;
            Models.ShopModel.find(
                {
                    _id: {
                        $in: user.dislikedShops
                    } 
                }
            ).then(
                shops => {
                    //console.log(shops)
                    res.send(shops)
                }
            )
        }else{
            res.status(500).send("Error while fetching user dislikedShops")
        }
        
    })
});



// get all shops
app.get('/shops', async (req, res) => {

    const { lat, lng, userId } = req.query;
    const options = { 
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        qs: { 
            location:  `${lat}, ${lng}`,
            //location: "33.995521, -6.8500229,16",
            rankby: 'distance',
            type: req.query.shoptype,
            //type: "restaurant" ,
            key: process.env.API_KEY 
        },
        json: true
    };

    let locationString = lat + ", " + lng;

    async function firstTimeSearching(userId, locationString ){
        let result = await Models.UserModel.findOne({ userId: userId}).lean().then(
            user => {
                if( user ){
                    return !user.searchedLocations.includes( locationString );
                }else {
                    return false
                }
            }
        )
        return result;
    }

    if(await firstTimeSearching(userId, locationString)){
        
        Models.UserModel.findOne({ userId: userId }).then(
            user => {
                user.searchedLocations.push( locationString )
                user.save()
            }
        )
        checkSuccess(request(options))
        .then( result => synthesizeShops(result))
        .then( result => addMoreDataAndSaveToDb(result, req.query.userId))
        .then( result => {
            if(result.success){
                //res.send(result.data)
                Models.ShopModel.find().lean().then(
                    result => {
                        console.log("I made it this far §!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", result)
                        res.send(result)
                    }
                )
                
            }
            return result;
        }).catch(
            error => {
                console.log("ERROR :::: ", error)
            }
        )
    } else {
        Models.ShopModel.find().lean().then(
            result => {
                res.send(result)
            }
        )
    }
    


});

app.post('/shops', (req, res)=>{
    const newShop = new Models.ShopModel(req.body);
    checkSuccess(newShop.save()).then(result=> {
        if(result.success){
            res.send(result)
        }else{
            res.status(500).send("Error while saving shop to db")
        }
    })
})

app.get('/shops/:id', (req, res) => {

    checkSuccess(Models.ShopModel.find({ _id: req.params.id})).lean()
    .then( result => {
        result.success ? res.send(result.data) : res.status(500).send(result)
    })
});

app.get('/shops/:id/photo', (req, res) => {

    chekcSuccess(Models.ShopModel.findOne({ _id: req.params.id}))
    .then(
        (result) => {
            if(!result.success){
                res.status(404).send("Not found")
            }else{
                const photo = result.data.photo.data.buffer
                res.setHeader("content-type", result.data.photo.contentType)
                res.send(photo)
            }
        }
    )
})


// start the server
app.listen(8081, () => {
  console.log('listening on port 8081');
});