import React, { Component } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Route } from 'react-router-dom'

import authClient from '../../Auth/Auth'
import { AxiosClient, getCurrentPosition} from './Utils'

import Callback from '../Callback/Callback'
import SecuredRoute from './SecuredRoute'
import NearbyShops from '../../routes/NearbyShops'
import LikedShops from '../../routes/LikedShops'
import NewNavbar from '../Navbar/NavBar'
import Welcome from '../Welcome/Welcome'


//This Component is user as a container to contain the state of the app
//It doesn't contain any UI whatsover, it's only mission is to manage the state of the app
//and load relevant components depending on the state

class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            user:this.props.user,
            location: {
                lat: -33.8670522,
                lng: 151.1957362
            },
            //Can be used to get particular types of shops (restaurant, store, clothing_store ...)
            shopType:"clothing_store",
            //Stores the nearbyShops fetched from the server
            nearbyShops:[],
            //stores the user's favorite shops
            userLikedShops:[],
            //stores the user's disliked shops
            userDislikedShops: [],
            //stores the user's liked shops ids
            //The ids are used to fetch each shop from the server and it's photos as well
            //They're also used to check what shops to display and which not to 
            //Same thing for dislikedshopsIds
            userLikedShopsIds: [],
            userDislikedShopsIds:[],
            //Used to check if the shops data is loaded from the server to avoid making the requests
            //each time one of the child components is rendered
            nearbyShopsFullyLoaded: false,
            likedShopsFullyLoaded: false,
            //To avoid asking the server too many times for the user information
            numberOfTries: 0

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
        this.initializeApplicationState = this.initializeApplicationState.bind(this)


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
            console.error("Error getting user coords: ", e)
            toast("We're having trouble getting your current location, please allow the browser to access your location.")
        }
    }

    //Is called when user likes a shop
    //It does as it's named! :p
    async handleAddingUserLikedShop(likedShop){
        let userId = authClient.getProfile().sub;
        await this.addToLikedShops( userId , likedShop)
        const oldState = this.state.nearbyShops;
        const newState = oldState.filter(
            shop => {
                console.log(shop.shopId !== likedShop.shopId)
                return shop.shopId !== likedShop.shopId
            }
        )
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
    // =============================   API Functions   ====================== //
    // ========================================================================== //

    //Initializes the application state :
    //      user info :
    //          name , nickname, userId
    //      user liked shops
    //      user dislikedshops
    //All are information needed to make decisions on what shops to display and what shops not to
    async initializeApplicationState(){

        const { user } = this.props;

        //Check if user is stored in the db and add the user to the db in case they're not registered
        //initializeApplicationState is also triggered inside addNewUserToDatabase in order to reinitialize the profile
        //after adding the user to the db
        let result = await AxiosClient().get("/users/" + user.userId)
                .then( response => {
                    let userData = response.data
                    this.setState({ userLikedShopsIds : userData.likedShopsIds})
                    this.setState({ userDislikedShopsIds : userData.dislikedShopsIds })
                    this.setState({ numberOfTries: this.state.numberOfTries++ })
                    return response;
                })
                .catch(
                    err => {
                        if( err.response){

                            if( err.response.status === 404 && this.state.numberOfTries < 4 ){
                                this.addNewUserToDatabase(user)
                                this.setState({ numberOfTries: this.state.numberOfTries++ })
                                return Promise.resolve({ success: true, data:"Successfully added new user to db"})
                            } 
                            return Promise.resolve({success: true, data:"Successfully added user to db"});
                        }else{
                            toast("Having trouble connecting to the server, please check your internet connection and try again.")
                            console.error("Error connecting to the backend server")
                        }
                    }
                )
        await this.getLikedShops(user.userId);
        await this.getDislikedShops(user.userId);

        return result;
    }

    //Does as the name suggests
    //It also triggers the initializeApplicationState after trying to add the user to the db
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
                this.initializeApplicationState();
                return result;
            }
        )
        .catch(
            err => {
                console.error("Failed to add new user to db : ", err) 
                this.initializeApplicationState()
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
        await this.getLocation();
        const { lat, lng } = this.state.location;
        const { getProfile } = authClient;
        //Get the nearby shops from the backend by using the shop type and the coordinates of the user
        //Once fetched and filtered to omit the liked/disliked shops, the shops will be stored in the state
        await AxiosClient().get("/shops?shopType="+ this.state.shopType + "&lat=" + lat + "&lng=" + lng +"&userId=" + getProfile().sub, {timeout: 8000})
            .then( response => response.data.data)
            .then( shops => {
                const nearbyShops = shops.filter(
                    shop => {
                        return !shopsToOmit.includes(shop.shopId)
                    }
                )
                this.setState({ nearbyShops: nearbyShops})
            }).catch(
                err => {
                    toast("No shops found nearby.")
                    console.log("No shops found nearby: ", err)

                }
            )
    }

    //Get the photos of the shops 
    async getShopsPhotos(shopsType){

        let shops = this.state[shopsType];
        let shopsWithPhotos = [];
        let counter = 0;
        for ( let shop of shops ){
            if( shop.photoRef.length === 0 ){
                console.log("Shop with shopId: "+ shop.shopId + " and shop name: " + shop.n)
            }else{
                
                await AxiosClient().get("/shops/photos/" + shop.photoRef ).then(
                    result => {
                        shop.photo.contentType = result.data.contentType;
                        shop.photo.data = result.data.data;
                        
                        if( shopsType === "nearbyShops" ){
                            this.setState({nearbyShopsFullyLoaded : true})
                        } else if(shopsType === "userLikedShops") {
                            this.setState({ likedShopsFullyLoaded : true })
                        } else {
                            console.error("Wrong shopsType provided")
                        }                    
                        
                        return shop;
                    }
                ).catch(
                    async err => {
                        toast("Error while fetching photos, trying again ...")
                        console.error("Error while fetching photos: ", err)
                        await AxiosClient().get("/shops/photos/" + shop.photoRef ).then(
                            result => {
                                shop.photo.contentType = result.data.contentType;
                                shop.photo.data = result.data.data;
                                this.setState({nearbyShopsFullyLoaded : true})
                                return shop;
                            }
                        )
                    }
                )
            }
            
            shopsWithPhotos.push(shop)
            counter++;
            if(counter === shops.length){
                this.setState({ nearbyShops: shopsWithPhotos})
                return true;
            }
            
        }

        
    }
    
    //Get the likedShops Ids for a particular user ..
    async getLikedShopsIds(userId){

        return await AxiosClient().get("/users/" + userId + "/likedShopsIds")
            .then( response => response.data )
            .then( likedShopsIds =>{
                if(likedShopsIds && likedShopsIds.length !== 0 ){
                    this.setState({ userDislikedShopsIds: likedShopsIds })
                }
                return likedShopsIds;
            }).catch(
                err => {
                    toast("Having trouble connecting to the server, please check your internet connection and try again.")
                    console.error("Error while fetching likedshopsIds : ", err)
                }
            )
    }

    async getDislikedShopsIds(userId){

        return await AxiosClient().get("/users/" + userId + "/dislikedShopsIds")
            .then( response => response.data )
            .then( dislikedShopsIds =>{
                if(dislikedShopsIds && dislikedShopsIds.length !== 0 ){
                    this.setState({ userDislikedShopsIds: dislikedShopsIds })
                }
                return dislikedShopsIds;
            }).catch(
                err => {
                    toast("Having trouble connecting to the server, please check your internet connection and try again.")
                    console.error("Error while fetching dislikedshopsIds : ", err)
                }
            )
    }
    //Gets the liked shops of the user from the backend using their userId
    //then saves them in the state 
    async getLikedShops(userId){

        await this.getLikedShopsIds(userId)
        const likedShopsIds = this.state.userLikedShopsIds;
        let likedShops = [];

        for (let likedShopId of likedShopsIds) {
            const temp = await AxiosClient().get("/shops/likedshops/" + likedShopId )
                .then( response => response.data)
            likedShops.push(temp);
        }
        this.setState({ userLikedShops: likedShops })
        return likedShops;
    }

    //Gets the disliked shops of the user from the backend using their userId
    //then saves them in the state
    async getDislikedShops(userId){

        await this.getDislikedShopsIds(userId);
        const dislikedShopsIds = this.state.userDislikedShopsIds;
        let dislikedShops = [];

        for( let dislikedShopId of dislikedShopsIds){
            const temp = await AxiosClient().get("/shops/dislikedShops/" + dislikedShopId)
            .then(response => response.data)

            dislikedShops.push(temp);
        }

        this.setState({ userDislikedShops: dislikedShops })

        return dislikedShops;
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
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.push(likedShop)
                this.setState({ userLikedShops: newLikedShopsList })
                return result;
            }).catch(
                err => {
                    toast("Having trouble connecting to the server, please check your internet connection and try again.")
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
            }).catch(
                err => {
                    toast("Having trouble connecting to the server, please check your internet connection and try again.")
                    console.error("Error while adding shop to disliked shops: ", err)
                }
            )
    }

    //Deletes a shop from the likedShops list in the state then proceeds to delete it from the db as well
    async DeleteFromLikedShops(userId, deletedShop ){
        let url = "/users/" + userId + "/likedShops";

        return await AxiosClient().delete(url,{ shopId: deletedShop.shopId })
            .then( response => response.data)
            .then( shopToDelete => {
                let oldLikedShopsList = this.state.userLikedShops;
                let newLikedShopsList = oldLikedShopsList.filter( shop => shop.shopId !== shopToDelete.shopId );
                this.setState({ userLikedShops: newLikedShopsList})
            }).catch(
                err => {
                    toast("Having trouble connecting to the server, please check your internet connection and try again.")
                    console.error("Error while deleting shop from liked shops : ", err)
                }
            )
    }

    render() {   

        return (
            <div>

                <NewNavbar></NewNavbar>
                
                <Route exact path='/callback' component={Callback}/>   
                <Route path="/" exact component={Welcome}></Route>
                <SecuredRoute path="/nearbyShops" exact render={ (props)=>{
                    
                                            return (<NearbyShops { ... props } 
                                                    shops={this.state.nearbyShops}
                                                    initializeApplicationState={this.initializeApplicationState}
                                                    like={this.handleAddingUserLikedShop} 
                                                    dislike={this.handleAddingUserDislikedShop}
                                                    getShops={this.getShops}
                                                    getShopsPhotos ={this.getShopsPhotos} 
                                                    nearbyShopsFullyLoaded={this.state.nearbyShopsFullyLoaded}
                                                /> 
                                            )
                                        } 
                                    } 
                    
                    checkingSession={this.props.checkingSession} 
                />

                <SecuredRoute path="/likedShops" exact render={ 
                                        (props)=>{

                                            return (<LikedShops {...props} 
                                                initializeApplicationState={this.initializeApplicationState}
                                                shops={this.state.userLikedShops} 
                                                userId={this.state.user.userId}
                                                dislike={this.handleRemovingUserLikedShop}
                                                getLikedShops={this.getLikedShops}
                                                getShopsPhotos={this.getShopsPhotos} 
                                                likedShopsFullyLoaded={this.state.likedShopsFullyLoaded}
                                            />
                                            )
                                        }
                                    }
                    
                    checkingSession={this.props.checkingSession} 
                />

                {/* this is the container of the popup messages I will use for error and notifications */}
                <ToastContainer progressStyle={{background: "red"}} position={toast.POSITION.BOTTOM_RIGHT}/>
            
            </div>
        )
    }
}


export default DashboardContainer