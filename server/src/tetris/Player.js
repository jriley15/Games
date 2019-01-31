var Vec2D = require('vector2d');
var Grid = require('./Grid');

class Player {
  constructor(id) {

    this.id = id;
    this.grid = new Grid(9, 21);

  }

};


module.exports = Player;
