import React, { Component } from 'react';
import {browserHistory} from 'react-router';
import axios from 'axios';
import ProfileCard from './ProfileCard';

const buttonStyle = {
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
};

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      firstName: '',
      lastName: ''
    }
  }
  componentDidMount() {
    this.getContacts();
  }
  getContacts() {
    var token = this.props.auth.getToken();
    axios.get('http://localhost:3001/api/contacts', { headers:{
      authorization: 'Bearer ' + token
    }})
      .then((response) => {
        this.setState({
          contacts: response.data
        })
      })
  }
  onNewContactClick() {
    var token = this.props.auth.getToken();
    const last = this.state.lastName;
    const first = this.state.firstName;
    console.log(first, last);
    axios.post('http://localhost:3001/api/contacts', {last, first}, { headers: {
      authorization: 'Bearer ' + token
    }})
      .then((response) => {
        this.getContacts();
      })
    
  }
  onFirstNameChange(e) {
    this.setState({
      firstName: e.target.value
    })
  }
  onLastNameChange(e) {
    this.setState({
      lastName: e.target.value
    })
  }
  onLogoutClick() {
    this.props.auth.logout();
    browserHistory.push('login')
  }
  onContactDeleteClick(contact, e) {
    var token = this.props.auth.getToken();
    axios.delete('http://localhost:3001/api/contacts/' + contact.id, { headers: {
      authorization: 'Bearer ' + token
    }}).then(()=>{
      this.getContacts();
    });
  }
  render() {
    let profile = this.props.auth.getProfile();
    return (
      <div>
        <div style={{
          margin: 30
        }}>
          {this.props.auth.loggedIn() ? <ProfileCard name={profile.name} picture={profile.picture}>
          <hr />
            {this.state.contacts.length > 0 ? <h5>Contacts</h5> : <span>Could not find any contacts</span>}
            <ul>
              {this.state.contacts.map((contact, index) => {
                return <li key={index}>{contact.firstName + ' ' + contact.lastName} <button onClick={this.onContactDeleteClick.bind(this, contact)}>Delete</button></li>
              })}
            </ul>
            <input type="text" placeholder="First name" onChange={this.onFirstNameChange.bind(this)} value={this.state.firstName} />
             <input type="text" placeholder="First name" onChange={this.onLastNameChange.bind(this)} value={this.state.lastName} />
            <button style={buttonStyle} onClick={this.onNewContactClick.bind(this)}>New Contact</button>
            <button style={buttonStyle} onClick={this.onLogoutClick.bind(this)}>Log out</button>
          </ProfileCard> : null}
        </div>
        {this.props.children}
      </div>
    );
  }
}
