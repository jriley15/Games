var Vec2D = require('vector2d');

const Player = require('./Player');
const Grid = require('./Grid');
const Shape = require('./Shape');

class Game {

  constructor() {

    //rooms



    this.players = [];

  }

  initialize(io) {

    var self = this;

    io.on('connection', socket => {

        self.addNewPlayer(socket);

        var player = self.findPlayer(socket.id);

        socket.on('controls', function(data) {
          player.grid.handleControls(data);
        });

        socket.on('disconnect', function(data) {
          self.removePlayer(socket);
          clearInterval(intervalId);
          clearInterval(shapeInterval);
        });

        var intervalId = setInterval(function(){
          io.to(socket.id).emit('state', player.grid);
        }, 1000/60);

        var shapeInterval = setInterval(function(){
          player.grid.forceShape(0, 1);
        }, 1000);

    });
  }

  findPlayer(id) {
    return this.players.find( player => player.id === id );
  }

  deletePlayer(id) {
    var index = this.players.findIndex( player => player.id === id);
    this.players.splice(index, 1);
  }

  addNewPlayer(socket) {
    var player = new Player(socket.id);
    console.log('Tetris: New player: '+player.id);
    this.players.push(player);

  }

  onClick(socket, data) {


  }

  removePlayer(socket) {
    this.deletePlayer(socket.id);
  }


}


module.exports = Game;
