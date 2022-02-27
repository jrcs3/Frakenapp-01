import React, { Component } from 'react';

const ipcRenderer = require('electron').ipcRenderer;

class  Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {message: "", returnedMessages: [], maxMessageId: 0};
    // I haven't touched React for years, & then I didn't understand it
    // There must be a better way.
    this.handleMessageTextChange = this.handleMessageTextChange.bind(this);
    this.handleMessageKeyDown = this.handleMessageKeyDown.bind(this);
    this.handlePhoneHomeClick = this.handlePhoneHomeClick.bind(this);
    this.SendMessage = this.SendMessage.bind(this);
  }
  
  handleMessageTextChange(event) {
    this.setState({message: event.target.value});
  }

  handleMessageKeyDown(e) {
    if (e.key === 'Enter') {
      this.SendMessage(this.state.message);
    }
  }

  handlePhoneHomeClick () {
    this.SendMessage(this.state.message);
  }

  // This logic is used in 2 places
  SendMessage (messageValue) {
    if (messageValue) {
      console.log(messageValue);
      ipcRenderer.send('phoneHome', messageValue);
      // This does not survive the closure
      const that = this;
      ipcRenderer.once('received-data', function (evt, message) {
        const id = that.state.maxMessageId + 1;
        const newMessages = [...that.state.returnedMessages, 
          {id, content: message}];
        that.setState({returnedMessages: newMessages});
        that.setState({maxMessageId: id});
        that.setState({message: ""});
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
          autoFocus 
        />
        <input 
          type="button" 
          id="phoneHome" 
          value="Phone Home" 
          onClick={this.handlePhoneHomeClick} 
        />
        <br />
        <h2>Incoming Calls</h2>
        {this.state.returnedMessages.map((returnedMessage, i) => (
          <p>{returnedMessage.content}</p>
        ))}
      </div>
    );
  }
}

export default Dialog;
