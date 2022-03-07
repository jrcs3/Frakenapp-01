import Dialog from './components/Dialog.jsx';
import React  from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(
  // Couldn't get "<React />" to work with TypeScript
  React.createElement(Dialog),
  document.getElementById('app-content')
);
