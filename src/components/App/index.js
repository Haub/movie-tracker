import React, { Component } from 'react';

import ContentRoute from '../../containers/ContentRoute/';
import UserInputForm from '../../containers/UserInputForm/';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <UserInputForm />
        <ContentRoute />
      </div>
    );
  }
}

export default App;