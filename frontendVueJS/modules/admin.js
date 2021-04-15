'use strict';
var _A = {
	v: {},

	setFormat : function (cmd, par, val, e) {
		val = val || (par ? encodeURI(prompt ("Введите " + par)) : null);
		e.preventDefault();
		// console.log(arguments);
		//developer.mozilla.org/ru/docs/Web/API/Document/execCommand

		document.execCommand (cmd, false, val);
		return false;
	},


	editPanel: function ($node, path) {
		// create edit panel
		var $ep = $('<div />',{class : 'core editpanel'}).insertBefore($node),
			opts= {
				// img_name : (str) cmd
				// img_name : (arr) cmd, (hint_promt_val | ("", val))
				undo: "undo", redo: "redo|repeat|_",
				"b" : "bold", "i" : "italic", "u" : "underline",  "strike" : "strikeThrough|strikethrough|_",
				"left" : "justifyLeft|align-left" ,"center" : "justifyCenter|align-center", "right" : "justifyRight|align-right", "full": "justifyFull|align-justify|_",
				"sub" : "subscript", "sup" : "superscript||_",
				"list" : "insertUnorderedList|list-ul", "ordered-list" : "insertOrderedList|list-ol|_",
				"p" : "insertParagraph|paragraph", "HR" : "insertHorizontalRule|~", "</>" : ["formatBlock|~|_","имя тега"],
				"indent" : "indent", "outdent" : "outdent||_",
				"url" : ["createLink|link","URL"], "unlink" : "unlink||_",
				"image" : ["insertimage|image","путь к изображению"], "FONT" : ["fontName|~|_","font-family"],
				"removeFormat" : "removeFormat|times "
			},

			$dFr= $(document.createDocumentFragment()),

			$save = $('<button class="fa fa-save button green bold" style="margin-right: 1em;">SAVE</button>', {title : 'Сохранить изменения'}).prependTo($ep),
			self = this;


		/* $node.on('blur', function(e) {
			console.log(this);
			e.preventDefault();
		}); */

		$save.on('click', function(e) {
			// format before saving
			self.saveEdit(e, $node.html(), {path: path});
		});
		// console.log(save);

		// use local styles
		document.execCommand ('styleWithCSS', false, false);

		Object.keys(opts).forEach(function(i) {
			var cmd, par, val = null, cmd_arr, fa;
			if(Array.isArray(opts[i])) {
				cmd = opts[i][0];
				par = opts[i][1];
				val = opts[i][2];
			} else cmd = opts[i];

			cmd_arr = cmd.split('|');
			cmd = cmd_arr[0];
			fa = cmd_arr[1] || cmd;

			var $tagI = $('<i />', {class: "button fa", title: i})
			.appendTo($dFr)
			.on('mousedown', this.setFormat.bind($node[0], cmd, par, val));

			// Интервалы между группами
			if(cmd_arr[2] === '_') $tagI.css({marginRight: '.9em'});

			// fa / text
			if(fa === '~') {
				$tagI.text(i);
			} else {
				$tagI.addClass("fa-" + fa);
			}
		}, this);

		$ep.append($dFr);

	}, // editPanel


	saveEdit : function(e, art, opts) {
		e.stopPropagation();

		if(!confirm('Сохранить изменения?')) return;

		opts = Object.assign({
			path: null,
			cb: null
		}, opts || {});

		if(!opts.path)
			return console.warn("Нет opts.path", opts);

		var dblBr = "p|h[1-6]|ol|ul|div|section|table|article",
			Br = "li";

		function addBr (tags) {
			return new RegExp("(<\\/(?:" + tags + ")>)(?!\\n|\\s|$)", 'ig');
		}

		art = art.replace(/\s*(?:(?:fsish|contenteditable)=[^\s>]+|class=([\'\"])\s*\1)/ig, '')
			.replace(addBr(dblBr), "$1\n\n")
			.replace(addBr(Br), "$1\n");

		$.post('/', {
			module : 'php/modules/editContent.php',
			path: opts.path,
			art : art,
			action : 'save'
		})
		.done(function(response) {
			console.log(response);

			_H.popup({
				'server' : {
					tag: 'div',
					html: response,
				}
			});

			if(typeof opts.cb === 'function') opts.cb();
			// Чистим кеш
		});

	}, // saveEdit
	// editPanel


	saveSettings: function($t) {
		// console.log(e);
		var $sts = $t.siblings('#page_settings').find('div'),
			obj = {};

		$sts.each(function(ind,i) {
			var key = i.children[0].textContent || i.children[0].value,
				arr = key.split('-');
			// if(key === 'template' && )
			if(arr.length > 1) {
				obj[arr[0]] = obj[arr[0]] || [];
				obj[arr[0]].push(i.children[1].value);
			} else
				obj[key] = i.children[1].value;
		});

		if(confirm('Save updates?')) window.$page_content.load(location.pathname, {
			adm: {saveSettings: obj}
		}, function(response) {
			// console.log(obj, response);
		});

	}, // saveSettings

	addSetting: function($t) {
		var $sts = $t.find('div');
		$t.append($t.children().last().clone());
		$t.children().last().find('label').replaceWith('<input value="seo-0">');
	},


	init: function() {

		var $esws = $f('.editorSwitcher');

		$esws.on('change', function(i) {
			var $area = $(this).siblings('.editor'),
			area = $area[0],
			path = $area.attr('data-path'),
			data = {module: path},
			action = this.options[this.selectedIndex].textContent;
			// console.log(this, area);

			$area.on('mouseup', function(e) {
				e.stopPropagation();
			});

			switch (action) {
				case 'contentEditable':
					$f('[contentEditable]').each(function(ind,i) {
						i.contentEditable = false;
					});

					_A.editPanel($area, path);
					data = {
						module: 'php/modules/editContent.php',
						path: path,
						action: 'load'
					};
					// area.innerHTML =
					area.contentEditable = true;
					break;

				case 'editFile':
					location.replace('/?module=Download&file=' + path);
					break;

				// 'normal'
				default:
					area.contentEditable = false;
					$area.siblings('.core.editpanel').remove();
					break;
			}

			// reload content without executable js
			$.post('/', data, 'text')
			.done(function(response) {
				// console.log(data);
				$area.html('');
				area.insertAdjacentHTML('afterbegin', response) ;
			})
			.fail(function(response) {
				console.log(response);
			});
		}); // change editorSwitcher

	} // init

} // _A


$(_A.init);