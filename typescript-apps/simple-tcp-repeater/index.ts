// # ip address for the socket
const HOST: string = 'localhost'; 
// # port number for the socket
const PORT: number = 3001; 


// TypeScript types (just for fun)
type ServerType = {
    listen: (port: number, host: string, callback: { (): void; }) => void; 
};
type SocketType = { 
    setKeepAlive: (enable: boolean, initialDelay: number) => void; 
    on: (event: string, callback: { (dataBuffer: ArrayBuffer): void; }) => void; 
    write: (data: string) => void; 
};
type NetType = {
    createServer: (callback: { (socket: SocketType): void; }) => ServerType; 
};

const net: NetType = require('net');

const server: ServerType = net.createServer(function(socket: SocketType) {
    // Phone Home App can phone at any time
    socket.setKeepAlive(true, 60000);

    // Listen for data 
    socket.on('data', function(dataBuffer: ArrayBuffer) {
        const data: string = dataBuffer + ''; // Change ArrayBuffer to string
        console.log(data);
        // Later on,  I want to be able to kill off Phone Home App
        if (data.trim().toLocaleLowerCase() === 'bye'){
            socket.write('hangup');
        }
        else {
            socket.write('You said "' + data + '"');
        }
    });
});

server.listen(PORT, HOST, function() {
    console.log("listening on " + PORT);
});
