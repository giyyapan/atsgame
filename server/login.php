<?php
$con = mysql_connect('localhost','giyya','fuckmylife');

if (!$con){
  die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['username']){
  echo 'error';
  return;
}
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];

mysql_select_db('ats', $con);

//check if username avail
$sql = "SELECT * FROM users WHERE username='$username'";
$result = mysql_query($sql,$con);

if ($row = mysql_fetch_array($result)){
  //echo $password.' '.$row['password'];
  if ($password == $row['password']){

	$uuid = $row['uuid'];
	echo '{"succeed":true,"uuid":"'.$uuid.'"}';
  }else{
	echo '{"succeed":false,"errNum":"002","errType":"wrong password"}';
  }
}else{
  echo '{"succeed":false,"errNum":"001","errType":"no such user"}';
}


mysql_close($con);
//*/
?>