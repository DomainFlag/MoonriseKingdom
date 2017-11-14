<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 11/11/2017
 * Time: 22:55
 */

$connection = new mysqli("localhost", "root", "Cc12a23s","ancient_empire");

if($connection->connect_error) {
    echo "Fuck";
}

$data = json_decode(file_get_contents('php://input'));
$identifier = md5(microtime().rand());
$date = date('Y-m-d');
if(isset($data->team_1) && isset($data->team_2)) {
    if($connection->query("INSERT INTO game(identifier, idTVictory, dimension, created_at) VALUES('".$identifier."', NULL, 4, '".$date."')") === TRUE) {
        $last_id = $connection->insert_id;
        $connection->query("INSERT INTO team(idG, name, color, created_at) VALUES('". $last_id ."', '".$data->team_1."', 'red', '". $date ."')");
        $connection->query("INSERT INTO team(idG, name, color, created_at) VALUES('". $last_id ."', '".$data->team_2."', 'blue', '". $date ."')");
        echo $identifier;
    };
}

echo $connection->error;
$connection->close();