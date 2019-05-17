import React, { Component } from 'react'
import { BACKEND_URL } from '../configs'
import axios from 'axios'

export class DashboardContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            user:{
                username:"",
                email:""
            },
            location: {
                lat:"",
                lng:""
            },
            nearbyShops:[],
            userLikedShops:[],
            userDislikedShops: []
        }
    }

    setUser(){

    }
    setLocation(){

    }
    setUserLikedShops(){

    }
    setUserDislikedShops(){

    }

    async getShops(){
        return await axios.get(BACKEND_URL + "/shops")
            .then( response => response.data)
            .then( shops => {
                this.setState({ nearbyShops: shops})
            })
    }
    async getLikedShops(userId){
        return await axios.get(BACKEND_URL + "/users/" + userId + "/likedShops")
            .then( response => response.data)
            .then( likedShops => this.setState({userLikedShops: likedShops}))
    }
    async getDislikedShops(userId){
        return await axios.get(BACKEND_URL + "/users/" + userId + "/dislikedShops")
            .then(response => response.data)
            .then(shops => this.setState({ userDislikedShops : shops }))
    }
    async addShopToLikedShops(userId, shopId){
        let url = BACKEND_URL + "/users/" + userId + "/likedShops"
        return await axios.put(url, { shopId })
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
        let url = BACKEND_URL + "/users/" + userId + "/dislikedShops"

        return await axios.put(url, { shopId })
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
        let url = BACKEND_URL + "/users/" + userId + "/likedShops";

        return await axios.delete(url,{ shopId })
            .then( response => response.data)
            .then( shop => {
                let newLikedShopsList = this.state.userLikedShops;
                newLikedShopsList.pop(shop);
                this.setState({ userLikedShops: newLikedShopsList})
            })
    }

    

    async componentDidMount(){
        //this.getShops()
        //this.getLikedShops("5cdd956d6426e35f64effcc6")
        //this.getDislikedShops("5cdd956d6426e35f64effcc6")
        //this.addShopToLikedShops("5cdd956d6426e35f64effcc6", "5cdd841e0e7bb33e10856be4")
        //this.AddShopToDislikedShops("5cdd956d6426e35f64effcc6", "5cdaee88823eb362b687ac3e")
        //await this.testAuth();
    }

    render() {
        const { isAuthenticated, getIdToken } = this.props.authClient;
        console.log("CHECK AUTH:::",isAuthenticated())
        console.log("ID TOKEN ::: ", getIdToken())
        axios({
            url: BACKEND_URL + "/auth",
            headers: {
                "Authorization": `Bearer ${getIdToken()}`
            }
        })
        return (
        <div>
            
        </div>
        )
    }
}
