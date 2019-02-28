const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
const app = express();

// Certificate
const privateKey = fs.readFileSync('./keys/private.key', 'utf8');
const certificate = fs.readFileSync('./keys/certificate.crt', 'utf8');
const ca = fs.readFileSync('./keys/ca_bundle.crt', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);
const io = require('socket.io')(httpServer);

const Tetris = require('./tetris/Game');
const Haxball = require('./haxball/Game');


app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile('tetris.html', { root:"public" } );
})
app.get('/tetris', function (req, res) {
    res.sendFile('tetris.html', { root:"public" } );
})
app.get('/haxball', function (req, res) {
    res.sendFile('haxball.html', { root:"public" } );
})

const tetrisIO = io.of('/tetris');
var tetris = new Tetris();
tetris.initialize(tetrisIO);

const haxballIO = io.of('/haxball');
var haxball = new Haxball();
haxball.initialize(haxballIO);




httpServer.listen(3001, function() {
    console.log('HTTP server listening on port 3001');
});

/*
httpsServer.listen(443, function() {
    console.log('HTTPS server listening on port 443');
});
*/


