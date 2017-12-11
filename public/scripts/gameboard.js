let dimY = document.querySelector(".gameboard").clientHeight*9/10;
let dimX = dimY*1.6;
// dimX *= 3;
// dimY *= 3;
let tools = document.getElementsByClassName("tools")[0];
let spells = document.getElementsByClassName("tools")[1];
let square = [[-1, 0], [1, 0], [0, -1], [0, 1]];

function upperCase(string) {
    return string[0].toUpperCase() + string.slice(1, string.length);
}

function lowerCase(string) {
    return string[0].toLowerCase() + string.slice(1, string.length);
}

let colors = [new Color()];

function Color(red, green, blue) {
    this.red = red || Math.floor(Math.random()*255);
    this.green = green || Math.floor(Math.random()*255);
    this.blue = blue || Math.floor(Math.random()*255);
}

Color.prototype.interpolationColor = function(color) {
    return new Color((this.red + color.red)/2, (this.green + color.green)/2, (this.blue + color.blue)/2);
};

Color.prototype.getRGB = function() {
    return "rgb(" + this.red + ", " + this.green + ", " + this.blue + ")";
};

let spirits = {
    "Warrior" : [],
    "Archer" : [],
    "Mage" : []
};

for(let property in spirits) {
    if(spirits.hasOwnProperty(property)) {
        for(let g = 1; g <= 2; g++) {
            let img = document.createElement("img");
            img.src = "../public/assets/" + lowerCase(property) + "_team_" + g + ".png";
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
    this.id = Number(morpion["idM"]);
    this.health = Number(morpion["health"]);
    this.attack = Number(morpion["damage"]);
    this.bonus = Number(morpion["bonus"]);
}

function Archer(morpion) {
    this.id = Number(morpion["idM"]);
    this.health = Number(morpion["health"]);
    this.attack = Number(morpion["damage"]);
}

function Mage(morpion) {
    this.id = Number(morpion["idM"]);
    this.health = Number(morpion["health"]);
    this.attack = Number(morpion["damage"]);
    this.mana = Number(morpion["mana"]);
}

function Morpion(type, state, x, y) {
    this.pos = new Vector(x, y);
    this.type = Types[type]();
    this.state = state;
    this.team = -1;
}

/* Game Implementation - Mechanism that drives the game */
function Game() {
    this.canvas = document.querySelector("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.fetchResources();
    this.setMatch();
    this.turns = 0;
    this.fetchData();
    this.setDPI();
}

Game.prototype.setDPI = function() {
    let scaleFactor = 3;

    // Backup the canvas contents.
    let oldScaleX = this.canvas.width / dimX;
    let oldScaleY = this.canvas.height / dimY;
    let backupScaleX = scaleFactor / oldScaleX;
    let backupScaleY = scaleFactor / oldScaleY;
    let backup = this.canvas.cloneNode(false);
    backup.getContext('2d').drawImage(this.canvas, 0, 0);

    // Resize the canvas.
    this.canvas.width = Math.ceil(dimX * scaleFactor);
    this.canvas.height = Math.ceil(dimY * scaleFactor);

    // Redraw the canvas image and scale future draws.
    this.ctx.setTransform(backupScaleX, 0, 0, backupScaleY, 0, 0);
    this.ctx.drawImage(backup, 0, 0);
    this.ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
};

Game.prototype.setMatch = function() {
    if(!document.cookie.split("PHPSESSID=").pop()) {
        window.location.href = "../views/index.php";
    }

    this.identifier = document.cookie.split("PHPSESSID=").pop();
    this.rewind = document.querySelector(".rewind");
    this.message = document.querySelector(".message");
};

function getImage(src) {
    let image = document.createElement("img");
    image.src = src;
    return image;
}

Game.prototype.fetchResources = function() {
    this.resources = {
        "board" : getImage("../public/assets/board.png"),
        "wasteland" : getImage("../public/assets/wasteland.png"),
        "lava" : getImage("../public/assets/lava.png")
    };
};

Game.prototype.fetchData = function() {
    let request = new XMLHttpRequest();
    request.open("GET", "../app/FetchData.php");
    this.teams = [];
    request.addEventListener("load", function(req, res) {
        let data = JSON.parse(request.responseText);
        this.boardDimmensions = data.dimension;
        this.setGame();
        this.turns = data.turns;
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

            team.placement.forEach(function(placement) {
                let cell = this.board[placement.cordX][placement.cordY];
                cell.type = Types[placement.class](placement);
                cell.team = (Number(placement.idT)-1)%2;
            }.bind(this));

            this.teams.push(teamRow);
        }.bind(this));

        data.ruin.forEach(function(magma) {
            let cell = this.board[magma.cordX][magma.cordY];
            cell.type = Types["wasteland"]();
            cell.type.ruin = true;
        }.bind(this));

        this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
        this.actionColor = this.teams[this.turns%2].color;

        for(let checkpointIteration = 0; checkpointIteration < this.turns; checkpointIteration++) {
            this.appendCheckpoint();
        }
        this.drawGame();
    }.bind(this));
    request.send();
};

Game.prototype.appendCheckpoint = function() {
    let checkpoint_interval = document.createElement("div");
    checkpoint_interval.className = "checkpoint_interval";
    let checkpoint = document.createElement("div");
    checkpoint.className = "checkpoint";
    let currentColor = colors[colors.length-1];
    let newColor = new Color();
    let interpolatedColor = currentColor.interpolationColor(newColor);
    colors.push(newColor);
    checkpoint.style.backgroundColor = interpolatedColor.getRGB();

    let index = colors.length-2;
    checkpoint.addEventListener("mouseover", function(e) {
        this.message.textContent = "Turn " + index;
        this.message.style.visibility = "visible";
    }.bind(this));

    checkpoint.addEventListener("mouseleave", function(e) {
        this.message.style.visibility = "hidden";
    }.bind(this));

    checkpoint.addEventListener("click", function(e) {
        this.rewindGame(index);
        this.rewindCheckpoint(index);
    }.bind(this));

    checkpoint_interval.appendChild(checkpoint);
    checkpoint_interval.style.background = "linear-gradient(to right, " + currentColor.getRGB() + ", " + newColor.getRGB() + ")";
    this.rewind.appendChild(checkpoint_interval);
};

Game.prototype.rewindCheckpoint = function(turn) {
    colors.splice(turn+1, colors.length);
    this.turns = turn;
    this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
    this.actionColor = this.teams[this.turns%2].color;

    while(this.rewind.childElementCount !== turn+1 && this.rewind.lastChild.nodeName !== "#text") {
        this.rewind.removeChild(this.rewind.lastChild);
    }
};

Game.prototype.rewindGame = function(turn) {
    let req = new XMLHttpRequest();
    req.open("POST", "../app/RewindGame.php");
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function() {
        let data = JSON.parse(req.responseText);

        this.teams.forEach(function(team) {
            Object.keys(team.morpions).forEach(function(key) {
                team.morpions[key].length = 0;
            })
        });

        let teams = this.teams;
        this.board.forEach(function(row) {
            row.forEach(function(cell) {
                cell.type = new Wasteland();
                cell.team = -1;
                cell.state = null;
            })
        });

        data.morpions.forEach(function(team, teamIndex) {
            team.forEach(function(morpion) {
                teams[teamIndex].morpions[morpion.class].push(Types[morpion.class](morpion));
            })
        });

        let board = this.board;
        data.placement.forEach(function(team) {
            team.forEach(function(placement) {
                let cell = board[placement.cordX][placement.cordY];
                cell.type = Types[placement.class](placement);
                cell.team = (Number(placement.idT)-1)%2;
            })
        });

        data.ruin.forEach(function(magma) {
            let cell = board[magma.cordX][magma.cordY];
            cell.type = Types["wasteland"]();
            cell.type.ruin = true;
        })
    }.bind(this));
    req.send(JSON.stringify({
        "turn" : turn
    }));
};

Game.prototype.setGame = function() {
    this.canvas.width = dimX;
    this.canvas.height = dimY;

    this.offsetPartitionX = 0.338*dimX;
    this.offsetPartitionY = 0.26*dimY;

    this.partitionX = (dimX-this.offsetPartitionX*2)/this.boardDimmensions;
    this.partitionY = 24/25*this.partitionX; //Problems with the aspect ratio of canvas, it's atrociously hard to match aspect ratio of flex canvas with the image ratio.

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
            let x = Math.floor((event.clientX - this.canvas.offsetLeft - this.offsetPartitionX)/this.partitionX);
            let y = Math.floor((event.clientY - this.canvas.offsetTop - this.offsetPartitionY)/this.partitionY);

            this.highlight.affected = this.board[x][y];
        }
    }.bind(this));

    this.canvas.addEventListener("click", function(event) {
        let x = Math.floor((event.clientX - this.canvas.offsetLeft - this.offsetPartitionX)/this.partitionX);
        let y = Math.floor((event.clientY - this.canvas.offsetTop - this.offsetPartitionY)/this.partitionY);

        if(!this.highlight.entity) {
            this.highlight.entity = this.board[x][y];
            if(Wasteland.prototype.isPrototypeOf(this.highlight.entity.type) && !this.highlight.entity.type.ruin) {
                tools.style.display = "flex";

                this.highlight.state = "highlight";

                tools.style.left = this.partitionX*(x+1) + this.offsetPartitionX - dimX/2 + "px";
                tools.style.top = this.partitionY*(y+1/2) + this.offsetPartitionY - dimY/2 + "px";
            } else if(Mage.prototype.isPrototypeOf(this.highlight.entity.type) && this.highlight.entity.team === this.turns%2) {
                if(this.highlight.entity.type.mana !== 0) {
                    spells.style.display = "flex";

                    this.highlight.state = "highlight";

                    spells.style.left = this.partitionX*(x+1) + this.offsetPartitionX - dimX/2 + "px";
                    spells.style.top = this.partitionY*(y+1/2) + this.offsetPartitionY - dimY/2 + "px";
                } else {
                    this.highlight.state = "action";
                }
            } else if(this.highlight.entity.team === this.turns%2) {
                this.highlight.state = "action";
            }
        } else {
            if(this.highlight.state === "action") {
                let affectedMorpion = this.board[x][y];
                if(this.highlight.entity.type.constructor.name !== "Wasteland") {
                    if(affectedMorpion.type.id && !this.highlight.entity.pos.isEqual(new Vector(x, y)) && affectedMorpion.team !== this.highlight.entity.team && !this.highlight.spell) {
                        switch(this.highlight.entity.type.constructor.name) {
                            case "Warrior" : {
                                this.actionAttack(this.highlight.entity, new Vector(x, y), affectedMorpion);
                                break;
                            }
                            case "Archer" : {
                                affectedMorpion.type.health -= this.highlight.entity.type.attack;
                                this.actionMiscellaneous(this.highlight.entity, new Vector(x, y), "throw");
                                break;
                            }
                            case "Mage" : {
                                affectedMorpion.type.health -= this.highlight.entity.type.attack;
                                this.actionMiscellaneous(this.highlight.entity, new Vector(x, y), "throw");
                                break;
                            }
                        }
                        this.turns++;
                        this.appendCheckpoint();
                        this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
                        this.actionColor = this.teams[this.turns%2].color;
                    } else if(!this.highlight.entity.pos.isEqual(new Vector(x, y)) && this.highlight.entity.type.constructor.name === "Mage" && this.highlight.spell) {
                        switch (this.highlight.spell) {
                            case "fireball" : {
                                if(affectedMorpion.type.id && affectedMorpion.team !== this.highlight.entity.team) {
                                    affectedMorpion.type.health -= 4;
                                    this.highlight.entity.type.mana -= 2;
                                    this.actionMiscellaneous(this.highlight.entity, new Vector(x, y), "fireball");
                                    this.turns++;
                                    this.appendCheckpoint();
                                    this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
                                    this.actionColor = this.teams[this.turns%2].color;
                                }
                                break;
                            }
                            case "heal" : {
                                if(affectedMorpion.type.id && affectedMorpion.team === this.highlight.entity.team) {
                                    affectedMorpion.type.health += 3;
                                    this.highlight.entity.type.mana -= 1;
                                    this.actionMiscellaneous(this.highlight.entity, new Vector(x, y), "heal");
                                    this.turns++;
                                    this.appendCheckpoint();
                                    this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
                                    this.actionColor = this.teams[this.turns%2].color;
                                }
                                break;
                            }
                            case "armageddon" : {
                                if(affectedMorpion.team !== this.highlight.entity.team) {
                                    affectedMorpion.type = Types["wasteland"]();
                                    affectedMorpion.state = null;
                                    affectedMorpion.team = null;
                                    if(Wasteland.prototype.isPrototypeOf(affectedMorpion.type)) {
                                        affectedMorpion.type.ruin = true;
                                    }
                                    this.highlight.entity.type.mana -= 5;
                                    this.actionArmageddon(this.highlight.entity, new Vector(x, y));
                                    this.turns++;
                                    this.appendCheckpoint();
                                    this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
                                    this.actionColor = this.teams[this.turns%2].color;
                                }
                                break;
                            }
                        }
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
            this.appendCheckpoint();
            this.actionMessage = "Turn " + this.turns + " | " + this.teams[this.turns%2].name;
            this.actionColor = this.teams[this.turns%2].color;
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

function winCondition(request) {
    let data = JSON.parse(request.responseText);
    if(data.victory) {
        let popup = document.querySelector(".popup");
        popup.className += " toggle";
        let popup_text = document.querySelector(".popup_paragraph");
        popup_text.textContent = this.teams[(data.team+1)%2].name;
        let content = document.querySelector("body");
        content.className += " fade";
        document.querySelector(".popup_action").addEventListener("click", function() {
            window.location.href = "../views/index.php";
        });
    }
}

Game.prototype.putMorpion = function(morpion) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/ActionPlacement.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function() {
        this.winCondition();
    }.bind(this));
    request.send(JSON.stringify(morpion));
};

Game.prototype.actionArmageddon = function(morpion, cell) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/ActionArmageddon.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function() {
        this.winCondition();
    }.bind(this));
    request.send(JSON.stringify({
        "morpion" : morpion,
        "cell" : cell
    }))
};

Game.prototype.actionAttack = function(morpion, cell, affectedMorpion) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/ActionAttack.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function() {
        let data = JSON.parse(request.responseText);
        if(data.bonus === 1) {
            affectedMorpion.type.health -= 2*morpion.type.attack;
        } else if(data.bonus === 0) {
            affectedMorpion.type.health -= morpion.type.attack;
        }
        if(affectedMorpion.type.health <= 0) {
            this.board[cell.x][cell.y].type = new Wasteland();
        }
        this.winCondition();
    }.bind(this));
    request.send(JSON.stringify({
        "morpion" : morpion,
        "cell" : cell
    }))
};

Game.prototype.actionMiscellaneous = function(morpion, cell, type) {
    let request = new XMLHttpRequest();
    request.open("POST", "../app/ActionMiscellaneous.php");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function() {
        this.winCondition();
    }.bind(this));
    request.send(JSON.stringify({
        "morpion" : morpion,
        "cell" : cell,
        "type" : type
    }));
};

Game.prototype.winCondition = function() {
    let request = new XMLHttpRequest();
    request.open("GET", "../app/WinCondition.php");
    request.addEventListener("load", winCondition.bind(this, request));
    request.send();
};

Game.prototype.drawMenu = function() {
    this.ctx.save();
    this.ctx.fillStyle = "white";
    this.ctx.font = "14px Roboto Slab";
    this.ctx.textAlign = "center";

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    this.ctx.beginPath();
    this.ctx.moveTo(dimX/2-100, 0);
    this.ctx.quadraticCurveTo(dimX/2-95, 25, dimX/2-70, 25);
    this.ctx.lineTo(dimX/2+70, 25);
    this.ctx.quadraticCurveTo(dimX/2+95, 25, dimX/2+100, 0);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.textAlign = "center";
    this.ctx.fillStyle = "white" || this.actionColor;
    this.ctx.fillText(this.actionMessage, dimX/2, 17, 200);

    if(this.highlight.entity && !Wasteland.prototype.isPrototypeOf(this.highlight.entity.type)) {
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        this.ctx.beginPath();
        this.ctx.moveTo(0, 50);
        this.ctx.quadraticCurveTo(30, 50+5, 30, 50+15);
        this.ctx.lineTo(30, dimY-50-15);
        this.ctx.quadraticCurveTo(30, dimY-50-5, 0, dimY-50);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = "white";
        let objects = Object.keys(this.highlight.entity.type);
        let partition = (dimY-100)/(objects.length);
        for(let i = 0; i < objects.length-1; i++) {
            this.ctx.drawImage(properties[objects[i+1]], 30/8, 50+(i+1)*partition-15, 3*30/4, 3*30/4);
            this.ctx.fillText(this.highlight.entity.type[objects[i+1]], 30/2, 50+30/2+(i+1)*partition+10); //7
        }
    }

    this.ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    this.ctx.beginPath();
    this.ctx.moveTo(dimX, 50);
    this.ctx.quadraticCurveTo(dimX-30, 50+5, dimX-30, 50+15);
    this.ctx.lineTo(dimX-30, dimY-50-15);
    this.ctx.quadraticCurveTo(dimX-30, dimY-50-5, dimX, dimY-50);
    this.ctx.closePath();
    this.ctx.fill();

    this.ctx.fillStyle = "white";
    let partition = (dimY-100)/4;
    for(let i = 0; i < 3; i++) {
        this.ctx.drawImage(spirits[Object.keys(spirits)[i]][this.turns%2], dimX-7*30/8, 50+(i+1)*partition-15, 3*30/4, 3*30/4);
        this.ctx.fillText("x" + this.teams[this.turns%2].morpions[lowerCase(Object.keys(spirits)[i])].length, dimX-30/2, 50+30/2+(i+1)*partition+10); //7
    }
    this.ctx.restore();
};

Game.prototype.drawGame = function() {
    this.ctx.clearRect(0, 0, dimX, dimY);
    // this.setDPI();
    this.ctx.drawImage(this.resources.board, 0, 0, dimX, dimY);

    this.drawMenu();

    for(let i = 0; i < this.boardDimmensions; i++) {
        for(let g = 0; g < this.boardDimmensions; g++) {
            let morpion = this.board[i][g];

            if(morpion.type.ruin)
                this.ctx.drawImage(this.resources.lava, this.offsetPartitionX+(i+0.02)*this.partitionX, this.offsetPartitionY+(g+0.08)*this.partitionY, this.partitionX*4/5, this.partitionY*4/5);
            else
                this.ctx.drawImage(this.resources.wasteland, this.offsetPartitionX+(i+0.02)*this.partitionX, this.offsetPartitionY+(g+0.08)*this.partitionY, this.partitionX*4/5, this.partitionY*4/5);
            
            if(!Wasteland.prototype.isPrototypeOf(morpion.type)) {
                this.ctx.fillStyle = this.teams[morpion.team].color;
                this.ctx.drawImage(spirits[morpion.type.constructor.name][morpion.team], this.offsetPartitionX+(i+0.18)*this.partitionX, this.offsetPartitionY+g*this.partitionY, this.partitionX/2, this.partitionY/2);
                this.ctx.font = "bold 12px Roboto Slab";
                this.ctx.fillStyle = "white";
                this.ctx.fillText(morpion.type.health, this.offsetPartitionX+(i+0.15)*this.partitionX, this.offsetPartitionY+(g+0.7)*this.partitionY);
                this.ctx.fillStyle = "#D2D7D3";
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
            this.ctx.fillRect(this.offsetPartitionX+pos.x*this.partitionX, this.offsetPartitionY + pos.y*this.partitionY, this.partitionX, this.partitionY);
            this.ctx.restore();
        } else if(this.highlight.state === "action") {
            if(!Warrior.prototype.isPrototypeOf(entity.type)) {
                for(let i = 0; i < this.boardDimmensions; i++) {
                    for (let g = 0; g < this.boardDimmensions; g++) {
                        if(i !== pos.x || g !== pos.y) {
                            this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                            this.ctx.fillRect(this.offsetPartitionX+i*this.partitionX, this.offsetPartitionY+g*this.partitionY, this.partitionX, this.partitionY);
                        }
                    }
                }
                if(this.highlight.affected && (this.highlight.affected.pos.x !== pos.x || this.highlight.affected.pos.y !== pos.y)) {
                    this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                    this.ctx.fillRect(this.offsetPartitionX+this.highlight.affected.pos.x*this.partitionX, this.offsetPartitionY+this.highlight.affected.pos.y*this.partitionY, this.partitionX, this.partitionY);
                }
            } else {
                square.forEach(function(dimens) {
                    let newPosition = new Vector(pos.x+dimens[0], pos.y+dimens[1]);
                    if(newPosition.x >= 0 && newPosition.x < this.boardDimmensions && newPosition.y >= 0 && newPosition.y < this.boardDimmensions) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.05)";
                        this.ctx.fillRect(this.offsetPartitionX+newPosition.x*this.partitionX, this.offsetPartitionY+newPosition.y*this.partitionY, this.partitionX, this.partitionY);
                    }
                    if(this.highlight.affected && this.highlight.affected.pos.x === newPosition.x && this.highlight.affected.pos.y === newPosition.y) {
                        this.ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
                        this.ctx.fillRect(this.offsetPartitionX+this.highlight.affected.pos.x*this.partitionX, this.offsetPartitionY+this.highlight.affected.pos.y*this.partitionY, this.partitionX, this.partitionY);
                    }
                }.bind(this));
            }
        }
    }

    requestAnimationFrame(this.drawGame.bind(this));
};