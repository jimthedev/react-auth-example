import React, { Component} from 'react';

export default class Login extends Component {
  render() {
    return (
      <div>
        <h2>Login</h2>
        Welcome to the login page
        <button onClick={this.props.auth.login.bind(this)}>Login</button>
        {this.props.children}
      </div>
    );
  }
}
