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
        request.open("POST", "../app/main.php");
        request.setRequestHeader("Content-Type", "application/json");
        request.addEventListener("load", function(req, res) {
            window.location.href = "index.php";
        });
        let inputs = document.getElementsByClassName("input");
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
    } else {
        window.location.href = "index.php";
    }
});

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

