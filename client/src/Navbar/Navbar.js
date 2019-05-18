import React from 'react';
import {Link, withRouter } from 'react-router-dom';
import authClient from '../Auth/Auth';

function NavBar(props) {

    const signOut = () => {
        authClient.signOut();
        props.history.replace('/');
    };

    const { isAuthenticated, signIn, getProfile } = authClient;
    console.log("Profile: ", getProfile() );
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                <Link className = "navbar-brand" style={{fontSize: "1.3rem"}} to="/">iShop</Link>
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/nearbyShops">Shops</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/likedShops">Favorite Shops</Link>
                    </li>
                    {
                        !isAuthenticated() &&
                        <button className="btn btn-dark" onClick={signIn}>Sign In</button>
                    }
                    {
                        isAuthenticated() &&
                        <div>
                            <label className="mr-2 text-white">{getProfile().name}</label>
                            <button className="btn btn-dark" onClick={signOut}>Sign Out</button>
                        </div>
                    }

                </ul>
            </div>
        </nav>
    );
}

export default withRouter(NavBar);