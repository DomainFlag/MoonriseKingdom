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
$alignment = [];
$count = [];
while($resultTeam = mysqli_fetch_assoc($resultsTeams)) {
    $team_id = $resultTeam["idT"];

    $req_morpions_placed_alive = "SELECT * FROM (SELECT * FROM morpion WHERE idT = ".$team_id." AND health > 0) m 
    NATURAL JOIN (SELECT * FROM coordinates WHERE idG = ".$game_id." AND ruin = false) c;";
    $results_morpions_placed_alive = mysqli_query($connection, $req_morpions_placed_alive);
    $alignment[($team_id+1)%2] = array();
    while($morpions_placed_alive = mysqli_fetch_assoc($results_morpions_placed_alive)) {
        $alignment[($team_id+1)%2][] = $morpions_placed_alive;
    }

    $req_get_all_morpions = "SELECT COUNT(idM) AS total FROM morpion WHERE idT = ".$team_id.";";
    $req_get_dead_morpions = "SELECT COUNT(idM) AS total FROM morpion WHERE idT = ".$team_id." AND health <= 0;";
    $req_get_armageddoned_morpions = "SELECT COUNT(idM) AS total FROM (SELECT * FROM coordinates WHERE idG = ".$game_id." AND ruin = true AND idM IS NOT NULL) c 
    NATURAL JOIN morpion m WHERE m.idT = ".$team_id.";";

    $result_all_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_all_morpions))["total"];
    $result_dead_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_dead_morpions))["total"];
    $result_armageddoned_morpions = mysqli_fetch_assoc(mysqli_query($connection, $req_get_armageddoned_morpions))["total"];

    $count[] = $result_all_morpions-$result_dead_morpions-$result_armageddoned_morpions;
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

if(alignmentCondition($alignment[0], $game_dimension) || $count[1] === 0) {
    clearTheDust();
    insertTheWinner($connection, $game_id, $alignment[0][0]["idT"]);
    echo json_encode(array("team" => 0, "victory" => true));
} else if(alignmentCondition($alignment[1], $game_dimension) || $count[0] === 0) {
    clearTheDust();
    insertTheWinner($connection, $game_id, $alignment[1][0]["idT"]);
    echo json_encode(array("team" => 1, "victory" => true));
} else {
    echo json_encode(array("teams" => array($count[0], $count[1]), "victory" => false));
}

disconnectDB($connection);