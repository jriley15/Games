var Vec2D = require('vector2d');

const Player = require('./Player');
const Ball = require('./Ball');
const Map = require('./Map');

class Game {

  constructor() {
    this.players = [];
    this.ball = new Ball(300, 300);
    this.map = new Map(0, 0, 840, 390);
    this.friction = 0.01;
  	this.speed = 3.0;
  	this.acceleration = 0.02;
  	this.shootingPower = 2;
    this.count = 0;
  }



  initialize(io) {

    const me = this;

    io.on('connection', socket => {
      me.addNewPlayer(socket);

      socket.on('movement', function(data) {
        me.updateMovement(socket, data);
      });

      socket.on('disconnect', function(data) {
        me.removePlayer(socket);
      });
    });

    setInterval(() => {
      me.update(io);
    }, 1000 / 60);
  }

  getPlayers() {
    return this.players.values();
  }

  findPlayer(id) {
    return this.players.find( player => player.id === id );
  }

  deletePlayer(id) {
    var index = this.players.findIndex( player => player.id === id);
    this.players.splice(index, 1);
  }

  addNewPlayer(socket) {
    this.count++;
    var player = new Player(100 * this.count, 100 * this.count, socket.id);
    console.log('Haxball: New player: '+player.id);
    this.players.push(player);

  }

  removePlayer(socket) {
    this.deletePlayer(socket.id);
    //delete this.findPlayer(socket.id);
    //delete this.players[socket.id];

  }

  updateMovement(socket, data) {

    var player = this.findPlayer(socket.id);
    if (player) {
      player.left = data.left;
      player.up = data.up;
      player.right = data.right;
      player.down = data.down;

      player.kicking = data.kicking;
    }

  }




  update(io) {

    if (this.players.length > 0) {

      this.players.forEach((player) => {

        //if (player != null) {
          var vx = 0;
          var vy = 0;


          if (player.left) {
            //player.position._x -= this.speed;
            vx -= this.speed;
          }
          if (player.up) {
            //player.position._y -= this.speed;
            vy -= this.speed;
          }
          if (player.right) {
            //player.position._x += this.speed;
            vx += this.speed;
          }
          if (player.down) {
            //player.position._y += this.speed;
            vy += this.speed;
          }

          var v = new Vec2D.Vector(vx, vy);
          if (v.distance(Vec2D.Vector(0, 0)) > 0) {
            v = this.normalize(v).mulS(this.speed);
          }
          player.lastPosition = player.position;
          player.velocity = player.velocity.add(v.subtract(player.velocity).mulS(this.acceleration));
          player.position = player.position.add(player.velocity);

        });

        this.ball.lastPosition = this.ball.position;
        this.ball.velocity = this.ball.velocity.mulS(1 - this.friction);
        this.ball.position = this.ball.position.add(this.ball.velocity);


        this.players.forEach((player) => {
          this.players.forEach((other) => {
              if (player != other) {
                player.uncollide(other);
              }

              this.map.setInsideMap(player, true);
          });

          player.uncollide(this.ball);
          if (player.kicking && player.position.distance(this.ball.position) < (player.radius + this.ball.radius) * 1.4) {
            var ball = new Vec2D.Vector(this.ball.position._x, this.ball.position._y);
            var norm = this.normalize(ball.subtract(player.position));
            this.ball.velocity = this.ball.velocity.add(norm.mulS(this.shootingPower));
          }
        });

        this.map.setInsideMap(this.ball, false);

      }
      io.emit('state', this.players, this.ball);
  }

  normalize(v) {

    var vec = new Vec2D.Vector(v._x, v._y);

    var mag = Math.sqrt(vec._x * vec._x + vec._y * vec._y);

    if (mag === 0) {
      vec._x = 0;
      vec._y = 0;
    } else {
      vec._x = vec._x / mag;
      vec._y = vec._y / mag;
    }

    return vec;
  }

};

module.exports = Game;
