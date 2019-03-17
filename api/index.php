<?php
# Настройки display_errors etc.
require_once '../commonStart.php';
# FIX pathes
// require_once 'classes/Path.php';
# Класс для работы с JSON-базами
require_once BASE_DIR . '/classes/DbJSON.php';
# Класс для работы с папкой контента
require_once BASE_DIR . '/classes/ParseContent.php';
// require_once 'classes/IteratorFilter.php';
# Класс для работы с API
require_once 'ContentMap.php';

ob_start();


try {
	// echo '<pre>';
	$api = new DataApi();
	// echo '</pre>';

} catch (Exception $e) {
	echo json_encode([
		'error' => $e->getMessage()
	]);
}

exit(profile('base'));

