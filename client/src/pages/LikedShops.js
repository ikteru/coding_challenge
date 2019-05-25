import React, { Component } from 'react'
import Shops from '../Shops/Shops'

export default class LikedShops extends Component {

    async componentDidMount(){
        await this.props.getLikedShops(this.props.userId)
        await this.props.getShopsPhotos("userLikedShops")
    }
    render() {
        console.log("Likedshops compoenent rendered !! ")
        console.log("LIKED SHOPS :::: ", this.props.shops)
        return (
            <div>
                <Shops { ...this.props } shops={this.props.shops} dislike={this.props.dislike}></Shops>
            </div>
        )
    }
}
