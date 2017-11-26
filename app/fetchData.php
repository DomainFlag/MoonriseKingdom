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

    $queryTeams = "SELECT * FROM team WHERE idG = " . $rowGame["idG"] . ";";
    $resultsTeams = mysqli_query($connection, $queryTeams);
    $data["teams"] = array();
    for($g = 0; $rowTeam = mysqli_fetch_array($resultsTeams); $g++) {
        $data["teams"][$g]["name"] = $rowTeam["name"];
        $data["teams"][$g]["color"] = $rowTeam["color"];
        $queryMorpions = "SELECT * FROM morpion WHERE idT = " . $rowTeam["idT"] . ";";
        $resultsMorpions = mysqli_query($connection, $queryMorpions);
        $data["teams"][$g]["morpions"] = array();
        for($h = 0; $rowMorpion = mysqli_fetch_array($resultsMorpions); $h++) {
            $data["teams"][$g]["morpions"][$h]["idM"] = (int)$rowMorpion["idM"];
            $data["teams"][$g]["morpions"][$h]["health"] = (int)$rowMorpion["health"];
            $data["teams"][$g]["morpions"][$h]["damage"] = (int)$rowMorpion["damage"];
            $data["teams"][$g]["morpions"][$h]["mana"] = (int)$rowMorpion["mana"];
            $data["teams"][$g]["morpions"][$h]["bonus"] = (int)$rowMorpion["bonus"];
            $data["teams"][$g]["morpions"][$h]["class"] = $rowMorpion["class"];
        }
    }
}

echo json_encode($data);

disconnectDB($connection);