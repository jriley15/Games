const express = require('express');
const http = require('http');

const webPort = 8080;
const webApp = express();
const webServer = http.Server(webApp);

const socketPort = 9000;
const socketApp = express();
const socketServer = http.Server(socketApp);

const io = require('socket.io')(socketServer);
const Tetris = require('./tetris/Game');
const Haxball = require('./haxball/Game');


//Web app static server

webApp.use(express.static('../public'));

webApp.get('/tetris', function (req, res) {
    res.sendFile('tetris.html', { root:"../public" } );
})
webApp.get('/haxball', function (req, res) {
    res.sendFile('haxball.html', { root:"../public" } );
})

webServer.listen(webPort, function() {
    console.log('Web server listening on port ' + webPort);
});



//web sockets game server

const tetrisIO = io.of('/tetris');
var tetris = new Tetris();
tetris.initialize(tetrisIO);

const haxballIO = io.of('/haxball');
var haxball = new Haxball();
haxball.initialize(haxballIO);



socketServer.listen(socketPort, function() {
    console.log('Socket server listening on port ' + socketPort);
});
