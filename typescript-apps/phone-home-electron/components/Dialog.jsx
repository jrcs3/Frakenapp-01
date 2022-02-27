import React, { useState, Component } from 'react';
import ReactDOM from 'react-dom';

const ipcRenderer = require('electron').ipcRenderer;

class  Dialog extends Component {

  constructor(props) {
    super(props);
    this.state = {message: "", returnedMessages: [], maxMessageId: 0};
    this.handleMessageTextChange = this.handleMessageTextChange.bind(this);
    this.SendMessage = this.SendMessage.bind(this);
    this.handlePhoneHomeClick = this.handlePhoneHomeClick.bind(this);
    this.notify = this.notify.bind(this);
    this.handleMessageKeyDown = this.handleMessageKeyDown.bind(this);
  }

  notify(message) {
    console.log(message);
  }
  
  //let messageText = '';
  
  handlePhoneHomeClick () {
    this.SendMessage(this.state.message);
    this.setState({message: ""});
    //this.state.message = '';
  }

  handleMessageTextChange(event) {
    //console.log(event.target.value);
    this.setState({message: event.target.value});
  }

  handleMessageKeyDown(e) {
    if (e.key === 'Enter') {
      this.SendMessage(this.state.message);
      this.setState({message: ""});
    }
  }

  // This logic is used in 2 places
  SendMessage (messageValue) {
    if (messageValue) {
      console.log(messageValue);
      ipcRenderer.send('phoneHome', messageValue);
      //$('#messageText').val('');
      //debugger;
      const that = this;
      ipcRenderer.once('received-data', function (evt, message) {
        //this.notify(message);
        //debugger;
        const id = that.state.maxMessageId + 1;
        const newMessages = [...that.state.returnedMessages, {id, content: message}];
        that.setState({returnedMessages: newMessages});
        that.setState({maxMessageId: id});
        console.log(`response: ${message}`);
      });  
    }
  }

  render() {
    return (
      <div>
        <input 
          type="text" 
          id="messageText" 
          name="messageText" 
          value={this.state.message} 
          onChange={this.handleMessageTextChange}
          onKeyDown={this.handleMessageKeyDown} 
          autoFocus/>
        <input 
          type="button" 
          id="phoneHome" 
          value="Phone Home" 
          onClick={this.handlePhoneHomeClick} />
        <br />
        <h2>Incoming Calls</h2>
        {this.state.returnedMessages.map((returnedMessage, i) => (
          <p>{returnedMessage.content}</p>
        ))}
      </div>
    );
  }
}


//export default Dialog;

ReactDOM.render(
  <Dialog />,
  //React.createElement(dialog),
  document.getElementById('received-data-content')
);
