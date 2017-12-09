<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 01/12/2017
 * Time: 17:18
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

        foreach($data->teams[0]->composition as $class => $classMorpions) {
            foreach ($classMorpions as $morpion) {
                if(!isset($morpion->mana))
                    $morpion->mana = 0;
                if(!isset($morpion->bonus))
                    $morpion->bonus = 0;
                $insertMorpionTeam_1 = "INSERT INTO morpion(health, damage, mana, bonus, class, idT) VALUES(". $morpion->health . ", ". $morpion->attack . ", ". $morpion->mana . ", ". $morpion->bonus . ", '". $class . "', ". $team_last_id . ");";
                mysqli_query($connection, $insertMorpionTeam_1);
            }
        }

        $req_team_2 = "INSERT INTO team(idG, name, color) VALUES(". $last_id .", '".$data->teams[1]->name."', '".$data->teams[1]->color."')";
        mysqli_query($connection, $req_team_2);
        $team_last_id = $connection->insert_id;

        foreach($data->teams[1]->composition as $class => $classMorpions) {
            foreach ($classMorpions as $morpion) {
                if(!isset($morpion->mana))
                    $morpion->mana = 0;
                if(!isset($morpion->bonus))
                    $morpion->bonus = 0;
                $insertMorpionTeam_1 = "INSERT INTO morpion(health, damage, mana, bonus, class, idT) VALUES(". $morpion->health . ", ". $morpion->attack . ", ". $morpion->mana . ", ". $morpion->bonus . ", '". $class . "', ". $team_last_id . ");";
                mysqli_query($connection, $insertMorpionTeam_1);
            }
        }
    }
}

disconnectDB($connection);
session_write_close();