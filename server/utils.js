const request = require('request-promise');
const Models = require('./models/models')
function checkSuccess(Promise){
    return Promise
        .then( result => ({ success: true, data: result }))
        .catch( error => ({ success: false, data: error }))
}

//Requests photos from google maps places api (photos endpoint) using photo references from the response
//that we get from the nearby places api request then saves the final shop data to the db
function addMoreDataAndSaveToDb(result, userId){
    if(result.success){
        let places = result.data;
        let resultPlaces = [];

        for( let place of places ){
            const options = {
                method: "GET",
                url: "https://maps.googleapis.com/maps/api/place/photo",
                qs: {
                maxwidth: 400,
                photoreference: "",
                key: process.env.API_KEY
                },
                encoding: null
            }
            options.qs.photoreference = place.photoRef
            
            place.photoRef !== ""  && request(options, (err, response, buffer ) =>{
                if( err ){
                    console.log("Error while fetching photo buffer  ")
                }else{
                    place.photo.contentType = response.headers["content-type"]
                    place.photo.data = buffer
                    place.userId = userId
                    //Save the shop to the db after adding the picture
                    Models.ShopModel(place).save()
                    //place.photo.data = buffer.toString('base64');
                }
                
            }).catch(
                err => console.log("Error from request promise", err.statusCode)
            );
            
            resultPlaces.push(place)
        }

        return Promise.resolve({ success: true, data:resultPlaces})
    }else{
        return result;
    }
}

//Gets shops from google maps places api (nearby places andpoint) and synthesizes the data for to be ready to be stored 
function synthesizeShops(result){
    if(result.success){
        let googlePlaces = result.data.results;
        console.log("GOOOOOOOOOOGLEEE :::::: ",googlePlaces)
        if( googlePlaces.length === 0 ){
            return Promise.reject( {
                success: false,
                data : "No shop found nearby"}
            )
        }else{
            let shops = googlePlaces.map(
                place => {
                    const temp = {
                        "location": place.geometry.location,
                        "name": place.name,
                        "icon": place.icon,
                        "types": place.types,
                        "photoRef": place.photos ? place.photos[0].photo_reference : "",
                        "photo": {}
                    }
                    return temp;
                })
            return Promise.resolve({
                success: true,
                data: shops
            })
        }
        
    }else{
        return result;
    }
}

module.exports = { checkSuccess, addMoreDataAndSaveToDb, synthesizeShops }