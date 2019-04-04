<!DOCTYPE html>
<html lang="ru">
<head>
	<script src="/<?=FRONT_DIR?>/js/Vue/v2.6.10.js"></script>
	<script src="/<?=FRONT_DIR?>/js/axios/0.18.0/axios.min.js"></script>
	<!-- <link rel="stylesheet" href="css/styles.css"> -->
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

<script src="/<?=TEMPLATE?>/js/__defer/ColorCode.js" defer="defer"></script>
<script src="/<?=TEMPLATE?>/js/App.js" defer="defer"></script>

<footer>
</footer>

</body>
</html>