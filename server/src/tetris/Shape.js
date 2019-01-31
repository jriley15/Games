var Vec2D = require('vector2d');

class Shape {

  constructor (id, x, y, coords, color, type, size) {

    this.id = id;
    this.x = x;
    this.y = y;
    this.coords = coords;
    this.color = color;
    this.type = type;
    this.size = size;

  }


  getCoord(c) {

    var index = this.coords.indexOf(c);
    return this.coords[index];

  }

  checkCollision(shape) {

    var collision = false;

    shape.coords.forEach((coordinate) => {
      this.coords.forEach((coord) => {
        if (coord._x == coordinate._x && coord._y == coordinate._y) {
          collision = true;
        }
      });
    });

    return collision;
  }

  isNull() {

    return (this.coords.length == 0);

  }



  getCopy() {

    var coords = [];
    this.coords.forEach((coordinate) => {
      coords.push(new Vec2D.Vector(coordinate._x, coordinate._y));
    });
    var x = this.x;
    var y = this.y;
    var color = this.color;

    return new Shape(this.id, x, y, coords, color, this.type, this.size);
  }









};
module.exports = Shape;
