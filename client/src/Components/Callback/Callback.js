import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import authClient from '../../Auth/Auth'
import Loader from 'react-loader-spinner'

class Callback extends Component {
  async componentDidMount() {
    await authClient.handleAuthentication();
    this.props.history.replace('/');
  }

  render() {
    return (
      <div style={{textAlign: "center", marginTop: "20%"}}>
        <Loader
          type="Grid"
          color="#EB3349"
          height="100"	
          width="100"
        />
      </div>
      
    );
  }
}

export default withRouter(Callback);