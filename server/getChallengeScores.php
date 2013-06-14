<?php
$con = mysql_connect('localhost','giyya','fuckmylife');

if (!$con){
  die('Could not connect: ' . mysql_error());
}
if (!$_REQUEST['challengeName']){
  echo 'error require challengeName';
  return;
}
$challengeName = $_REQUEST['challengeName'];

mysql_select_db('ats',$con);

$sql = "SELECT * FROM challengeScores WHERE challengeName='$challengeName' ORDER BY score DESC";
$result = mysql_query($sql,$con);

$scoresArray = '[';
$timer = 0;
 
while($row = mysql_fetch_array($result)){
  if ($timer != 0){
    $scoresArray .= ',';
  }
  
  $timer ++;
  if (!$row['time']){
    $row['time'] = 1;
  }
  $newObj = '{"username":"'.$row['username'].'","score":'.$row['score'].',"time":'.$row['time'].'}';
  $scoresArray .= $newObj;
}
$scoresArray .= ']';

echo '{"succeed":true,"scoresArray":'.$scoresArray.'}';


mysql_close($con);

?>