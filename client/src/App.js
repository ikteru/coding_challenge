import React from 'react';
import NewNavbar from './Navbar/NewNavbar';
import Navbar from './Navbar/Navbar';

import { BrowserRouter, Route, withRouter } from 'react-router-dom';
import { DashboardContainer } from './Dashboard/DashboardContainer';
import authClient from './Auth/Auth';
import Callback from './Auth/Callback';
import SecuredRoute from './Auth/SecuredRoute';

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

    if (this.props.location.pathname === '/callback') return;
    try {
      await authClient.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
    
    this.setState({checkingSession:false});

  }

  render(){
    return (
        <div>

          {/* <Route path="/" render={ ()=> <DashboardContainer authClient={authClient} /> } /> */}
          {/* <SecuredRoute path="/" exact render={(props) => <DashboardContainer {...props} />} checkingSession={this.state.checkingSession} /> */}
          <DashboardContainer />
        </div>

    );
  } 
}

export default withRouter(App);
