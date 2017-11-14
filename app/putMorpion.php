<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 12/11/2017
 * Time: 13:03
 */
$connection = new mysqli("localhost", "root", "Cc12a23s", "ancient_empire");
if($connection->error) {
    echo "Damn..";
}

$data = json_decode(file_get_contents('php://input'));
if(isset($data->identifier, $data->cordX, $data->cordY, $data->classM)) {
    $result = $connection->query("SELECT MIN(t.idT) AS idT FROM team t WHERE t.idG = (SELECT g.idG FROM game g WHERE g.identifier = '".$data->identifier."')
    GROUP BY t.idG");
    if(sizeof($result) === 1) {
        while($row = mysqli_fetch_array($result)) {
            if(is_numeric($row["idT"])) {
                echo "ops???";
                $date = date('Y-m-d');
                if($connection->query("INSERT INTO morpion(idT, cordX, cordY, class, created_at) VALUES(".$row["idT"].", ".$data->cordX.", ".$data->cordY.", '".$data->classM."', '".$date."')") === TRUE) {
                    echo "yehooo";
                }
            }
        }
    };
}

$connection->close();