<?php
# Подключение классов, настройки display_errors etc...
require_once 'commonStart.php';

ob_start();
######

$contentObj = new ParseContent('content/');
# Caching
$cach = new Caching;
$currentInMenu = $contentObj->getFromMap();

# Формируем простой вывод для ПС
?>

<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="Корнилов Павел">
	<meta name="generator" content="KFF-3.0 -  js-master.ru">
	<?php
	if(!empty($currentInMenu['data']['seo'][0])) {
		echo '<meta name="description" content="' . $currentInMenu['data']['seo'][0] . '">';
	}
	if(!empty($currentInMenu['data']['seo'][1])) {
		echo '<meta name="keywords" content="' . $currentInMenu['data']['seo'][1] . '>';
	}
	?>
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$currentInMenu['data']['title']?></title>
	<link rel="stylesheet" href="/templates/core.css">
</head>

<body>

<?php
echo "<nav>" . $cach->get('menu.htm', $contentObj->createMenu()) . "</nav>\n";
echo "<main>";
echo "<h1>{$currentInMenu['data']['title']}</h1>";
if(file_exists(\H::$File)) require_once(\H::$File);
echo "</main>";
?>

</body>
</html>

<?php
$response = ob_get_clean();

# Отдаём для ПС
header('Content-type: text/html; charset=utf-8');
echo $response;

exit(profile('base'));
#####

echo '<pre>';

print_r(
	trim($_SERVER['REQUEST_URI'],'\\/')
);
// print_r($contentObj->ContentMap);

echo "\n===============\n";

echo '</pre>';
