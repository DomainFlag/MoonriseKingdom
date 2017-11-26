<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 26/11/2017
 * Time: 15:58
 */
include('../inc/constants.php');
include('../inc/connexion.php');
session_start();
$_SESSION["turns"]++;
$connection = connectDB();

$data = json_decode(file_get_contents('php://input'));

if(isset($data)) {
    $req_game_id = "SELECT game.idG FROM game WHERE identifier = '" . session_id() . "';";
    $game_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_game_id))["idG"];

    $req_team_id = "SELECT team.idT FROM team WHERE idG = " . $game_id ." && idT%2 = " . ($data->morpion->team+1)%2 . ";";
    $team_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_team_id))["idT"];

    $req_insert_action = "INSERT INTO action(idG, idT) VALUES($game_id, $team_id)";
    mysqli_query($connection, $req_insert_action);
    $action_id = mysqli_insert_id($connection);

    $req_find_affected_morpion = "SELECT * FROM coordinates WHERE idG = " . $game_id . " && cordX = " . $data->cell->x . " && cordY =" . $data->cell->y . ";";
    $results = mysqli_query($connection, $req_find_affected_morpion);
    if(mysqli_num_rows($results) === 0) {
        $req_insert_coordinates = "INSERT INTO coordinates(cordX, cordY, ruin, idG) VALUES(". $data->cell->x .", ". $data->cell->y .", true, ". $game_id.");";
        mysqli_query($connection, $req_insert_coordinates);
        $coordinates_id = mysqli_insert_id($connection);

        $req_insert_armageddon = "INSERT INTO armageddon(idA, idCo, idM) VALUES(". $action_id .", ". $coordinates_id .", " . $data->morpion->type->id . ");";
        mysqli_query($connection, $req_insert_armageddon);
        $armageddon_id = mysqli_insert_id($connection);
    } else {
        $req_find_coordinates = "SELECT * FROM coordinates WHERE idG = ". $game_id." && cordX = ". $data->cell->x ." && cordY = ". $data->cell->y .";";
        $coordinates_id = mysqli_fetch_array(mysqli_query($connection, $req_find_coordinates))["idCo"];

        $req_update_coordinates = "UPDATE coordinates SET ruin = true WHERE idCo = ". $coordinates_id.";";
        mysqli_query($connection, $req_update_coordinates);

        $req_insert_armageddon = "INSERT INTO armageddon(idA, idCo, idM, idM_Morpion) VALUES(". $action_id .", ". $coordinates_id .", " . $data->morpion->type->id . ", ". mysqli_fetch_array($results)["idM"] .");";
        mysqli_query($connection, $req_insert_armageddon);
        $armageddon_id = mysqli_insert_id($connection);
    }
}

disconnectDB($connection);