import React, { Component } from 'react'
import authClient from '../Auth/Auth'
import { AxiosClient, getCurrentPosition} from '../Auth/Utils'
import NearbyShops from '../pages/NearbyShops'
import LikedShops from '../pages/LikedShops'
import NewNavbar from '../Navbar/NewNavbar'
import { Route } from 'react-router-dom'
import SecuredRoute from '../Auth/SecuredRoute'
import Callback from '../Auth/Callback'

//This Component is user as a container to contain the state of the app
//It doesn't contain any UI whatsover, it's only mission is to manage the state of the app
//and load relevant components depending on the state

export class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            user:{
                name: "",
                nickname: "",
                userId: ""
            },
            location: {
                lat: -33.8670522,
                lng: 151.1957362
            },
            shopType:"clothing_store",
            currentRoute: this.props.location && this.props.location.pathname,
            nearbyShops:[],
            userLikedShops:[],
            userDislikedShops: [],
            userLikedShopsIds: [],
            userDislikedShopsIds:[]
        }

        this.handleAddingUserDislikedShop = this.handleAddingUserDislikedShop.bind(this);
        this.handleAddingUserLikedShop = this.handleAddingUserLikedShop.bind(this);
        this.addToDislikedShops = this.addToDislikedShops.bind(this);
        this.addToLikedShops = this.addToLikedShops.bind(this);
        this.handleRemovingUserLikedShop = this.handleRemovingUserLikedShop.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getLikedShops = this.getLikedShops.bind(this);
        this.getDislikedShops = this.getDislikedShops.bind(this);
        this.getShopsPhotos = this.getShopsPhotos.bind(this);
        this.getShops = this.getShops.bind(this);


    }


    // ========================================================================== //
    // =============================   UX Functions   =========================== //
    // ========================================================================== //

    //Get the user's current location
    async getLocation(){
        try{

            const { coords } = await getCurrentPosition();
            const location = {
                lat: coords.latitude,
                lng: coords.longitude
            }
            this.setState({ location })
        }catch(e){
            console.log("Error getting user coords: ", e)
        }
    }

    //Is called when user likes a shop
    //It does as it's named! :p
    async handleAddingUserLikedShop(likedShop){
        let userId = authClient.getProfile().sub;
        await this.addToLikedShops( userId , likedShop)
        const oldState = this.state.nearbyShops;
        console.log("OLD STATE :::::::::::: ", oldState)
        const newState = oldState.filter(
            shop => {
                console.log(shop.shopId !== likedShop.shopId)
                return shop.shopId !== likedShop.shopId
            }
        )
        console.log("NEW STATE :::::::::::: ", newState)
        this.setState({ nearbyShops: newState});

    }
    //IS called when a user dislikes a shop
    async handleAddingUserDislikedShop(dislikedshop){
        let userId = authClient.getProfile().sub;

        const oldState = this.state.nearbyShops;
        const newState = oldState.filter(
            shop => {
                console.log(shop.shopId !== dislikedshop.shopId)
                return shop.shopId !== dislikedshop.shopId
            }
        )
        this.setState({ nearbyShops: newState});

        await this.addToDislikedShops( userId , dislikedshop)
    }
    //Is called when a user removes a shop from his favorites
    async handleRemovingUserLikedShop(deletedShop){
        console.log(deletedShop.shopId)
        let userId = authClient.getProfile().sub;

        await this.DeleteFromLikedShops(userId, deletedShop);

    }

    // ========================================================================== //
    // =============================   BACKEND Functions   ====================== //
    // ========================================================================== //

    //Initializes the user profile :
    //      user info :
    //          name , nickname, userId
    //      user liked shops
    //      user dislikedshops
    async initializeUserProfile(){

        //Get the user profile from Auth0 and construct a simple user object
        const { getProfile } = authClient;
        const userAuthProfile = getProfile();
        const user = {
            userId: userAuthProfile.sub,
            name: userAuthProfile.name,
            nickname: userAuthProfile.nickname
        }
        this.setState({ user : user })

        //Check if user is stored in the db and add the user to the db in case they're not registered
        //InitializeUserProfile is also triggered inside addNewUserToDatabase in order to reinitialize the profile
        //after adding the user to the db
        let result = await AxiosClient().get("/users/" + user.userId)
                .then( response => {
                    let userData = response.data
                    this.setState({ userLikedShopsIds : userData.likedShopsIds})
                    this.setState({ userDislikedShopsIds : userData.dislikedShopsIds })
                    return response;
                })
                .catch(
                    err => {
                        if( err.response.status === 404 ){
                            this.addNewUserToDatabase(user)
                            return Promise.resolve({ success: true, data:"Successfully added new user to db"})
                        } 
                        return Promise.resolve({success: true, data:"Successfully added user to db"});
                    }
                )
        return result;
    }

    //Does as the name suggests
    //It also triggers the initializeUserProfile after trying to add the user to the db
    async addNewUserToDatabase(user){
        return AxiosClient().post("/users", {
            userId: user.userId,
            name: user.name,
            nickname: user.nickname,
            likedShops: this.state.userLikedShops,
            dislikedShops: this.state.userDislikedShops
        })
        .then(
            (result)=>{
                if( !result.success){
                    return Promise.reject(result.message)
                }
                this.initializeUserProfile(user.userId);
                return result;
            }
        )
        .catch(
            err => {
                console.error("Failed to add new user to db : ", err) 
                this.initializeUserProfile()
            }
        )
        
    }

    //This function gets shops from the backend everytime this compoenent is rendered
    //then stores them in the state
    async getShops(){

        //Figure out which shops not to display in the main page
        //Which are the likedShops and the dislikedShops
        //Then add them to the shopsToOmit array so we can take them off the list of shops to display
        let shopsToOmit = [];
        if( this.state.userDislikedShopsIds || this.state.userDislikedShopsIds ){
            shopsToOmit = this.state.userLikedShopsIds.concat(this.state.userDislikedShopsIds)
        }
        
        //Get the location of the user using the browser's navigator.location object.
        //await this.getLocation();
        const { lat, lng } = this.state.location;
        //Get the nearby shops from the backend by using the shop type and the coordinates of the user
        //Once fetched and filtered to omit the liked/disliked shops, the shops will be stored in the state
        await AxiosClient().get("/shops?shopType="+ this.state.shopType + "&lat=" + lat + "&lng=" + lng +"&userId=" + this.state.user.userId, {timeout: 8000})
            .then( response => response.data.data)
            .then( shops => {
                console.log("SHOOOOOOOOOOOOOOOOOOOOOOOOPSSS :::: ", shops)
                const nearbyShops = shops.filter(
                    shop => {
                        return !shopsToOmit.includes(shop.shopId)
                    }
                )
                this.setState({ nearbyShops: nearbyShops})
            })
    }

    //Get the photos of the shops 
    async getShopsPhotos(shopsType){

        let shops = this.state[shopsType];
        let shopsWithPhotos = [];
        let counter = 0;
        for ( let shop of shops ){
            
            await AxiosClient().get("/photos/" + shop.photoRef ).then(
                result => {
                    shop.photo.contentType = result.data.contentType;
                    shop.photo.data = result.data.data;
                    
                    return shop;
                }
            )
            
            shopsWithPhotos.push(shop)
            counter++;
            if(counter === shops.length){
                this.setState({ nearbyShops: shopsWithPhotos})
                return true;
            }
            
        }

        
    }

    //Gets the liked shops of the user from the backend using their userId
    //then saves them in the state 
    async getLikedShops(userId){
        return await AxiosClient().get("/users/" + userId + "/likedShops")
            .then( response => response.data)
            .then( likedShops => {
                if( likedShops && likedShops.length !== 0 ){
                    this.setState({userLikedShops: likedShops})
                }
                return likedShops;
            })
    }

    //Gets the disliked shops of the user from the backend using their userId
    //then saves them in the state
    async getDislikedShops(userId){
        return await AxiosClient().get("/users/" + userId + "/dislikedShops")
            .then(response => response.data)
            .then(dislikedShops => {
                this.setState({ userDislikedShops : dislikedShops })
                return dislikedShops
            })
    }

    //Adds a shop to the likedShops of a user using their userId and the shopId of the shop to add to favorites
    //It first adds the shops to the state then proceeds to save the shop to the database using an HTTP PUT request
    async addToLikedShops(userId, likedShop){
        let url = "/users/" + userId + "/likedShops"
        let alreadyInLikedShops = false;

        this.state.userLikedShops.forEach( shop => {
            if (shop.shopId === likedShop.shopId){
                alreadyInLikedShops = true
            }
        })
        return !alreadyInLikedShops && await AxiosClient().put(url, { shopId : likedShop.shopId })

            .then( (result) => {
                console.log("RESULTTTTTTTTTTTTTTTTTTTTTtttt ::::: ", result)
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.push(likedShop)
                this.setState({ userLikedShops: newLikedShopsList })
                return result;
            }).catch(
                err => {
                    console.error("Error adding shop to liked shops db: ", err)
                    return false;
                }
            )
    }

    //Adds a shop to the dislikedShops of a user using their userId and the shopId of the shop to add to dislikedshops
    //It first adds the shops to the state then proceeds to save the shop to the database using an HTTP PUT request
    async addToDislikedShops(userId, dislikedshop){
        let url = "/users/" + userId + "/dislikedShops"
        let alreadyInDislikedShops = false;

        this.state.userLikedShops.forEach( shop => {
            if (shop.shopId === dislikedshop.shopId){
                alreadyInDislikedShops = true
            }
        })
        return !alreadyInDislikedShops && await AxiosClient().put(url, { shopId: dislikedshop.shopId })
            .then( () => {
                let newDislikedShopsList = this.state.userDislikedShops;
                newDislikedShopsList.push(dislikedshop);
                this.setState({ userDislikedShops: newDislikedShopsList})
                this.state.userLikedShops.forEach(
                    shop => {
                        if( shop.shopId === dislikedshop.shopId){
                            let newLikedShopsList = this.state.userLikedShops;
                            this.setState({likedShops : newLikedShopsList })
                        }
                    }
                )
            })
    }

    //Deletes a shop from the likedShops list in the state then proceeds to delete it from the db as well
    async DeleteFromLikedShops(userId, deletedShop ){
        let url = "/users/" + userId + "/likedShops";

        return await AxiosClient().delete(url,{ shopId: deletedShop.shopId })
            .then( response => response.data)
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.pop(shop);
                this.setState({ userLikedShops: newLikedShopsList})
            })
    }


    async componentWillMount(){

        await this.initializeUserProfile()

    }

    render() {    
        return (
            <div>

                <NewNavbar></NewNavbar>
                
                <Route exact path='/callback' component={Callback}/>   

                <SecuredRoute path="/" exact render={
                        (props) => {
                            return (
                                <Route path ="/nearbyShops" render={ (props)=>{
                                            return (<NearbyShops { ... this.props } 
                                                    shops={this.state.nearbyShops}
                                                    like={this.handleAddingUserLikedShop} 
                                                    dislike={this.state.handleAddingUserDislikedShop}
                                                    getShops={this.getShops}
                                                    getShopsPhotos ={this.getShopsPhotos} 
                                                /> 
                                            )
                                        } 
                                    }
                                />
                            )
                        }

                    } 
                    
                    checkingSession={this.state.checkingSession} 
                />

                <SecuredRoute path="/" exact render={
                        (props) => {
                            return (
                                <Route path ="/likedShops" render={ 
                                            (props)=><LikedShops {...props} 
                                            shops={this.state.userLikedShops} 
                                            userId={this.state.user.userId}
                                            dislike={this.handleRemovingUserLikedShop}
                                            getLikedShops={this.getLikedShops}
                                            getShopsPhotos={this.getShopsPhotos} 
                                        />
                                    } 
                                />
                            )
                        }

                    } 
                    
                    checkingSession={this.state.checkingSession} 
                />
                
            </div>
        )
    }
}
