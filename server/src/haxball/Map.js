var Vec2D = require('vector2d');




class Map {

  constructor (x, y, width, height) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

  }


  setInsideMap(entity, isPlayer) {

    var distance = entity.radius;

    if (entity.position._x - distance < this.x) {

			//if(!isPlayer && entity.position._y > 1/3 * (this.height + this.y) && entity.position._y < 2/3 * (this.height + this.y)) {
				//result = 0;
				//score left side
			//} else {
				if (isPlayer) {
					entity.position = new Vec2D.Vector(distance+this.x, entity.position._y);
					entity.velocity = new Vec2D.Vector(0, entity.velocity._y);
				} else {
					entity.position = new Vec2D.Vector(distance+this.x, entity.position._y);
					entity.velocity = new Vec2D.Vector(-entity.velocity._x, entity.velocity._y);
				}
			//}
		}
		if (entity.position._y - distance < this.y) {
			if (isPlayer) {
				entity.position = new Vec2D.Vector(entity.position._x, distance+this.y);
				entity.velocity = new Vec2D.Vector(entity.velocity._x, 0);
			} else {
				entity.position = new Vec2D.Vector(entity.position._x, distance+this.y);
				entity.velocity = new Vec2D.Vector(entity.velocity._x, -entity.velocity._y);
			}
		}
		if (entity.position._x + distance > this.width) {
			//if(!isPlayer && entity.position._y > 1/3 * (this.height + this.y) && entity.position._y < 2/3 * (this.height + this.y)) {
				//result = 1;
				//score right side

			//} else {
				if (isPlayer) {
					entity.position = new Vec2D.Vector(this.width - distance - 1, entity.position._y);
					entity.velocity = new Vec2D.Vector(0, entity.velocity._y);
				} else {
					entity.position = new Vec2D.Vector(this.width - distance - 1, entity.position._y);
					entity.velocity = new Vec2D.Vector(-entity.velocity._x, entity.velocity._y);
				}
			//}
		}
		if (entity.position._y + distance > this.height) {
			if (isPlayer) {
				entity.position = new Vec2D.Vector(entity.position._x, this.height - distance - this.y);
				entity.velocity = new Vec2D.Vector(entity.velocity._x, 0);
			} else {
				entity.position = new Vec2D.Vector(entity.position._x, this.height - distance - this.y);
				entity.velocity = new Vec2D.Vector(entity.velocity._x, -entity.velocity._y);
			}
		}



  }



};
module.exports = Map;
