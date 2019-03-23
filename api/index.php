<?php
# Настройки display_errors etc.
require_once '../commonStart.php';


# Разбираем параметры, разделённые слешем
$requestUri = explode('?', $_SERVER['REQUEST_URI'])[0];
// print_r($requestUri . '<br>');
// @list($enterPoint, $apiName, $id) = explode('/', trim($requestUri,'\\/'));

$requestUri = explode('/', trim($requestUri,'\\/'));
$enterPoint = array_shift($requestUri);

# fix 4 USA host
if($enterPoint === 'restAPI') $enterPoint = array_shift($requestUri);

$apiName = ucfirst(array_shift($requestUri));
$id = array_shift($requestUri) ?? null;

ob_start();

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
	echo json_encode([
		'error' => $e->getMessage()
	]);
}