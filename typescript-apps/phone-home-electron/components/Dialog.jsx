import React, { Component } from 'react';

const ipcRenderer = require('electron').ipcRenderer;

class Dialog extends Component {
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
      // Send the message home, the Main process will send it on
      ipcRenderer.send('phoneHome', messageValue);
      // This does not survive the closure
      const myComponent = this;
      // Get the response back from the Main process
      // once recieves a single message, it is like a one time on(). 
      ipcRenderer.once('received-data', function (evt, message) {
        // Add this item to returnedMessages, React will rerender the UI
        const id = myComponent.state.maxMessageId + 1;
        const newMessages = [...myComponent.state.returnedMessages, 
          {id, content: message}];
        myComponent.setState({returnedMessages: newMessages});
        myComponent.setState({maxMessageId: id});
        // Clear the phoneHome textBox
        myComponent.setState({message: ""});
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
