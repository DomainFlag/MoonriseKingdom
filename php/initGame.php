<?php
	$identifier=echo md5(microtime().rand());
	$dim=$_POST[''];
	$currentD = date("Y-m-d H:i:s");
	$requete='INSERT INTO Game VALUES(?,?,?,?);';
	$stmt=mysqli_prepare($connexion,$requete);
	if ($stmt == FALSE)
	{
		echo ' erreur de preparation ';
	}
	else
	{
		echo ' bonne preparation ';
		mysqli_stmt_bind_param($stmt,"isis",$idG,$identifier,$dim,$currentD);
		mysqli_stmt_execute($stmt);
	}

?>