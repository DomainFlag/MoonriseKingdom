<?php
/**
 * Created by PhpStorm.
 * User: Cchiv
 * Date: 01/12/2017
 * Time: 19:16
 */

/*
 * Aista e cel mai greu si ultima care trebuie sa o faci, probabil :D!
 *
 * Cind joaca este initialized, tu poti sa faci rewind apasind click peste un dreptunghi cam rotund la bara de jos, unde dreptunghi-urile
 * mici sunt turn-ul la care vrei sa te intorci in timp;
 *
 * Exemplu de data structure:
 * {"turn": 0}
 * Folosesti http://jsonparseronline.com/
 *
 * Aici noi reluam jocul de la un turn specific, 0 asta cind joaca e creata, 1 cind a fost facuta prima actiune s.a
 *
 * Atunci cind facem o miscare valorile morpioanelor se schimba(health, mana, bonus) s.a, prikolul este ca trebuie sa faci
 * un request DB care ea un (numar = nr total de actiuni - turns) de actiuni si tu faci efect invers asupra morpionului, genu
 * ultima actiune face dmg 4 la un morpion => inseamna ca ii restaureaza 4 health, apoi urmatoarea penultimea actiune face
 * un fireball deci ii restaureaza mana perduta si punctele de viata perdute de catre morpionul afectat s.a.
 *
 * vei face delete la toate actiunele care au fost rewind-uite!
 *
 * Cind faci update-urile necesare incepi sa creezi un data structure genu ca in fetchTeams.php unde este informatie precum
 * toata statistica la morpione(health, mana s.a) dupa schimbari + informatia despre coordonate si ii face un echo la sfirsit
 * asta inseamna ca datele sunt trimisise clientului si eu pot sa schimb jocul dupa rewind-ul fauct.
 */