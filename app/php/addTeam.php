<?php
	$requete='SELECT MAX(idT) AS maxidT FROM Team';
	$res=mysqli_query($connexion,$requete);
	if ($res == FALSE)
	{
		echo ' No teams in the DB! ';
		$idT=1;
	}
	else
	{
		$row=mysqli_fetch_assoc($res);
		$idT=$row['maxidT'] + 1;
	}
	$name=$_GET[''];
	$color=$_GET[''];
	$requete='INSERT INTO Team VALUES(?,?,?);';
	$stmt=mysqli_prepare($connexion,$requete);
	if ($stmt == FALSE)
	{
		echo ' erreur de preparation ';
	}
	else
	{
		echo ' bonne preparation ';
		mysqli_stmt_bind_param($stmt,"iss",$idT,$name,$color);
		mysqli_stmt_execute($stmt);
	}
?>