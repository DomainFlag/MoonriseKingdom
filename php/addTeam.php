<?php
	$name=$_GET[''];
	$color=$_GET[''];
	$idGame=$_GET[''];
	$requete='INSERT INTO Team VALUES(?,?,?,?);'; //Nu este idGame, discutam la TP
	$stmt=mysqli_prepare($connexion,$requete);
	if ($stmt == FALSE)
	{
		echo ' erreur de preparation ';
	}
	else
	{
		echo ' bonne preparation ';
		mysqli_stmt_bind_param($stmt,"ss",$name,$color);
		mysqli_stmt_execute($stmt);
	}
	for(int $i=0)
?>