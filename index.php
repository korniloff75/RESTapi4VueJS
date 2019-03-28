<?php
ob_start();

# Подключение классов, настройки display_errors etc...
require_once 'commonStart.php';

$contentObj = new ParseContent('content/');
# Caching
$cache = new Caching;
$currentInMap = $contentObj->getFromMap();

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
	# SEO
	if(!empty($currentInMap['data']['seo'][0])) {
		echo '<meta name="description" content="' . $currentInMap['data']['seo'][0] . '">';
	}
	if(!empty($currentInMap['data']['seo'][1])) {
		echo '<meta name="keywords" content="' . $currentInMap['data']['seo'][1] . '>';
	}
	?>
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$currentInMap['data']['title']?></title>
	<link rel="stylesheet" href="/templates/core.css">

	<script src="/<?=FRONT_DIR?>/js/vue/v2.6.10.js"></script>

	<script src="/<?=FRONT_DIR?>/js/axios/0.18.0/axios.min.js"></script>
	<link rel="stylesheet" href="css/styles.css">
	<style>
	main.fade-enter-active {
		transition: opacity 1.2s;
	}
	/*
	.fade-leave,
	.fade-leave-active,
	.fade-leave-to {
		display: none,
		transition: none;
	}
	*/
	main.fade-enter, main.fade-leave-to {
		opacity: 0;
	}
	</style>
</head>

<body>
<header></header>
<div id="app">
<?php
echo "<nav is=\"menu-items\">" . $cache->get('menu.htm', $contentObj->createMenu()) . "</nav>\n";
echo "<main is=\"main-content\">";
echo "<h1>{$currentInMap['data']['title']}</h1>";
foreach($currentInMap['path'] as $path) {
	if(file_exists($path)) require_once($path);
}

echo "</main>";
?>
</div> <!-- #app -->
<script src="/<?=FRONT_DIR?>/js/App.js" defer="defer"></script>

<footer>
</footer>

</body>
</html>

<?php
$response = ob_get_clean();

# Отдаём для ПС
header('Content-type: text/html; charset=utf-8');
echo $response;

exit(\DEV? profile('base'): null);
#####

echo '<pre>';

print_r(
	trim($_SERVER['REQUEST_URI'],'\\/')
);
// print_r($contentObj->ContentMap);

echo "\n===============\n";

echo '</pre>';
