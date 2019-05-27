import React from 'react'

export default function Welcome(){


    const welcomeStyle={
        color: "#fff",
        textAlign: "center",
        marginTop: "10%"
    }
    return (
        <div style={welcomeStyle}>
            <h1>Welcome</h1>

            <h4>
                Welcome to Random.shop, a Random name for a Random app! <br/>
                Find the nearest shops and take your pick!
            </h4>
        </div>
    )
}