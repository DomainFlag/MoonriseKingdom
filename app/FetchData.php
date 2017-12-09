<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 26/11/2017
 * Time: 12:48
 */
include('../inc/constants.php');
include('../inc/connexion.php');
$connection = connectDB();
session_start();

$query = "SELECT * FROM (SELECT * FROM game WHERE identifier = '" . session_id() . "') g NATURAL JOIN team NATURAL JOIN morpion;";
$data = array();
$queryGame = "SELECT * FROM game WHERE identifier = '" . session_id() . "'";
$resultsGame = mysqli_query($connection, $queryGame);

for($i = 0; $rowGame = mysqli_fetch_array($resultsGame); $i++) {
    $data["dimension"] = $rowGame["dimension"];
    $data["turns"] = $_SESSION["turns"];
    $game_id = $rowGame["idG"];

    $queryTeams = "SELECT * FROM team WHERE idG = " . $game_id . ";";
    $resultsTeams = mysqli_query($connection, $queryTeams);
    $data["teams"] = array();
    for($g = 0; $rowTeam = mysqli_fetch_array($resultsTeams); $g++) {
        $data["teams"][$g]["name"] = $rowTeam["name"];
        $data["teams"][$g]["color"] = $rowTeam["color"];

        $team_id = $rowTeam["idT"];

        $data["teams"][$g]["placement"] = array();
        $req_coordinates = "SELECT * FROM (SELECT * FROM coordinates c WHERE idG = " . $game_id . ") c 
        INNER JOIN 
        (SELECT * FROM morpion WHERE idT = " . $team_id . ") m ON c.idM = m.idM;";

        $coordinates_result = mysqli_query($connection, $req_coordinates);
        while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
            $data["teams"][$g]["placement"][] = $coordinate;
        }

        $data["teams"][$g]["morpions"] = array();
        $req_coordinates = "SELECT * FROM (SELECT * FROM morpion WHERE idT = " . $team_id . ") m  
        WHERE m.idM NOT IN (SELECT c.idM FROM coordinates c WHERE idG = " . $game_id . " && idM IS NOT NULL);";

        $coordinates_result = mysqli_query($connection, $req_coordinates);
        while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
            $data["teams"][$g]["morpions"][] = $coordinate;
        }
    }

    $data["ruin"] = array();
    $req_coordinates = "SELECT * FROM coordinates WHERE idG = " . $game_id . " && ruin = true;";
    $coordinates_result = mysqli_query($connection, $req_coordinates);
    while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
        $data["ruin"][] = $coordinate;
    }
}

echo json_encode($data);

disconnectDB($connection);