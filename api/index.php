<?php
# Настройки display_errors etc.
require_once '../commonStart.php';


# Разбираем параметры, разделённые слешем
@list($enterPoint, $apiName, $id) = explode('/', trim($_SERVER['REQUEST_URI'],'\\/'));
$apiName = ucfirst($apiName);

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

	unset($enterPoint);

	# Класс для работы с API
	require_once "$apiName.php";

	new $apiName($id);

	// echo '</pre>';

} catch (Exception $e) {
	echo json_encode([
		'error' => $e->getMessage()
	]);
}