import React, { Component } from 'react'
import authClient from '../Auth/Auth'
import Shops from '../Shops/Shops'
import { AxiosClient, getCurrentPosition} from '../Auth/Utils'

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
                lat: "33.995521",
                lng: "-6.8500229,16"
            },
            shopType:"restaurant",
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
    async handleAddingUserLikedShop(shopId){
        let userId = authClient.getProfile().sub;
        await this.addToLikedShops( userId , shopId)
        const oldState = this.state.nearbyShops;
        const newState = oldState.filter(
            shop => {
                console.log(shop._id !== shopId)
                return shop._id !== shopId
            }
        )
        this.setState({ nearbyShops: newState});

    }
    //IS called when a user dislikes a shop
    async handleAddingUserDislikedShop(shopId){
        let userId = authClient.getProfile().sub;

        const oldState = this.state.nearbyShops;
        const newState = oldState.filter(
            shop => {
                console.log(shop._id !== shopId)
                return shop._id !== shopId
            }
        )
        this.setState({ nearbyShops: newState});

        await this.addToDislikedShops( userId , shopId)
    }
    //Is called when a user removes a shop from his favorites
    async handleRemovingUserLikedShop(shopId){
        console.log(shopId)
        let userId = authClient.getProfile().sub;

        await this.DeleteFromLikedShops(userId, shopId);

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
        await AxiosClient().get("/users/" + user.userId)
                .then( response => {
                    let userData = response.data
                    this.setState({ userLikedShopsIds : userData.likedShops})
                    this.setState({ userDislikedShopsIds : userData.dislikedShops })
                    return response;
                })
                .catch(
                    err => {
                        if( err.response.status === 404 ){
                            this.addNewUserToDatabase(user)
                            return Promise.resolve({ success: true, data:"Successfully added new user to db"})
                        } 
                        return err;
                    }
                )

        //Get the user liked and disliked shops from the db now that we know he is in the db
        await this.getLikedShops(user.userId);
        await this.getDislikedShops(user.userId);
        
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
        if( this.state.userLikedShops || this.state.userDislikedShops ){
            shopsToOmit = this.state.userLikedShopsIds.concat(this.state.userDislikedShopsIds)
        }
        
        //Get the location of the user using the browser's navigator.location object.
        await this.getLocation();
        const { lat, lng } = this.state.location;
        //Get the nearby shops from the backend by using the shop type and the coordinates of the user
        //Once fetched and filtered to omit the liked/disliked shops, the shops will be stored in the state
        return await AxiosClient().get("/shops?shopType="+ this.state.shopType + "&lat=" + lat + "&lng=" + lng +"&userId=" + this.state.user.userId)
            .then( response => response.data)
            .then( shops => {
                const nearbyShops = shops.filter(
                    shop => {
                        return !shopsToOmit.includes(shop._id)
                    }
                )
                this.setState({ nearbyShops: nearbyShops})
            })
    }

    //Gets the liked shops of the user from the backend using their userId
    //then saves them in the state 
    async getLikedShops(userId){
        return await AxiosClient().get("/users/" + userId + "/likedShops")
            .then( response => response.data)
            .then( likedShops => {
                this.setState({userLikedShops: likedShops})
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
    async addToLikedShops(userId, shopId){
        let url = "/users/" + userId + "/likedShops"
        let alreadyInLikedShops = false;

        this.state.userLikedShops.forEach( shop => {
            if (shop.shopId === shopId){
                alreadyInLikedShops = true
            }
        })
        return !alreadyInLikedShops && await AxiosClient().put(url, { shopId })
            .then(response => {
                return response.data
            })
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.push(shop)
                this.setState({ userLikedShops: newLikedShopsList })
            }).catch(
                err => {
                    console.error("Error adding shop to liked shops db: ", err)
                    return false;
                }
            )
    }

    //Adds a shop to the dislikedShops of a user using their userId and the shopId of the shop to add to dislikedshops
    //It first adds the shops to the state then proceeds to save the shop to the database using an HTTP PUT request
    async addToDislikedShops(userId, shopId){
        let url = "/users/" + userId + "/dislikedShops"
        let alreadyInDislikedShops = false;

        this.state.userLikedShops.forEach( shop => {
            if (shop.shopId === shopId){
                alreadyInDislikedShops = true
            }
        })
        return !alreadyInDislikedShops && await AxiosClient().put(url, { shopId })
            .then( response => response.data)
            .then( shop => {
                let newDislikedShopsList = this.state.userDislikedShops;
                newDislikedShopsList.push(shop);
                this.setState({ userDislikedShops: newDislikedShopsList})
                this.state.userLikedShops.forEach(
                    shop => {
                        if( shop._id === shopId){
                            let newLikedShopsList = this.state.userLikedShops;
                            this.setState({likedShops : newLikedShopsList })
                        }
                    }
                )
            })
    }

    //Deletes a shop from the likedShops list in the state then proceeds to delete it from the db as well
    async DeleteFromLikedShops(userId,shopId){
        let url = "/users/" + userId + "/likedShops";

        return await AxiosClient().delete(url,{ shopId })
            .then( response => response.data)
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.pop(shop);
                this.setState({ userLikedShops: newLikedShopsList})
            })
    }


    async componentDidMount(){

        await this.initializeUserProfile().then( ()=> this.getShops())

    }
    render() {    
        return (
            <div>
                {
                    this.state.currentRoute === "/nearbyShops" && <Shops { ...this.props } shops={this.state.nearbyShops} like={this.handleAddingUserLikedShop} dislike={this.handleAddingUserDislikedShop}></Shops>
                }
                {
                    this.state.currentRoute === "/likedShops" && <Shops { ...this.props } shops={this.state.userLikedShops} dislike={this.handleRemovingUserLikedShop}></Shops>
                }
            </div>
        )
    }
}
