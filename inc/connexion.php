<?php
function connectDB() {
    $connexion = mysqli_connect(server, user, mdp, bd);
    if (mysqli_connect_errno()) {
        printf("Fail connecting : %s\n", mysqli_connect_error());
        exit();
    }
    return $connexion;
}
function disconnectDB($connexion) {
    mysqli_close($connexion);
}