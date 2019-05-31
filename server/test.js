const { getDistance } = require('geolib')


const result = getDistance(
    { latitude:-33.8670522 , longitude:151.1957362},
    { latitude: 57.045917, longitude: 921984}
)

console.log(result)