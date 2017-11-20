<?php

	connectBD();
function FillCo($i,$j)
{	global $connexion;
	$requete='SELECT MAX(idCo) AS maxidCo FROM Coordonates';
	$res=mysqli_query($connexion,$requete);
	if ($res == FALSE)
	{
		echo ' Every position is free in the DB! ';
		$idCo=1;
	}
	else
	{
		$row=mysqli_fetch_assoc($res);
		$idCo=$row['maxidCo'] + 1;
	}
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