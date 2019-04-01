/*
<script type="text/javascript">
</script>
*/
//== v 5.xxx Назначить путь к локальной папке
DizSel.checkUrl= "/js/Diz_alt_pro/";

// Фиксим существующую верстку
// DA_del
_K.G('$.widget-columns-table').classList.add('DA_del');

_K.G('A$.widget-columns-table').forEach(function(i) {
	i.classList.add('DA_del');
});

// zIndex
_K.DR(function() {
	[].forEach.call(_K.G('A$#altObj #navigation-f2f1c479-7e4b-fc01-fce1-d7d6edfe2536 li ul'), function(i) { _K.G(i, {zIndex: '10000', position:'static'})});
});

// альтернатива стилями
{/* <style>
#altObj #widget-a742daa3-966f-89e6-e325-3ae0d0ce3d49 li {
	display: block;
}
#altObj #widget-a742daa3-966f-89e6-e325-3ae0d0ce3d49 li ul {
	z-index: 1000;
	position: static;
}
</style> */}

// 4 Joomla - вставить в шаблон
// {module kff|showtitle=0}


	//== Изменение расположения кнопки
//	_K.G(DizSel.SlabovidButton, {margin: '0 0 -'+getComputedStyle(DizSel.SlabovidButton).height} ) ;

// колушки
DizSel.SlabovidButtonParent= _K.G('#header');
/*
<style>
#altObj #topmenu li.sublnk:hover ul {
	display: block;
}
</style>
 */

_K.G('#mce-12173').parentNode.parentNode.Append(DizSel.SlabovidButton,'after');

	_K.v.slB= _K.G('$.art-shapes' );
	DizSel.SlabovidButtonParent= _K.v.slB;
	_K.G(_K.v.slB, {position:'relative'} );
	_K.DR(function() {
	//	_K.G(DizSel.SlabovidButton, {left:'',top:'',right:0,position:'absolute',textShadow: '0 0 0 #159', fontSize:'1.4em',backgroundColor:'transparent',color:'#fff',borderWidth:'1px'});
	})




_K.DR(function() {
	var nav= _K.G('$#altObj #topmenu');
	posMenu ();
	DizSel.SlabovidButton.e.add( "click", posMenu);
	_K.G('#toDefault' ).e.add( "click", posMenu);
	function posMenu () {
		if(DizSel.v.DAlt) {
			_K.G(nav, {width: '1000px'});
			_K.G('#vt_main_bg', {clear: 'both'} )
		} else {
			_K.G(nav, {width: ''});
		};
	}
 })


/* ===== Примеры переназначения: =====
=============================== */

	//== Дополнительный обработчик на кнопке
_K.DR(function() {
	DizSel.SlabovidButton.e.add( "click", posMenu);
	_K.G('#toDefault' ).e.add( "click", posMenu);
	var nav= _K.G('A$#uMenuDiv2');

	posMenu ();
	function posMenu () {
		if(DizSel.v.DAlt) {
			[].forEach.call(nav, function(el) { _K.G(el, {color: Cook.get('diz_alt_Col')} ) });

		} else {
			[].forEach.call(nav, function(el) { _K.G(el, {color: ''} ) });

		};
	}
})

	//== Перемещение ПУ вниз
	_K.DR(function() {_K.G(DizSel.PU, {top:'unset', bottom:0}) });

	//== Работа со шрифтом
	DizSel.sts.fontSize.fixed= true; // Фиксируем размер шрифта в формат min/max. При false - итерационное изменение
	DizSel.sts.fontSize.min= 14; // Малый шрифт
	DizSel.sts.fontSize.max= 25; // Большой шрифт

	//== Использование изображения вместо кнопки
	// DizSel.addImg("/wp-content/uploads/2015/04/zrenie.jpg","position:width:100px;cursor:pointer;border:1px solid #117;padding:0"[,"/off.jpg"]);

	//== Использование готового блока вместо кнопки
	DizSel.SlabovidButton= _K.G('#fvb', {background: 'url("/.s/t/805/8.gif") 0 0 / 100% 100%'});

	//== После загрузки страницы:
	_K.DR(function() {
	//== кнопка
	_K.G(DizSel.SlabovidButton, {left:'',top:'',right:'5px',position:'absolute'});
	//== Изменение стилей ПУ
	_K.G(DizSel.PU, {top:'80px'});
	});

	//== Настройка формы входа UCOZ
{/* <style type="text/css" media="screen">
	a.login-with {width:22px;}
</style>
<style type="text/css" media="screen">
div#altBody div.block2_title {padding:0;}
div#altBody #header {height: 100px;}
</style> */}