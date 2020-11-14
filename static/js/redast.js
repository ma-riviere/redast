export {socket, multiLog, makeTruncater}
let namespace = "/redast";

let socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

socket.on('clients_update', function(count){
    multiLog("Client count updated to : " + count)
});

function multiLog(level="[INFO]", message) {
    socket.emit('log', level + " " + message);
    console.log(level + " " + message);
}

function makeTruncater(decimal) {
  return function (num) {
    return parseFloat(num.toFixed(decimal));
  };
}

multiLog('[DEBUG]', "Redast.js loaded")