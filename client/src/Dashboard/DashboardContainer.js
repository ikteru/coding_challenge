import React, { Component } from 'react'
import authClient from '../Auth/Auth'
import axios from 'axios'
import { BACKEND_URL } from '../configs'
import Shops from '../Shops/Shops'

export class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            location: {
                lat:"",
                lng:""
            },
            currentLocation: this.props.location && this.props.location.pathname,
            nearbyShops:[],
            userLikedShops:[],
            userDislikedShops: []
        }
    }

    setLocation(){

    }
    setUserLikedShops(){

    }
    setUserDislikedShops(){

    }
    
    newAxiosClient(){
        return  axios.create(
            {
                baseURL: BACKEND_URL,
                timeout: 1000,
                headers: {'Authorization': `Bearer ${authClient.getIdToken()}`}
            }
        )
    }

    async getShops(){
        return await this.newAxiosClient().get("/shops")
            .then( response => response.data)
            .then( shops => {
                this.setState({ nearbyShops: shops})
            })
    }
    async getLikedShops(userId){
        return await this.newAxiosClient().get("/users/" + userId + "/likedShops")
            .then( response => response.data)
            .then( likedShops => this.setState({userLikedShops: likedShops}))
    }
    async getDislikedShops(userId){
        return await this.newAxiosClient().get("/users/" + userId + "/dislikedShops")
            .then(response => response.data)
            .then(shops => this.setState({ userDislikedShops : shops }))
    }
    async addShopToLikedShops(userId, shopId){
        let url = "/users/" + userId + "/likedShops"
        return await this.newAxiosClient().put(url, { shopId })
            .then(response => {
                console.log(response.data)
                return response.data
            })
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.push(shop)
                this.setState({ userLikedShops: newLikedShopsList })
            })
    }
    async AddShopToDislikedShops(userId, shopId){
        let url = "/users/" + userId + "/dislikedShops"

        return await this.newAxiosClient().put(url, { shopId })
            .then( response => response.data)
            .then( shop => {
                let newDislikedShopsList = this.state.userDislikedShops;
                newDislikedShopsList.push(shop);
                this.setState({ userDislikedShops: newDislikedShopsList})
                this.state.userLikedShops.forEach(
                    shop => {
                        if( shop._id === shopId){
                            let newLikedShopsList = this.state.userLikedShops;
                            console.log("----------------------------", newLikedShopsList.length)
                            console.log("----------------------------",newLikedShopsList.pop(shop));
                            console.log("----------------------------", newLikedShopsList.length)

                            this.setState({likedShops : newLikedShopsList })
                        }
                    }
                )
            })
    }

    async DeleteFromLikedShops(userId,shopId){
        let url = "/users/" + userId + "/likedShops";

        return await this.newAxiosClient().delete(url,{ shopId })
            .then( response => response.data)
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.pop(shop);
                this.setState({ userLikedShops: newLikedShopsList})
            })
    }

    async componentDidMount(){
        if( this.state.currentLocation === "/nearbyShops") {
            console.log(this.state.currentLocation)
            await this.getShops()
        } else if(this.state.currentLocation === "/likedShops"  ){
            console.log(this.state.currentLocation)
            await this.getLikedShops("5cdd956d6426e35f64effcc6")
        } else {
            //await this.getShops()
            console.log("Current location undefined ... ")
        }
        //this.getDislikedShops("5cdd956d6426e35f64effcc6")
        //this.addShopToLikedShops("5cdd956d6426e35f64effcc6", "5cdd841e0e7bb33e10856be4")
        //this.AddShopToDislikedShops("5cdd956d6426e35f64effcc6", "5cdaee88823eb362b687ac3e")
        //await this.testAuth();
    }
    render() {    
        //this.newAxiosClient().get("/auth").then(result => console.log("RESULT :::: ", result))
        
        return (
        <div>
            {
                this.state.currentLocation === "/nearbyShops" && <Shops shops={this.state.nearbyShops}></Shops>
            }
            {
                this.state.currentLocation === "/likedShops" && <Shops shops={this.state.userLikedShops}></Shops>
            }
            
        </div>
        )
    }
}
