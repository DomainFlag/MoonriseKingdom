<?php
/**
 * Created by PhpStorm.
 * User: Maria Solomon
 * Date: 11/20/2017
 * Time: 4:55 PM
 */
include('../inc/constants.php');
include('../inc/connexion.php');
connectBD();
$connexion;
function getTeams() {
    global $connexion;
    $req = 'SELECT * FROM AllTeams NATURAL JOIN Appartient NATURAL JOIN AllMorpis;';
    echo (string)$connexion;
    $res = mysqli_query($connexion, $req);
    $allTeams = array();
    while ($row = mysqli_fetch_array($res)) {
        array_push($allTeams[$row["idT"]-1], $row);
    }
    return $allTeams;
}

deconnectBD();