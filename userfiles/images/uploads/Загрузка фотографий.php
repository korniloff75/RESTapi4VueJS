<?php
# Этот код вставлять в то место, где должен работать модуль.

global $pth;
// Путь к скрипту
$path_script= $pth['folder']['base'] . 'PHP/classes/ImgOnMap.php';


require_once($path_script);
$wall= new Wall('foto', [
		// Размер миниатюры
		'min' => '70px', 
		// Максимальный размер файла в байтах
		'max' => 500*1024
	], 
// Путь к директории для загрузки пользовательских фото
$pth['folder']['base'] . 'userfiles/images/uploads/'
);

?>

<style>
#<?= $wall->wallID; ?> {width:100%; height:500px; position:relative; border:1px solid red; cursor:pointer; background: url("<?=$pth['folder']['base']?>userfiles/images/uploads/карта.jpg") center/contain no-repeat}
img.big {width:100% !important;}
</style>