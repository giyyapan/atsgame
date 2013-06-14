<?php
$con = mysql_connect('localhost','giyya','fuckmylife');

if (!$con){
  die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['uuid']){
  echo 'error require uuid';
  return;
}
$uuid = $_REQUEST['uuid'];

mysql_select_db('ats',$con);

$sql = "SELECT * FROM users WHERE uuid='$uuid'";
$result = mysql_query($sql,$con);

if (!$row = mysql_fetch_array($result)){
  echo '{"succeed":false,"errNum":"001","errType":"no such uuid"}';
  return;
}else{
  $dataJStr = $row['dataJStr'];
  echo '{"succeed":true,"dataJStr":'.$dataJStr.',"username":"'.$row['username'].'"}';
  return;
}

mysql_close($con);
?>