<?php
		$requete='SELECT MAX(idM) AS maxidM FROM Morpion';
		$res=mysqli_query($connexion,$requete);
		if ($res == FALSE)
			{
				echo ' No morpions in the DB! ';
				$idM=1;
			}
			else
			{
				$row=mysqli_fetch_assoc($res);
				$idM=$row['maxidC'] + 1;
			}
		$health=4;
		$damage=3;
		$class=$_POST['']; // 	     PROBLEMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
		if (strcmp($class,'mage')==0)
		{
			$mana=3;
		}
		else
		{
			$mana=0;
		}
	$requete='INSERT INTO Morpion VALUES(?,?,?,?,?);';
	$stmt=mysqli_prepare($connexion,$requete);
	if ($stmt == FALSE)
	{
		echo ' erreur de preparation ';
	}
	else
	{
		echo ' bonne preparation ';
		mysqli_stmt_bind_param($stmt,"iiiis",$idM,$health,$damage,$mana,$class);
		mysqli_stmt_execute($stmt);
	}
?>