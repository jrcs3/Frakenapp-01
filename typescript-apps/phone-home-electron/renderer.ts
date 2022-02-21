import $ from 'jquery';

function main () {

  $(document).ready(function () {
    // Inter Process Communication module for the renderer process
    const ipcRenderer = require('electron').ipcRenderer;

    // Recieves data from the main process
    ipcRenderer.on('received-data', function (evt, message) {
      $('#received-data-content').append('<p>' + message + '<\p>');
    });

    // Sends data back to the main process'ms
    // when the phoneHome button is clicked
    $('#phoneHome').click(function (event) {
      const messageValue = $('#messageText').val();
      SendMessage(messageValue);
    });

    // I'm tired of having to click the button
    $('#messageText').keypress(function (event) {
      const keycode = (event.keyCode ? event.keyCode : event.which);
      if ((keycode + 0) === 13) {
        const messageValue = $('#messageText').val();
        SendMessage(messageValue);
      }
      event.stopPropagation();
    });

    // This logic is used in 2 places
    function SendMessage (messageValue) {
      if (messageValue) {
        ipcRenderer.send('phoneHome', messageValue);
        $('#messageText').val('');
      }
    }

    // I'm tired of having to click on the message box to get started
    $('#messageText').focus();
  });
}

main();
