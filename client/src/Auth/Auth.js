import auth0 from 'auth0-js';
import {
  AUTH0_DOMAIN, 
  AUTH0_AUDIENCE, 
  AUTH0_CLIENT_ID,
  AUTH0_REDIRECT_URI,
  AUTH0_RESPONSE_TYPE,
  AUTH0_SCOPE   
} from '../configs';


//This is where I initialize the Auth0 
class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: AUTH0_DOMAIN,
      audience: AUTH0_AUDIENCE,
      clientID: AUTH0_CLIENT_ID,
      redirectUri: AUTH0_REDIRECT_URI,
      responseType: AUTH0_RESPONSE_TYPE,
      scope: AUTH0_SCOPE
    });

    this.getProfile = this.getProfile.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getIdToken() {
    return this.idToken;
  }

  isAuthenticated() {
    return new Date().getTime() < this.expiresAt;
  }

  signIn() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    return new Promise((resolve, reject) => {
      this.auth0.parseHash((err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.setSession(authResult);
        resolve();
      });
    })
  }

  setSession(authResult) {
    this.idToken = authResult.idToken;
    this.profile = authResult.idTokenPayload;
    // set the time that the id token will expire at
    this.expiresAt = authResult.idTokenPayload.exp * 1000;
  }

  signOut() {
    this.auth0.logout({
      returnTo: "http://localhost:3000",
      clientID: AUTH0_CLIENT_ID,
    });
  }

  silentAuth() {
    return new Promise((resolve, reject) => {
      this.auth0.checkSession({}, (err, authResult) => {
        if (err) return reject(err);
        this.setSession(authResult);
        resolve();
      });
    });
  }
}

const authClient = new Auth();

export default authClient;