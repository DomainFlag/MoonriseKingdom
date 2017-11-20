<?php

	connectBD();
function FillCo($i,$j)
{	global $connexion;
	$ruin=FALSE;
	$requete='INSERT INTO Coordonates VALUES(?,?,?,?);';
	$stmt=mysqli_prepare($connexion,$requete);
	if ($stmt == FALSE)
	{
		echo ' erreur de preparation ';
	}
	
	else
	{
		echo ' bonne preparation ';
		mysqli_stmt_bind_param($stmt,"iiis",$idCo,$i,$j,$ruin);
		mysqli_stmt_execute($stmt);
	}
}
?>