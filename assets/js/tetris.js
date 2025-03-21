



const SHAPES = [
    [1632],
    [8738, 3840, 17476, 240],
    [610, 114, 562, 624],
    [802, 1136, 550, 113],
    [1570, 116, 547, 368],
    [561, 864, 1122, 54],
    [306, 1584, 612, 99]
]


const COLORS = ["#111", "#00a300", "#9f00a7", "#603cba", "#ffc40d", "#ee1111", "#99b433", "#ff0096"];


let dw = 360;
let dh = 760;


class Tetris extends Loop {

    constructor() {
        super();
        this.score = 0;
        this.level = 1;
        this.currentShape = null;
        this.time = 0;
        this.keyLeft = new Key(0.15);
        this.keyRight = new Key(0.15);
        this.keyDown = new Key(0.20);
        this.keyUp = new Key();
    }


    create = function (parent) {
        try {
            this.canvas = document.createElement("canvas");
            this.canvas.style.width = "100%";
            this.canvas.style.height = "100%";
            parent.appendChild(this.canvas);

            window.addEventListener('keydown', this.inputHandler.bind(this), false);
            window.addEventListener('keyup', this.inputHandler.bind(this), false);

            let self = this;
            let resize = function () {
                self.canvas.width = dw;
                self.canvas.height = dh;
            }
            window.onresize = resize;
            resize();
            this.running = true;

            this.restart();
            this.start(function (dt) {
                self.update(dt);
                self.render(self.canvas.getContext("2d"));
            }, 60);
        } catch (e) {
            console.error("Error during canvas setup:", e);
        }
    }

    inputHandler = function(e) {

        let code = e.keyCode;
        let down = e.type == "keydown";
        let prevent = false;
        switch(code) {
            case 32:
                if(this.gameOver && !down) {
                    this.restart();
                }
                prevent = true;
                break;
            case 37:
                this.updateKeyState(this.keyLeft, down);
                break;
            case 39:
                this.updateKeyState(this.keyRight, down);
                break;
            case 40:
                this.updateKeyState(this.keyDown, down);
                prevent = true;
                break;
            case 38:
                this.updateKeyState(this.keyUp, down)
                break;
        }
        if(prevent) e.preventDefault();
    }

    
    updateKeyState = function (key, down) {
        if (down && key.isReleased()) {
            key.setState(JUST_PRESSED);
        }
        else if (!down) {
            key.setState(RELEASED);
        } 
    }

    update = function (deltaTime) {
        if (this.gameOver) return;
    
        if (!this.currentShape || this.currentShape.remove) {
            this.spawnNewShape();
        }
    
        this.updateTime(deltaTime);
        this.handleInput(deltaTime);
    };
    
    spawnNewShape = function () {
        let lines = this.grid.checkLines();
        if (lines > 0) {
            this.score += lines * 100;
            if (this.score > this.level * 1000) {
                this.level++;
            }
        }
    
        let shapeId = Math.floor(Math.random() * 7);
        this.currentShape = new Shape(SHAPES[shapeId], shapeId + 1, this.grid);
        this.currentShape.x = 3;
        this.time = 0;
    
        if (!this.currentShape.canMove(this.currentShape.x, this.currentShape.y)) {
            this.gameOver = true;
        }
    };
    
    updateTime = function (deltaTime) {
        if (this.time > 1) {
            this.time = 0;
            this.currentShape.moveDown();
        } else {
            this.time += deltaTime * this.level;
        }
    };
    
    handleInput = function (deltaTime) {
        const keys = [
            { key: this.keyLeft, action: () => this.currentShape.moveLeft() },
            { key: this.keyRight, action: () => this.currentShape.moveRight() },
            { key: this.keyDown, action: () => { this.time = 0; this.currentShape.moveDown(); } },
            { key: this.keyUp, action: () => this.currentShape.rotateRight() }
        ];
    
        for (const { key, action } of keys) {
            if (key.isJustPressed() || key.isHoldDown()) {
                key.setState(PRESSED);
                action();
            }   
            if (key.isPressed() && key == this.keyDown) {
                key.addHoldDownTime(deltaTime * 10 * this.level);
            }
            if (key.isPressed()) {
                key.addHoldDownTime(deltaTime * this.level);
            }
        }
    };
    

    render = function (ctx) {

        ctx.fillStyle = "#040404"; // black
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.grid.render(ctx);
        if (this.currentShape != null) this.currentShape.render(ctx);
        ctx.font = '20px sans-serif';
        ctx.fillStyle = "#808080"; // gray
        ctx.fillText("Score: " + this.score, 10, dh - 15);
        ctx.fillText("Level: " + this.level, dw - 80, dh - 15);

        if (this.gameOver) {
            let text = "Press Space";
            let dimensions = ctx.measureText(text);
            ctx.fillText(text, dw * 0.5 - dimensions.width * 0.5, dh * 0.5 + 30);
            ctx.font = 'bold 25px sans-serif';
            text = "GAME OVER";
            dimensions = ctx.measureText(text);
            ctx.fillText(text, dw * 0.5 - dimensions.width * 0.5, dh * 0.5);
        }

    }

    dispose = function () {
        this.stop();
    }

    restart = function () {
        this.grid = new Grid(10, 20);
        this.currentShape = null;
        this.level = 1;
        this.score = 0;
        this.gameOver = false;
    }

}
