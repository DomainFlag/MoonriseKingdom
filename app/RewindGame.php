<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 01/12/2017
 * Time: 19:16
 */
include('../inc/constants.php');
include('../inc/connexion.php');
session_start();
$connection = connectDB();

$data = json_decode(file_get_contents('php://input'));

$_SESSION["turns"] = $data->turn;

if(isset($data)) {
    $req_game_id = "SELECT game.idG FROM game WHERE identifier = '" . session_id() . "';";
    $game_id = (int)mysqli_fetch_array(mysqli_query($connection, $req_game_id))["idG"];

    $req_actions = "SELECT * FROM action WHERE idG = " . $game_id ." ORDER BY idA DESC;";
    $actions_result = mysqli_query($connection, $req_actions);
    $actions_count = mysqli_num_rows($actions_result);

    while(($row_action = mysqli_fetch_array($actions_result)) && $actions_count !== $data->turn) {
        $idA = $row_action["idA"];

        $req_placements = "SELECT * FROM placement WHERE idA = ". $idA.";";
        $req_actions_placements = mysqli_query($connection, $req_placements);

        $req_attacks = "SELECT * FROM attack WHERE idA = ". $idA.";";
        $req_actions_attacks = mysqli_query($connection, $req_attacks);

        $req_armageddon = "SELECT * FROM armageddon WHERE idA = ". $idA.";";
        $req_actions_armageddon = mysqli_query($connection, $req_armageddon);

        $req_miscellaneous = "SELECT * FROM miscellaneous WHERE idA = ". $idA.";";
        $req_actions_miscellaneous = mysqli_query($connection, $req_miscellaneous);

        $placement = mysqli_fetch_assoc($req_actions_placements);
        $attack = mysqli_fetch_assoc($req_actions_attacks);
        $armageddon = mysqli_fetch_assoc($req_actions_armageddon);
        $miscellaneous = mysqli_fetch_assoc($req_actions_miscellaneous);

        $id_placement = $placement["idA"];
        $id_attack = $attack["idAt"];
        $id_armageddon = $armageddon["idA"];
        $id_miscellaneous = $miscellaneous["idA"];

        $id_max = max($id_placement, $id_attack, $id_armageddon, $id_miscellaneous);
        if($id_max === $id_placement) {
            $req_delete_placement = "DELETE FROM placement WHERE idPl = ". $placement["idPl"] .";";
            mysqli_query($connection, $req_delete_placement);

            $req_delete_placement_coordinates = "DELETE FROM coordinates WHERE idCo = ". $placement["idCo"] .";";
            mysqli_query($connection, $req_delete_placement_coordinates);

            $id_placement = mysqli_fetch_assoc($req_actions_placements)["idA"];
        } else if($id_max === $id_armageddon) {
            $req_delete_armageddon = "DELETE FROM armageddon WHERE idAm = ". $armageddon["idAm"] .";";
            mysqli_query($connection, $req_delete_armageddon);

            //If there is a morpion there then he is resurrected, if there isn't delete the coordinate cause there isn't any morpion => he wanted to deny the opponent to put morpion there.
            $req_find_coordinate = "SELECT idM FROM coordinates WHERE idCo = " . $armageddon["idCo"]. ";";
            $morpion_id = mysqli_fetch_assoc(mysqli_query($connection, $req_find_coordinate))["idM"];

            if(empty($morpion_id)) {
                $req_find_ruined_coordinate = "DELETE FROM coordinates WHERE idCo = " . $armageddon["idCo"]. ";";
            } else {
                $req_find_ruined_coordinate = "UPDATE coordinates SET ruin = false WHERE idCo = " . $armageddon["idCo"]. ";";
            }
            mysqli_query($connection, $req_find_ruined_coordinate);

            $id_armageddon = mysqli_fetch_assoc($req_actions_armageddon)["idA"];
        } else if($id_max === $id_attack) {
            $req_update_morpion_0 = "UPDATE morpion SET bonus = bonus-5 WHERE idM = " . $attack["idM"] . ";";
            mysqli_query($connection, $req_update_morpion_0);

            $req_find_attack_initiator = "SELECT damage FROM morpion WHERE idM = ". $attack["idM"] .";";
            $damage = (int)mysqli_fetch_assoc(mysqli_query($connection, $req_find_attack_initiator))["damage"];

            if($attack["bonus"] === "1")
                $damage *= 2;

            $req_update_morpion_1 = "UPDATE morpion SET health = health + ".$damage." WHERE idM = " . $attack["idM_morpion"] . ";";
            mysqli_query($connection, $req_update_morpion_1);

            $req_delete_attacks = "DELETE FROM attack WHERE idAt = ". $attack["idAt"] .";";
            mysqli_query($connection, $req_delete_attacks);

            $id_attack = mysqli_fetch_assoc($req_actions_attacks)["idA"];
        } else if($id_max === $id_miscellaneous)  {
            switch($miscellaneous["type"]) {
                case "fireball" : {
                    $req_update_morpion_0 = "UPDATE morpion SET mana = mana+2 WHERE idM = " . $miscellaneous["idM"] . ";";
                    mysqli_query($connection, $req_update_morpion_0);
                    $req_update_morpion_1 = "UPDATE morpion SET health = health+4 WHERE idM = " . $miscellaneous["idM_morpion"] . ";";
                    mysqli_query($connection, $req_update_morpion_1);
                    break;
                }
                case "heal" : {
                    $req_update_morpion_0 = "UPDATE morpion SET mana = mana+1 WHERE idM = " . $miscellaneous["idM"] . ";";
                    mysqli_query($connection, $req_update_morpion_0);

                    $req_update_morpion_1 = "UPDATE morpion SET health = health-3 WHERE idM = " . $miscellaneous["idM_morpion"] . ";";
                    mysqli_query($connection, $req_update_morpion_1);
                    break;
                }
                case "throw" : {
                    $req_find_attack_initiator = "SELECT damage FROM morpion WHERE idM = ". $miscellaneous["idM"] .";";
                    $damage = (int)mysqli_fetch_assoc(mysqli_query($connection, $req_find_attack_initiator))["damage"];

                    $req_update_morpion_1 = "UPDATE morpion SET health = health+".$damage." WHERE idM = " . $miscellaneous["idM_morpion"] . ";";
                    mysqli_query($connection, $req_update_morpion_1);
                    break;
                }
            }
            $req_delete_miscellaneous = "DELETE FROM miscellaneous WHERE idMi = ". $miscellaneous["idMi"] .";";
            mysqli_query($connection, $req_delete_miscellaneous);

            $id_miscellaneous = mysqli_fetch_assoc($req_actions_miscellaneous)["idA"];
        }

        $req_delete_action = "DELETE FROM action WHERE idA = " . $idA . ";";
        mysqli_query($connection, $req_delete_action);
        $actions_count--;
    }

    $req_team_id = "SELECT team.idT FROM team WHERE idG = " . $game_id .";";
    $teams_result = mysqli_query($connection, $req_team_id);
    $array = array();
    $array["morpions"] = array();

    while($row_team_id = mysqli_fetch_array($teams_result)) {
        $team_id = (int)$row_team_id["idT"];
        $team_modulo_id = ($team_id+1)%2;


        $array["placement"][$team_modulo_id] = array();
        $req_coordinates = "SELECT * FROM (SELECT * FROM coordinates c WHERE idG = " . $game_id . ") c 
        INNER JOIN 
        (SELECT * FROM morpion WHERE idT = " . $team_id . ") m ON c.idM = m.idM;";

        $coordinates_result = mysqli_query($connection, $req_coordinates);
        while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
            $array["placement"][$team_modulo_id][] = $coordinate;
        }


        $array["morpions"][$team_modulo_id] = array();
        $req_coordinates = "SELECT * FROM (SELECT * FROM morpion WHERE idT = " . $team_id . ") m  
        WHERE m.idM NOT IN (SELECT c.idM FROM coordinates c WHERE idG = " . $game_id . " && idM IS NOT NULL);";

        $coordinates_result = mysqli_query($connection, $req_coordinates);
        while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
            $array["morpions"][$team_modulo_id][] = $coordinate;
        }
    }

    $array["ruin"] = array();
    $req_coordinates = "SELECT * FROM coordinates WHERE idG = " . $game_id . " && ruin = true;";
    $coordinates_result = mysqli_query($connection, $req_coordinates);
    while($coordinate = mysqli_fetch_assoc($coordinates_result)) {
        $array["ruin"][] = $coordinate;
    }
    echo json_encode($array);
}

disconnectDB($connection);