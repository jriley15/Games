var Vec2D = require('vector2d');



class Ball {

  constructor (x, y) {

    this.position = new Vec2D.Vector(x, y);
    this.velocity = new Vec2D.Vector(0, 0);
    this.lastPosition = new Vec2D.Vector(0, 0);
    this.radius = 10;


  }





};
module.exports = Ball;
