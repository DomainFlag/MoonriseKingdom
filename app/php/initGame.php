<?php

	$requete='SELECT MAX(idG) AS maxidG FROM Game';
	$res=mysqli_query($connexion,$requete);
	if ($res == FALSE)
	{
		echo ' No games in the DB! ';
		$idG=1;
	}
	else
	{
		$row=mysqli_fetch_assoc($res);
		$idG=$row['maxidG'] + 1;
	}
	

?>