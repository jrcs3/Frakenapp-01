document.addEventListener('DOMContentLoaded', function () {
    // Inter Process Communication module for the renderer process
    const ipcRenderer = require('electron').ipcRenderer;

    // Recieves data from the main process   
    ipcRenderer.on('received-data', function (evt, message) {
        const newElement: HTMLElement = document.createElement('p');
        newElement.textContent = message;
        document.getElementById("received-data-content").appendChild(newElement);
    });
    
    // Sends data back to the main process'ms
    // when the phoneHome button is clicked
    document.getElementById('phoneHome').addEventListener('click', function (event) {
        const messagecontrol: HTMLInputElement = document.getElementById('messageText') as HTMLInputElement;
        const messageValue: String = messagecontrol.value;
        if (messageValue){
            ipcRenderer.send('phoneHome', messageValue);
            messagecontrol.value = "";
        }
    });
});
