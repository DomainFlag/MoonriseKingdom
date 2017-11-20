<?php  
		$health=4;
		$damage=3;
		$class=$_POST['']; // 	     PROBLEMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
		if (strcmp($class,'mage')==0)
		{
			$mana=3;
			$bonus=0;
		}
		else
		if (strcmp($class,'warrior')==0)
		{
			$bonus=0.1;
			$mana=0;
		}
		else
		{
			$mana=0;
			$bonus=0;
		}
		$team=$_POST[''];
		$idCo=$_POST['']; 
		$requete='INSERT INTO Morpion VALUES(?,?,?,?,?,?,?,?);'; 
		$stmt=mysqli_prepare($connexion,$requete);
		if ($stmt == FALSE)
		{
			echo ' erreur de preparation ';
		}
		else
		{
			echo ' bonne preparation ';
			mysqli_stmt_bind_param($stmt,"iiisiii",$health,$damage,$mana,$class,$team,$bonus,$idCo);
			mysqli_stmt_execute($stmt);
		}
?>