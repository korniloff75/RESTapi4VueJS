<?php
ob_start();

# Подключение классов, настройки display_errors etc...
require_once 'commonStart.php';

$ContentObj = new ParseContent(CONTENT_DIRNAME . "/");
# Caching
$Cache = new Caching;
$CurrentInMap = $ContentObj->getFromMap();


# Формируем простой вывод для ПС
# и первой загрузки SPA
require_once(TEMPLATE . "/index.php");

$response = ob_get_clean();

# Отдаём для ПС
header('Content-type: text/html; charset=utf-8');
echo $response;

die(\DEV? \H::profile('base'): null);
#####

echo '<pre>';

print_r(
	trim($_SERVER['REQUEST_URI'],'\\/')
);
// print_r($ContentObj->ContentMap);

echo "\n===============\n";

echo '</pre>';
