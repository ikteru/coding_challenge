import React, { Component } from 'react'
import Shops from '../Components/Shops/Shops'

export default class LikedShops extends Component {

    async componentDidMount(){
        const { likedShopsFullyLoaded, initializeApplicationState } = this.props;
        //Initialize the application state
        await initializeApplicationState()
        
        //Check if the liked shops are fully loaded first to avoid making additional API requests
        if(!likedShopsFullyLoaded){
            this.props.getShopsPhotos("userLikedShops")
        }
    }
    componentWillUnmount(){
        this.setState({ willUnmount: true})
    }
    render() {
        return (
            <div>
                <Shops { ...this.props } shops={this.props.shops} dislike={this.props.dislike}></Shops>
            </div>
        )
    }
}
