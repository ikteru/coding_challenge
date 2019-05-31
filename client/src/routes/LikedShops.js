import React, { Component } from 'react'
import Shops from '../Components/Shops/Shops'
import { sortShopsByDistance } from '../Components/Dashboard/Utils'
import authClient from '../Auth/Auth'

export default class LikedShops extends Component {

    async componentDidMount(){
        const { likedShopsFullyLoaded, initializeApplicationState, getLikedShops } = this.props;
        //Initialize the application state
        await initializeApplicationState();

        const userId = authClient.getProfile().sub;
        
        await getLikedShops( userId );
        //Check if the liked shops are fully loaded first to avoid making additional API requests
        if(!likedShopsFullyLoaded){
            this.props.getShopsPhotos("userLikedShops")
        }
    }
    componentWillUnmount(){
        this.setState({ willUnmount: true})
    }
    render() {
        const sortedLikedShops = sortShopsByDistance(this.props.shops);
        return (
            <div>
                <Shops { ...this.props } shops={sortedLikedShops} dislike={this.props.dislike}></Shops>
            </div>
        )
    }
}
