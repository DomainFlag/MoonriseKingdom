<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 11/11/2017
 * Time: 22:55
 */
include('../inc/constants.php');
include('../inc/connexion.php');
$connection = connectDB();
session_start();
$_SESSION["turns"] = 0;

$data = json_decode(file_get_contents('php://input'));
$date = date('Y-m-d');

if(isset($data)) {
    $req = "INSERT INTO game(identifier, dimension, created_at) VALUES('". session_id()."', ". $data->dimension . ", '".$date."')";
    $res = mysqli_query($connection, $req);
    if($res) {
        $last_id = $connection->insert_id;

        $req_team_1 = "INSERT INTO team(idG, name, color) VALUES(". $last_id .", '".$data->teams[0]->name."', '".$data->teams[0]->color."')";
        mysqli_query($connection, $req_team_1);
        $team_last_id = $connection->insert_id;

        $getMorpionsTeam_1 = "SELECT * FROM (SELECT * FROM compositions WHERE idT = " . $data->teams[0]->composition . ") T NATURAL JOIN belongs NATURAL JOIN sample;";
        $MorpionsTeam_1 = mysqli_query($connection, $getMorpionsTeam_1);
        while($row = mysqli_fetch_array($MorpionsTeam_1)) {
            $insertMorpionTeam_1 = "INSERT INTO morpion(health, damage, mana, bonus, class, idT) VALUES(". $row["health"] . ", ". $row["damage"] . ", ". $row["mana"] . ", ". $row["bonus"] . ", '". $row["class"] . "', ". $team_last_id . ");";
            mysqli_query($connection, $insertMorpionTeam_1);
        }


        $req_team_2 = "INSERT INTO team(idG, name, color) VALUES(". $last_id .", '".$data->teams[1]->name."', '".$data->teams[1]->color."')";
        mysqli_query($connection, $req_team_2);
        $team_last_id = $connection->insert_id;

        $getMorpionsTeam_2 = "SELECT * FROM (SELECT * FROM compositions WHERE idT = " . $data->teams[1]->composition . ") T NATURAL JOIN belongs NATURAL JOIN sample;";
        $MorpionsTeam_2 = mysqli_query($connection, $getMorpionsTeam_2);
        while($row = mysqli_fetch_array($MorpionsTeam_2)) {
            $insertMorpionTeam_2 = "INSERT INTO morpion(health, damage, mana, bonus, class, idT) VALUES(". $row["health"] . ", ". $row["damage"] . ", ". $row["mana"] . ", ". $row["bonus"] . ", '". $row["class"] . "', ". $team_last_id . ");";
            mysqli_query($connection, $insertMorpionTeam_2);
        }
    }
}

disconnectDB($connection);
session_write_close();