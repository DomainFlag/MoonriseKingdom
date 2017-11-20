<?php
global $connexion;
function connectBD() {
    global $connexion;
    $connexion = mysqli_connect(server, user, mdp, bd);
    if (mysqli_connect_errno()) {
        printf("Échec de la connexion : %s\n", mysqli_connect_error());
        exit();
    }
    mysqli_query($connexion, 'SET NAMES UTF8'); // requete pour avoir les noms en UTF8
}
function deconnectBD() {
    global $connexion;
    mysqli_close($connexion);
}