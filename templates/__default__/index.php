<!DOCTYPE html>
<html lang="ru">
<head>
	<script src="/<?=FRONT_DIR?>/js/Vue/v2.6.10.js"></script>
	<script src="/<?=FRONT_DIR?>/js/axios/0.18.0/axios.min.js"></script>
	<!-- <link rel="stylesheet" href="css/styles.css"> -->
	<style>
	nav li.active {
		font-weight: 900;
	}
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

<header>
	<h2>Testing REST-API for VueJS</h2>
</header>

<div id="app">
	<aside>
		<nav is="menu-items">
			<?= $Cache->get('menu.htm', $ContentObj->createMenu())?>
		</nav>
	</aside>

	<main is="main-content">
		<h1><?=$CurrentInMap['data']['title']?></h1>

		<?=$CurrentInMap['content']?>
	</main>
</div> <!-- #app -->

<!-- Сделана автоподгрузка скриптов из /<?=TEMPLATE?>/js/__defer/
	<script src="/<?=TEMPLATE?>/js/__defer/ColorCode.js" defer="defer"></script> -->
<script src="/<?=TEMPLATE?>/js/App.js" defer="defer"></script>

<footer>
</footer>

</body>
</html>