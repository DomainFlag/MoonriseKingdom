<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 01/12/2017
 * Time: 17:18
 */

/*
 * Custom Game este creat atunci cind apesi create Team la ambele echipe si alegi fix 10 morpioane la fiecare si apesi Start Game.
 *
 * Exemplu de data care primeste serveru
 * {"teams":[{"name":"fsafsaf","color":"rgb(241, 106, 67)","composition":{"warrior":[{"health":6,"attack":4},{"health":6,"attack":4}],"archer":[{"health":8,"attack":2},{"health":8,"attack":2},{"health":8,"attack":2},{"health":8,"attack":2}],"mage":[{"health":7,"attack":2,"mana":3},{"health":7,"attack":2,"mana":3},{"health":7,"attack":2,"mana":3},{"health":7,"attack":2,"mana":3}]}},{"name":"fsafasfasfa","color":"rgb(47, 147, 149)","composition":{"warrior":[{"health":6,"attack":4},{"health":6,"attack":4},{"health":6,"attack":4},{"health":6,"attack":4},{"health":6,"attack":4}],"archer":[{"health":8,"attack":2},{"health":8,"attack":2},{"health":8,"attack":2},{"health":8,"attack":2}],"mage":[{"health":7,"attack":2,"mana":3}]}}],"dimension":3}
 * Folosesti http://jsonparseronline.com/ CTRL+C la stringu de mai sus si CTRL+V si te uiti cum e structurat JSON data.
 * Iai data folosind instructiunea asta => $data = json_decode(file_get_contents('php://input'));
 * Folosesti ca reper main.php
 * Nu uita de sessions.
 */