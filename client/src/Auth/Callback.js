import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import authClient from './Auth';

class Callback extends Component {
  async componentDidMount() {
    await authClient.handleAuthentication();
    this.props.history.replace('/');
  }

  render() {
    return (
      <p>Loading profile...</p>
    );
  }
}

export default withRouter(Callback);