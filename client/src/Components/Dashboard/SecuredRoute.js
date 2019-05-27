import React from 'react';
import {Route} from 'react-router-dom';
import authClient from '../../Auth/Auth';
import Loader from 'react-loader-spinner'

function SecuredRoute(props) {
  const {render, path, checkingSession} = props;
  const { isAuthenticated, signIn } = authClient;
  
  return (
    <Route path={path} render={(props) => {
        if (checkingSession) return (
          <div style={{textAlign: "center", marginTop: "20%"}}>
            <Loader
              type="Grid"
              color="#fff"
              height="100"	
              width="100"
            />
          </div>
        );
        if (!isAuthenticated()) {
          signIn();
          return <div></div>;
        }
        return render(props)
    }} />
  );
}

export default SecuredRoute;