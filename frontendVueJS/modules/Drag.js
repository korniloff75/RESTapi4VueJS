/* <script src="//js-master.ru/js/addons/Drag.js" type="text/javascript" defer="defer" charset="utf-8"></script>
========================================= */
"use strict";
window.Drag= {
//======================================== /
	sts: {
		inited: false,
		$dragZone: $('body'),
		els: '.drag_obj',
		handle: '.drag_handle',
		//== Псевдомассив перемещаемых элементов
		get gDrags() {return this.$dragZone.find(this.els)},
		set stDrag (st) { // Оформление
			Drag.$styles = Drag.$styles || $('<style />', {type:'text/css'}).appendTo('head')
			.html(st);
		},
		minDrag: 3, // Минимальный интервал перемещения
		memCh: $f('#sohr')[0]
	},

	init:  function () {
		Drag.sts.Drags= Drag.sts.gDrags;
		// console.log(Drag.sts.gDrags);
		if(Drag.inited || !Drag.sts.Drags) return;

		Drag.inited = 1;

		this.sts.stDrag= this.sts.els + " { position:relative; /* cursor:move; */ } ";

		Object.defineProperties(Drag.sts.Drags, {
			'some': {value: Array.prototype.some},
			'includes': {value: Array.prototype.includes}
		});

		Drag.sts.$dragZone.on({
			mousedown : Drag.obj,
			mouseup : function(e) {
				var el = Drag.target;

				if (!el || !el.moved) return;

				el.moved = 0;
				el.style.zIndex-=-1;
				el.clicked = false; //== ЛКМ отпущена
				// console.log(Drag.sts.memCh);
				if(Drag.sts.memCh) {
					var c = {};

					// console.log(el.pos, Drag.sts.memCh, Drag.target );

					c[el.pos] = el.style.left+'_'+el.style.top;
					$.cookie.set( c, {expires: 10, path: '#'} );
				}
			},

			mousemove : function(e) {
				e= $().e.fix(e);

				if (!Drag.target || !Drag.target.clicked || [Math.abs(Drag.target.mousePosX-e.pageX), Math.abs(Drag.target.mousePosY-e.pageY)].Max < Drag.sts.minDrag) return;

				var el = Drag.target;
				el.moved = 1;
				e.preventDefault();
				var posLeft = el.style.left && parseInt( el.style.left ) || 0,
				posTop = el.style.top && parseInt( el.style.top ) || 0;

				el.style.left = posLeft + e.pageX - el.mousePosX + 'px';
				el.style.top = posTop + e.pageY - el.mousePosY + 'px';
				el.mousePosX = e.pageX; el.mousePosY = e.pageY;
			}
		});


		Drag.sts.Drags.each(function(ind, i) {
			// Маркируем перемещаемые элементы свойствами смещения left & top
			i.pos= 'pos'+ind;
			// Участок для перетаскивания
			i.$Handle= $(i).find(Drag.sts.handle);
			$(i.$Handle || i).css({cursor:"move"}).attr({title:"Переместить"});
			// Запоминаем начальные значения left & top
			i['pos'+ind]= [getComputedStyle(i).left || 0 , getComputedStyle(i).top || 0];
		});

		if(!this.sts.memCh) return;
		// Если включено сохранение позиций
		this.sts.memCh.checked=  $.cookie.get('sohr') == true;

		this.sts.memCh.onchange= Drag.restore;
		this.restore();
	}, // init


	obj: function ( e )  {
		e = $().e.fix(e);
		if (e.which != 1) return; //== ЛКМ

		//== Определяем объект клика и наличие Handle
		var el= e.target,
			h= !Drag.sts.Drags.includes(el) &&  el.closest(Drag.sts.els);
		// console.log(el, el.closest('.drag_handle'));

		//== Есть Handle
		// console.log(el, h);
		if (h) {
			if (!h.$Handle.length || h.$Handle[0] === el) el = h;
			else return;
		}

		// define target
		Drag.target = el;

		e.preventDefault();
		e.stopPropagation();
		el.clicked = true; //== ЛКМ нажата
		//== устанавливаем первоначальные значения координат объекта
		el.mousePosX= e.pageX; el.mousePosY = e.pageY;

		//== обработка координат указателя мыши и изменение позиции объекта

	},

	restore: function() {
		Drag.target = 0;
		$.cookie.set({sohr : +Drag.sts.memCh.checked }, {expires: 10, path: '#'}) ;
		var posSt;
		Drag.sts.Drags.each(function(ind, i) {
			if($.cookie.get('sohr') == 0) $.cookie.remove ({path: '#'}, i.pos);
			posSt= $.cookie.get(i.pos) && $.cookie.get(i.pos).split('_') || i[i.pos] || [0,0]; //== nE!
			$(i).css({
				left : posSt[0],
				top : posSt[1]
			});
		})
	}
};

$(Drag.init.bind(Drag));