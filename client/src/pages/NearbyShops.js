import React, { Component } from 'react'
import Shops from '../Shops/Shops'

export default class NearbyShops extends Component {

    async componentDidMount(){
        await this.props.getShops()
        await this.props.getShopsPhotos("nearbyShops")
    }
    render() {
        console.log("nearbyshops compoenent rendered !! ")

        return (
            <div>
                <Shops { ...this.props } shops={this.props.shops} like={this.props.like} dislike={this.props.dislike}></Shops>
            </div>
        )
    }
}
