


class Shape {

    constructor(data, color, grid) {
        this.data     = data;
        this.color    = color;
        this.grid     = grid;
        this.rotation = 0;
		this.remove   = false;
		this.x = this.y = 0;
    }

    render = function(ctx) {
		ctx.fillStyle = COLORS[this.color];
		var i, j, x, y, b, d =  this.data[this.rotation];
		for (i = 0; i < 4; i++) {
			x = i + this.x;
			
			for (j = 0; j < 4; j++) {
				b = (i << 2) + j;
				if ((0x1 & d >>> b) == 1) {
					y = j + this.y;
					ctx.fillRect(x * TILE_SIZE + (x << 2) + 2, y * TILE_SIZE + (y << 2) + 2, TILE_SIZE, TILE_SIZE);
				}
			}
		}
	}
	
	moveLeft = function() {
		if (!this.remove && this.canMove(this.x - 1, this.y)) {
			this.x--;
		}
	}

	moveRight = function() {
		if (!this.remove && this.canMove(this.x + 1, this.y)) {
			this.x++;
		}
	}
	
	moveDown = async function() { 
        await 5; 
        this.y++;
    }

	rotateLeft = function() {
		if (!this.remove) {
			var lastRotation = this.rotation;
			this.rotation--;
			if (this.rotation < 0) {
				this.rotation = this.data.length - 1;
			}if (!this.canMove(this.x, this.y)) {
				this.rotation = lastRotation;
			}
		}
	}

	rotateRight = function() {
		if (!this.remove) {
			var lastRotation = this.rotation;
			this.rotation = (this.rotation + 1) % this.data.length;if (!this.canMove(this.x, this.y)) {
				this.rotation = lastRotation;
			}
		}
	}

	canMove = function(x, y) {
		var i, j, x1, y1, b, d = this.data[this.rotation];

		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
                x1 = i + x;
				b = (i << 2) + j;
				if ((0x1 & d >>> b) == 1) {
                    y1 = j + y;
					if(x1 < 0 || x1 > 9 || y1 < 0 || y1 > 19 || this.grid.getTileAt(x1, y1)) {
						return false;
					}
				}
			}
		}
		return true;
	}

}