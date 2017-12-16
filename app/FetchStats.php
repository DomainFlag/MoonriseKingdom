<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 13/12/2017
 * Time: 18:39
 */
function get_games_count($connexion) {
    $req_find_games_count = "SELECT COUNT(idG) AS count FROM game";
    echo "<p class='statistics-header'><strong>". mysqli_fetch_assoc(mysqli_query($connexion, $req_find_games_count))["count"] ."</strong> games played&nbsp;</p>";
}

function get_dead_morpions_count($connexion) {
    $req_find_dead_morpions_count = "SELECT (SELECT COUNT(idM) FROM morpion WHERE health <= 0) + (SELECT COUNT(idCo) FROM coordinates WHERE idM IS NOT NULL AND ruin = 1) AS count";
    echo "<p class='statistics-header'>with <strong>". mysqli_fetch_assoc(mysqli_query($connexion, $req_find_dead_morpions_count))["count"] ."</strong> dead morpions.</p>";
}

function get_most_used_class($connexion) {
    $req_find_most_used_class = "SELECT * FROM (SELECT COUNT(class) AS count, class FROM morpion GROUP BY class) c ORDER BY c.count DESC LIMIT 1";
    $class = mysqli_fetch_assoc(mysqli_query($connexion, $req_find_most_used_class));
    echo "<div class='statistics-column'>
            <p class='statistics-paragraph'>Most used class</p>
            <img class=\"sprites\" src=\"./../public/assets/".$class["class"].".png\" />
        </div>";
}

function get_most_used_spell($connexion) {
    $req_find_most_used_spell = "SELECT type FROM (
    SELECT * FROM (SELECT COUNT(idMi) AS count, type FROM miscellaneous WHERE type != 'throw' GROUP BY type) m UNION (
        SELECT COUNT(idAm) AS count, 'armageddon' AS type FROM armageddon)) l ORDER BY count DESC LIMIT 1;";
    $spell = mysqli_fetch_assoc(mysqli_query($connexion, $req_find_most_used_spell));
    echo "<div class='statistics-column'>
            <p class='statistics-paragraph'>Most used spell</p>
            <img class=\"sprites\" src=\"./../public/assets/".$spell["type"].".png\" />
          </div>";
}

function get_killer_warrior($connexion) {
    $req_find_killer_warrior = "SELECT * FROM (SELECT l.idM FROM (
    SELECT COUNT(m.idM) AS count, m.idM FROM (
        SELECT m0.* FROM (
            SELECT idM, MAX(idA), idM_morpion FROM attack 
            GROUP BY idM_morpion) m0 LEFT OUTER Join morpion m1 ON m0.idM_morpion = m1.idM WHERE m1.health <= 0) m GROUP BY m.idM) l ORDER BY l.count DESC LIMIT 1) f NATURAL JOIN morpion m1;";
    $killer_warrior = mysqli_fetch_assoc(mysqli_query($connexion, $req_find_killer_warrior));
    if(empty($killer_archer)) {
        $killer_archer["class"] = "warrior";
        $killer_archer["health"] = 8;
        $killer_archer["damage"] = 2;
    }
    echo "<div class='statistics-column'>
            <p class='statistics-paragraph'>Killer Warrior</p>
            <img class=\"sprites\" src=\"./../public/assets/".$killer_warrior["class"].".png\">
          </div>";
    echo "<div class='stat-hover'>
            <div class='stat'><div class='health'></div><div>".$killer_warrior["health"]."</div></div>
            <div class='stat'><div class='attack'></div><div>".$killer_warrior["damage"]."</div></div>
            </div>";
}

function get_killer_archer($connexion) {
    $req_find_killer_archer = "SELECT *
    FROM (
        SELECT *
        FROM (
            SELECT COUNT(m.idM) AS count, m.idM 
            FROM (
                SELECT m0.* 
                FROM (
                    SELECT mi.idM, MAX(mi.idA), mi.idM_morpion 
                    FROM (
                        SELECT * FROM miscellaneous WHERE type = 'throw'
                    ) mi GROUP BY idM_morpion) m0 LEFT OUTER Join morpion m1 ON m0.idM_morpion = m1.idM WHERE m1.health <= 0
            ) m GROUP BY m.idM
            ) f NATURAL JOIN morpion m1 WHERE m1.class = 'archer'
            ) t ORDER BY t.count DESC LIMIT 1;";
    $killer_archer = mysqli_fetch_assoc(mysqli_query($connexion, $req_find_killer_archer));
    if(empty($killer_archer)) {
        $killer_archer["class"] = "archer";
        $killer_archer["health"] = 8;
        $killer_archer["damage"] = 2;
    }
    echo "<div class='statistics-column'>
            <p class='statistics-paragraph'>Killer Archer</p>
            <img class=\"sprites\" src=\"./../public/assets/".$killer_archer["class"].".png\">
          </div>";
    echo "<div class='stat-hover'>
            <div class='stat'><div class='health'></div><div>".$killer_archer["health"]."</div></div>
            <div class='stat'><div class='attack'></div><div>".$killer_archer["damage"]."</div></div>
            </div>";
}

function get_killer_mage($connexion) {
    $req_find_killer_mage = "SELECT *
    FROM (
        SELECT *
        FROM (
            SELECT COUNT(m.idM) AS count, m.idM 
            FROM (
                SELECT m0.* 
                FROM (
                SELECT idM, MAX(idA), idM_morpion FROM (
                    SELECT m0.idM, m0.idA, m0.idM_Morpion
                    FROM (
                        SELECT idM, idA, idM_morpion FROM miscellaneous WHERE type = 'fireball'
                    ) m0 LEFT OUTER Join morpion m1 ON m0.idM_morpion = m1.idM WHERE m1.health <= 0
                    UNION
                    SELECT idM, idA, idM_morpion FROM armageddon WHERE idM_morpion IS NOT NULL
                ) r GROUP BY idM_morpion) m0
            ) m GROUP BY m.idM
            ) t ORDER BY t.count DESC LIMIT 1 
            ) f NATURAL JOIN morpion m1";
    $killer_mage = mysqli_fetch_assoc(mysqli_query($connexion, $req_find_killer_mage));
    if(empty($killer_mage)) {
        $killer_mage["class"] = "mage";
        $killer_mage["health"] = 3;
        $killer_mage["damage"] = 2;
        $killer_mage["mana"] = 5;
    }
    echo "<div class='statistics-column'>
            <p class='statistics-paragraph'>Killer Mage</p>
            <img class=\"sprites\" src=\"./../public/assets/".$killer_mage["class"].".png\">
          </div>";
    echo "<div class='stat-hover'>
            <div class='stat'><div class='health'></div><div>".$killer_mage["health"]."</div></div>
            <div class='stat'><div class='attack'></div><div>".$killer_mage["damage"]."</div></div>
            <div class='stat'><div class='mana'></div><div>".$killer_mage["mana"]."</div></div>
            </div>";
}