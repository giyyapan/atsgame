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
$username = $_REQUEST['username'];
$score = $_REQUEST['score'];
$time = $_REQUEST['time'];
$uploadTime = $_REQUEST['uploadTime'];
$dataValue = $_REQUEST['dataValue'];

$key = md5($uploadTime.'qwervbnm22112');

/*
if ($dataValue != md5($challengeName.$username.$score.$key)){
  //echo '{"succeed":false,"errNum":"999","errType":"cheat"}';
  //return;
}
*/
mysql_select_db('ats',$con);

//count :
$result = mysql_query("SELECT COUNT(*) FROM challengeScores WHERE challengeName='$challengeName'"
					  ,$con);

//print_r(mysql_fetch_array($result));
$row = mysql_fetch_array($result);

if ($row[0] >= 30){
  $_result = mysql_query("SELECT * FROM challengeScores WHERE challengeName='$challengeName' ORDER BY score ASC",$con);
  $_row = mysql_fetch_array($result);

  $_challengeName = $_row['challengeName'];
  $_username = $_row['username'];
  $_score = $_row['score'];
  
  if ($score < $_score){
	echo '{"succeed":false,"errNum":"002","errType":"Not high enough to enter top 100"}';
	return;
  }
  mysql_query("DELETE FROM challengeScores WHERE challengeName='$_challengeName' AND username='$_username' AND score='$_score'",$con);
}

$sql = "INSERT INTO challengeScores (challengeName,username,score,time) VALUES('$challengeName','$username','$score','$time')";

if (!mysql_query($sql,$con))
{
  die('Error: ' . mysql_error());
  return;
}

$sql = "SELECT * FROM challengeScores WHERE challengeName='$challengeName' ORDER BY score DESC";
$result = mysql_query($sql,$con);

$timer = 1;
while($row = mysql_fetch_array($result)){
  if ($row['username']==$username && $row['score']==$score){
    break;
  }
  $timer ++;
}
echo '{"succeed":true,"number":'.$timer.'}';

?>