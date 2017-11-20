let dimX = document.querySelector(".gameboard").clientHeight*1.25;
let dimY = document.querySelector(".gameboard").clientHeight*4/5;
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
    },
    "warrior" : function() {
        return new Warrior();
    },
    "archer" : function() {
        return new Archer();
    },
    "mage" : function() {
        return new Mage();
    }
};

function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype.isEqual = function(pos) {
    return (this.x === pos.x && this.y === pos.y);
};

function Wasteland() {
    this.type = null;
}

function Warrior() {
    this.health = 8;
    this.attack = 2;
    this.bonus = 10;
}

function Archer() {
    this.health = 8;
    this.attack = 2;
}

function Mage() {
    this.health = 5;
    this.attack = 2;
    this.mana = 3;
}

function Morpion(type, state, x, y) {
    this.pos = new Vector(x, y);
    this.type = Types[type]();
    this.state = state;
}

function Game() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setGame();
    this.drawGame()
}

Game.prototype.setGame = function() {
/*    if(!document.cookie.split("game_id=").pop()) {
        window.location.href = "home.php";
    }
    this.identifier = document.cookie.split("game_id=").pop();*/

    this.canvas.width = dimX;
    this.canvas.height = dimY;

    this.boardDimmensions = 4;
    this.partition = dimY/this.boardDimmensions;
    this.offsetPartition = (dimX-dimY)/2;

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
            let x = Math.floor((event.clientX - this.canvas.offsetLeft - this.offsetPartition)/this.partition);
            let y = Math.floor((event.clientY - this.canvas.offsetTop)/this.partition);

            this.highlight.affected = this.board[x][y];
        }
    }.bind(this));

    this.canvas.addEventListener("click", function(event) {

        let x = Math.floor((event.clientX - this.canvas.offsetLeft - this.offsetPartition)/this.partition);
        let y = Math.floor((event.clientY - this.canvas.offsetTop)/this.partition);

        if(!this.highlight.entity) {
            this.highlight.pos = new Vector(x, y);
            this.highlight.entity = this.board[x][y].type;
            if(Wasteland.prototype.isPrototypeOf(this.board[x][y].type)) {
                tools.style.display = "flex";

                this.highlight.state = "highlight";

                tools.style.left = this.partition*x+this.partition + this.offsetPartition - dimX/2 + "px";
                tools.style.top = this.partition*y+this.partition/2 - dimY/2 + "px";
            } else {
                this.highlight.state = "action";
            }
        } else {
            if(this.highlight.state === "action") {
                if(this.highlight.entity.constructor.name !== "Wasteland") {
                    let AffectedMorpion = this.board[x][y].type;
                    if(!this.highlight.pos.isEqual(new Vector(x, y))) {
                        switch(this.highlight.entity.constructor.name) {
                            case "Warrior" : {
                                AffectedMorpion.health -= this.highlight.entity.attack;
                                this.highlight.entity.bonus += 5;
                                // Game.prototype.attackMorpion(this.highlight.pos, new Vector(x, y), "Warrior");
                                break;
                            }
                            case "Archer" : {
                                AffectedMorpion.health -= this.highlight.entity.attack;
                                // Game.prototype.throwMorpion(this.highlight.pos, new Vector(x, y), "Archer");
                                break;
                            }
                            case "Mage" : {
                                // Game.prototype.mageMorpion(this.highlight.pos, new Vector(x, y), "Mage");
                                break;
                            }
                        }
                        if(AffectedMorpion.health <= 0) {
                            console.log("heyo");
                            this.board[x][y].type = new Wasteland();
                        }
                    }
                }
            }
            tools.style.display = "none";
            this.highlight.entity = null;
            this.highlight.state = null;
        }
        event.stopPropagation();
    }.bind(this));

    tools.addEventListener("click", function(event) {
        if(this.highlight) {
            this.board[this.highlight.pos.x][this.highlight.pos.y].type = Types[event.target.attributes["class-specific"].value]();
            tools.style.display = "none";
            this.highlight.entity = null;
            this.highlight.state = null;

            // this.putMorpion(x, y, event.target.attributes["class-specific"].value);
        }
        event.stopPropagation();
    }.bind(this));

};

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

Game.prototype.actionMorpion = function(initiatorM, affectedM, classM) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/actionMorpion.php");
    request.getResponseHeader("Content-type", "application/json");
    request.addEventListener("load", function(req, res) {
        console.log(request.responseText);
    });
    request.send(JSON.stringify({
        "identifier" : this.identifier,
        "initiatorM" : initiatorM,
        "affectedM" : affectedM,
        "classM" : classM
    }));
};

Game.prototype.drawMenu = function() {
    if(this.highlight.entity && this.highlight.state === "action") {
        this.ctx.fillStyle = "white";
        this.ctx.font = "14px Roboto Slab";
        this.ctx.textAlign = "center";
        let objects = Object.keys(this.highlight.entity);
        let length = Object.keys(this.highlight.entity).length;
        let partition = dimY/(length+1);
        for(let i = 0; i < length; i++) {
            this.ctx.fillText(objects[i] + "\n" + this.highlight.entity[objects[i]], this.offsetPartition/2, (i+1)*partition);
        }
    }
};

Game.prototype.drawGame = function() {
    this.ctx.clearRect(0, 0, dimX, dimY);

    this.drawMenu();
    this.ctx.font = 50;
    for(let i = 0; i < this.boardDimmensions; i++) {
        for(let g = 0; g < this.boardDimmensions; g++) {
            let morpion = this.board[i][g].type;
            this.ctx.fillStyle = "khaki";
            this.ctx.fillRect(this.offsetPartition+i*this.partition, g*this.partition, this.partition, this.partition);

            if(!Wasteland.prototype.isPrototypeOf(morpion)) {
                this.ctx.fillStyle = Colors[morpion.constructor.name];
                this.ctx.beginPath();
                this.ctx.arc(this.offsetPartition+(i+0.5)*this.partition, (g+0.5)*this.partition, this.partition/4, 0, 2*Math.PI);
                this.ctx.fill();
                this.ctx.fontStyle = "white";
                this.ctx.fillText(morpion.health, this.offsetPartition+(i+0.1)*this.partition, (g+0.9)*this.partition);
                this.ctx.fontStyle = "khaki";
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
            this.ctx.fillRect(this.offsetPartition+pos.x*this.partition, pos.y*this.partition, this.partition, this.partition);
            this.ctx.restore();
        } else if(this.highlight.state === "action") {
            if(!Warrior.prototype.isPrototypeOf(this.highlight.entity)) {
                for(let i = 0; i < this.boardDimmensions; i++) {
                    for (let g = 0; g < this.boardDimmensions; g++) {
                        if(i !== pos.x || g !== pos.y) {
                            this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                            this.ctx.fillRect(this.offsetPartition+i*this.partition, g*this.partition, this.partition, this.partition);
                        }
                    }
                }
                if(this.highlight.affected && (this.highlight.affected.pos.x !== pos.x || this.highlight.affected.pos.y !== pos.y)) {
                    this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                    this.ctx.fillRect(this.offsetPartition+this.highlight.affected.pos.x*this.partition, this.highlight.affected.pos.y*this.partition, this.partition, this.partition);
                }
            } else {
                square.forEach(function(dimens) {
                    let newPosition = new Vector(pos.x+dimens[0], pos.y+dimens[1]);
                    if(newPosition.x >= 0 && newPosition.x < this.boardDimmensions && newPosition.y >= 0 && newPosition.y < this.boardDimmensions) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                        this.ctx.fillRect(this.offsetPartition+newPosition.x*this.partition, newPosition.y*this.partition, this.partition, this.partition);
                    }
                    if(this.highlight.affected && this.highlight.affected.pos.x === newPosition.x && this.highlight.affected.pos.y === newPosition.y) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                        this.ctx.fillRect(this.offsetPartition+this.highlight.affected.pos.x*this.partition, this.highlight.affected.pos.y*this.partition, this.partition, this.partition);
                    }
                }.bind(this));
            }
        }
    }

    this.ctx.strokeStyle = "coral";
    this.ctx.lineWidth = 5;
    for(let g = 0; g < this.boardDimmensions-1; g++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetPartition + (g+1)*this.partition, 0);
        this.ctx.lineTo(this.offsetPartition + (g+1)*this.partition, dimY);
        this.ctx.stroke();
    }

    for(let g = 0; g < this.boardDimmensions-1; g++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetPartition, (g+1)*this.partition);
        this.ctx.lineTo(this.offsetPartition + this.boardDimmensions*this.partition, (g+1)*this.partition);
        this.ctx.stroke();
    }

    requestAnimationFrame(this.drawGame.bind(this));
};