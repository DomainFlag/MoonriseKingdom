<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 12/11/2017
 * Time: 13:03
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

    $req_team_id = "SELECT team.idT FROM team WHERE idG = " . $game_id ." && idT%2 = " . ($data->team+1)%2 . ";";
    $team_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_team_id))["idT"];

    $req_insert_action = "INSERT INTO action(idG, idT) VALUES($game_id, $team_id)";
    mysqli_query($connection, $req_insert_action);
    $action_id = mysqli_insert_id($connection);

    $req_insert_coordinates = "INSERT INTO coordinates(cordX, cordY, ruin, idM, idG) VALUES(". $data->pos->x .", ". $data->pos->y .", false,". $data->type->id .",". $game_id .");";
    mysqli_query($connection, $req_insert_coordinates);
    $coordinates_id = mysqli_insert_id($connection);

    $req_insert_placement = "INSERT INTO placement(idA, idCo) VALUES(". $action_id .", ". $coordinates_id .");";
    mysqli_query($connection, $req_insert_placement);
    $placement_id = mysqli_insert_id($connection);
}