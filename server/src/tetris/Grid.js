const Vec2D = require('vector2d');
const Shape = require('./Shape');


class Grid {

  constructor (width, height) {


    this.width = width;
    this.height = height;

    this.shapes = [];
    this.activeShape = this.generateNewShape();
    this.index = 0;

    this.upcomingShapes = [];

    for (var i = 0; i < 5; i++) {
      this.upcomingShapes.push(this.generateNewShape());
    }

    this.savedShape = null;
    this.canSave = true;

  }

  rotateShape() {
    //hotfix for yellow square
    if (this.activeShape.color == 'yellow') {
      return;
    }

    var newShape = this.activeShape.getCopy();
    for (var i = 0; i < newShape.coords.length; i++) {
        var x = newShape.x;
        var y = newShape.y;
        newShape.coords[i] = this.rotateVector(x, y, 90, newShape.coords[i]);
    }

    var collision = this.collision(newShape);


    if (collision) {
      //algorithm to alter x left or right and find new valid rotation point


      //create new shape with coords to the right and rotated
      //check collision
      //if doesn't work, try further right and check again
      //if doesn't work, try left

      var solved = false;
      for (var x = 1; x <= this.activeShape.size; x++) {

        var newShape = this.activeShape.getCopy();
        newShape.x += x;
        newShape.coords.forEach((coordinate) => {
          coordinate._x += x;
        });

        for (var i = 0; i < newShape.coords.length; i++) {
            var x = newShape.x;
            var y = newShape.y;
            newShape.coords[i] = this.rotateVector(x, y, 90, newShape.coords[i]);
        }

        var collision = this.collision(newShape);

        if (!collision) {
          this.activeShape = newShape;
          solved = true;
          return;
        }
      }

      for (var x2 = 0; x2 >= -this.activeShape.size; x2--) {

        var newShape = this.activeShape.getCopy();
        newShape.x += x2;
        newShape.coords.forEach((coordinate) => {
          coordinate._x += x2;
        });

        for (var i = 0; i < newShape.coords.length; i++) {
            var x = newShape.x;
            var y = newShape.y;
            newShape.coords[i] = this.rotateVector(x, y, 90, newShape.coords[i]);
        }

        var collision = this.collision(newShape);

        if (!collision) {
          this.activeShape = newShape;
          return;
        }

      }


    } else {
      this.activeShape = newShape;
    }
  }

  rotateVector(cx, cy, angle, v2)
  {
    angle = angle * (Math.PI/180);
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    // translate point back to origin:
    v2._x -= cx;
    v2._y -= cy;
    // rotate point
    var xnew = Math.round(10000 * (v2._x * c - v2._y * s) / 10000);
    var ynew = Math.round(10000 * (v2._x * s + v2._y * c) / 10000);
    // translate point back:
    v2._x = (xnew + cx);
    v2._y = (ynew + cy);
    return v2;
  }

  collision(newShape) {
    var collision = false;
    this.shapes.forEach((shape) => {
      if (newShape.checkCollision(shape)) {
        collision = true;
        return true;
      }
    });
    newShape.coords.forEach((coordinate) => {
      if (coordinate._x < 0 || coordinate._x > this.width || coordinate._y > this.height) {
        collision = true;
        return true;
      }
    });
    return collision;
  }

  deleteShape(id) {
    var index = this.shapes.findIndex( shape => shape.id === id);
    this.shapes.splice(index, 1);
  }

  clearLines() {

    //initialize row array to 0 count
    var rows = {};
    for (var i = 0; i <= this.height; i++) {
      rows[i] = 0;
    }

    //set all row counts
    this.shapes.forEach((shape) => {
      shape.coords.forEach((coord) => {
        rows[coord._y]++;
      });
    });

    //loop through all rows, beginning at the top down
    for (var row = 0; row <= this.height; row++) {

      //row is complete
      if (rows[row] > this.width) {

        //removes cords from all shapes that are in this row
        for (var i = 0; i < this.shapes.length; i++) {
          var toSplice = [];
          for (var j = 0; j < this.shapes[i].coords.length; j++) {
            if (this.shapes[i].coords[j]._y == row) {
              toSplice.push(j);
            }
          }
          var spliced = 0;
          toSplice.forEach((id) => {
              this.shapes[i].coords.splice(id-spliced, 1);
              spliced++;
          });
        }

        //remove all shapes from shapes[] array that have their coords completely removed
        this.shapes.forEach((shape) => {
          if (shape.isNull()) {
            this.deleteShape(shape.id);
          }
        });

        //loop through every shape and move it's y coords down if it's above the currently being removed rows
        for (var i = 0; i < this.shapes.length; i++) {

          var above = false;
          for (var j = 0; j < this.shapes[i].coords.length; j++) {
            if (this.shapes[i].coords[j]._y <= row) {
              this.shapes[i].coords[j]._y++;
              above = true;
            }
            if (above) {
              this.shapes[i].y++;
            }
          }
        }
      }
    }
  }


  handleControls(data) {

    if (data.left) {
      this.moveShape(-1, 0);
    }
    if (data.right) {
      this.moveShape(1, 0);
    }
    if (data.down) {
      this.moveShape(0, 1);
    }
    if (data.space) {
      this.dropShape();
    }
    if (data.up) {
      this.rotateShape();
    }
    if (data.c) {
      this.saveShape();
    }
  }

  saveShape() {
    if (this.canSave) {
      var active = this.activeShape.getCopy();

      //check if there's an existing shape savedShape
      //if there is, swap the two and reset the coords on the current active
      //if there isn't, save the current shape and generate a fresh one for the active

      if (this.savedShape) {
        this.activeShape = this.savedShape;
        this.savedShape = this.getShapeData(active.type);
      } else {
        this.savedShape = this.getShapeData(active.type);
        this.newShape();
      }
      this.canSave = false;
    }
  }

  moveShape(x, y) {

    //check for collision with any shapes[]
    //or bounds
    //if collision, add active shape to shapes[]
    //and set active shape to null



    var coords = this.activeShape.coords;
    var newCoords = [];

    coords.forEach((coordinate) => {
      newCoords.push(new Vec2D.Vector(coordinate._x+x, coordinate._y+y));
    });

    var newShape = new Shape(this.activeShape.id, this.activeShape.x+x, this.activeShape.y+y, newCoords, this.activeShape.color, this.activeShape.type, this.activeShape.size);


    var collision = this.collision(newShape);


    if (collision) {
      //new position would collide, do nothing
    } else {
      //move request granted
      this.activeShape = newShape;
    }
  }

  forceShape(x, y) {

    //check for collision with any shapes[]
    //or bounds
    //if collision, add active shape to shapes[]
    //and set active shape to null

    var coords = this.activeShape.coords;
    var newCoords = [];

    coords.forEach((coordinate) => {
      newCoords.push(new Vec2D.Vector(coordinate._x+x, coordinate._y+y));
    });

    var newShape = new Shape(this.activeShape.id,this.activeShape.x+x, this.activeShape.y+y, newCoords, this.activeShape.color, this.activeShape.type, this.activeShape.size);

    var collision = this.collision(newShape);

    if (collision) {
      //console.log('collision');
      this.shapes.push(this.activeShape.getCopy());

      //restart game
      this.activeShape.coords.forEach((coordinate) => {
        if (coordinate._y == 0) {
          this.shapes = [];
        }
      });

      //generate new shape
      this.newShape();
      this.clearLines();
      this.canSave = true;
    } else {
      this.activeShape = newShape;
    }
  }


  newShape() {

    this.activeShape = this.upcomingShapes.shift();
    this.upcomingShapes.push(this.generateNewShape());

  }

  generateNewShape() {

    var random = Math.floor(Math.random() * 7);
    var shape = this.getShapeData(random);

    this.index++;

    return shape;
  }


  getShapeData(type) {

    var x = 0;
    var y = 0;
    var coords = [];
    var shape = null;

    switch (type) {
      case 0:
        x = 4;
        y = 0;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x, y+1));
        coords.push(new Vec2D.Vector(x+1, y));
        coords.push(new Vec2D.Vector(x+1, y+1));
        shape = new Shape(this.index, x, y, coords, 'yellow', type, 0);
      break;
      case 1:
        x = 4;
        y = 0;
        coords.push(new Vec2D.Vector(x-1, y));
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x+1, y));
        coords.push(new Vec2D.Vector(x+2, y));
        shape = new Shape(this.index, x, y, coords, 'cyan', type, 2);
      break;
      case 2:
        x = 4;
        y = 0;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x, y+1));
        coords.push(new Vec2D.Vector(x-1, y+1));
        coords.push(new Vec2D.Vector(x+1, y));
        shape = new Shape(this.index, x, y, coords, 'green', type, 1);
      break;
      case 3:
        x = 4;
        y = 0;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x-1, y));
        coords.push(new Vec2D.Vector(x, y+1));
        coords.push(new Vec2D.Vector(x+1, y+1));
        shape = new Shape(this.index, x, y, coords, 'red', type, 1);
      break;
      case 4:
        x = 4;
        y = 1;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x-1, y));
        coords.push(new Vec2D.Vector(x, y-1));
        coords.push(new Vec2D.Vector(x+1, y));
        shape = new Shape(this.index, x, y, coords, 'purple', type, 1);
      break;
      case 5:
        x = 4;
        y = 1;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x-1, y));
        coords.push(new Vec2D.Vector(x-1, y-1));
        coords.push(new Vec2D.Vector(x+1, y));
        shape = new Shape(this.index, x, y, coords, 'blue', type, 2);
      break;
      case 6:
        x = 4;
        y = 1;
        coords.push(new Vec2D.Vector(x, y));
        coords.push(new Vec2D.Vector(x-1, y));
        coords.push(new Vec2D.Vector(x+1, y));
        coords.push(new Vec2D.Vector(x+1, y-1));
        shape = new Shape(this.index, x, y, coords, 'orange', type, 2);
      break;
    }
    return shape;

  }

  dropShape() {
    //loop through shapes to find drop point
    //set current shape position to new coords
    //add current shape to shapes array
    //set current shape to null

    for (var y = 0; y < this.height; y++) {

      var newShape = this.activeShape.getCopy();
      newShape.y += y;
      newShape.coords.forEach((coordinate) => {
        coordinate._y += y;
      });

      var collision = this.collision(newShape);

      if (collision) {
        newShape._y--;
        newShape.coords.forEach((coordinate) => {
          coordinate._y--;
        });
        this.shapes.push(newShape);
        //this.generateNewShape();
        this.newShape();
        this.clearLines();
        this.canSave = true;
        break;

      }
    }
  }
};

module.exports = Grid;
