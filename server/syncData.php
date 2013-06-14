<?php
$con = mysql_connect('localhost','giyya','fuckmylife');
if (!$con){
  die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['uuid']){
  echo '{"succeed":false,"errNum":"001","errType":"wrong uuid"}';
  return;
}
$uuid = $_REQUEST['uuid'];
mysql_select_db('ats',$con);

$result = mysql_query("SELECT * FROM users
WHERE uuid='$uuid'");

while($row = mysql_fetch_array($result))
  {
  $dataJStr = $row['dataJStr'];
  echo '{"succeed":true,"dataJStr":"$dataJStr"}'
  return;
  }
mysql_close($con);
?>