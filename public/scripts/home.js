document.querySelector(".submit").addEventListener("click", function(e) {
    if(!document.cookie.split("game_id=").pop()) {
        let request = new XMLHttpRequest();
        request.open("POST", "../app/main.php");
        request.getResponseHeader("Content-type", "application/x-www-form-urlencoded");
        request.addEventListener("load", function(req, res) {
            document.cookie = "game_id=" + request.responseText;
            window.location.href = "index.php";
        });
        let inputs = document.getElementsByClassName("input");
        request.send(JSON.stringify({
            "team_1" : inputs[0].value,
            "team_2" : inputs[1].value
        }));
    } else {
        window.location.href = "index.php";
    }
});