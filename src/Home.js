import React, { Component } from 'react';
import {browserHistory} from 'react-router';
export default class Home extends Component {
  onLogoutClick() {
    this.props.auth.logout();
    browserHistory.push('login')
  }
  render() {
    let profile = this.props.auth.getProfile();
    return (
      <div>
        Welcome to the home page
        {this.props.auth.loggedIn() ? <button onClick={this.onLogoutClick.bind(this)}>Log out</button> : null}
        {this.props.auth.loggedIn() ? <div>
          {profile.name}
          <img src={profile.picture} />
        </div> : null}
        {this.props.children}
      </div>
    );
  }
}
