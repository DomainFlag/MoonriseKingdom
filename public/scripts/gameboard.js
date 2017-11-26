let dimX = document.querySelector(".gameboard").clientHeight*1.25;
let dimY = document.querySelector(".gameboard").clientHeight*4/5;
let tools = document.getElementsByClassName("tools")[0];
let spells = document.getElementsByClassName("tools")[1];
let square = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function upperCase(string) {
    return string[0].toUpperCase() + string.slice(1, string.length);
}

function lowerCase(string) {
    return string[0].toLowerCase() + string.slice(1, string.length);
}

let spirits = {
    "Warrior" : [],
    "Archer" : [],
    "Mage" : []
};

for(let property in spirits) {
    if(spirits.hasOwnProperty(property)) {
        for(let g = 1; g <= 2; g++) {
            let img = document.createElement("img");
            img.src = "../public/assets/" + property + "_team_" + g + ".png";
            spirits[property].push(img);
        }
    }
}

let properties = Object.create(null);

["health", "attack", "bonus", "mana"].forEach(function(property) {
    let img = document.createElement("img");
    img.src = "../public/assets/" + property + ".png";
    properties[property] = img;
});

let Types = {
    "wasteland" : function() {
        return new Wasteland();
    },
    "warrior" : function(morpion) {
        return new Warrior(morpion);
    },
    "archer" : function(morpion) {
        return new Archer(morpion);
    },
    "mage" : function(morpion) {
        return new Mage(morpion);
    }
};

let Spells = {
    "fireball" : 2,
    "heal" : 1,
    "armageddon" : 5
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
    this.ruin = false;
}

function Warrior(morpion) {
    this.id = morpion["idM"];
    this.health = morpion["health"];
    this.attack = morpion["damage"];
    this.bonus = morpion["bonus"];
}

function Archer(morpion) {
    this.id = morpion["idM"];
    this.health = morpion["health"];
    this.attack = morpion["damage"];
}

function Mage(morpion) {
    this.id = morpion["idM"];
    this.health = morpion["health"];
    this.attack = morpion["damage"];
    this.mana = morpion["mana"];
}

function Morpion(type, state, x, y) {
    this.pos = new Vector(x, y);
    this.type = Types[type]();
    this.state = state;
    this.team = -1;
}

Game.prototype.setMatch = function() {
    if(!document.cookie.split("PHPSESSID=").pop()) {
        window.location.href = "home.php";
    }
    this.identifier = document.cookie.split("PHPSESSID=").pop();
};

function Game() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setMatch();
    this.turns = 0;
    this.fetchData();
}

Game.prototype.fetchData = function() {
    let request = new XMLHttpRequest();
    request.open("GET", "../app/fetchData.php");
    this.teams = [];
    request.addEventListener("load", function(req, res) {
        let data = JSON.parse(request.responseText);
        this.boardDimmensions = data.dimension;
        data.teams.forEach(function(team) {
            let teamRow = {
                "name" : team.name,
                "color" : team.color,
                "morpions" : {
                    "warrior" : [],
                    "archer" : [],
                    "mage" : []
                }
            };
            team.morpions.forEach(function(morpion) {
                teamRow["morpions"][morpion.class].push(Types[morpion.class](morpion));
            }.bind(this));
            this.teams.push(teamRow);
        }.bind(this));

        this.setGame();
        this.drawGame();


    }.bind(this));
    request.send();
};


Game.prototype.setGame = function() {
    this.canvas.width = dimX;
    this.canvas.height = dimY;

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
        affected : null,
        spell: null
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
            this.highlight.entity = this.board[x][y];
            if(Wasteland.prototype.isPrototypeOf(this.highlight.entity.type)) {
                tools.style.display = "flex";

                this.highlight.state = "highlight";

                tools.style.left = this.partition*x+this.partition + this.offsetPartition - dimX/2 + "px";
                tools.style.top = this.partition*y+this.partition/2 - dimY/2 + "px";
            } else if(Mage.prototype.isPrototypeOf(this.highlight.entity.type) && this.highlight.entity.team === this.turns%2) {
                if(this.highlight.entity.type.mana !== 0) {
                    spells.style.display = "flex";

                    this.highlight.state = "highlight";

                    spells.style.left = this.partition*x+this.partition + this.offsetPartition - dimX/2 + "px";
                    spells.style.top = this.partition*y+this.partition/2 - dimY/2 + "px";
                } else {
                    this.highlight.state = "action";
                }
            } else if(this.highlight.entity.team === this.turns%2) {
                this.highlight.state = "action";
            }
        } else {
            if(this.highlight.state === "action") {
                if(this.highlight.entity.type.constructor.name !== "Wasteland") {
                    let affectedMorpion = this.board[x][y];
                    if(!this.highlight.entity.pos.isEqual(new Vector(x, y)) && affectedMorpion.team !== this.highlight.entity.team && !this.highlight.spell) {
                        switch(this.highlight.entity.type.constructor.name) {
                            case "Warrior" : {
                                if(Math.random()*100 < this.highlight.entity.type.bonus)
                                    affectedMorpion.type.health -= 2*this.highlight.entity.type.attack;
                                else
                                    affectedMorpion.type.health -= this.highlight.entity.type.attack;
                                this.highlight.entity.type.bonus += 5;
                                // Game.prototype.attackMorpion(this.highlight.pos, new Vector(x, y), "Warrior");
                                break;
                            }
                            case "Archer" : {
                                affectedMorpion.type.health -= this.highlight.entity.type.attack;
                                // Game.prototype.throwMorpion(this.highlight.pos, new Vector(x, y), "Archer");
                                break;
                            }
                            case "Mage" : {
                                affectedMorpion.type.health -= this.highlight.entity.type.attack;
                                // Game.prototype.throwMorpion(this.highlight.pos, new Vector(x, y), "Archer");
                                break;
                            }
                        }
                        this.turns++;
                    }
                    if(this.highlight.entity.type.constructor.name === "Mage" && this.highlight.spell) {
                        switch (this.highlight.spell) {
                            case "fireball" : {
                                affectedMorpion.type.health -= 4;
                                this.highlight.entity.type.mana -= 2;
                                break;
                            }
                            case "heal" : {
                                affectedMorpion.type.health += 3;
                                this.highlight.entity.type.mana -= 1;
                                break;
                            }
                            case "armageddon" : {
                                if(!Wasteland.prototype.isPrototypeOf(affectedMorpion.type)) {
                                    affectedMorpion.type = Types["wasteland"]();
                                    this.highlight.entity.type.mana -= 5;
                                } else {
                                    affectedMorpion.type.ruin = true;
                                    this.highlight.entity.type.mana -= 5;
                                }
                                this.actionArmageddon(this.highlight.entity, new Vector(x, y));
                                break;
                            }
                        }
                        this.turns++;
                        // Game.prototype.mageMorpion(this.highlight.pos, new Vector(x, y), "Mage");
                    }
                    if(affectedMorpion.type.health <= 0) {
                        this.board[x][y].type = new Wasteland();
                    }
                }
            }
            tools.style.display = "none";
            spells.style.display = "none";
            this.highlight.entity = null;
            this.highlight.state = null;
            this.highlight.spell = null;
        }
        event.stopPropagation();
    }.bind(this));

    tools.addEventListener("click", function(event) {
        if(this.highlight.state === "highlight" && this.teams[this.turns%2].morpions[event.target.attributes["class-specific"].value].length > 0) {
            this.highlight.entity.type = this.teams[this.turns%2].morpions[event.target.attributes["class-specific"].value][0];
            this.teams[this.turns%2].morpions[event.target.attributes["class-specific"].value].shift();
            this.highlight.entity.team = this.turns%2;

            this.putMorpion(this.highlight.entity);

            tools.style.display = "none";
            this.highlight.state = null;
            this.highlight.entity = null;
            this.teams[this.turns%2].morpions[upperCase(event.target.attributes["class-specific"].value)]--;
            this.turns++;
        }
        event.stopPropagation();
    }.bind(this));

    spells.addEventListener("click", function(event) {
        if(this.highlight.state === "highlight" && this.highlight.entity.type.mana >= Spells[event.target.attributes["class-specific"].value]) {
            spells.style.display = "none";
            this.highlight.state = "action";
            this.highlight.spell = event.target.attributes["class-specific"].value;
        }
        event.stopPropagation();
    }.bind(this));

};

Game.prototype.putMorpion = function(morpion) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/actionPlacement.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function(req, res) {
        console.log(request.responseText);
    });
    request.send(JSON.stringify(morpion));
};

Game.prototype.actionArmageddon = function(morpion, cell) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/actionArmageddon.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function(req, res) {
        console.log(request.responseText);
    });
    request.send(JSON.stringify({
        "morpion" : morpion,
        "cell" : cell
    }))
};

Game.prototype.actionMorpion = function(initiatorM, affectedM, classM) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/actionMorpion.php");
    request.setRequestHeader("Content-Type", "application/json");
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
    this.ctx.save();
    this.ctx.fillStyle = "darkslategrey";
    this.ctx.fillRect(0, 0, this.offsetPartition, dimY);
    this.ctx.fillRect(this.offsetPartition+this.boardDimmensions*this.partition, 0, this.offsetPartition, dimY);
    this.ctx.fillStyle = "white";
    this.ctx.font = "14px Roboto Slab";
    this.ctx.textAlign = "center";
    if(this.highlight.entity && !Wasteland.prototype.isPrototypeOf(this.highlight.entity.type)) {
        let objects = Object.keys(this.highlight.entity.type);
        let partition = dimY/(objects.length);
        for(let i = 0; i < objects.length-1; i++) {
            this.ctx.drawImage(properties[objects[i+1]], this.offsetPartition/4, (i+1)*partition-15, 30, 30);
            this.ctx.fillText(this.highlight.entity.type[objects[i+1]], this.offsetPartition*3/4, (i+1)*partition+7);
        }
    }

    // this.ctx.fillText(this.teams[this.turns%2].name, this.offsetPartition*3/2+this.partition*this.boardDimmensions, 50);

    for(let i = 0; i < 2; i++) {
        this.ctx.fillText(this.teams[i].name, this.offsetPartition*3/2+this.partition*this.boardDimmensions, 50+180*i);
        let g = 0;
        for(let type in spirits) {
            this.ctx.drawImage(spirits[type][i], this.offsetPartition*5/4+this.partition*this.boardDimmensions, 50+180*i+5+35*(g+1)-15, 30, 30);
            this.ctx.fillText("x" + this.teams[i].morpions[lowerCase(type)].length, this.offsetPartition*3/2+20+this.partition*this.boardDimmensions, 50+180*i+5+35*(g+1)+7);
            g++;
        }
    }
    this.ctx.restore();
};

Game.prototype.drawGame = function() {
    this.ctx.clearRect(0, 0, dimX, dimY);
    this.ctx.save();

    this.drawMenu();

    for(let i = 0; i < this.boardDimmensions; i++) {
        for(let g = 0; g < this.boardDimmensions; g++) {
            let morpion = this.board[i][g];
            this.ctx.fillStyle = "khaki";
            this.ctx.fillRect(this.offsetPartition+i*this.partition, g*this.partition, this.partition, this.partition);

            if(!Wasteland.prototype.isPrototypeOf(morpion.type)) {
                this.ctx.fillStyle = this.teams[morpion.team].color;
                this.ctx.drawImage(spirits[morpion.type.constructor.name][morpion.team], this.offsetPartition+(i+0.25)*this.partition, (g+0.25)*this.partition, this.partition/2, this.partition/2);
                this.ctx.font = "12px Roboto Slab";
                this.ctx.fillText(morpion.type.health, this.offsetPartition+(i+0.1)*this.partition, (g+0.9)*this.partition);
                this.ctx.fillStyle = "khaki";
            }
        }
    }

    if(this.highlight.entity) {
        let pos = this.highlight.entity.pos;
        let entity = this.highlight.entity;
        if(this.highlight.state === "highlight") {
            this.ctx.save();
            this.ctx.shadowBlur = "50";
            this.ctx.shadowColor = "rgb(245, 240, 142, 0.3)";
            this.ctx.fillStyle = "rgb(245, 240, 142, 0.3)";
            this.ctx.fillRect(this.offsetPartition+pos.x*this.partition, pos.y*this.partition, this.partition, this.partition);
            this.ctx.restore();
        } else if(this.highlight.state === "action") {
            if(!Warrior.prototype.isPrototypeOf(entity.type)) {
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