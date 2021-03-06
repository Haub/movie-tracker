import React, { Component } from 'react';

import ContentRoute from '../../containers/ContentRoute/';
import FormRoute from '../../containers/UserInputForm/FormRoute';
import './App.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <header className="header">
          <h1 className="title">HANKY PANKY</h1>
          <FormRoute />
        </header>
        <ContentRoute />
      </div>
    );
  }
}

export default App;