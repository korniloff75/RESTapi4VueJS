<?php
define('BASE_DIR', ('..'));
# Настройки display_errors etc.
require_once BASE_DIR . '/core/commonStart.php';
// require_once '../core/commonStart.php';
require_once 'Caching.php';

# Разбираем параметры, разделённые слешем
$requestUri = explode('?', $_SERVER['REQUEST_URI'])[0];
$requestUri = explode('/', trim($requestUri,'\\/'));

$enterPoint = array_shift($requestUri);

# fix 4 USA host
if($enterPoint === 'restAPI') $enterPoint = array_shift($requestUri);

$apiName = ucfirst(array_shift($requestUri));
$id = array_shift($requestUri) ?? null;

ob_start();

if(\DEV) foreach($tmp['notes'] ?? [] as $note) {
	print_r($note);
}

try {
	// echo '<pre>';

	# Проверяем соответствие
	if(
		$enterPoint !== 'api' ||
		!file_exists("$apiName.php")
	)
	{
		throw new RuntimeException('Undefined request. API Not Found', 404);
	}

	unset($enterPoint, $requestUri);

	# Класс для работы с API
	require_once "$apiName.php";

	new $apiName($id);

	// echo '</pre>';

} catch (Exception $e) {
	echo \Caching::toJSON([
		'error' => $e->getMessage()
	]);
}