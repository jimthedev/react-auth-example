import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    // Append some auth information into props
    let children = null;
    if (this.props.children) {
      children = React.cloneElement(this.props.children, {
        auth: this.props.route.auth //sends auth instance from route to children
      })
    }
    return (
      <div className="App">
        {children}
      </div>
    );
  }
}

export default App;
