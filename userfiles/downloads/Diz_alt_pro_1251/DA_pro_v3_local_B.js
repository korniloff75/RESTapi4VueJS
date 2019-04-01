/******************************************
Copyright KorniloFF-ScriptS ©
https://js-master.ru
*******************************************/
"use strict";
window.DizSel = window.DizSel || !!_K && {
	__proto__: _K,
	version: '3.6.1',

	get checkUrl() {
		return '/js/Diz_alt_pro/';
	},
	set checkUrl(uri) {
		Object.defineProperty(this, 'checkUrl', { value: uri});
	},

	SlabovidButtonParent: _K.G('$body'),

	addons: {},
	sts: {},
	v: { ch: 0 },
	log: [],


	init: function () {
		// console.log(DizSel.addons.db.src);
		this.altObj = _K.body().cr('div', { id: 'altObj', style: 'position:absolute; left:0; top:0; z-index:30000; width:100%; padding:20px; margin:0;', hidden: 1 });

		DizSel.Backup= {
			altBody: _K.G('#altBody') || this.altObj.cr('div', { id: 'altBody' }),
			altBack: this.altObj.cr('div', {id:'mask'}),

			save: function () {
				DizSel.v.start = new Date();
				DizSel.Backup.altBody.innerHTML = '';

				//== Запоминаем размеры
				DizSel.fns.getNodes(function (i) {
					i.setAttribute('fsIsh', Math.max(DizSel.sts.fontSize.min, parseInt(getComputedStyle(i).fontSize))) }, this.obj
				);
				[].forEach.call(this.obj.childNodes, function (i) { DizSel.Backup.altBody.Clone(i) });

				_K.G('A$div#altObj .DA_del').forEach(function (i) { _K.G(i).remove() });
				DizSel.fns.getNodes(function (i) {
					DizSel.fns.setCol(i);
					DizSel.fns.setFS(i)
				}); //== Сохранение начального размера

				DizSel.v.speed = new Date().getTime() - DizSel.v.start.getTime();
				var speedScr = _K.G('#speedScr');
				if (speedScr) speedScr.textContent = DizSel.v.speed;
			}, // save

			get obj() { return _K.G('$body'); }

		}; // Backup

		DizSel.inited = DizSel.inited && DizSel.inited++ || 1;
		DizSel.log.push("DizSel.inited= " + DizSel.inited);
		if (!_K.isObject()) {
			console.error('missing _K');
			return;
		}

		if (!_K.prot || !!_K.v.diz) return;
		//== Создаем ссылки на основной и добавочный стили
		DizSel.style_BG = _K.G('$head').cr('link', { href: DizSel.checkUrl + 'Uni_3.css', rel: 'StyleSheet', type: 'text/css' }).cr('link', { href: '', rel: 'StyleSheet', type: 'text/css' }, 'after');

		//==
		DizSel.createBGs();
		//	console.profile();

		DizSel.fns.imageOff();
		DizSel.CheckCook();
		/* DizSel.v.speed = new Date().getTime() - DizSel.v.start.getTime(); */
		//==
		//	console.profileEnd();
		DizSel.fns.floatTip.init();
		//	DizSel.fns.lightCur();
		DizSel.log.push('Скорость отработки скрипта - ' + DizSel.v.speed + ' мс');
		// var speedScr = _K.G('#speedScr');
		// if (speedScr) speedScr.textContent = DizSel.v.speed;
		// _K.i('Diz_alt_pro LOG: \n-------------------------\n' + DizSel.log.join('\n'));

	}, // init

	addStyleSheet: function () {
		if (Cook.get('diz_alt') === 'y') { Cook.set({ diz_alt: 'n' }, DizSel.sts.mem); } else { Cook.set({ diz_alt: 'y' }, DizSel.sts.mem); };
		DizSel.CheckCook();
	},

	PUopacity: function () { //== Анимация прозрачности ПУ
		DizSel.PUanimate = setInterval(function () {
			if (DizSel.PU.style.opacity <= 0.1) {
				clearInterval(DizSel.PUanimate); return;
			}
			DizSel.PU.style.opacity = DizSel.PU.style.opacity - .015;
		}, 30);
	},

	CheckCook: function () { //== При загрузке и КАЖДОМ КЛИКЕ на SlabovidButton
		DizSel.v.DAlt = Cook.get('diz_alt') === 'y'; //== кешируем diz_alt
		this.SlabovidButton.value = this.SlabovidButton.title = this.sts.button.value;

		if (!!_K.G('#puzadpn')) { //== Проверяем не Юкоз ли это? Выставляем отступ контента
			this.PU.style.top = parseInt(getComputedStyle(_K.G('#puzadpn')).height) * 1.2 + 'px';
			_K.body().style.top = +(this.PU.style.top) * 1.1 + parseInt(getComputedStyle(DizSel.PU).height) + 'px';
			DizSel.log.push('getComputedStyle(_K.G(\'#puzadpn\')).height= ' + (getComputedStyle(_K.G('#puzadpn')).height || 'нету'));
		} else if (_K.G('#wpadminbar')) { //== Проверяем не ВП ли это? Выставляем отступ контента
			this.PU.style.top = getComputedStyle(_K.G('wpadminbar')).height;
		} else _K.G(DizSel.altObj).style.paddingTop = (parseInt(getComputedStyle(DizSel.PU).height) || 45) + 'px';
		DizSel.log.push('getComputedStyle(DizSel.PU).height= ' + getComputedStyle(DizSel.PU).height);
		DizSel.PU.e.add({
			mouseover: 'DizSel.hasOwnProperty(\'PUanimate\') && clearInterval (DizSel.PUanimate); this.style.opacity=1;',
			mouseout: DizSel.PUopacity
		});

		////////////////////////////////////////
		//== если выбран ДИЗАЙН Д/СЛАБОВИДЯЩИХ

		if (DizSel.v.DAlt) {
			DizSel.altObj.hidden = 0;
			//== Исходный цвет текста
			this.changeCol.value = Cook.get('diz_alt_Col') || DizSel.sts.startCol()
			DizSel.Backup.altBody.className = Cook.get('diz_alt_class') || '';
			//== Назначаем заданный фон
			_K.G(DizSel.style_BG).href = DizSel.checkUrl + (Cook.get('diz_alt_BG') || 'cs-white') + '.css';


			//////////////////////////////////
			//== если СТАНДАРТНЫЙ ДИЗАЙН
		} else if (!DizSel.v.DAlt) {
			DizSel.altObj.hidden = 1;
			DizSel.hasOwnProperty('PUanimate') && clearInterval (DizSel.PUanimate);

			if (!!_K.G('#puzadpn')) DizSel.SlabovidButton.style.margin = getComputedStyle(_K.G('#puzadpn')).height + ' auto -' + getComputedStyle(_K.G('#puzadpn')).height;
			if (!!_K.G('#uzadpn')) DizSel.SlabovidButton.style.position = 'relative';

		} //== /DizSel.v.DAlt

		DizSel.regRu(); //== Проверяем хостинг reg.ru
	},
	noFA: function () {
		FA = ['DIV_DA_207850_wrapper'];
		FA.forEach(function (el) { el.hidden = 1 });
	},
	regRu: function () {
		var rRH = _K.G('$#header-content-inner div');
		if (!rRH || !/widget/i.test(rRH.id)) return;
		DizSel.log.push('rRH= ' + rRH);
		DizSel.log.push('Ага, значит сайт на хосте REG.RU');
		if (DizSel.v.DAlt) _K.G(rRH, { height: 0 });
		else _K.G(rRH, { height: '' });
	},

	///////////////////////////////////////////////////////
	fns: { //== Вложенные ФУНКЦИИ
		getNodes: function getNodesSelf(handler, els) { //== Универсальный метод рекурсивной обработки всех потомков заданных элементов
			els = (els || DizSel.Backup.altBody).childNodes;

			Object.keys(els).forEach(function (i) {
				if (![1].includes(els[i].nodeType) || /no-size/i.test(els[i].className) || els[i].tagName && DizSel.sts.fontSize.NoTags.test(els[i].tagName)) return; //== Выкидываем ненужные Ноды, классы и теги
				handler(els[i]);
				//== Каждому родителю текстового блока назначаем стиль
				if (els[i].hasChildNodes()) { getNodesSelf(handler, els[i]) } //== Остаются теги. Если есть потомки - рекурсия
			});

		},

		setCol: function (i) { i.style.color = Cook.get('diz_alt_Col') || DizSel.sts.startCol(); }, // if (DizSel.v.DAlt)
		setFS: function (i) {
			i.fsIsh = +(i.fsIsh || Math.max(i.getAttribute('fsIsh'), DizSel.sts.fontSize.min));
			i.fs = i.fsIsh + DizSel.sts.fontSize.step * (+Cook.get('diz_alt_fs'));
			i.style.fontSize = i.fs + 'px';
		},
		toggleStyle: function (stName, e) {
			_K.l("arguments= ", arguments);
			//			if(stName)
			DizSel.Backup.altBody.classList.toggle(stName);
			Cook.set({ diz_alt_class: DizSel.Backup.altBody.className }, DizSel.sts.mem);
		},

		imageOff: function () {
			for (var i = 0, imgs = DizSel.Backup.altBody.G('A$img'), l = imgs.length; i < l; i++) {
				var imgSize = getComputedStyle(imgs[i]);
				if (parseInt(imgSize.width) < DizSel.sts.imageOff.minImg || imgs[i].id === 'captcha') continue;
				Cook.get('diz_alt_Img') || Cook.set({ diz_alt_Img: 3 }, DizSel.sts.mem);
				imgs[i].alter = imgs[i].alter || +(Cook.get('diz_alt_Img'));

				switch (imgs[i].alter) {
					case 4: //== Ч/Б
						imgs[i].style.filter = imgs[i].style.WebkitFilter = 'grayscale(100%)';
						Cook.get('diz_alt_Img') == 4 || Cook.set({ diz_alt_Img: 4 }, DizSel.sts.mem);
						imgs[i].alter = 1;
						break;
					case 1: //== ALT
						imgs[i].hidden = 1;
						_K.G(imgs[i], { filter: 'grayscale(0)', WebkitFilter: 'grayscale(0)' });
						_K.G(imgs[i]).cr('span', { class: 'imgAlt', style: 'padding:3px;border:1px solid;display: inline-block; width:' + imgSize.width + '; height:' + imgSize.height }, 'after').innerHTML = imgs[i].alt || 'IMG';
						Cook.get('diz_alt_Img') == 1 || Cook.set({ diz_alt_Img: 1 }, DizSel.sts.mem);
						imgs[i].alter++;
						break;
					case 2: //== NONE
						imgs[i].hidden = 1;
						!_K.G('$span.imgAlt') || [].forEach.call(_K.G('A$span.imgAlt'), function (a) { a.del() });
						Cook.get('diz_alt_Img') == 2 || Cook.set({ diz_alt_Img: 2 }, DizSel.sts.mem);
						imgs[i].alter++;
						break;
					case 3: //== DEFAULT
						imgs[i].hidden = 0;
						imgs[i].alter++;
						Cook.get('diz_alt_Img') == 3 || Cook.set({ diz_alt_Img: 3 }, DizSel.sts.mem);
						break;
				}

			};

		},
		sound: function () {
			function addSts(t) {
				setTimeout(function () {
					//	ya.speechkit.settings.apikey = '...';
					ya.tts = new ya.speechkit.Tts(DizSel.sts.sound);
				}, (t || 0) + 300)
			}
			if (!window.ya) _K.G('$head').cr('script', { src: 'https://webasr.yandex.net/jsapi/v1/webspeechkit.js' })
				.onload = function () { try { addSts() } catch (e) { addSts(300) } };


			DizSel.Backup.altBody.onmouseup = function (e) {
				e = _K.Event.fix(e);
				var selNode = window.getSelection().toString(); // anchorNode.textContent
				if (e.target.nodeName === 'CODE' || !selNode) return;
				_K.l("Настройки - " + DizSel.sts.sound.speaker + ", проигрывается= " + selNode);
				ya.tts.speak(selNode);
				selNode = false;
			}
			_K.G(this, { boxShadow: '0 0 1px 1px #999', transform: 'scale(1.2)' })
		},

		floatTip: {
			init: function () {
				if (window.floatTip) return;
				this._constr();
				this.obj = _K.G('#floatTip') || _K.G('$body').cr('div', { id: 'floatTip', style: 'z-index:50000; position: absolute;' + DizSel.sts.floatTip.st, hidden: 1 });
				[].forEach.call(_K.G('A$#special-panel *[title]'), function (i) {
					i.e.add({
						'mouseover': function (e) {
							DizSel.fns.floatTip.toolTip.call(i, e);
							DizSel.fns.floatTip.moveTip(e)
						},
						'mouseout': 'DizSel.fns.floatTip.obj.hidden=1'
					})
					i['data-title'] = i['data-title'] || i.title;
					i.title = '';
				})
			},
			_constr: function () {
				var ppts = {
					moveTip: function (e) {
						e = _K.Event.fix(e);
						var gC = getComputedStyle(DizSel.fns.floatTip.obj),
							x = e.pageX,
							y = e.pageY;
						DizSel.fns.floatTip.obj.style.left = (((x + parseInt(gC.width) + DizSel.sts.floatTip.distX) < (_K.body().clientWidth + _K.scroll.left)) ? x + DizSel.sts.floatTip.distX : x - parseInt(gC.width) - DizSel.sts.floatTip.distX) + 'px';
						DizSel.fns.floatTip.obj.style.top = (((y + parseInt(gC.height) + DizSel.sts.floatTip.distY) < (_K.body().clientHeight + _K.scroll.top)) ? y + DizSel.sts.floatTip.distY : y - parseInt(gC.height) - DizSel.sts.floatTip.distY) + 'px';
					},
					toolTip: function (e) { _K.G(DizSel.fns.floatTip.obj, this['data-title']).hidden = 0; }
				}
				return _K.clonePpts(DizSel.fns.floatTip, ppts, { enum: true });
			}
		}, //== /floatTip
		lightCur: function () { //== В проекте, не работает

		},

		stylePU: function (el, set) { //== Украшаем ПУ стилями css3
			set = set || { opacity: .1, scale: .5 };
			el.style.opacity = set.opacity;
		},
		zoom: function () { //== Разработка
			var base, baseZoom;

			function baseInit() {
				base = this.innerHTML;
				baseZoom = _K.G('$body').cr('div', { class: 'zoomDiv' });
				baseZoom.innerHTML = base;
			}
		}
	}, //== /fns

	SaveFS: function (ch) { //== Сохраняем количество изменений размера шрифта
		if (!isNaN(ch)) {
			DizSel.v.ch = ch;
			var Next = +(Cook.get('diz_alt_fs') || 0) + Math.sign(ch);
			if (!DizSel.sts.fontSize.fixed) { //== Если размер итерационный
				if (!(Math.abs(Next) > DizSel.sts.fontSize.iter)) Cook.set({ diz_alt_fs: Next }, DizSel.sts.mem);
			} else Cook.set({ diz_alt_fs: Math.sign(ch) }, DizSel.sts.mem);
			DizSel.fns.getNodes(DizSel.fns.setFS);
		}
	},



	/////////////////////////////////////////////////////////////
	createBGs: function () { //== Запускается ПРИ ЗАГРУЗКЕ
		//== Backup content /////////////////////////////////
		DizSel.Backup.save();
		//== Создаем БЛОК УПРАВЛЕНИЯ
		//== Создаем фрагмент ПУ
		DizSel.PUfr = _K.G(document.createDocumentFragment());
		DizSel.PU = DizSel.PUfr.cr('div', { id: 'special-panel', class: 'no-size', style: " opacity:.9; " });
		DizSel.inPU = DizSel.PU.cr('div', { style: 'margin: 0 auto; display: inline-block;' });
		DizSel.PU.e.add('select', function (e) { _K.Event.fix(e).preventDefault() });

		//== Создаем кнопку, если ее еще нет
		DizSel.SlabovidButton = DizSel.SlabovidButton || (_K.G(DizSel.SlabovidButtonParent) || _K.G('$#header') || _K.G('$body')).cr("input", { type: 'button', class: 'imgPU no-size btn min700 DA_del', style: 'padding: 3px 5px 3px 50px; margin:0 auto; font-size:20px; background: url("' + DizSel.checkUrl + 'eye.gif") no-repeat scroll 3px center, #ddd linear-gradient(#ccc, #eee, #ccc) repeat scroll 0 0;border: 1px solid #58a; border-radius:5px; z-index:9949; position:static; left:5px; top:20px; cursor: url(\'' + DizSel.checkUrl + 'glasses.png\'), pointer;', id: 'diz_alt', value: 'ДЛЯ СЛАБОВИДЯЩИХ' }, "fCh");
		DizSel.SlabovidButton.e.add("click", DizSel.addStyleSheet);
		if (typeof DizSel.sts.button.callback === 'function') DizSel.sts.button.callback();

		//== Создаем БЛОК КНОПОК СМЕНЫ ФОНА
		this.v.BG = this.v.BG || DizSel.inPU.cr('div', { class: 'no-size flex', style: 'margin: 0 auto; display: flex;' });
		DizSel.PU_sts = DizSel.PU_sts || DizSel.inPU.cr('div', { hidden: 1 }).cr('div', { class: 'flex', style: 'display: flex;' });
		if(_K.G('$script[src*=\'DA_pro_v3_B.js\']')) DizSel.version= DizSel.version + '_beta';
		DizSel.v.BG.cr('div', { style: 'position: absolute; right: 0;' }).innerHTML = 'v ' + DizSel.version;

		DizSel.changeCol = DizSel.v.BG.cr('input', { type: 'color', class: 'imgPU', title: 'цвет ТЕКСТА', style: 'width:50px;height:30px;float:left; margin:10px 20px;padding:0;', value: Cook.get('diz_alt_Col') || DizSel.sts.startCol() });

		Object.keys(DizSel.sts.BG_dim).forEach(function (i) {
			var fn = (function (bg) {
				return function () {
					//== Кукисы прописывать отдельно!
					Cook.set({ diz_alt_BG: bg }, DizSel.sts.mem);
					Cook.set({ diz_alt_Col: DizSel.sts.startCol() }, DizSel.sts.mem);
					DizSel.CheckCook();
					DizSel.fns.getNodes(DizSel.fns.setCol);
				}
			})(i), // nE!

				a = { ppts: { class: 'sprite-' + i, title: DizSel.sts.BG_dim[i] }, e: fn, st: { margin: '0 5px' }, in_sts: true };
			nextPU.call(a);
		});


		//== Создаем кнопки увеличения/уменьшения/кернинга/
		var elsPU = [
			{fontSizeS: { ppts: { class: 'sprite-fontBig', title: 'Уменьшить' }, e: function () { DizSel.SaveFS(-DizSel.sts.fontSize.step); }, st: { marginLeft: '20px' } }},
			{fontSizeB: { ppts: { class: 'sprite-fontBig_50', title: 'Увеличить' }, e: function () { DizSel.SaveFS(DizSel.sts.fontSize.step); } }},

			{fontType: { ppts: { class: 'sprite-text', title: 'Тип шрифта' }, e: DizSel.fns.toggleStyle.bind(null, 'fontType'), in_sts: true }},
			{kern: { ppts: { class: 'sprite-kern', title: 'Изменить интервал' }, e: DizSel.fns.toggleStyle.bind(null, 'kern'), in_sts: true }},
			{lh: { ppts: { class: 'sprite-kern', title: 'Высота строки' }, e: DizSel.fns.toggleStyle.bind(null, 'lineHeight'), st: { transform: 'rotate(90deg)' }, in_sts: true }},
			{imageOff: { ppts: { class: 'sprite-imageOff', title: 'Показ изображений', alt: 'Показ изображений' }, e: DizSel.fns.imageOff, in_sts: true }},
			{sound: { ppts: { class: 'sprite-sound', title: 'Озвучивать выделенный текст', alt: 'Озвучивать выделенный текст' }, e: DizSel.fns.sound }},
			{sts: {
				ppts: {
					class: 'sprite-settings',
					title: 'Настройки отображения сайта',
					alt: 'Настройки отображения сайта'
				},
				e: function(e) {
					DizSel.PU_sts.parentNode.hidden = !DizSel.PU_sts.parentNode.hidden;
				}
			}},

			//	fontRes: {ppts: {class:'sprite-reset', title:'Сбросить'}, e:function() { return DizSel.SaveFS('reset') }},
			{toDefault: { ppts: { class: 'sprite-toDefault', title: 'Обычный вид', id: 'toDefault' }, e: function () { DizSel.addStyleSheet(); }, st: { margin: '3px 20px 0' } }}
		]; // elsPU

		// _K.l(elsPU);

		DizSel.changeCol.onchange = function () { //== Цвет текста
			Cook.set({ diz_alt_Col: this.value }, DizSel.sts.mem);
			DizSel.fns.getNodes(DizSel.fns.setCol);
		};

		function nextPU(n) {
			var o = !!n ? this[n] : this;
			var i = (o.in_sts ? DizSel.PU_sts : DizSel.v.BG).cr('i', o.ppts);
			i.classList.add('imgPU');
			//	i.draggable=false;
			i.focus = false;
			!!o.e && (i.onclick = o.e);
			!!o.st && _K.G(i, o.st);
		}

		elsPU.forEach(function (i) {
			nextPU.call(i, Object.keys(i)[0]);
		});

		//== Вставляем фрагмент в DOM
		DizSel.altObj.Append(DizSel.PUfr, "fCh");

		//== Создаем БЛОК УПРАВЛЕНИЯ - Конец


		if (DizSel.v.DAlt) DizSel.PUopacity();

	}, //== /createBGs

} //== /DizSel
// if(Cook.get('diz_alt')==='y') DizSel.altObj.hidden=0;


DizSel.addons.puny = DizSel.checkUrl && _K.G('$head').cr('script', { src: DizSel.checkUrl + 'punycode.js', async: 0 });


window.addEventListener('load', function(e) {

	if (DizSel.inited) {
		console.warn("DizSel.inited = ", DizSel.inited);
		return;
	}

	DizSel.addons.db = _K.G('$head').cr('script', { src: DizSel.checkUrl + 'db.js?req=' + _K.fns.rnd(0, 1e5), async: 0 });
	// console.log(DizSel.addons.db.src);
	if (/bereghost\.ru/.test(location.host)) DizSel.noFA();
	// _K.G().e.add('load', DizSel.init);
	DizSel.addons.db.e.add({
		load: DizSel.init.bind(DizSel),
		error: function(e) {
			DizSel.addons.puny = DizSel.checkUrl && _K.G('$head').cr('script', { src: DizSel.checkUrl + 'punycode.js', async: 0 });
			// console.log(DizSel.addons.db.src);
			DizSel.addons.db.remove();
			// DizSel.addons.db.src = 'http://js-master.ru/js/db/db_DA_pro_3?req=';
			DizSel.addons.db = _K.G('$head').cr('script', { src: 'http://js-master.ru/js/db/db_DA_pro_3?req=' + _K.fns.rnd(0, 1e5), async: 0 });
			// console.log(e, DizSel.addons.db);
			// DizSel.init.call(DizSel);
			DizSel.addons.db.onload = DizSel.init.bind(DizSel);
		}
	}) ;
});
