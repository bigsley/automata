import React from 'react';
import ReactDOM from 'react-dom';
import GridInputController from '../GridInputController/index.jsx';

class App extends React.Component {
  render() {
    return (
      <GridInputController />
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
