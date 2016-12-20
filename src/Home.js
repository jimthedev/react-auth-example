import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import ProfileCard from './ProfileCard';
export default class Home extends Component {
  onLogoutClick() {
    this.props.auth.logout();
    browserHistory.push('login')
  }
  render() {
    let profile = this.props.auth.getProfile();
    return (
      <div>
        <div style={{
          margin: 30
        }}>
          {this.props.auth.loggedIn() ? <ProfileCard name={profile.name} picture={profile.picture}>
            <button style={{
              borderLeft: '1px solid #ddd',
              borderRight: '0px solid #ddd',
              borderTop: '1px solid #ddd',
              borderBottom: '0px solid #ccc',
              borderRadius: '10px 10px 10px 10px ',
              display: 'inline-block',
              boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.2)',
              paddingLeft: 30,
              paddingRight: 30,
              marginTop: 20,
              cursor: 'pointer',
              fontSize: 18,
              backgroundColor: 'white'
            }} onClick={this.onLogoutClick.bind(this)}>Log out</button>
          </ProfileCard> : null}
        </div>
        {this.props.children}
      </div>
    );
  }
}
