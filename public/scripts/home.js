let compositions = document.getElementsByClassName("composition");

function getChildIndex(composition) {
    for(let i = 0; i < compositions.length; i++) {
        if(composition === compositions[i])
            return i+1;
    }
    return -1;
}

document.querySelector(".submit").addEventListener("click", function(e) {
    if(!document.cookie.split("PHPSESSID=").pop()) {
        let request = new XMLHttpRequest();
        let inputs = document.getElementsByClassName("input");
        if(customs_compositions[0].count >= 0 &&  customs_compositions[0].count <= 4 && customs_compositions[0].count >= 0 && customs_compositions[0].count <= 4) {
            customs_compositions.forEach(function(composition) {
                for(let property in composition.morpions) {
                    if(composition.morpions.hasOwnProperty(property)) {
                        let morpionsType = composition.morpions[property];
                        morpionsType.forEach(function(morpion) {
                            let sum = 0;
                            for(let stat in morpion) {
                                if(morpion.hasOwnProperty(stat)) {
                                    sum += morpion[stat];
                                }
                            }
                            if(sum !== 10) {
                                let op = types[property]();
                                for(let defaultStat in op) {
                                    if(op.hasOwnProperty(defaultStat)) {
                                        morpion[defaultStat] = op[defaultStat];
                                    }
                                }
                            }
                        })
                    }
                }
            });

            request.open("POST", "../app/CustomGame.php");
            request.setRequestHeader("Content-Type", "application/json");
            request.addEventListener("load", function(req, res) {
                window.location.href = "index.php";
            });
            teams[0].name = inputs[0].value;
            teams[1].name = inputs[1].value;
            request.send(JSON.stringify({
                "teams" : [
                    {
                        "name" : teams[0].name,
                        "color" : teams[0].color.style.backgroundColor,
                        "composition" : customs_compositions[0].morpions
                    }, {
                        "name" : teams[1].name,
                        "color" : teams[1].color.style.backgroundColor,
                        "composition" : customs_compositions[1].morpions
                    }
                ],
                "dimension" : selectedDimension
            }));
        } else {
            request.open("POST", "../app/Main.php");
            request.setRequestHeader("Content-Type", "application/json");
            request.addEventListener("load", function(req, res) {
                window.location.href = "index.php";
            });
            teams[0].name = inputs[0].value;
            teams[1].name = inputs[1].value;
            request.send(JSON.stringify({
                "teams" : [
                    {
                        "name" : teams[0].name,
                        "color" : teams[0].color.style.backgroundColor,
                        "composition" : getChildIndex(teams[0].composition)
                    }, {
                        "name" : teams[1].name,
                        "color" : teams[1].color.style.backgroundColor,
                        "composition" : getChildIndex(teams[1].composition)
                    }
                ],
                "dimension" : selectedDimension
            }));
        }
    } else {
        window.location.href = "index.php";
    }
});

/* Custom Team Customisation: */
function Warrior() {
    this.health = 6;
    this.attack = 4;
}

function Archer() {
    this.health = 8;
    this.attack = 2;
}

function Mage() {
    this.health = 3;
    this.attack = 2;
    this.mana = 5;
}

let chose = 0;
let customs_compositions = [
    {
        "count" : 8,
        "morpions" : {
            "warrior" : [],
            "archer" : [],
            "mage" : []
        }
    }, {
        "count" : 8,
        "morpions" : {
            "warrior" : [],
            "archer" : [],
            "mage" : []
        }
    }
];

let customs = document.getElementsByClassName("team_creator");
for(let i = 0; i < 2; i++) {
    customs[i].addEventListener("click", function(e) {
        chose = i;
        document.querySelector(".custom_composition").style.visibility = "visible";
        showCustomComposition(chose);
        e.stopPropagation();
        document.querySelector("section").addEventListener("click", function(e) {
            document.querySelector(".custom_composition").style.visibility = "hidden";
            e.stopPropagation();
            document.querySelector("section").removeEventListener("click", this);
        });
    });
}


let customInterface  = document.querySelector(".interface");
function showCustomComposition(index) {
    let team_1 = customs_compositions[index];
    let customClasses = customInterface.getElementsByClassName("custom_class");
    let spirits = customInterface.getElementsByClassName("predefined_spirit");
    let taken = customInterface.getElementsByClassName("taken");
    let stats = customInterface.querySelector(".stats");

    for(let i = 0; i < taken.length; i++) {
        while(taken[i].firstChild) {
            taken[i].removeChild(taken[i].firstChild);
        }
    }

    let ind = 0;
    for(let type in team_1.morpions) {
        if(team_1.morpions.hasOwnProperty(type)) {
            let typeMorpions = team_1.morpions[type];
            typeMorpions.forEach(function(morpion, morpionIndex) {
                let spirit = spirits[ind].cloneNode(true);
                spirit.className = "spirits";
                let typeIndex = ind;
                spirit.addEventListener("click", function(e) {
                    while(stats.firstChild) {
                        stats.removeChild(stats.firstChild);
                    }

                    let properties = Object.keys(customs_compositions[index].morpions[Object.keys(types)[typeIndex]][morpionIndex]);

                    let total = document.createElement("p");
                    total.className = "count";
                    let sum = 0;
                    for(let g = 0; g < properties.length; g++) {
                        sum += customs_compositions[index].morpions[Object.keys(types)[typeIndex]][morpionIndex][properties[g]];
                    }
                    total.textContent = "Total: " + sum;

                    for(let g = 0; g < properties.length; g++) {
                        let stat = document.createElement("div");
                        stat.className = "stat";

                        let effectType = document.createElement("div");
                        effectType.className = properties[g];
                        let effectValue = document.createElement("select");
                        for(let i = 0; i <= 9; i++) {
                            let option = document.createElement("option");
                            option.value = i;
                            option.text = i;
                            effectValue.appendChild(option);
                        }
                        effectValue.selectedIndex = customs_compositions[index].morpions[Object.keys(types)[typeIndex]][morpionIndex][properties[g]];
                        effectValue.addEventListener("change", function(e) {
                            let selects = stats.getElementsByTagName("select");
                            customs_compositions[index].morpions[Object.keys(types)[typeIndex]][morpionIndex][properties[g]] = Number(selects[g].selectedOptions[0].value);

                            let sum = 0;
                            for(let g = 0; g < selects.length; g++) {
                                sum += Number(selects[g].selectedOptions[0].value);
                            }
                            total.textContent = "Total: " + sum;
                        });

                        stat.appendChild(effectType);
                        stat.appendChild(effectValue);
                        stats.appendChild(stat);
                    }
                    stats.appendChild(total);
                });

                taken[ind].appendChild(spirit);
            });
            ind++;
        }
    }
}

document.querySelector(".custom_composition").addEventListener("click", function(e) {
    e.stopPropagation();
});

document.querySelector(".close").addEventListener("click", function(e) {
    document.querySelector(".custom_composition").style.visibility = "hidden";
});

let types = {"warrior" : function() {
    return new Warrior();
}, "archer" : function() {
    return new Archer();
}, "mage" : function() {
    return new Mage();
}};

let adds = document.getElementsByClassName("add");
for(let g = 0; g < adds.length; g++) {
    adds[g].addEventListener("click", function(e) {
        if(customs_compositions[chose].count !== 0) {
            document.querySelector(".count").textContent = --customs_compositions[chose].count + " Morpions Left";
            customs_compositions[chose].morpions[Object.keys(types)[g]].push(types[Object.keys(types)[g]]());
            showCustomComposition(chose);
            e.stopPropagation();
        }
    });
}
/* Teams Customisation: */

let teams = [{
    "name" : "Team 1",
    "color" : null,
    "composition" : null
}, {
    "name" : "Team 2",
    "color" : null,
    "composition" : null
}];

let colorPickers = document.getElementsByClassName("colorpicker");
for(let i = 0; i < 2; i++) {
    ["#355C7D", "#E8175D", "#F16A43", "#F7D969", "#2F9395", "#A6206A", "#99B898"].forEach(function(color) {
        let colorContainer = document.createElement("div");
        colorContainer.className = "color";
        colorContainer.style.backgroundColor = color;
        colorContainer.addEventListener("click", function(e) {
            if(teams[i].color)
                teams[i].color.style.border = "initial";
            teams[i].color = colorContainer;
            colorContainer.style.border = "3px solid lightslategrey";
            document.querySelector("#crystal").style.background = teams[index%2].color.style.backgroundColor;
            if(teams[i].composition.style.background.match(/gradient/))
                teams[i].composition.style.background = "linear-gradient(to bottom, " + teams[(i+1)%2].color.style.backgroundColor + " 50%, " + teams[i].color.style.backgroundColor + " 50%)";
            else
                teams[i].composition.style.background = teams[i].color.style.backgroundColor;
        });
        colorPickers[i].appendChild(colorContainer);
    });
}

teams[0].color = colorPickers[0].firstChild;
teams[1].color = colorPickers[1].lastChild;

colorPickers[0].firstChild.style.border = "3px solid lightslategrey";
colorPickers[1].lastChild.style.border = "3px solid lightslategrey";

let index = 0;
document.querySelector("#selected_team").textContent = "Choosing " + teams[index%2].name;
document.querySelector("#crystal").style.background = teams[index%2].color.style.backgroundColor;

for(let i = 0; i < compositions.length; i++) {
    compositions[i].addEventListener("click", function(e) {
        document.querySelector("#selected_team").textContent = "Choosing " + teams[(index+1)%2].name;
        document.querySelector("#crystal").style.background = teams[(index+1)%2].color.style.backgroundColor;
        if(teams[index%2].composition)
            teams[index%2].composition.style.background = "initial";
        teams[index%2].composition = compositions[i];
        if(teams[0].composition === teams[1].composition) {
            teams[0].composition.style.background = "linear-gradient(to bottom, " + teams[0].color.style.backgroundColor + " 50%, " + teams[1].color.style.backgroundColor + " 50%)";
        } else {
            if(teams[0].composition)
                teams[0].composition.style.background = teams[0].color.style.backgroundColor;
            if(teams[1].composition)
                teams[1].composition.style.background = teams[1].color.style.backgroundColor;
        }
        index++;
        e.stopPropagation();
    });
}

teams[0].composition = compositions[0];
teams[0].composition.style.backgroundColor = teams[0].color.style.backgroundColor;
teams[1].composition = compositions[1];
teams[1].composition.style.backgroundColor = teams[1].color.style.backgroundColor;

let selectedDimension = 3;
document.querySelector("#dimension").addEventListener("change", function(e) {
    selectedDimension = e.target.options[e.target.selectedIndex].value;
});

