import React, { Component } from 'react';
export default class ProfileCard extends Component {
  render() {
    return (
      <div style={{
        borderLeft: '2px solid #efefef',
        borderRight: '2px solid #efefef',
        borderTop: '2px solid #efefef',
        borderBottom: '2px solid #efefef',
        display: 'inline-block',
        padding: 30,
        backgroundColor: 'white'
      }}>
        <div style={{
          margin: '10px auto',
          display:'flex',
          borderRadius: '50%',
          width: 40,
          height: 40,
          flexDirection: 'column-reverse',
          background: 'url(' + (this.props.picture ? this.props.picture : 'https://image.freepik.com/free-icon/anonymous-avatar-information-button_318-32279.jpg') + ') no-repeat center center',
          backgroundSize: 'cover'
        }}>
        </div>
        <div style={{
          color: '#333'
        }}>{this.props.name}</div>
        {this.props.children}
      </div>
    );
  }
}
