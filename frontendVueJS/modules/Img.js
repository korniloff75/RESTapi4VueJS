/* <script src="//js-master.ru/js/addons/Img.js" type="text/javascript" defer="defer" charset="utf-8"></script>
	связан с /PHP/thumb.php
========================================= */
"use strict";

// Polyfills
if(![].Step) Array.prototype.Step = function (napr, ind) {
	var i = ind || this.ind || 0;

	this.ind = napr > 0 ?
	(i < (this.length - napr) ? i + napr : 0) :
	((i >= -napr) ? i + napr : this.length - 1);
	// console.log(this.ind);
	// console.log(this[this.ind]);
	return this[this.ind];
};
//  /Polyfills


window.Img= window.Img || {
//======================================== /
	__proto__: null, // нет унаследованных свойств
	inited: 0,

	data: [],

	sts: {
		scriptArea: document.querySelector('#tplge_mainin') || document.querySelector('.content'),
		/*
		if (imgClass == false) - берутся все изображения из scriptArea.
		*/
		imgClass:'toBig',
		ind:null,
		mainStyle: "/* Styles 4 Img.js*/ \n #Img_parentHelp {position:fixed; top:0; left:0; width:100%;text-align:center;z-index:12000; background: #def; opacity: .7; font-size: 1.1em;} \n #Img_parentHelp>*:hover {transform: scale(1.2);} \n #Img_help {cursor:pointer; text-decoration:underline;} \n #Img_bigBlank {color: inherit; text-decoration: underline;} \n",
		style: 'cursor:zoom-in;',
		title:'Кликните для увеличения',
		noList: 0,
		timeSlide: 3
	},

	screen: {
		get W() { return document.documentElement.clientWidth ? document.documentElement.clientWidth : (document.parentWindow || document.defaultView).innerWidth },

		get H() { return document.documentElement.clientHeight ? document.documentElement.clientHeight : (document.parentWindow || document.defaultView).innerHeight }
	},

	init: function() {
		// console.log('Img.inited = ', Img.inited);
		if(Img.inited) return;
		Img.inited = 1;


		Img.sts.imgClass = Img.sts.imgClass ? ((Img.sts.imgClass.indexOf('.') === -1 ? '.' : '') + Img.sts.imgClass) : '';

		if(!window.sv || !window.sv.AJAX) {
			var styleImg = document.createElement('style');
			styleImg.id = 'ImgJs';
			styleImg.textContent = Img.sts.mainStyle + "img" + Img.sts.imgClass + " {" + Img.sts.style + "} ";

			document.head.appendChild(styleImg);
		}


		// Fix 4 Sl_s D:\Domains\js-master.ru\content\articles\freeJS\Простой_слайдер.htm
		// Если Img.data заполнен заранее, изображения на странице не перебираются.
		if(!Img.data.length || window.sv && sv.AJAX) {
			// FIX 4 AJAX
			Img.data = [];

			[].forEach.call(Img.sts.scriptArea.querySelectorAll('img' + Img.sts.imgClass), function(i) {
				// _K.G(i, Img.sts.style, {title: Img.sts.title});
				i.title = Img.sts.title;

				//== Если работает JS - отключаем серверную обертку
				if (Img.sts.imgClass && i.parentNode.tagName==='A') i.parentNode.onclick= function(e) {
					e.preventDefault();
					return false;
				};

				//== Вписываем адреса полных изображений
				i.fixSrc= i.src.replace(/^(.+)\/thumb/i, "$1");

				Img.data.push(i);
			});
		}


		console.log('Img.data.length = ', Img.data.length);

		if (!Img.data.length) return;


		//== Навешиваем обработчик на scriptArea
		Img.sts.scriptArea.addEventListener('click', Img.increase );

	}, // init


	close: function (e) {
		if (e.keyCode && e.keyCode !== 27) return;

		e.preventDefault();
		e.stopPropagation();

		if(!!Img.canvas) {
			Img.canvas.remove();
			Img.canvas = null;
		}

		document.removeEventListener('keydown', Img.list);

		window._K && _K.Event.wait.end();
//		_K.l("Img.sts.slide= ", Img.sts.slide);
		Img.sts.slide = clearInterval(Img.sts.slide);
	},

	iChange: function(napr) {
		window._K && _K.Event.wait.start();
		Img.data.some(function(i,ind) {
			i.fixSrc = i.fixSrc || i.src;
			//== Получаем индекс текущего изображения
			return Img.sts.ind = (Img.front.src === i.fixSrc)? ind: null;
		});
		var Img_bigBlank = document.querySelector("#Img_bigBlank" );


		Img.front.src= Img.data.Step(napr, Img.sts.ind).fixSrc;

		Img.center();

		Img_bigBlank && (Img_bigBlank.href= Img.front.src);
	},

	list: function(e) { //== Листинг клавишами
		e = e || window.event;
		if (!Img.canvas) return;

		if (e.keyCode == 37) Img.iChange(-1);
		if (e.keyCode == 39) Img.iChange(1);
	},

	drag: {
		mousedown: function(e) { //	Img.drag // ,	touchstart : Img.drag
			e = e || window.event;
			e.preventDefault(); e.stopPropagation();

			//== устанавливаем первоначальные значения координат объекта
			this.mousePosX= e.pageX || e.changedTouches[0].pageX;
		},

		mouseup: function(e) {
			var d= this.mousePosX - (e.pageX || e.changedTouches[0].pageX) ;
			Math.abs(d)>10 && Img.iChange(Math.sign(d));
		},

		mousemove: function(e) {
			e.preventDefault(); e.stopPropagation();
		}
	},


	center: function() {
		if(!Img.front) return;

		var gCW=  Img.screen.W,
		gCH= Img.screen.H,
		img_big_h= parseInt(getComputedStyle(Img.front).height),
		img_big_w= parseInt(getComputedStyle(Img.front).width);


		if ((img_big_h / img_big_w)>= gCH/gCW) {
			// Port
			Img.front.style.height = gCH*.95 +'px';
			Img.front.style.width = 'auto';
			Img.front.style.left = (gCW- gCH*.9 * img_big_w / img_big_h)/2 +'px';
			Img.front.style.top = gCH*.05+'px';
			// console.log(gCH, Img.front.style.height, Img.front.style.top);
		} else {
			// Alb
			Img.front.style.width = gCW +'px';
			Img.front.style.height = 'auto';
			Img.front.style.left = 0;
			Img.front.style.top = (gCH-img_big_h)*.5+'px'
		}

	},



	increase: function(e) {
		e = e || window.event;
		var t= e.target || e.srcElement;
		// console.log(Img.sts.scriptArea);

		//== Проверяем на соответствие
		if (e.which != 1 || t.tagName!=='IMG' || Img.sts.imgClass && !t.classList.contains(Img.sts.imgClass.substr(1))) return;
		// !Img.data.includes(t)
		e.preventDefault();
		e.stopPropagation();

		//== Создаем увеличение
		Img.canvas = document.createElement('div');
		Img.canvas.id = 'Img_canvas';

		Img.back = document.createElement('div');
		Img.back.style.cssText = 'width:100%;height:100%;position:fixed; top:0; left:0; background:#999; z-index:10000; opacity:.9; cursor: zoom-out;';

		Img.front= document.createElement('img');
		Img.front.style.cssText = 'max-width:98%;position:fixed; top:-2000px;z-index:11000; padding:5px; background:#fff; border:1px solid #777; border-radius:20px; box-shadow:3px 3px 4px 1px #555;';

		Img.canvas.appendChild(Img.back);
		Img.canvas.appendChild(Img.front);


		Img.front.src= t.src.replace(/(.+)\/thumb/, "$1") ;


		window._K && _K.Event.wait.start();
		document.addEventListener("keyup", Img.close);

		Img.parentHelp = document.createElement('div');
		Img.parentHelp.id = "Img_parentHelp";

		Img.parentHelp.onclick= function(e) {
			e.stopPropagation();
		};

		Img.parentHelp.innerHTML += "&middot; <span id='Img_help' onclick='this.innerHTML= \"<b>&#x2190;</b> Предыдущий | Следуюций <b>&#x2192;</b> | Закрыть - ESCAPE\";' title='Использование клавиатуры'>Подсказка</span>" + ' &middot; <a id="Img_bigBlank" class="NOajax" href="'+Img.front.src+'" target="_blank" >Полный размер</a> <span onclick="Img.slide(event)" style="cursor:pointer; text-decoration:underline;">Слайдшоу</span>';

		Img.canvas.appendChild(Img.parentHelp);

		document.body.appendChild(Img.canvas);

		if(!Img.sts.noList) document.addEventListener("keydown", Img.list);

		var evs = {
			mousedown : Img.drag.mousedown,
			mouseup: Img.drag.mouseup,
			mousemove: Img.drag.mousemove,
			touchstart: Img.drag.mousedown,
			touchmove: Img.drag.mousemove,
			touchend: Img.drag.mouseup,
			load: function(e) {
				Img.back.addEventListener("click",Img.close);
				// Img.back.e.add("click",Img.close);
				Img.center();
				window._K && _K.Event.wait.end();
			}
		};

		Object.keys(evs).forEach(function(i) {
			Img.front.addEventListener(i, evs[i], true)
		});

	},

	slide: function slide(e) {
		var b = e.target;
		// document.querySelector('#Img_help').hidden=1;
		// document.querySelector('#Img_bigBlank').hidden=1;

		Img.sts.slide = Img.sts.slide || setInterval(function() {Img.list({keyCode:39})} , Img.sts.timeSlide * 1000);

		b.onclick = function() {Img.sts.slide=clearInterval(Img.sts.slide); this.textContent= 'Слайдшоу'; this.onclick= slide};
		b.textContent = 'Остановить';

	}
};
//========================================= /

if(Img.init) document.addEventListener('DOMContentLoaded', Img.init.bind(Img));