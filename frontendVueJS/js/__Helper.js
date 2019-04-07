'use strict';

// helpers
window._H = {
	mailform: '//js-master.ru/content/1000.Contacts/feedback/',
	api: {
		yTranslate: 'trnsl.1.1.20160322T135831Z.724a4334bf15348b.9d46f4011f729a523031c9d5854f7955478e94e7'
	},

	open:	function() {
		this.addClass('opened');
	},

	close: function() {
		this.removeClass('opened');
	},


	fixSlash: function(path) {
		return path ? path.replace(/\\/g, '/') : '';
	},

	getPath: function(str) {
		var path = decodeURI(str);
		path = _H.qs.parse(path)['page'] || path.replace(/^\/(.+)$/, '$1');
		// path = _H.qs.parse(path)['page'] || path.replace(/^\/(.+)\/$/, '$1');
		return this.fixSlash(path).replace(location.protocol + '//' + location.host + '/', '');
	},


	// create .close_button
	closeButton: function(node, param) {
		param = Object.assign({
			size: 20,
			lineWidth: 3,
			color: '#fff'
		}, (param || {}));

		var c = document.createElement('canvas');

		c = Object.assign(c, {
			width: param.size,
			height: param.size
		});
		if (!c.getContext) return;
		node.appendChild(c);

		// console.log(i, c);

		var ctx = c.getContext("2d");
		ctx.beginPath();
		ctx.lineWidth = param.lineWidth;
		ctx.strokeStyle = param.color;

		ctx.moveTo(0, 0);
		ctx.lineTo(param.size, param.size);
		ctx.moveTo(0, param.size);
		ctx.lineTo(param.size, 0);
		ctx.stroke();
		ctx.closePath();
	},


	qs: {
		// parse query string || @str in object @out
		parse: function(str) {
			str = str || window.location.search;
			if (!str) return false;
			var out = {};

			str.replace(/.*\?/, "").split(/\&/).map(function(i) {
				var pG = i.split(/\=/);
				out[pG[0]] = pG[1] && decodeURI(pG[1]) || null;
				return pG;
			});

			return out;
		},
	}, // qs



	form: {
		validate: function (form, opts) {
			var err = [];

			[].forEach.call(form.elements, function(ind, i) {
				err[ind] = [];

				i.label = form.querySelectorAll("label[for='" + i.id + "']");

				if(i.value !== undefined && i.type !== 'file') i.value = i.value.trim();
				// console.log(i.name);

				switch (i.name) {
					case 'email':
						if(!/.+@.+\..+/i.test(i.value)) err[ind].push('Неверно указан email!');
						break;

					case 'entry':
					case 'message':
						if(i.value.length < 3) err[ind].push('Нет сообщения!');
						break;
					/*
					default:
						break; */
				}

				if(i.required && i.value == 0) {
					err[ind].push('Заполните поле ' + (i.label.textContent || i.placeholder));
				}

				// console.log(err[ind]);
				if(err[ind].length) {
					i.label.style.color = 'red';
				} else {
					i.label.style.color = 'green';
				}
			});
			return err; // arr
		},

		errors: function(form, opts) {
			opts = Object.assign({
				breaks: '<br>',
			}, opts || {});
			var str = '';

			this.validate(form).forEach(function(e) {
				if(e.length) {
					str += (e.join(opts.breaks) + opts.breaks);
				}
			});
			return str;
		}
	},


	popup: function(o) {
		/* o = Object.assign({
				name : {
					tag: 'div',
					html: 'Hello!',
					style: 'display: inline-block;'
			}
		}, (o || {})); */

		var def = {
				tag: 'div',
				html: 'Hello!',
				style: 'display: inline-block;'
		};

		document.addEventListener('keypress', close);

		// console.log(this);

		function close (e) {
			var bool = e.defKeyCode('esc') || e.type === 'click';
			// console.log(bool);
			if(!bool) return;

			e.stopPropagation();
			[].forEach.call(document.querySelectorAll('.popup_canvas'), function(i) {
				i.remove();
			});

			document.removeEventListener('keypress', close);
		}

		var addStyle = '<style>'
			+ '.popup_canvas{width:100%;min-height:100%;background-color: rgba(0,0,0,0.5);overflow:hidden;position:fixed;top:0px;text-align: center; z-index:20;}'
			+ '.popup{display: inline-block;margin:40px auto 0px auto;width:initial;max-width:90%;max-height: 80%;padding:10px;background-color: #c5c5c5;border-radius:5px;box-shadow: 0px 0px 10px #000;}'
			+ '</style>';

		document.head.insertAdjacentHTML('beforeend', addStyle);

		// var df = document.createDocumentFragment(),
		var pw = '<div class="popup_canvas" onclick="close()">'
			+ '<div class=popup>';
		// document.createElement('div')

		Object.keys(o).forEach(function(name) {
			this[name] = Object.assign(def, this[name]);
			pw += (!name.includes('empty') ?
				name + ' - ' :
				'') + '<' + this[name].tag + ' style= "' + this[name].style + '">' + (this[name].html || '') + '</' + this[name].tag + '>\n';

			// f.innerHTML = i.html;
			// pw.appendChild(f);
		}, o);

		pw += '</div></div>';

		document.body.insertAdjacentHTML('beforeend', pw);

		document.querySelector('.popup_canvas').addEventListener('click', close);
	},


	defer: {
		funcs: [],
		tocs: [],
		add: function(fn) {
			var toc = fn.toString();
			if(this.tocs.indexOf(toc) !== -1) {
				console.groupCollapsed(fn.name + 'in defer.add');
				console.log('Функция ', toc, ' уже сохранена!');
				console.groupEnd(fn.name + 'in defer.add');
				return;
			}
			this.tocs.push(toc);
			this.funcs.push(fn);
			return this;
		},
		clean: function() {
			this.funcs = [];
			this.tocs = [];
			return this;
		},
		eval: function(doc) {
			doc = doc || document
			// if(this.complete) return;
			this.funcs.forEach(function(i) {
				if(typeof i === 'function') {
					// console.log(i);
					i(doc);
				}
			});
			this.complete = 1;
			console.log('_H.defer.complete = ' + this.complete,
			'\nthis.funcs = ', this.funcs);
		},
	},


}; // _H


Object.defineProperties(window._H, {
	defer: {
		writable: true
	}

});