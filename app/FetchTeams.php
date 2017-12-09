<?php
/**
 * Created by PhpStorm.
 * User: Maria Solomon
 * Date: 11/20/2017
 * Time: 4:55 PM
 */
include('../inc/constants.php');
include('../inc/connexion.php');
function getTeams($connexion) {
    $req = "SELECT * FROM Compositions NATURAL JOIN Belongs NATURAL JOIN Sample;";
    $res = mysqli_query($connexion, $req);
    $allTeams = array();
    while ($row = mysqli_fetch_array($res)) {
        $index = $row["idT"]-1;
        if(!isset($allTeams[$index][$row["class"]])) $allTeams[$index][$row["class"]] = array();
        $allTeams[$index][$row["class"]][] = $row;
    }
    return $allTeams;
}