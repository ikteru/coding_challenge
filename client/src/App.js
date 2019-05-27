import React from 'react';

import { withRouter } from 'react-router-dom';
import DashboardContainer from './Components/Dashboard/DashboardContainer';
import authClient from './Auth/Auth';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      checkingSession: true,
    }
  }
  
  async componentDidMount() {

    if (this.props.location.pathname === '/callback') {
      this.setState({checkingSession:false});
      return;
    }

    if(this.props.location.pathname === '/callback ') return;
    try {
      await authClient.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    
    this.setState({checkingSession:false});

  }

  render(){

    // Alert provider configurations
    const options = {
      position: positions.BOTTOM_CENTER,
      timeout: 5000,
      offset: '30px',
      transition: transitions.SCALE
    }

    //Get the user profile from Auth0 and construct a simple user object
    const { getProfile } = authClient;
    const userAuthProfile = getProfile();
    
    let user = {}

    if( userAuthProfile ){

      user = {
          userId: userAuthProfile.sub,
          name: userAuthProfile.name,
          nickname: userAuthProfile.nickname
      }
    }

    return (
        <div>

          {/* <Route path="/" render={ ()=> <DashboardContainer authClient={authClient} /> } /> */}
          {/* <SecuredRoute path="/" exact render={(props) => <DashboardContainer {...props} />} checkingSession={this.state.checkingSession} /> */}
          <AlertProvider template={AlertTemplate} {...options}>
            <DashboardContainer 
              checkingSession={this.state.checkingSession}
              user={user}
            />
          </AlertProvider>
        
        </div>

    );
  } 
}

export default withRouter(App);
