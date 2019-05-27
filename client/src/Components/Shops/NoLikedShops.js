import React from 'react'
import NoLikedShop from '../../assets/heart-off.png'

export default function NoLikedShops(){

    
    return (
    <div style={{
        textAlign: "center",
        marginTop: "10%",
        marginLeft: "35%",
        color: "#fff"
    }}>
        <img src={NoLikedShop} style={{height: 140, width: "auto"}}/>
    <h4>
       You haven't liked any shop yet.
    </h4>
    </div>
    )
}