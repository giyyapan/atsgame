<?php
$con = mysql_connect('localhost','giyya','fuckmylife');
if (!$con){
 die('Could not connect: ' . mysql_error());
}

if (mysql_query("CREATE DATABASE ats",$con))
  {
  echo "Database created";
  }
else
  {
	echo "Error creating database: " . mysql_error();
  }

mysql_select_db('ats', $con);

$sql = "CREATE TABLE users
(
userID int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(userID),
username varchar(30),
dataJStr varchar(2000),
updateTime int,
uuid varchar(50),
password varchar(50)
)";
mysql_query($sql,$con);
echo '</br>';
echo mysql_error();

$sql = "CREATE TABLE challengeScores
(
id int NOT NULL AUTO_INCREMENT, 
PRIMARY KEY(id),
challengeName varchar(30),
score int(11),
username varchar(30),
time varchar(20)
)";

mysql_query($sql,$con);
echo '</br>';
echo mysql_error();

mysql_close($con);

echo '</br> enter'
?>