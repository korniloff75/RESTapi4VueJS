/******************************************
Copyright KorniloFF-ScriptS ©
http://js-master.ru
*******************************************/
/*
<?php
header('content-type: application/x-javascript');
require_once 'js.php';
#$SITE_name= global $SITE_name; // выдает ошибку
ob_start("compress_js");
?>
3.5.4 - Исправлен конфликт с Яндекс-картами!
3.6.0 - Освобожден Object.prototype
3.6.1 - Сайт переведен на аякс, совместная работа с /js/addons/ajax.js
LITE 3.6.3 - Часть функционала перенесено в TOOLs.js
*/

'use strict';
/* if(!document.body) {
	document.body = document.documentElement || document.querySelector('body');
} */

document.documentElement.hidden !== undefined || Object.assign(HTMLElement.prototype, {
	get hidden() { return this.style && this.style.display === 'none' },
	set hidden(a) {
		this.style && (this.style.display = !!a ? 'none' : '');
		// _K.l(this);
	}
});
	// closest && fix matches
;(function(EL) {
	EL.matches = EL.matches || EL.mozMatchesSelector || EL.msMatchesSelector || EL.oMatchesSelector || EL.webkitMatchesSelector;
	EL.closest = EL.closest || function closest(selector) {
		if (!this) return null;
		if (this.matches(selector)) return this;
		if (!this.parentElement) {return null}
		else return this.parentElement.closest(selector)
	};
}(Element.prototype));

Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
	!/MSIE [6-9]/.test(navigator.appVersion) ? (obj.__proto__ = proto) : _K.clonePpts(obj, proto, { enum: 1 });
	return obj;
};

Object.getPrototypeOf = Object.getPrototypeOf || function (obj) { return obj.__proto__ };

if (![].includes) {
	Array.prototype.includes = function (searchElement, fromIndex) {
		fromIndex = fromIndex || 0;
		return this.some(function (i,ind) { return (ind >= fromIndex) && i === searchElement })
	}
}

Element.prototype.getBoundingClientRect || Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
	value: function () {
		var top = 0,
			left = 0,
			elem = this;
		while (elem) {
			top += parseInt(elem.offsetTop);
			left += parseInt(elem.offsetLeft);
			elem = elem.offsetParent;
		}
		return { top: top, left: left }
	},
	writable: 1
});

var getComputedStyle = getComputedStyle || function (elem) { return elem.currentStyle };

console.groupCollapsed('KFF.js');


/*
* _K
*/

if (!window._K && (!location.search.length || !/layout\=edit/.test(location.search))) {
	var _K = {

		version: 'Lite_3.7.0',

		G: function () {
			var obj= arguments[0];

			function addProto (o) {
				if(o && !o.clonePpts) {
					var proto= Object.getPrototypeOf(o);
					if (!proto || !Object.getPrototypeOf(proto) || proto.__proto__ === null) { // nE!
						// console.log("_K.allows= ", _K.allows);
						Object.setPrototypeOf(o, _K.allows);
					} else {
						 _K.clonePpts(proto, _K, { enum: 1 });
					}
				}
				return o;
			}

			switch (arguments.length) {
				case 0:
					 return addProto(this !== _K ? this : document);
				case 1:
					var objOut, objs;
					if (this.isObject.call(obj)) objOut= obj;
					else if (typeof (obj) === "string") {
						if (obj.charAt(0) === "#") objOut= this.G().getElementById(obj.substr(1));
						else if (obj.charAt(0) === "$") objOut= (this.G().querySelector(obj.substr(1)));
						else if (obj.substr(0, 2) === 'A$') objs= this.G().querySelectorAll(obj.substr(2));
						else if (obj.charAt(0) === ".") objs= this.G().getElementsByClassName(obj.substr(1));
						else objOut= this.G().getElementById ? this.G().getElementById(obj) : this.G().layers ? this.G()[obj] : this.G().all[obj] ? this.G().all[obj] : false;
					} else return null;

					if(objOut) return addProto(objOut);
					else if(objs) {
						objs = [].map.call(objs, function (i) {
							return addProto(i);
						});
						return addProto(objs);
					}
					break;
				case 2:
					if (this.G(obj)) var o = this.G(obj);
					else break;
					if (arguments[1] instanceof Object) { // стили задавать в формате JS
						this.clonePpts(o.style, arguments[1], { enum: true, assert: true, plain: true }); // break;
					} else {
						if (typeof (arguments[1]) === "string" && arguments[1].substr(0, 2) === "++") o.innerHTML += arguments[1].substr(2);
						else o.innerHTML = arguments[1];
					}
					return o;
				case 3:
					if (!this.G(obj)) break;
					return this.G(obj, arguments[1]).clonePpts(arguments[2], { enum: true, assert: true, plain: true });
			}
		}, //== /G

		//=========================================/

		clonePpts: function (objExt, obj, sts) { //== Клонируем свойства // nE!
			//
			if (this !== _K && arguments.length < 3) {
				objExt = this;
				obj = arguments[0];
				sts = arguments[1];
			}

			if (!_K.isObject.call(objExt) || !_K.isObject.call(obj)) {
				_K.l("_K.isObject.call(objExt)= " + objExt + " _ " + _K.isObject.call(objExt));
				_K.l("_K.isObject.call(obj)= " + _K.isObject.call(obj));
				throw new TypeError('clonePpts cannot convert some argument to object')
			};
			sts = sts || {};

			(!!sts.enum ? Object.keys : Object.getOwnPropertyNames)(obj).forEach(function (name) {
				// console.log("ppt= " +  name);
				if(!objExt) console.warn("objExt in clonePpts = " + objExt);
				var d = !sts.plain && Object.getOwnPropertyDescriptor(obj, name) || 1,
					dExt= (name in objExt) && Object.getOwnPropertyDescriptor(objExt, name);

				if (dExt && (!sts.assert || !dExt.writable ) || _K.setts.noClonePpts.test(name) ) {
					return;
				} // else allows.push(name);

				// console.log("ppt in allows= " + name);

				if (!!sts.D) Object.keys(sts.D).forEach(function (i) { d[i] = arguments[2][i] });
				if (sts.enum && sts.enum === 'set') d && (d.enumerable = false);

				if (!!sts.plain) objExt[name] = obj[name];
				else Object.defineProperty(objExt, name, d);

			//	objExt[name] = obj[name];

				!!sts.callback && sts.callback();

			});
			// console.log("allowsInObj= " +  allows.valueOf() + "\n");
			return objExt;
		}, //== /clonePpts


		//== Использование _O =====================
		Append: function app(el, after) {
			//== fix to native method

			console.assert(!!this, el + ' не имеет ' + this + '\nОшибка в Append');
			switch (after) {
				case 1:
					; // after this
				case "after":
					!!this.nextSibling ? this.parentNode.insertBefore(el, this.nextSibling) : this.parentNode.appendChild(el);
					break;
				case 2: // before this
				case "before":
					this.parentNode.insertBefore(el, this);
					break;
				case "fCh":
					this.firstChild ? this.insertBefore(el, this.firstChild) : app.call(this, el);
					break;
				case null:
					;
				case undefined:
					this.appendChild(el);
					break;
			}
			return _K.G(el);
		},

		cr: function (elem, objAttrs, after) { //== Тег, объект с аттрибутами, родительский элемент разметки
			if (!this) return _K.l('_K.cr not have this! === ' + this);
			objAttrs = objAttrs || {};

			var el = (elem === 'textNode') ? _K.G().createTextNode() : _K.G().createElement(elem);
			if (elem === 'script') objAttrs.type = 'text/javascript';

			_K.G(el).attr(objAttrs); // _K.l(el.attr);

			return (!_K.isObject.call(this) || this === _K) ? el : this.Append.call(this, el, after);
		},

		Clone: function (o, after, deep) {
			//== Конфликт с MooTools - obj.clone
			return this.Append(o.cloneNode(deep || true), after);
		},

		attr: function (objAttrs) {
			//== Получаем список атрибутов или значение
			if (!objAttrs) return this.attributes;
			if (typeof objAttrs === 'string') return this.getAttribute(objAttrs); // null

			//== Добавляем атрибуты
			if(!this.setAttribute) throw new Error ('missing setAttribute in ' + this);
			Object.keys(objAttrs).forEach(function (i) {
				if (['defer','async'].includes(i)) {
					this[i] = objAttrs[i];
				} else this.setAttribute(i, objAttrs[i]);
			}, this);
		},

		remove : function () {
			if(this.parentNode && this.parentNode.lastChild) this.parentNode.removeChild(this);
		},

		del: function () {
			this.remove();
		},
		//== /Использование _O =====================


		/* ======================
		========== СОБЫТИЯ ==============
		====================== */
		get e() {
			this.Event.elem = this !== _K? this: null;
			return this.Event;
		},
//		event: function () { return this.e; },
		Event: {
			fix: function (e) {
				e = e || window.event;
				if (e.isFixed) return e;
				e.isFixed = true;
				//== фиксим отключение события по умолчанию	_K.Event.fix(e).preventDefault()
				e.preventDefault = e.preventDefault || function () { this.returnValue = false };
				//== фиксим отключение всплытия событий	_K.Event.fix(e).stopPropagaton()
				e.stopPropagation = e.stopPropagation || function () { this.cancelBubble = true };
				if (!e.target) e.target = e.srcElement;
				if (!e.relatedTarget && e.fromElement) e.relatedTarget = e.fromElement == e.target ? e.toElement : e.fromElement;

				//== аналог pageX/pageY для тачпадов
				if (e.changedTouches) {
					e.chTX = e.changedTouches[0].pageX;
					e.chTY = e.changedTouches[0].pageY;
				}
				//		_K.l("e.changedTouches= "+ e.changedTouches);

				//== добавить pageX/pageY & which для IE
				if (e.pageX == null && !e.which && e.button) {
					e.pageX = e.clientX + _K.scroll.left - (_K.body().clientLeft || 0);
					e.pageY = e.clientY + _K.scroll.top - (_K.body().clientTop || 0);
					e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0))
				};
				return e
			},

			check: function (elem, type, handler) {
				var a = [], o = {},
					el = this.elem || elem;
				this.elem = null;
				//  _K.l("this.elem = ", el );
				if (!elem.__proto__.__proto__) {
					Object.keys(elem).forEach(function (i) {
						a.push({ elem: el, type: i, handler: elem[i] });
					});
				} else if (elem instanceof Object) {
					a.push({ elem: el, type: type, handler: handler });
				} else { a.push({ elem: el, type: arguments[0], handler: arguments[1] }); }

				return a;
			},

			add: function (elem, type, handler, useCapture) {
				useCapture = (!this.elem && arguments[3] ? arguments[3] : arguments[2]) || false;

				this.check(elem, type, handler).forEach(function (a) { addEvent(a.elem, a.type, a.handler);
				// console.log(a.valueOf(), useCapture);
				});

				function addEvent(elem, type, handler) {
					handler = (handler.toFun || handler);

					elem.addEventListener ? elem.addEventListener(type, handler, useCapture) : elem.attachEvent ? elem.attachEvent("on" + type, handler) : elem["on" + type] = handler;
				}
			},

			del: function (elem, type, handler) {
				this.check(elem, type, handler).forEach(function (a) { delEvent(a.elem, a.type, a.handler); });

				function delEvent(elem, type, handler) {
					handler = handler.toFun || handler;
					elem.removeEventListener ? elem.removeEventListener(type, handler, false) : elem.detachEvent ? elem.detachEvent("on" + type, handler) : elem["on" + type] = null;
				}
			},

			stop: function (e) {
				(this.elem || _K).Event.fix(e).stopPropagation();
			},
			wait: {}
		}, //== /Event


		isObject: function () { return this != null && (typeof this === 'object' || typeof this === 'function'); },

		ajax : {
			dataDR : [],
			// Удаляемые элементы
			els : [],
			add : {
				num : function(num, fn) {
					_K.ajax.dataDR.splice(num, 0, fn);
				},
				first : function(fn) {
					this.num(0, fn)
				},
				last : function(fn) {
					this.num(_K.ajax.dataDR.length, fn)
				}
			},

			DR : function() {
				var addons = [].slice.call(_K.G('A$script[data-addons]'), 0);
				this.dataDR.forEach(function(handler) {
					if(typeof handler === 'function') handler();
					else return;
				});


				console.log(
					/* [].filter.call( document.scripts, function(i) {
						return addons.indexOf(i) === -1;
					} ), */
					'_K.ajax.DR complete'
				);
			}
		},
		v: {
			local: /:90|!\.ru/i.test(location.host),
			Inh: {
				// __proto__: Element.prototype.__proto__
			}
		},
		tmp : {}

	}; //== /_K
	//===========================================================================================/

	// Неперечисляемые свойства объекта _K

	Object.defineProperties(_K, {
		__proto__: { value: Object.prototype },
		version: {
			enumerable : false,
			writable : false
		},
		setts: {
			value: { noClonePpts: /^(version|__proto__|setts|allows|dE|i|l|dir|body|DR|event|v|log|prot|date|fixDate|argTransform|parseData|scroll|fns|lO|onload)$|^on/ }
		},
		allows: {
			get: function () {
				var out = {};
				Object.keys(_K).forEach(function (ppt) {
					return _K.clonePpts(out, _K, {enum:1});
					// return Object.assign(out, _K);
				});
				return out;
			}
		},
		dE: {
			get: function() { return _K.G(document.documentElement) }
		},

/*		prot: {
			writable:1, configurable:1
		},*/
		log: { value: [] },
		lO: { value: {} },
		l: {
			value: console.log.bind(console)
		},
		i: {
			value: console.info.bind(console)
		},
		body: {
			value: function () { return _K.G((_K.G().compatMode == 'CSS1Compat') ? _K.dE : _K.G().body) }
		},
		date: {
			value: function () {
				var date = new Date();
				return { ss: date.getSeconds(), min: date.getMinutes(), h: date.getHours(), d: date.getDate(), dn: date.getDay(), mon: date.getMonth() + 1, year: date.getFullYear(), time: date.getTime() }
			}
		},
		fixDate: {
			value: function () {
				var date = _K.date();
				Object.keys(date).forEach(function (i) { date[i] = (date[i] < 10) ? "0" + date[i] : date[i]; });
				return date;
			}
		},
		DR: {
			value: function (handler, delay) {
				var called = false;

				function ready() {
					if (called) return;
					called = true;
					delay ? setTimeout(handler, delay) : handler();
				}
				('onpageshow' in window) ? _K.Event.add(window, 'pageshow', ready) : _K.Event.add(document, "DOMContentLoaded", ready);
				// Собираем для аякса
				_K.ajax.dataDR.push(handler);
			}
		},

		scroll: {
			get: function () { //== получаем ПРОКРУТКУ страницы
				return {
					left: window.scrollX || window.pageXOffset || _K.dE.scrollLeft,
					top: window.scrollY || window.pageYOffset || _K.dE.scrollTop
				}
			}
		},

		fns: {
			value : {
				rnd: function (rmin, rmax) { return Math.floor(Math.random() * (rmax - rmin + 1)) + rmin; },

				rgbToHex: function (rgb) { //== Преобразуем цвета
					if (rgb.charAt(0) === '#') return rgb;
					var hex = '#';
					rgb.match(/\d+/g).forEach(function (i) { hex += parseInt(i).toString(16) });
					return hex;
				}

			}

		} //== /fns

	});

	//== /_K enumerable: false
	//===========================================================================================/



//	Object.clonePpts || _K.clonePpts(Object.prototype, _K, { enum: 'set' });


	//===========================================================================================/

//========================================= /
window.Cookie = window.Cook = { //== Конфликт с MooTools - window.Cookie
	set: function set (dim, timeout, path) { // в днях
		timeout = (timeout || 1) * 3.6e6 * 24; //мс
		var maxAge = (timeout || 1) * 3600 * 24; //с
		path = path || "/";
		var expires = (new Date((new Date).getTime() + timeout)).toUTCString() || null;
		if (dim instanceof Array) {
			var obj = {};
			dim.forEach(function(i) {
				obj[i[0]] = i[1];
			});
			return set(obj, timeout, path);
		} else Object.keys(dim).forEach(function (i) {
			_K.G().cookie = i + '=' + dim[i] + ';expires=' + expires  + '; path=' + path;
		});

		return dim;
		// + ';max-age=' + maxAge
	},
	get: function (cookie_name) {
		if (!cookie_name) return;
		var m = _K.G().cookie.match('(^|;)?' + encodeURI (cookie_name) + '=([^;]*?)(;|$)');
		return m && m.length ? decodeURI (m[2]) : null;
	},
	del: function (c_names) { // перечислить удаляемые кукисы через запятую
		var path = '/', del = {};
		for (var i = 0, L = arguments.length; i < L; i++) {
			if (!this.get(arguments[i])) { path = arguments[i]; continue; }
			del[arguments[i]] = 0;
			//	 _K.i('cookie_date - '+arguments[i]+'= '+ cookie_date+'= '+cookie_date.toGMTString());
		}
		this.set(del, -1, path);
	},
	json : {
		get : function(cookie_name) {
			cookie_name = cookie_name || 'JSON';
			return JSON.parse(Cook.get(cookie_name));
		},
		set : function(obj, nameObj, timeout, path) {
			nameObj = nameObj || 'JSON';
			var c = this.get(name) || {}, out = {};
			c = Object.assign(c,obj);
			out[nameObj] = JSON.stringify(c);
			Cook.set(out, timeout, path);
		},
		del : function(nameObj, names) {
			nameObj = nameObj || 'JSON';
			var obj = this.get(nameObj);
			[].forEach.call(arguments, function(name, ind) {
				delete(obj[name]);
			});
			this.set(obj, nameObj)
		}
	}
} // Cook


//========================================= /
//================ PrototypeS ===================/

/*
 * object.watch polyfill
 *
 * 2012-04-03
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

// object.watch
if (!Object.prototype.watch) {
	Object.defineProperty(Object.prototype, "watch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop, handler) {
			var
			  oldval = this[prop]
			, newval = oldval
			, getter = function () {
				return newval;
			}
			, setter = function (val) {
				oldval = newval;
				return newval = handler.call(this, prop, oldval, val);
			}
			;

			if (delete this[prop]) { // can't watch constants
				Object.defineProperty(this, prop, {
					  get: getter
					, set: setter
					, enumerable: true
					, configurable: true
				});
			}
		}
	});
}

// object.unwatch
if (!Object.prototype.unwatch) {
	Object.defineProperty(Object.prototype, "unwatch", {
		  enumerable: false
		, configurable: true
		, writable: false
		, value: function (prop) {
			var val = this[prop];
			delete this[prop]; // remove accessors
			this[prop] = val;
		}
	});
}

//== Вывод текста "печатной машинкой"
String.prototype.delayingWrite = function (obj, delay, cb, timeLast) {
	if (!obj) return 0;
	if (this.length) {
		obj.wr = 1;
		obj.textContent += this.charAt(0);
		var s = this.substr(1);
		setTimeout(function () { s.delayingWrite(obj, delay, cb, timeLast); }, delay);
	} else {
		obj.wr = 0;
		if (typeof cb === 'function') {
			setTimeout(cb, timeLast || delay * 10);
		}
	}
}

String.prototype.trim = String.prototype.trim || function () { return this.replace(/^\s+|\s+$/gm, '') };
String.prototype.ltrim = String.prototype.ltrim || function () { return this.replace(/^\s+/gm, '') };
String.prototype.tabTrim = function () { return this.replace(/\t/gm, '  ') };
String.prototype.rtrim = String.prototype.rtrim || function () { return this.replace(/\s+$/gm, '') };
String.prototype.fulltrim = String.prototype.fulltrim || function () { return this.replace(/((^|\n)\s+|\s+($|\n))/gm, '').replace(/\s+/gm, ' '); };

String.prototype.toFun || Object.defineProperty(String.prototype, 'toFun', { get: function () { return new Function(this) } });
Math.sign = Math.sign || function (x) {
	x = +x;
	return (x === 0 || isNaN(x)) ? x : x > 0 ? 1 : -1;
}

;[].inArray || (Array.prototype.inArray = Array.prototype.includes)
;[].isArray || Object.defineProperty(Array.prototype, 'isArray', {
	get: function () {
		return Object.prototype.toString.call(this) === '[object Array]';
	}
});

;[].rnd || Object.defineProperty(Array.prototype, 'rnd', {
	get: function () { return this[_K.fns.rnd(0, this.length - 1)] }
})
;[].Step || Object.defineProperty(Array.prototype, 'Step', {
	value: function (napr, ind) {
		ind = ind || this.ind || 0;

		Object.defineProperty(this, 'ind', {
			value: napr > 0 ? (
				ind < (this.length - napr) ? ind + napr : 0
			) : (
				(ind >= -napr) ? ind + napr : this.length - 1
			),
			writable: true
		});

		// console.log('this - ', this, '\nthis.ind - ', this.ind);

		// console.log('i.src - ', this[this.ind].src, this.ind , (this.length - Math.abs(napr)));

		return this[this.ind];
	},
	writable: true,
	configurable: true
});

;[].Copy || Object.defineProperty(Array.prototype, 'Copy', {
	get: function () {
		var i, clon = this.slice();
		for (i = 0; i < clon.length; i++) {
			if (Array.isArray(clon[i])) clon[i] = clon[i].Copy;
		}
		return clon;
	}
})
;[].Max || Object.defineProperty(Array.prototype, 'Max', {
	get : function () {
		return Math.max.apply(null, this);
	}
});
//=========================================/
Function.prototype.bind = Function.prototype.bind || function (oThis) {
	if (typeof this !== 'function') {
		// ближайший аналог внутренней функции
		// IsCallable в ECMAScript 5
		throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
	}
	var aArgs = [].slice.call(arguments, 1),
		fToBind = this,
		fNOP = function () { },
		fBound = function () {
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat([].slice.call(arguments)));
		};
	fNOP.prototype = this.prototype;
	fBound.prototype = new fNOP();
	return fBound;
};
//=========================================/
//=========================================/ ================================================================================
//=========================================  СОВМЕСТИМОСТЬ  ========================================//
Object.assign || Object.defineProperty(Object, 'assign', {
	enumerable: false,
	configurable: true,
	writable: true,
	value: function (target, firstSource) {
		if (target === undefined || target === null) { throw new TypeError('Cannot convert first argument to object'); }
		var to = Object(target);
		for (var i = 1, L = arguments.length; i < L; i++) {
			Object.keys(arguments[i]).forEach(function(p) {
				to[p] = arguments[i][p];
			})
		}
		return to;
	}
});

//========================================  / СОВМЕСТИМОСТЬ  ============================================================================================/
//=========================================/ /
Object.assign(_K.lO, {
	'Lib version': _K.version,
	host: location.host,
	'userAgent': navigator.userAgent,
	'appName': navigator.appName
});

Object.defineProperties(_K.Event.wait, {
	start: {
		configurable: true,
		value: function () {
			if (!!_K.Event.wait.init) return;
			_K.Event.wait.init = _K.G(_K.body()).cr('img', { style: 'max-width:300px;height:auto;position:fixed; z-index:20000; border:none;', src: "/images/loadbar.gif", alt: "Загрузка..." });
			_K.G(_K.Event.wait.init, {
				top: _K.body().clientHeight / 2 - parseInt(getComputedStyle(_K.Event.wait.init).height) / 2 + 'px',
				left: _K.body().clientWidth / 2 - parseInt(getComputedStyle(_K.Event.wait.init).width) / 2 + 'px'
			})
		}
	},
	end: {
		configurable: true,
		value: function () {
			if (!!_K.Event.wait.init) { _K.Event.wait.init.del() };
			_K.Event.wait.init = null;
		}
	}
});
//=========================================/
//================================================================================== //
window.Ajax = {
	//========================================= //
	obj: {},
	sts: {
		hds: {
			//	'X-Requested-With' : "XMLHttpRequest", //== Мешает кроссдоменному запросу
			//	'Content-type': 'application/json; charset=utf-8' //== -"-
		}
	},

	get Get() {
		if (window.location.search.length === 0) return false;
		var out = {},
			key = location.search.replace(/\?/, "").split(/\&/),
			dimkey;
		Object.keys(key).forEach(function (i) {
			dimkey = key[i].toString().split(/\=/);
			out[dimkey[0]] = dimkey[1] && decodeURI(dimkey[1]) || null;
		});
		return out;
	},

	// Собираем поля формы в {} || json
	all_form: function (f, stringify) { 
		var out = {};

		function iter(f) {
			var fields = f.childNodes;
			for (var i in fields) {
				if (fields[i].nodeType != 1) continue;
				if (fields[i].hasChildNodes()) iter(fields[i]);
				if (!fields[i].value || !fields[i].name) continue;
				out[fields[i].name] = fields[i].value.trim();
			}
		}
		iter(f);

		return stringify ? JSON.stringify(out) : out;
	},

	r: function (url, obj) {
		var xhr = ('onload' in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest,
			aj = new xhr(), met = 'GET';

		obj = Object.assign({
			url : url,
			send : null,
			async : 1,
			type : '', // 'document'
			headers : {'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
		}, obj || {});

		url = obj.url;
		var getInUrl = url.toString().indexOf('?') > -1;

		console.log('obj = ', obj, obj.send instanceof Object);

		_K.e.wait.start();
/* 		if(typeof obj.send === 'string') {

		} */
		if (obj.send instanceof Object) {
			met = 'POST';
			obj.send = Object.keys(obj.send).map(function(key){
				return encodeURIComponent(key) + '=' + encodeURIComponent(obj.send[key]);
			}).join('&');
		};

		if(met === 'GET') {
			url += (getInUrl ? '&' : '?') + (obj.send || '');
			obj.send = null;
		}

		aj.open(met, url, obj.async);

		if(obj.async) aj.responseType = obj.type;
		aj.done = function(cb) {
			cb = cb || function(){};
			this.cb = cb.bind(this);
			return this;
		};
		aj.prevEval = function(cb) {
			cb = cb || function(){};
			this.cb0 = cb.bind(this);
			return this;
		};

		//== Прописали заголовки
		if(obj.headers) for (var i in obj.headers) aj.setRequestHeader(i, obj.headers[i]);

		function checkResp() {
			if (!aj) return onErr();
			if (!aj.onreadystatechange) {
				aj.onload = onSuccess;
				aj.onerror = onErr;
			} else {
				aj.onreadystatechange = function () {
					// _K.l("this.readyState= " + this.readyState);
					if (this.readyState === XMLHttpRequest.DONE && this.status === 200) onSuccess();
				}
			}

			aj.send(obj.send);

			return aj;
		}

		function onErr() {
			_K.e.wait.end();
			aj.resp = 'Файл "' + url + '" не доступен в данный момент. Ошибка - ' + aj.status;
			return aj;
		}

		function evalDoc () {
			if(aj.responseType !== 'document') {
				// console.log('aj.responseType = ', aj.responseType);
				return;
			}

			aj.resp.querySelectorAll('script').forEach(function(i) {
				// setTimeout(function() {
					_K.G('$head').Append(i);
					/* var nS = _K.G('$head').cr('script', {async:i.async, defer : i.defer, class:'localScript' });
					if(i.src) nS.src = i.src;
					else nS.innerHTML = i.innerHTML; */
				// }, 700);
			});
			console.log('scrs = ', aj.resp.querySelectorAll('script') , "\n");

		}

		function onSuccess() { //== Получили ответ от сервера
			_K.e.wait.end();
			aj.resp = aj.response;
			aj.cb0 && aj.cb0();

 			setTimeout(function() {

				evalDoc();
				aj.cb && aj.cb();

			}, 100);

			// console.log('aj = ', aj);

			return aj;
		};

		return checkResp();
	}, // r

	open : function(met, url, send, async, fn) {
		// var aj= Ajax.open("POST",url,{param1:value,param2:value},true,{CB:function() { ... }});
		// Все действия после асинхронного запроса выполнять в callback-функциях объекта fn
		return this.r(url, {send : send, async : async}).done(function() {
			if(!fn) return;
			var xhr = this;
			fn instanceof Object && Object.keys(fn).forEach(function (f) {
				(fn[f]).call(xhr);
			});
		});
	}
};

	//========================================= /
	// _K.DR(function() {
	var s = 'color:#007; background:#eef;';
	//	_K.i('KFF LOG: \n-------------------------\n%c'+_K.log.join('\n')+'\n------------------------------',s);
	//	_K.i('Глобальный объект - %O', _K);
	console.table && console.table(_K.lO);
	// });
	//========================================= /
} else _K.i('\n!!!!!!!!!!!!!!!!!!!!\n! Попытка повторного запуска KorniloFF.js\n!!!!!!!!!!!!!!!!!!!!');
console.groupEnd();

// _K.DR(window.onload);

/*
<?php ob_end_flush();?>
*/