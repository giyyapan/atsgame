<?php
$con = mysql_connect('localhost','giyya','fuckmylife');

if (!$con){
  die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['username'] || !$_REQUEST['dataJStr']){
  echo 'error';
  return;
}
$username = $_REQUEST['username'];
$dataJStr = $_REQUEST['dataJStr'];
$password = $_REQUEST['password'];

mysql_select_db('ats', $con);

//check if username avail
$sql = "SELECT * FROM users WHERE username='$username'";
$result = mysql_query($sql,$con);
if (mysql_fetch_array($result)){
  echo '{"succeed":false,errNum:"001","errType","usernameExist"}';
  return;
}

$sql = "INSERT INTO users (username,dataJStr,password,updateTime,uuid) VALUES('$username','$dataJStr','$password','1',uuid())";

//echo $username.' '.$dataJStr.'</br>';

if (!mysql_query($sql,$con))
{
  die('Error: ' . mysql_error());
}

$sql = "SELECT * FROM users WHERE username='$username'";

$result = mysql_query($sql,$con);
///*
if($row = mysql_fetch_array($result))
{
  $uuid = $row['uuid'];
  echo '{"succeed":true,"uuid":"'.$uuid.'"}';
}


mysql_close($con);
//*/
?>