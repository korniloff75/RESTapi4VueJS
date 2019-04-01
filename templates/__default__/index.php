<!DOCTYPE html>
<html lang="ru">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="Корнилов Павел">
	<meta name="generator" content="KFF-3.0 -  js-master.ru">
	<?php
	# SEO
	if(!empty($CurrentInMap['data']['seo'][0])) {
		echo '<meta name="description" content="' . $CurrentInMap['data']['seo'][0] . '">';
	}
	if(!empty($CurrentInMap['data']['seo'][1])) {
		echo '<meta name="keywords" content="' . $CurrentInMap['data']['seo'][1] . '>';
	}
	?>
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title><?=$CurrentInMap['data']['title']?></title>
	<link rel="stylesheet" href="/templates/core.css">

	<script src="/<?=FRONT_DIR?>/js/Vue/v2.6.10.js"></script>

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
echo "<nav is=\"menu-items\">" . $Cache->get('menu.htm', $ContentObj->createMenu()) . "</nav>\n";
echo "<main is=\"main-content\">";
echo "<h1>{$CurrentInMap['data']['title']}</h1>";
foreach($CurrentInMap['path'] as $path) {
	if(file_exists($path)) require_once($path);
}

echo "</main>";
?>
</div> <!-- #app -->
<script src="/<?=TEMPLATE?>/js/App.js" defer="defer"></script>

<footer>
</footer>

</body>
</html>