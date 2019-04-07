<?php
ob_start();

define('BASE_DIR', __DIR__);

# Подключение классов, настройки display_errors etc...
require_once 'core/commonStart.php';

$ContentObj = new ParseContent(CONTENT_DIRNAME . "/");
# Caching
$Cache = new Caching;
$CurrentInMap = $ContentObj->getFromMap();

# Переменные для клиента
$SV = [
	'DEV' => \DEV,
	'DIR' => \H::$Dir,
	'ASSETS' => \H::$Dir . '/assets',
];

# Формируем простой вывод для ПС
# и первой загрузки SPA
require_once(TEMPLATE . "/index.php");

$Response = ob_get_clean();

# ADD META
$Meta = '<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="Корнилов Павел">
<meta name="generator" content="KFF-3.1.1 -  js-master.ru">
<meta http-equiv="X-UA-Compatible" content="ie=edge">';

if(!empty($CurrentInMap['data']['seo'][0])) {
	$Meta .= '<meta name="description" content="' . $CurrentInMap['data']['seo'][0] . '">';
}
if(!empty($CurrentInMap['data']['seo'][1])) {
	$Meta .= '<meta name="keywords" content="' . $CurrentInMap['data']['seo'][1] . '">';
}

# ADD Title
$Title = "\n<title>{$CurrentInMap['data']['title']}</title>\n";

#
$Response = preg_replace("/<head>/", "
$0
$Meta
$Title
<link rel=\"stylesheet\" href=\"/templates/core.css\">
<!-- Загружаем скрипты для кеширования-->
<script>window.sv=" . Caching::toJSON($SV) . "</script>
<script src=\"/" . FRONT_DIR . "/js/polyfills.js\"></script>
<script src=\"/" . FRONT_DIR . "/js/__Helper.js\"></script>
<!-- /Загружаем скрипты для кеширования-->
", $Response);

# Отдаём для ПС
header('Content-type: text/html; charset=utf-8');
// echo $CurrentInMap['data']['title'];
echo $Response;

die(\DEV? \H::profile('base'): null);
#####

echo '<pre>';

echo "\n===============\n";

echo '</pre>';
