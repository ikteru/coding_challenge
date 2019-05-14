const request = require("request-promise");
const mongoose = require("mongoose");
const Models = require('./models/models');

require('dotenv').config();

let shops = [];

const options = { 
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    qs: { 
        location: '-33.8670522,151.1957362',
        radius: '1000',
        type: 'restaurant',
        key: 'AIzaSyBqJDXoWfIY0qli8M7k1x1kR1LUQ4kBcZs' 
    },
    headers: { 
        'Postman-Token': '3d1428ca-7207-4cf6-bf5b-0b24573fb263',
        'cache-control': 'no-cache' 
    } 
};

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

request(options)
.then( response => JSON.parse(response))
.then(
    result => {
        return result.results.map(
            place => {
                const temp = {
                    "location": place.geometry.location,
                    "name": place.name,
                    "icon": place.icon,
                    "types": place.types,
                    "photo": place.photos[0] ? place.photos[0].photo_reference : "",
                }
                const shop = Models.ShopModel(temp);

                shop.save();
                return temp;
                 
            }
        )
    }
)
.then(
    result => console.log(result)
)


// const user1 = {
//     username: "ikteru",
//     email: "test@ikteru.com",
//     likedShops: [],
//     dislikedShops: []
// }

// const user2 = {
//     username: "hamza",
//     email: "hamza@ikteru.com",
//     likedShops:["5cdae8f4d6d53457aa551623", "5cdae8f4d6d53457aa551625"],
//     dislikedShops: ["5cdae8f4d6d53457aa551627"]
// }

// Models.UserModel(user1).save()
// Models.UserModel(user2).save()