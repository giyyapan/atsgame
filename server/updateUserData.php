<?php
$con = mysql_connect('localhost','giyya','fuckmylife');

if (!$con){
 die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['uuid'] || !$_REQUEST['dataJStr'] || !$_REQUEST['updateTime'] || !$_REQUEST['dataValue']){
  echo 'error! require uuid , dataJStr and updateTime';
  return;
}
$uuid = $_REQUEST['uuid'];
$dataJStr = $_REQUEST['dataJStr'];
$updateTime = $_REQUEST['updateTime'];
$dataValue = $_REQUEST['dataValue'];

$key = md5($updateTime.'qwervbnm22112');

/*
if ($dataValue != md5($dataJStr.$key)){
  //echo $dataValue.' '.md5($dataJStr.$key);
  echo '{"succeed":false,"errNum":"999","errType":"cheat"}';
  return;
}
*/


mysql_select_db('ats',$con);

$sql = "SELECT * FROM users WHERE uuid='$uuid'";
$result = mysql_query($sql,$con);

if (!mysql_fetch_array($result)){
  echo '{"succeed":false,"errNum":"001","errType":"no such uuid"}';
  return;
}else{
  $sql = "UPDATE users SET dataJStr='$dataJStr' WHERE uuid='$uuid'";
  mysql_query($sql,$con);
  $sql = "UPDATE users SET updateTime='$updateTime' WHERE uuid='$uuid'";
  mysql_query($sql,$con);

  echo '{"succeed":true}';
}

mysql_close($con);
?>