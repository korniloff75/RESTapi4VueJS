/* in developing
plugin jQuery
add/del EventListener & useCapture
ES-5

USE:
===============
$(document).e.add|del('click', handler, useCapture);

OR:
$(document).e.add|del({
	click: handler1,
	focus: handler2
} [, null, useCapture = false]);

Event fix in handler:
e = $().e.fix(e);
*/
'use strict';

jQuery && !jQuery.fn.e && Object.defineProperties(jQuery.fn,
	{e:	{
		get: function () {
			var self = this.get(0);

			return {
				add: function (type, handler, useCapture) {
					useCapture = useCapture || false;
					if(!self) return;

					// console.log(self);
					var o = this.check(type, handler);

					Object.keys(o).forEach(function (type) {
						// handler = handler.bind(null, )
						self.addEventListener ? self.addEventListener(type, o[type], useCapture) : self.attachEvent ? self.attachEvent("on" + type, o[type]) : self["on" + type] = o[type];

					});

				},

				remove: function (type, handler, useCapture) {
					useCapture = useCapture || false;
					if(!self) return;
					var o = this.check(type, handler);

					Object.keys(o).forEach(function (type) {
						self.removeEventListener ? self.removeEventListener(type, o[type], useCapture) : self.detachEvent ? self.detachEvent("on" + type, o[type]) : self["on" + type] = null;

					});

				},

				check: function (o, type, handler) {
					var out = {};

					if (!o.__proto__.__proto__) {
						// o - is Object
						out = o;
					} else {
						out[type] = handler;
					}

					return out;
				},

				fix: function (e) {
					e = e || window.event;
					if (e.isFixed) return e;
					e.isFixed = 1;

					var eO = e.originalEvent || e;

					// pageX/pageY 4 one tauch (custom)
					e.chT = eO.changedTouches ? {
						get x() {
							return eO.changedTouches[0].pageX
						},
						get y() {
							return eO.changedTouches[0].pageY
						},
						toLeft: function() {
							// ...
						}

					} : {x: 0, y: 0};

					// define keyCode
					e.defKeyCode = function(toc) {
						/* // e.which keyCode
						$(window).e.add({keyup: function(e) {
							console.log(e.ctrlKey);
						}});
						*/

						return eO.keyCode && (eO.keyCode === ({
							esc : 27,
							space : 0,
							arr_left : 37,
							arr_up : 38,
							arr_right : 39,
							arr_down : 40,
							enter: 13,

						})[toc]);
					}

					if(e.type === 'wheel') {
						e.deltaY = eO.deltaY || eO.detail || eO.wheelDelta;
						// console.log('e= ', e, '\ne.deltaY= ', e.deltaY);
					}

					if(e.originalEvent) {
						return e;
					} // jQuery fixed

					var dE = document.documentElement,
					scroll = {
						get: function () {
							return {
								left: window.scrollX || window.pageXOffset || dE.scrollLeft,
								top: window.scrollY || window.pageYOffset || dE.scrollTop
							}
						}
					};

					e.preventDefault = e.preventDefault || function () {
						this.returnValue = false
					};

					e.stopPropagation = e.stopPropagation || function () {
						this.cancelBubble = true
					};

					if (!e.target) e.target = e.srcElement;

					//== add pageX/pageY & which in IE
					if (e.pageX == null && !e.which && e.button) {
						e.pageX = e.clientX + scroll.left - (dE.clientLeft || 0);
						e.pageY = e.clientY + scroll.top - (dE.clientTop || 0);
						e.which = e.button & 1 ? 1 : (e.button & 2 ? 3 : (e.button & 4 ? 2 : 0))
					};

					return e;
				} // fix
			}
		}
	}, // e

	reload: {
		value: function() {
			this.load(location.pathname, {ajax:1});
		}
	},


	// FIX event delegation
	/* on: function() {
		console.log(this);
		if($(arguments[0]).length && arguments[1].toString() === "[object Object]") {
			var evs = arguments[1];
			console.log(evs);
			Object.keys(evs).forEach(function(i) {
				return this.on(i, arguments[0], evs[i]);
			});
			return this;
		} else {
			return $(this).on(arguments);
		}
	}, */


	// replace or include node in DOM
	Append: {
		writable: true,
		value: function app(el, pos) {

			// console.log(this[0]);
			var self = this[0] || this;

			console.assert(!!self, el + ' не имеет ' + self + ' в ' + this + '\nОшибка в Append');
			if(!self) console.log(this);

			switch (pos) {
				case "after":
					!!self.nextSibling ? self.parentNode.insertBefore(el, self.nextSibling) : self.parentNode.appendChild(el);
					break;
				case "before":
					self.parentNode.insertBefore(el, self);
					break;
				case "fCh":
					self.firstChild ? self.insertBefore(el, self.firstChild) : app.call(self, el);
					break;
				case null:
				case undefined:
					self.appendChild(el);
					break;
			}
			return $(el);
		}
	},

	// Аналог .append with some fuetchers
	cr: {
		writable: true,
		value: function (node, objAttrs, pos) {

			objAttrs = objAttrs || {};

			var el = (node === 'textNode') ? document.createTextNode() : document.createElement(node);
			if (node === 'script') objAttrs.type = 'text/javascript';

			$(el).attr(objAttrs); // _K.l(el.attr);

			// console.log(this);

			return this.Append.call(this, el, pos);
		}
	},


	// Собираем поля формы в {}
	ajaxForm: {
		value: function () {
			var f = this[0],
			out = {};

			if(!f.elements)
				throw new TypeError('Context of the $().ajaxForm must be a FORM');
			console.log(f.elements);

			[].forEach.call(f.elements, function(i) {
				if(!i.name) return;
				out[i.name] = i.value.trim();
			});

			return out;
		}
	},

	// Выделение текста
	select: {
		value: function () {
			var rng, sel,
				self = this instanceof jQuery ? this[0] : this;

			// console.log('self in select = ', self);
			self.title = self.title || 'Выделить';

			if (document.createRange) {
				rng = document.createRange(); //создаем объект Range
				rng.selectNodeContents(self); //== Содержимое текущего узла (selectNode - сам узел)
				sel = window.getSelection(); //Получаем объект текущее выделение
				var strSel = sel.toString();
				if (!strSel.length) { //Если ничего не выделено
					sel.removeAllRanges(); //Очистим все выделения (на всякий случай)
					sel.addRange(rng); //Выделим текущий узел
				}
			} else {
				document.body.createTextRange().moveToElementText(self).select();
			}
		}
	},

}); // $().fn()
//



Object.defineProperties(jQuery, {
	tmp: {
		value: Object.create(null),
		configurable: true,
		writable: true
	},

	cookie: {
		// configurable: true,
		// writable: true,
		value: {
			set: function set (obj, opts) {
				if (!(obj = Object(obj))) return;
				opts = Object.assign({
					expires: 1,  // сут
					path: "/",
					json: ''  // name 4 json
				}, opts || {});

				// console.log(obj, opts);

				// сут -> мс
				var expires = (new Date((new Date).getTime() + opts.expires * 3.6e6 * 24)).toUTCString() || null;

				// console.log(expires);

				if(opts.json) {
					document.cookie = opts.json + '=' + JSON.stringify(obj) + ';expires=' + expires  + '; path=' + opts.path;

					console.log('cookie = ', this.get(opts.json));

				} else {
					Object.keys(obj).forEach(function (i) {
						if(obj[i] === null)
							return this.remove(i);
						document.cookie = i + '=' + obj[i] + ';expires=' + expires  + '; path=' + opts.path;
					}, this);
				}

				return obj;

			},

			get: function (cookie_name) {
				if (!cookie_name) return decodeURI(document.cookie);

				var m = document.cookie.match('(^|;)?' + encodeURI (cookie_name) + '=([^;]*?)(;|$)'),
				out;

				if(m && (out = m[2]) && (/^(\[|\{)/i.test(m[2]))) {
					try {
						out = JSON.parse(decodeURI (out));
					} catch (e) {
						console.error(e);
					}
				}
				return m && (out || m[2] || null);
			},

			remove: function (c_names) {
				// перечислить удаляемые кукисы через запятую
				var opts = {path: '/'},
				del = {};
				for (var i = 0, L = arguments.length; i < L; i++) {
					if (!this.get(arguments[i]) && (arguments[i] = Object(arguments[i]))) {
						opts = Object.assign(opts, arguments[i]);
						continue;
					}
					del[arguments[i]] = 0;
				}
				// console.log(opts);

				this.set(del, {path: opts.path, expires: -1});
			},
		}
	}, // cookie


	rnd: {
		value: function (arr) {

			if(!arr.length) {
				arr = Object.values(arr);
				// console.info('argument is not array');
			}

			var rnd = Math.floor(Math.random() * arr.length);

			// console.log('rnd = ', rnd, arr);

			return arr[rnd];
		}
	},
}); // $.fn()
