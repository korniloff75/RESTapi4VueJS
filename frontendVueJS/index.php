<?php

?>

<!DOCTYPE html>
<html lang="ru">

<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<script src="<?=FRONT_DIR?>/js/vue.js"></script>

	<script src="<?=FRONT_DIR?>/js/axios/0.18.0/axios.min.js"></script>
	<link rel="stylesheet" href="css/styles.css">

</head>


<body>
	<header>
		<h1>Frontend for RestAPI</h1>
	</header>

	<div id="app">
		<aside>
			<nav is="menu-items"></nav>
		</aside>

		<main is="main-content">
			<!--  -->
		</main>

		<footer></footer>

	</div> <!-- #app -->

	<script src="<?=FRONT_DIR?>/js/App.js"></script>

</body>

</html>
