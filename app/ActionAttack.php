<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 10/12/2017
 * Time: 20:19
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

    $lottery = rand(0, 100);
    $attack = $data->morpion->type->attack;
    $bonus = 0;
    //We cap here because bonus can get out of 45 limit, look below the cause.
    if($lottery <= min($data->morpion->type->bonus, 45)) {
        $attack *= 2;
        $bonus = 1;
    }

    //We don't put cap at bonus because of rewind, if we go back bonus will be negative
    $req_update_bonus = "UPDATE morpion SET bonus = bonus + 5 WHERE idM = ".$data->morpion->type->id.";";
    mysqli_query($connection, $req_update_bonus);

    $req_insert_attack = "INSERT INTO attack(idA, bonus, idM, idM_Morpion) VALUES(".$action_id.", ".$bonus.", ".$data->morpion->type->id.", ".$affected_morpion.");";
    mysqli_query($connection, $req_insert_attack);

    $req_update_morpion = "UPDATE morpion SET health = health-".$attack." WHERE idM = ".$affected_morpion.";";
    mysqli_query($connection, $req_update_morpion);
    echo json_encode(array("bonus" => $bonus));
}
