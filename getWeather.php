<?php
header( "Content-Type: application/json; Charset=utf-8" );
header( "pragma: no-cache" );
header( "Expires: Wed, 9 Feb 2100 14:59:58 GMT" );
header( "Cache-control: no-cache" );
header( "Access-Control-Allow-Origin: *" );


if ( $_GET['city'] == '' ) {
	$_GET['city'] = "270000";
}

$work = file_get_contents( "http://weather.livedoor.com/forecast/webservice/json/v1?city={$_GET['city']}" );
$obj = json_decode( $work );
$work = json_encode( $obj, JSON_UNESCAPED_UNICODE | 128 );	//‘æ2ˆø”’ˆÓ

print $work;
?>

