import React, { Component } from 'react';
export default class NoMatch extends Component {
  render() {
    return (
      <div>
        No matching route found camper!
        {this.props.children}
      </div>
    );
  }
}
