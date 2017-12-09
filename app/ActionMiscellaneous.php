<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 27/11/2017
 * Time: 18:14
 */
include('../inc/constants.php');
include('../inc/connexion.php');
$connection = connectDB();
session_start();
$_SESSION["turns"]++;

$data = json_decode(file_get_contents('php://input'));

if(isset($data)) {
    $req_game_id = "SELECT game.idG FROM game WHERE identifier = '" . session_id() . "';";
    $game_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_game_id))["idG"];

    $req_team_id = "SELECT team.idT FROM team WHERE idG = " . $game_id ." && idT%2 = " . $data->morpion->team . ";";
    $team_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_team_id))["idT"];

    $req_insert_action = "INSERT INTO action(idG, idT) VALUES($game_id, $team_id)";
    mysqli_query($connection, $req_insert_action);
    $action_id = mysqli_insert_id($connection);

    $req_affected_morpion = "SELECT idM FROM coordinates WHERE idG = ".$game_id." AND cordX = ".$data->cell->x." AND cordY = ".$data->cell->y.";";
    $result_affected_morpion = mysqli_query($connection, $req_affected_morpion);
    $affected_morpion = mysqli_fetch_assoc($result_affected_morpion)["idM"];
    switch($data->type) {
        case "attack" : {
            $lottery = rand(0, 100);
            $attack = $data->morpion->type->attack;
            $bonus = 0;
            if($lottery <= $data->morpion->type->bonus) {
                $attack *= 2;
                $bonus = 1;
            }

            $req_insert_attack = "INSERT INTO attack(idA, bonus, idM, idM_Morpion) VALUES(".$action_id.", ".$bonus.", ".$data->morpion->type->id.", ".$affected_morpion.");";
            mysqli_query($connection, $req_insert_attack);

            $req_update_morpion = "UPDATE morpion SET health = GREATEST(health-".$attack.", 0) WHERE idM = ".$affected_morpion.";";
            mysqli_query($connection, $req_update_morpion);
            break;
        }
        default : {
            $req_insert_miscellaneous = "INSERT INTO miscellaneous(idA, type, idM, idM_Morpion) VALUES(".$action_id.", '".$data->type."', 
            ".$data->morpion->type->id.", ".$affected_morpion.");";
            mysqli_query($connection, $req_insert_miscellaneous);

            switch($data->type) {
                case "throw" : {
                    $req_initiator_morpion = "SELECT * FROM morpion WHERE idM = ".$data->morpion->type->id.";";
                    $result_initiator_morpion = mysqli_query($connection, $req_initiator_morpion);
                    $initiator_morpion = mysqli_fetch_assoc($result_initiator_morpion);

                    $req_update_morpion = "UPDATE morpion SET health = GREATEST(health-".$initiator_morpion["damage"].", 0) WHERE idM = ".$affected_morpion.";";
                    mysqli_query($connection, $req_update_morpion);
                    break;
                }
                case "fireball" : {
                    $req_update_morpion = "UPDATE morpion SET health = GREATEST(health-4, 0) WHERE idM = ".$affected_morpion.";";
                    mysqli_query($connection, $req_update_morpion);
                    break;
                }
                case "heal" : {
                    $req_update_morpion = "UPDATE morpion SET health = health+3 WHERE idM = ".$affected_morpion.";";
                    mysqli_query($connection, $req_update_morpion);
                    break;
                }
            }
        }
    }
}

include('WinCondition.php');