var net = require('net');

type SocketType = { 
    setKeepAlive: (enable: boolean, initialDelay: number) => void; 
    on: (event: string, callback: { (dataBuffer: ArrayBuffer): void; }) => void; 
    write: (data: string) => void; 
};

var server = net.createServer(function(socket: SocketType){
    socket.setKeepAlive(true, 60000);

    socket.on('data', function(dataBuffer: ArrayBuffer) {
        const data = dataBuffer + '';
        console.log(data);
        if (data.trim().toLocaleLowerCase() === 'bye'){
            socket.write('hangup');
        }
        else{
            socket.write('You said "' + data + '"');
        }
    });
    socket.on('end', function(dataBuffer: ArrayBuffer){
        
    });
});

server.listen(3001, 'localhost', function(){
    console.log("listening on 3001");
});
