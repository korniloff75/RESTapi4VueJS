<?php
if (version_compare(PHP_VERSION, '7.0', '<') ) die("<h3>Обновите версию PHP!</h3>");

define('DEV', true);

if(\DEV)
{
	# Develop
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(-1);
	ini_set('max_execution_time', 5);
} else {
	#Production
	ini_set('display_errors', 0);
	ini_set('display_startup_errors', 0);
	error_reporting(0);
	ini_set('max_execution_time', 100);
}
ini_set('date.timezone', "Europe/Moscow");

ini_set(
	'include_path', get_include_path()
	. PATH_SEPARATOR . BASE_DIR . '/core/classes'
);


define('TEMPLATE', 'templates/__default__');
define('CACHE_DIR', BASE_DIR . '/cache');
define('FRONT_DIR', 'frontendVueJS');

define('TEST', 0);

// define('CONTENT_DIRNAME', $_SERVER['SERVER_PORT'] == 90 ? 'content_my' : 'content');
define('CONTENT_DIRNAME', $_SERVER['SERVER_PORT'] == 90 && !TEST ? 'content_my' : 'content');
// var_dump($_SERVER['SERVER_PORT'] == 90 && !TEST, CONTENT_DIRNAME);

define('CONTENT_DIR', BASE_DIR . '/' . CONTENT_DIRNAME);

if(!file_exists(CONTENT_DIR)) {
	throw new Exception('Нет директории с контентом: ' . CONTENT_DIR, 500);
}
/* else {
	var_dump(CONTENT_DIR, file_exists(CONTENT_DIR));
} */
// var_dump($_SERVER);


# FIX pathes
require_once 'Path.php';
# Helper singleton
require_once '_Helper.php';
# Класс для работы с папкой контента
require_once 'ParseContent.php';
# Кэширование
require_once 'Caching.php';

$tmp=[];