var Vec2D = require('vector2d');


class Player {
  constructor(x, y, id) {


    this.position = new Vec2D.Vector(x, y);
    this.velocity = new Vec2D.Vector(0, 0);
    this.lastPosition = new Vec2D.Vector(0, 0);
    this.id = id;
    this.kicking = false;
    this.radius = 15;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;

  }


  uncollide(other) {



    var distance = this.position.distance(other.position);
    var minDist = other.radius + this.radius;

    if (distance <= minDist) {

      var overLap = minDist - distance;

      var test = new Vec2D.Vector(other.position._x, other.position._y).subtract(this.position);

      var direction = this.normalize(test);

      var test2 = new Vec2D.Vector(other.velocity._x, other.velocity._y);

      var sum = test2.add(this.velocity);

      other.position = other.lastPosition;

      var test3 = new Vec2D.Vector(other.velocity._x, other.velocity._y);
      var test4 = new Vec2D.Vector(direction._x, direction._y);

      other.velocity = test3.add(test4.mulS(overLap / 2));

      direction = new Vec2D.Vector(-(direction._x), -(direction._y));
      sum = new Vec2D.Vector(-sum._x, -sum._y);

      var test5 = new Vec2D.Vector(direction._x, direction._y);

      this.position.add(test5.mulS(overLap));


      var test6 = new Vec2D.Vector(direction._x, direction._y);
      //velocity = velocity.add(direction.scalarMultiply(overlap / 2));
      this.velocity = this.velocity.add(test6.mulS(overLap /2));




    }

  }

  negate(v) {
    return new Vec2D.Vector(-v._x, -v._y);
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
module.exports = Player;
