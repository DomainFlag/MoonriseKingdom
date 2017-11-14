let dim = document.querySelector("section").clientHeight*7/10;
let tools = document.querySelector(".tools");
let square = [[-1, 0], [1, 0], [0, -1], [0, 1]];

let Colors = {
    "Warrior": "darkred",
    "Archer": "forestgreen",
    "Mage": "mediumslateblue"
};

let Types = {
    "wasteland" : function() {
        return new Wasteland();
    }(),
    "warrior" : function() {
        return new Warrior();
    }(),
    "archer" : function() {
        return new Archer();
    }(),
    "mage" : function() {
        return new Mage();
    }()
};

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

function Wasteland() {
    this.type = null;
}

function Warrior() {
    this.health = 10;
    this.attack = 40;
    this.bonus = 0;
}

function Archer() {
    this.health = 5;
    this.attack = 20;
}

function Mage() {
    this.health = 5;
    this.attack = 3;
    this.mana = 5;
}

function Morpion(type, state, x, y) {
    this.pos = new Vector(x, y);
    this.type = Types[type];
    this.state = state;
}

function Game() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setGame();
    this.drawGame()
}

Game.prototype.putMorpion = function(cordX, cordY, classM) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/putMorpion.php");
    request.getResponseHeader("Content-type", "application/x-www-form-urlencoded");
    request.addEventListener("load", function(req, res) {
        console.log(request.responseText);
    });
    request.send(JSON.stringify({
        "identifier" : this.identifier,
        "cordX" : cordX,
        "cordY" : cordY,
        "classM" : classM
    }));
};

Game.prototype.setGame = function() {
    if(!document.cookie.split("game_id=").pop()) {
        window.location.href = "home.php";
    }
    this.identifier = document.cookie.split("game_id=").pop();

    this.canvas.width = dim;
    this.canvas.height = dim;

    document.querySelector(".gameboard").style.width = dim + "px";
    document.querySelector(".gameboard").style.height = dim + "px";

    this.boardDimmensions = 4;
    this.partition = dim/this.boardDimmensions;

    this.board = [];
    for(let i = 0; i < this.boardDimmensions; i++) {
        let row = [];
        for(let g = 0; g < this.boardDimmensions; g++) {
            row.push(new Morpion("wasteland", null, i, g));
        }
        this.board.push(row);
    }

    this.highlight = {
        entity : null,
        state : null,
        affected : null
    };

    document.querySelector(".gameboard").addEventListener("mousemove", function(event) {
        if(this.highlight.state === "action") {
            let x = Math.floor((event.clientX - this.canvas.offsetLeft)/this.partition);
            let y = Math.floor((event.clientY - this.canvas.offsetTop)/this.partition);

            this.highlight.affected = this.board[x][y];
        }
    }.bind(this));

    this.canvas.addEventListener("click", function(event) {
        if(!this.highlight.entity) {
            let x = Math.floor((event.clientX - this.canvas.offsetLeft)/this.partition);
            let y = Math.floor((event.clientY - this.canvas.offsetTop)/this.partition);

            this.highlight.pos = new Vector(x, y);
            this.highlight.entity = this.board[x][y].type;
            if(Wasteland.prototype.isPrototypeOf(this.board[x][y].type)) {
                tools.style.display = "inline-block";

                this.highlight.state = "highlight";

                tools.style.left = this.partition*x+this.partition + "px";
                tools.style.top = this.partition*y+this.partition/2 + "px";
            } else {
                this.highlight.state = "action";
            }
        } else {
            tools.style.display = "none";
            this.highlight.entity = null;
            this.highlight.state = null;
        }
        event.stopPropagation();
    }.bind(this));

    tools.addEventListener("click", function(event) {
        if(this.highlight) {
            this.board[this.highlight.pos.x][this.highlight.pos.y].type = Types[event.target.attributes["class-specific"].value];
            tools.style.display = "none";
            this.highlight.entity = null;
            this.highlight.state = null;

            // this.putMorpion(x, y, event.target.attributes["class-specific"].value);
        }
        event.stopPropagation();
    }.bind(this));

};

Game.prototype.drawGame = function() {
    this.ctx.clearRect(0, 0, dim, dim);

    for(let i = 0; i < this.boardDimmensions; i++) {
        for(let g = 0; g < this.boardDimmensions; g++) {

            let morpion = this.board[i][g].type;
            this.ctx.fillStyle = "khaki";
            this.ctx.fillRect(i*this.partition, g*this.partition, this.partition, this.partition);

            if(!Wasteland.prototype.isPrototypeOf(morpion)) {
                this.ctx.fillStyle = Colors[morpion.constructor.name];
                this.ctx.beginPath();
                this.ctx.arc((i+0.5)*this.partition, (g+0.5)*this.partition, this.partition/4, 0, 2*Math.PI);
                this.ctx.fill();
            }
        }
    }

    if(this.highlight.entity) {
        let pos = this.highlight.pos;
        if(this.highlight.state === "highlight") {
            this.ctx.save();
            this.ctx.shadowBlur = "50";
            this.ctx.shadowColor = "rgb(245, 240, 142)";
            this.ctx.fillStyle = "rgb(245, 240, 142)";
            this.ctx.fillRect(pos.x*this.partition, pos.y*this.partition, this.partition, this.partition);
            this.ctx.restore();
        } else if(this.highlight.state === "action") {
            if(!Warrior.prototype.isPrototypeOf(this.highlight.entity)) {
                for(let i = 0; i < this.boardDimmensions; i++) {
                    for (let g = 0; g < this.boardDimmensions; g++) {
                        if(i !== pos.x || g !== pos.y) {
                            this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                            this.ctx.fillRect(i*this.partition, g*this.partition, this.partition, this.partition);
                        }
                    }
                }
                if(this.highlight.affected && (this.highlight.affected.pos.x !== pos.x || this.highlight.affected.pos.y !== pos.y)) {
                    this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                    this.ctx.fillRect(this.highlight.affected.pos.x*this.partition, this.highlight.affected.pos.y*this.partition, this.partition, this.partition);
                }
            } else {
                square.forEach(function(dimens) {
                    let newPosition = new Vector(pos.x+dimens[0], pos.y+dimens[1]);
                    if(newPosition.x >= 0 && newPosition.x < this.boardDimmensions && newPosition.y >= 0 && newPosition.y < this.boardDimmensions) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                        this.ctx.fillRect(newPosition.x*this.partition, newPosition.y*this.partition, this.partition, this.partition);
                    }
                    if(this.highlight.affected && this.highlight.affected.pos.x === newPosition.x && this.highlight.affected.pos.y === newPosition.y) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                        this.ctx.fillRect(this.highlight.affected.pos.x*this.partition, this.highlight.affected.pos.y*this.partition, this.partition, this.partition);
                    }
                }.bind(this));
            }
        }
    }

    this.ctx.strokeStyle = "ghostwhite";
    for(let g = 0; g < this.boardDimmensions-1; g++) {
        this.ctx.beginPath();
        this.ctx.moveTo((g+1)*this.partition, 0);
        this.ctx.lineTo((g+1)*this.partition, dim);
        this.ctx.stroke();
    }

    for(let g = 0; g < this.boardDimmensions-1; g++) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, (g+1)*this.partition);
        this.ctx.lineTo(dim, (g+1)*this.partition);
        this.ctx.stroke();
    }

    requestAnimationFrame(this.drawGame.bind(this));
};