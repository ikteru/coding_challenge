import React from 'react';
import Navbar from './Navbar/Navbar';
import { BrowserRouter, Route, withRouter } from 'react-router-dom';
import { DashboardContainer } from './Dashboard/DashboardContainer';
import Shops from './Shops/Shops';
import authClient from './Auth/Auth';
import Callback from './Auth/Callback'

class App extends React.Component {

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return;
    try {
      await authClient.silentAuth();
      this.forceUpdate();
    } catch (err) {
      if (err.error !== 'login_required') console.log(err.error);
    }
  }

  render(){
    return (
      <BrowserRouter>
        
        <Route exact path='/callback' component={Callback}/>
        
        <Navbar authClient={authClient}/>
        
        <Route path="/" render={ ()=> <DashboardContainer authClient={authClient} />  }></Route>
        <Route path="/shops" render={() => <Shops favorite={false} />}></Route>
        <Route path="/favshops" render={() => <Shops favorite={true} />}></Route>

      </BrowserRouter>
    );
  } 
}

export default withRouter(App);
