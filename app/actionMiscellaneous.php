<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 27/11/2017
 * Time: 18:14
 */
/*
 * actionMiscellaneous are loc atunci cind attaci cu un warrior, arcas, mage(cind n-are mana), fireball, heal
 *
 * Exemplu de data structure:
 * {"morpion":{"pos":{"x":0,"y":0},"type":{"id":15,"health":8,"attack":2,"bonus":15},"state":null,"team":0},"cell":{"x":1,"y":0},"type":"attack"}
 * Folosesti http://jsonparseronline.com/
 *
 * Aici actiunele pentru attack(warrior), throw(archer), throw(mage), heal(mage), fireball(mage) | hint: daca te uiti
 * la structura json-ului este "type" property care o folosesti, poti sa faci un switch
 *
 * Folosesti ca reper actionArmageddon.php si actionPlacement.php
 * Nu uita de sessions, adica incrementing turns property;
 */
