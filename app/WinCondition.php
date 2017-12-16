<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 08/12/2017
 * Time: 18:15
 */
include('../inc/constants.php');
include('../inc/connexion.php');
session_start();
$connection = connectDB();

function searchOccurrence($alignment, $x, $y) {
    for($g = 0; $g < sizeof($alignment); $g++) {
        if((int)$alignment[$g]["cordX"] === $x && (int)$alignment[$g]["cordY"] === $y) {
            return true;
        }
    }
    return false;
}

function findSomeoneAdjacent($ally, $cordX, $cordY) {
    $positioning = array(array(-1, 0), array(1, 0), array(0, 1), array(0, -1));
    for($g = 0; $g < sizeof($ally); $g++) {
        for($h = 0; $h < sizeof($positioning); $h++) {
            if(
                ($ally[$g]["cordX"] + $positioning[$h][0]) == $cordX &&
                ($ally[$g]["cordY"] + $positioning[$h][1]) == $cordY)
                return true;
        }
    }
    return false;
}

function findOtherOccurrence($opponent, $ally, $index) {
    if($index < sizeof($opponent)) {
        if($opponent[$index]["class"]  !==  "warrior") {
            return true;
        } else {
            if(findSomeoneAdjacent($ally, $opponent[$index]["cordX"], $opponent[$index]["cordY"]))
                return true;
            else
                findOtherOccurrence($opponent, $ally,$index + 1);
        }
    } else {
        return false;
    }
}

function alignmentCondition($alignment, $dimension) {
    for($row = 0; $row < $dimension; $row++) {
        for($column = 0; $column < $dimension && searchOccurrence($alignment, $row, $column); $column++) {
            if($column === $dimension-1)
                return true;
        }
    }
    for($column = 0; $column < $dimension; $column++) {
        for($row = 0; $row < $dimension && searchOccurrence($alignment, $row, $column); $row++) {
            if($row === $dimension-1) {
                return true;
            }
        }
    }
    for($diagonal = 0; $diagonal < $dimension && searchOccurrence($alignment, $diagonal, $diagonal); $diagonal++) {
        if($diagonal === $dimension-1)
            return true;
    }
    for($diagonal = $dimension-1; $diagonal >= 0 && searchOccurrence($alignment, ($dimension-1-$diagonal), $diagonal); $diagonal--) {
        if($diagonal === 0)
            return true;
    }

    return false;
}

$req_game = "SELECT * FROM game WHERE identifier = '" . session_id() . "';";
$result_game = mysqli_fetch_assoc(mysqli_query($connection, $req_game));
$game_id = (int)$result_game["idG"];
$game_dimension = (int)$result_game["dimension"];

$queryTeams = "SELECT * FROM team WHERE idG = " . $game_id . ";";
$resultsTeams = mysqli_query($connection, $queryTeams);
$alignment = array(array("idT" => NULL, "morpions" => array()), array("idT" => NULL, "morpions" => array()));
$morpions_left_alive = [];
$morpions_left_to_place = [];
while($resultTeam = mysqli_fetch_assoc($resultsTeams)) {
    $team_id = $resultTeam["idT"];
    $alignment[($team_id+1)%2]["idT"] = $team_id;

    $req_morpions_placed_alive = "SELECT * FROM (SELECT * FROM morpion WHERE idT = ".$team_id." AND health > 0) m 
    NATURAL JOIN (SELECT * FROM coordinates WHERE idG = ".$game_id." AND ruin = false) c;";
    $results_morpions_placed_alive = mysqli_query($connection, $req_morpions_placed_alive);
    while($morpions_placed_alive = mysqli_fetch_assoc($results_morpions_placed_alive)) {
        $alignment[($team_id+1)%2]["morpions"][] = $morpions_placed_alive;
    }

    $req_get_all_morpions = "SELECT COUNT(idM) AS total FROM morpion WHERE idT = ".$team_id.";";
    $req_get_dead_morpions = "SELECT COUNT(idM) AS total FROM morpion WHERE idT = ".$team_id." AND health <= 0;";
    $req_get_armageddoned_morpions = "SELECT COUNT(idM) AS total FROM (SELECT * FROM coordinates WHERE idG = ".$game_id." AND ruin = true AND idM IS NOT NULL) c 
    NATURAL JOIN morpion m WHERE m.idT = ".$team_id.";";

    $req_get_placed_morpions = "SELECT COUNT(idCo) AS total FROM coordinates NATURAL JOIN (SELECT * FROM morpion WHERE idT = ".$team_id.") m;";
    //Even the dead morpions have a position, they are just not rendered because of health.

    $result_all_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_all_morpions))["total"];
    $result_dead_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_dead_morpions))["total"];
    $result_armageddoned_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_armageddoned_morpions))["total"];

    $result_all_placed_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_placed_morpions))["total"];

    $morpions_left_to_place[] = $result_all_morpions - $result_all_placed_morpions;
    $morpions_left_alive[] = $result_all_morpions - $result_dead_morpions - $result_armageddoned_morpions;
}

function insertTheWinner($connection, $idG, $idT) {
    $req_insert_winner = "UPDATE game SET idT = ".$idT." WHERE idG = ".$idG.";";
    mysqli_query($connection, $req_insert_winner);
}

function clearTheDust() {
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"]
        );
    }
    session_destroy();
}

if(
    (alignmentCondition($alignment[0]["morpions"], $game_dimension) || $morpions_left_alive[1] == 0) ||
    ($morpions_left_to_place[1] == 0 && $morpions_left_to_place[0] == 0 && !findOtherOccurrence($alignment[1]["morpions"], $alignment[0]["morpions"], 0))) {
    clearTheDust();
    insertTheWinner($connection, $game_id, $alignment[0]["idT"]);
    echo json_encode(array("team" => 0, "victory" => true, "draw" => false));
} else if(
    (alignmentCondition($alignment[1]["morpions"], $game_dimension) || $morpions_left_alive[0] == 0) ||
    ($morpions_left_to_place[1] == 0 && $morpions_left_to_place[0] == 0 && !findOtherOccurrence($alignment[0]["morpions"], $alignment[1]["morpions"], 0))) {
    clearTheDust();
    insertTheWinner($connection, $game_id, $alignment[1]["idT"]);
    echo json_encode(array("team" => 1, "victory" => true, "draw" => false));
} else {
    echo json_encode(array("teams" => array($morpions_left_alive[0], $morpions_left_alive[1]), "victory" => false, "draw" => false));
}

disconnectDB($connection);