import React, { Component } from 'react'
import Shops from '../Components/Shops/Shops'
import Loader from 'react-loader-spinner'

export default class NearbyShops extends Component {
    state = {
        loaded: false
    }
    async componentDidMount(){

        const { 
            shopsFullyLoaded, 
            getShops, 
            getShopsPhotos,
            initializeApplicationState
        } = this.props;

        await initializeApplicationState()
        
        if( !shopsFullyLoaded){
            
            await getShops()
            
            this.setState({ loaded: true});

            await getShopsPhotos("nearbyShops")
        }

        

    }


    render() {
        const { 
            shops, 
            like, 
            dislike 
        } = this.props;
        console.log("LOADED :::: ", this.state.loaded)
        return (
            <div>

            {
                this.state.loaded && <Shops { ...this.props } shops={shops} like={like} dislike={dislike}></Shops>
            }
            {
                !this.state.loaded && (
                <div style={{textAlign: "center", paddingTop: "20%", height: 300}}>
                    <Loader
                        type="Grid"
                        color="#fff"
                        height="100"	
                        width="100"
                    />
                </div>
              )
            }
                
            </div>
        )
    }
}
