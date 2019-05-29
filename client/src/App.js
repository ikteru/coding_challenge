import React from 'react';

import { withRouter } from 'react-router-dom';
import DashboardContainer from './Components/Dashboard/DashboardContainer';
import authClient from './Auth/Auth';

//This component is the entry to the application
//it takes care of the authentication 
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
            <DashboardContainer 
              checkingSession={this.state.checkingSession}
              user={user}
              {...this.props}
            />        
        </div>

    );
  } 
}

export default withRouter(App);
