import React from 'react';
import {Route} from 'react-router-dom';
import authClient from './Auth';

function SecuredRoute(props) {
  const {render, path, checkingSession} = props;
  const { isAuthenticated, signIn } = authClient;
  
  return (
    <Route path={path} render={(props) => {
        if (checkingSession) return <h3 className="text-center">Validating session...</h3>;
        if (!isAuthenticated()) {
          signIn();
          return <div></div>;
        }
        return render(props)
    }} />
  );
}

export default SecuredRoute;