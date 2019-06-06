# Random.Shop :p 

This project is a full-stack application with both the front-end and back-end API implemented.
The front-end is developed using Reactjs and the API is developed using Nodejs/express and a docker image of a Mongo database that wasn't secured for our purposes.
The scenario is as follows:

The user navigates to the application which is hosted on:
```
http://localhost:8080
```
The user then gets greeted with a simple welcome screen and a Navbar as requested in the coding challenge.
The Navbar has three links:
    - Nearby Shops
    - Liked/Favorite Shops
    - Login
Since it's been requested the user logs in in order to use the application, both "Nearby Shops" and "Liked Shops" links are secure and therefore redirect the user to the login page if he is not authenticated.

The user can also Login or Register using the Login link.

In order to implement secure Login, I chose to use an Identity Provider and therefore save myself the trouble of implementing my own identity solution which, no matter how secure it is, won't be as secure as a specialist's.

I also chose to use an external identity provider in order to showcase my knowledge and proficiency in ``` OAuth 2.0 ``` and ``` Open Id Connect``` standards. 

The identity provider I chose is: ```Auth0```

Once the user logs in using Auth0's universal login page, he redirected back to the welcome page with his email or name displayed on the top right corner with the option to Logout.

Now, the user has access to both "Nearby Shops" and "Favorite Sops" pages.

The user's location is automatically taken from the ```navigator.geolocation``` object and used to get the nearby shops.

##When the user logs in

The moment the user logs in, the application sends a request to the server in order to check if the Mongo database has any record of the user. In case the user doesn't yet have a record, it creates a new record and saves it in the ```users``` database.

The User database model is as follows: 

```
{
    userId:{
        type: String,
        unique: true
    },
    searchedLocations: Array,
    name: String,
    nickname: String,
    likedShopsIds: Array,
    dislikedShopsIds: Array
}
```
- The userId is the ID we get back from Auth0. 
- The searchedLocations is an Array of coordinates of locations the user has already searched, it will be used in the future to implement a caching solution in order to avoid calling the Google Maps API too many times.
- The likedShopsIds and dislikedShopsIds are both an array of ShopIds. They are used in order to decide what shops to display to the user since we can't display neither in the "Nearby Shops" page. And also used to display the "Favorite Shops" page.

In case the user has a record in the database and does have some liked shops and disliked shops in his data, the application will get those information and initializes the application with said information.

## Security

Since I'm using Auth0 as an identity provider, I'm automatically using the Open Id Connect & OAuth 2.0 standards in order to secure the application.
Meaning that, not only do I use Auth0 for authentication purposes, but also for Authorizing the requests sent to the API.
Unless the client application sends a token in the Authorization header of each and every request, the request will be declined.

## Getting Nearby Shops

I'll explain briefly the flow of getting ```Nearby Shops```:
    - The user clicks on Nearby Shops
    - The user's location is fetched from the navigator.geolocation object.
    - A request to the back-end API is executed in order to get a list of all the nearby shops 
      ordered by distance.
    - The back-end API receives the request and then uses ```Google Maps Places API ``` to get a list of all nearby shops, synthesizes the data, adds relevant data to the application and sends back a the list of shops to the front-end.
    - The app then decides what shops to display based on what shops has the user liked or disliked and the list it got back from the API.
A similar flow describe how to get ```Favorite Shops```.

### Prerequisites

You'll need to have Nodejs installed on your computer. You'll also need "Git" installed.
You'll also need Docker.

### Installing


(I'll implement a docker-compose structure in the future where you only need to executer ```docker-compose up``` in order to demo ths project, but for now, please follow the instructions below )

Download the project to your computer by using the green "Clone & Download" button, or by executing:
```
git clone https://github.com/ikteru/coding_challenge.git
```
Go into the folder you just downloaded and execute the following commands:

```
cd client && npm install
cd server && npm install 
```
This will install all the dependencies needed for the project to run.

Since we're using a Mongodb database, you'll need to run an instance. You can either install Mongodb or download a Mongo Docker image and run it on the 27017 port, make sure the database doesn't need authentication.

In my case, I used Docker to download a Mongo image and run it.
To download a Mongo image:

```
docker pull mongo
```
To run an instance of the image you just downloaded:
```
docker run -d -p 27017:27017 -v ~/coding_challenge/mongo/data:/data/db mongo
```
Make sure there is a mongo/data folder inside the coding_challenge folder and that you don't get the path to it wrong.
In my case, the path is : ~/coding_challenge/
Where ~ is the home folder of my Ubuntu.

At the moment, I haven't secured the database whatsoever to make it easier to demo. 
However, in production, the database should be secured.

Now that we have the database up and running, let's start the server too.
Head to the server folder and execute the following command:
```
npm start
```
That will start the API for you.

And finally, let's start the actual React application, head to the client folder and execute:
```
npm start
```

##Improvements and new features:

This project of course is just a work in progress and can use a lot of changes and is also open to new features, I constructed it in such a way that adding new features won't be a hassle.

Some proposed new features : 
- Giving the user the ability to choose what type of shops he wants to see (clothing_shop, store, restaurant ... )
- Adding a predective search bar where the user can search for a particular shop using different criterias like the products they sell or the services they provide ...
- Adding the "Opening hours" to the interface so the user can tell if the shop he's looking at is open at the moment or not.

And a lot more features that this project is already structured in a way that makes it easier to add them.

Improvements: 
- Rethink the database structure 
- Rethink the REST API structure and build it in adherance to the Open API 3.0 specification
- ....

Enjoy ... Hopefully everything will work! :p 
