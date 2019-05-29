import React from 'react'
import StoreImg from './store.png'
export default function Welcome(){


    const welcomeStyle={
        color: "#fff",
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.2)",
        marginTop: "10%",
        WebkitBoxShadow : "11px 13px 42px -14px rgba(0,0,0,0.46)",
        MozBoxShadow : "11px 13px 42px -14px rgba(0,0,0,0.46)",
        BoxShadow: "11px 13px 42px -14px rgba(0,0,0,0.46)"
    }
    return (
        <div style={welcomeStyle}>
            <h1>Welcome</h1>

            <h4>
                Welcome to Random.shop, a Random name for a Random app! <br/>
                Find the nearest shops and take your pick!
            </h4>
            <img src={StoreImg} alt=""/>
        </div>
    )
}