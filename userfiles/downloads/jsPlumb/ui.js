jsPlumb.ready(function () {
	// Объект в котором хранятся html страницы из папки prop
	var propPage = {};
	/* $.get("getprop?id=empty", function(data) {
			propPage.empty = data;
			$("#prop-content").html(propPage.empty);
			console.log(JSON.stringify(data));
	}); */

	propPage.empty = "<div class=\"prop-content_empty\">\r\n&#8592; Для просмотра свойств элемента, нажмите на него\r\n</div>";

	$("#prop-content").html(propPage.empty);

	// Признак того, что в данный момент происходит перенос блока
	var dragCheck = false;
	// Номер последнего блока
	var block_num = 1;
	// Тут хранятся все свойства всех блоков
	var nodesProperties = {};
	// Тут хранятся все подсказки на блоках
	var nodesHelper = {};
	// Текущий масштаб
	var zoom = 0; // номер элемента массива ['1', '0.75', '0.5', '0.25']
	// Ошибки валидации блоков
	var nodesError = [];
	// Код выбранного блока, активный блок
	var blockIdCurrent;

	var instance = window.jsp = jsPlumb.getInstance({
		// default drag options
		DragOptions: { cursor: 'pointer', zIndex: 2000 },
		// the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
		// case it returns the 'labelText' member that we set on each connection in the 'init' method below.
		ConnectionOverlays: [
			["Arrow", {
				location: 1,
				visible: true,
				width: 11,
				length: 11,
				id: "ARROW",
				events: {
					click: function () { }
				}
			}],
			/*[ "Label", {
					location: 0.1,
					id: "label",
					cssClass: "aLabel",
					events:{
							tap:function() { alert("hey"); }
					}
			}]*/
		],
		Container: "canvas",
	});

	var basicType = {
		connector: "Flowchart",
		paintStyle: { stroke: "red", strokeWidth: 4 },
		hoverPaintStyle: { stroke: "blue" },
		overlays: [
			"Arrow"
		]
	};
	instance.registerConnectionType("basic", basicType);


	init = function (connection) {
		connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
	};


	/**
	 * Добавление нового блока
	 * @param blockId
	 * @param action_type_group
	 * @param action_type
	 * @param positionX
	 * @param positionY
	 * @private
	 */
	function _addBlock(blockId, action_type_group, action_type, positionX, positionY, properties, helper) {
		var new_jtk_block = eval('jtk_block_' + action_type);

		// Готовим html
		var new_jtk_block_html = $(new_jtk_block.html);
		new_jtk_block_html.css({ 'left': positionX + 'px', 'top': positionY + 'px' });
		new_jtk_block_html.attr('id', blockId);
		new_jtk_block_html.attr('action-type-group', action_type_group);
		new_jtk_block_html.attr('action-type', action_type);

		// Добавляем подсказку
		if (helper !== undefined && helper.length > 0) {
			new_jtk_block_html.find(".jtk-block_desc_text_help").html(helper);
			nodesHelper[blockId] = helper;
		}

		// Добавляем новый блок
		$(".flowchart-place").prepend(new_jtk_block_html);

		// Добавляем точки входа и выхода к новому блоку
		_addEndpoints(blockId, new_jtk_block.sourceAnchors, new_jtk_block.targetAnchors);

		instance.draggable(jsPlumb.getSelector(".flowchart-place .jtk-block"), {
			grid: [20, 20],
			drag: function (e) {
				dragCheck = true;

				leftTo = (parseInt($(e.el).css("width"))) + e.pos[0] + 60;
				if (leftTo > $("#canvas")[0].scrollWidth) {
					$("#canvas").css("width", (leftTo + 160) + 'px');
				}
				/*
				topTo = (parseInt($(e.el).css("height"))) + e.pos[1] + 60;
				if (topTo > $("#canvas")[0].scrollHeight) {
						$( "#canvas" ).css("height", (topTo + 160) + 'px');
				}*/
				//$("#canvas").innerHeight('1600px');



				/*
				if (leftTo > scrollWidth ) {

						var scroll = leftTo - $( ".ag-editor" ).width();
						if(scroll > 0)
								$( ".ag-editor" ).scrollLeft(scroll-20);
				}*/
			},
			stop: function (e) {
				dragCheck = false;
				// Подгружаем свойства перетаскиваемого блока
				nodeClickEvent($(e.el));

				// Не даем разместить блок выше и левее нуля
				if (e.finalPos[0] < 0 || e.finalPos[1] < 0) {
					if (e.finalPos[0] < 0) $(e.el).css('left', '0px');
					if (e.finalPos[1] < 0) $(e.el).css('top', '15px');
					instance.repaintEverything();
				}
			}
		});

		// Создаем в памяти объект со свойствами данного блока
		if (properties == 0) {
			var copy_properties = Object.assign({}, new_jtk_block.properties);
			nodesProperties[blockId] = copy_properties;
		}
		else {
			nodesProperties[blockId] = properties;
		}

		// Номер текущего блока
		var current_block_num = Number(blockId.replace(/\D+/g, ""));
		// Проставляем номер последующего блока (макимальный id)
		if ((current_block_num + 1) <= block_num) {
			block_num++;
		}
		else {
			block_num = current_block_num + 1;
		}
	}


	/*
	 * Добавление точек входа и выхода
	 */
	var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
		// Добавление выходных точек
		for (var i = 0; i < sourceAnchors.length; i++) {
			if (typeof sourceAnchors[i] === 'object') {
				anchorPosition = sourceAnchors[i][6];
			}
			else {
				anchorPosition = sourceAnchors[i];
			}

			var style = sourceEndpoint;
			// Для условий, свои настройки выходных точек
			if (anchorPosition == "BottomLeftYes") {
				style = sourceEndpointConditionYes;
			}
			else if (anchorPosition == "BottomRightNo") {
				style = sourceEndpointConditionNo;
			}

			// uuid - уникальный идентификатор точки, будет использоваться для связей
			var sourceUUID = toId + 'UUID' + anchorPosition;
			instance.addEndpoint(toId, style, {
				anchor: sourceAnchors[i], uuid: sourceUUID
			});
		}
		// Добавление входных точек
		for (var j = 0; j < targetAnchors.length; j++) {
			// uuid - уникальный идентификатор точки, будет использоваться для связей
			var targetUUID = toId + 'UUID' + targetAnchors[j];
			instance.addEndpoint(toId, targetEndpoint, {
				anchor: targetAnchors[j], uuid: targetUUID
			});
		}
	};

	/**
	 * Сохранение состояния
	 */
	function save(run, noty) {
		// Если нет прав на сохранение
		if (($("#btn-save")).length == 0) {
			return false;
		}

		// Собираем все связи между точками
		var connections = [];
		$.each(instance.getConnections(), function (idx, connection) {
			connections.push({
				//connectionId: connection.id,
				pageSourceId: connection.sourceId,
				pageTargetId: connection.targetId,
				uuids: connection.getUuids()
			});
		});

		// Собираем все блоки
		var nodes = [];
		$(".jtk-block").each(function (idx, elem) {
			var $elem = $(elem);
			nodes.push({
				blockId: $elem.attr('id'),
				action_type_group: $elem.attr('action-type-group'),
				action_type: $elem.attr('action-type'),
				positionX: parseInt($elem.css("left"), 10),
				positionY: parseInt($elem.css("top"), 10),
				properties: nodesProperties[$elem.attr('id')],
				helper: nodesHelper[$elem.attr('id')]
			});
		});

		connections = JSON.stringify(connections);
		nodes = JSON.stringify(nodes);

		$.ajax({
			method: "POST",
			url: "editorsave",
			data: { id_automation: $("#id_automation").val(), connections: connections, nodes: nodes, run: run, YII_CSRF_TOKEN: $("#YII_CSRF_TOKEN").val() }
		}).done(function (result) {
			if (noty) {
				$.notify({
					message: 'Сохранено'
				}, {
						type: 'success',
						delay: 1000,
						placement: {
							from: "bottom",
							align: "left"
						},
					});
			}
		});
	}

	/**
	 * Загрузка состояния
	 */
	function load(nodes_json, connections_json) {
		// Разбираем блоки, размещаем их и делаем точки входа и выхода
		var nodes = JSON.parse(nodes_json);

		$.each(nodes, function (index, elem) {
			_addBlock(elem.blockId, elem.action_type_group, elem.action_type, elem.positionX, elem.positionY, elem.properties, elem.helper);
		});

		// Разбираем и делаем связи
		var connections = JSON.parse(connections_json);
		$.each(connections, function (index, elem) {
			instance.connect({ uuids: [elem.uuids[0], elem.uuids[1]], editable: true });
		});


		// Добавляем подсказку с кол-вом контактов, проходящих блок
		if ($("#run_date").val() != '0000-00-00 00:00:00') {
			$.get("GetCountContact?id=" + $("#id_automation").val(),
				function (data) {
					data = jQuery.parseJSON(data);
					if (data) {
						$.each(nodes, function (index, elem) {
							title = "Кол-во контактов прошедших блок";
							var $elem = $("#" + elem.blockId);
							count_ctct = 0;
							if (data[elem.blockId] !== undefined) {

								if (elem.action_type == 3) { // блок - письмо
									title = "Контакты, которым было отправлено письмо.";
									$.each(data[elem.blockId], function (index, value) {
										if (index > 0) {
											if (index == 1) {
												value_span = '<span style="color:#008000">' + value + '</span>';
											}
											if (index == 2) {
												value_span = '<span style="color:#d8a903">' + value + '</span>';
											}
											if (index == 3) {
												value_span = '<span style="color:#ff0000">' + value + '</span>';
											}
											count_ctct = count_ctct + '/' + value_span;

										}
										else {
											count_ctct = value;
										}
									});
								}
								else {
									count_ctct = data[elem.blockId];
								}
							}


							$elem.append('<div class="jtk-block_contact" data-blockId="' + elem.blockId + '" data-action_type="' + elem.action_type + '" data-action-type-group="' + elem.action_type_group + '" title="' + title + '">' + count_ctct + '</div>');
						});
					}
				});
		}

	}
	function preload() {
		var data = {
			"nodes_json": "[{\"blockId\":\"flowchartWindow2\",\"action_type_group\":\"2\",\"action_type\":\"3\",\"positionX\":2920,\"positionY\":200,\"properties\":{\"email_subject\":\"\",\"email_text\":\"\",\"id_mailing_author\":null}},{\"blockId\":\"flowchartWindow1\",\"action_type_group\":\"1\",\"action_type\":\"2\",\"positionX\":2833,\"positionY\":46,\"properties\":{\"id\":\"\"}}]",
			"connections_json": "[{\"pageSourceId\":\"flowchartWindow1\",\"pageTargetId\":\"flowchartWindow2\",\"uuids\":[\"flowchartWindow1UUIDBottomCenter\",\"flowchartWindow2UUIDTopCenter\"]}]"
		};

		if (data.nodes_json !== '') {
			load(data.nodes_json, data.connections_json);
			$(".load").hide();
		}
		else {
			$(".load").hide();
		}

		/* $.get("editorload?id="+$("#id_automation").val(),
		function(data) {
				data = jQuery.parseJSON(data);
				if(data.nodes_json !== '') {
						load(data.nodes_json, data.connections_json);
						$(".load").hide();
				}
				else {
						$(".load").hide();
				}
		}); */

	}


	instance.batch(function () {
		instance.bind("click", function (conn, originalEvent) {
			// if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
			//   instance.detach(conn);
			//conn.toggleType("basic");


		});

		instance.bind("connectionDrag", function (connection) {

		});

		instance.bind("connectionDragStop", function (connection) {
			if (connection.target) {
				if (connection.targetId) {
					// Убираем сообщение об ошибках в блоке
					$('#' + connection.sourceId).find(".jtk-block_err").remove();
					$('#' + connection.targetId).find(".jtk-block_err").remove();
				}
			}

		});

		instance.bind("connectionMoved", function (params) {

		});
	});

	// Перетаскивание блоков из toolbox
	var dragCheckTb = false;
	$(".tb-block").draggable({
		revert: true,
		helper: "clone",
		appendTo: 'body',
		containment: "window",
		start: function (event, ui) {
			dragCheckTb = true;
		},
		stop: function (event, ui) {
			dragCheckTb = false;
			ui.helper.remove();
		},
	});
	$('.ag-editor').droppable({
		accept: '.tb-block',
		drop: function (e, ui) {
			leftPosition = $(".ag-editor").scrollLeft() + (ui.offset.left - $(this).offset().left);
			topPosition = $(".ag-editor").scrollTop() + (ui.offset.top - $(this).offset().top);

			_addBlock('flowchartWindow' + block_num, ui.helper.attr('action-type-group'), ui.helper.attr('action-type'), leftPosition, topPosition, 0)
			instance.repaintEverything();
			// Удаляем блок, который переносили из тулбокса
			ui.helper.remove();
		}
	});
	// Подсказка о том, что блок надо тащить
	$('.ag-toolbox').on("mouseup", ".tb-block", function (event) {
		if (dragCheckTb == false) {
			tooltip = $(this).tooltip({
				title: 'Перетащите влево',
				trigger: 'manual',
			});
			tooltip.tooltip('show');
			setTimeout(function () { tooltip.tooltip('hide'); }, 1000);
		}
	});

	// Удаление блока
	$('.flowchart-place').on("click", ".jtk-block_del", function () {
		var parentnode = $(this)[0].parentNode;

		bootbox.confirm({
			message: "Удалить блок?",
			buttons: {
				confirm: {
					label: 'Да',
				},
				cancel: {
					label: 'Нет',
				}
			},
			callback: function (result) {
				if (result == true) {
					instance.deleteConnectionsForElement(parentnode);
					instance.removeAllEndpoints(parentnode);
					$(parentnode).remove();
					// Удаляем свойства элемента из памяти
					delete nodesProperties[$(parentnode).attr('id')];
					// Убираем страницу со свойствами
					$("#prop-content").html(propPage.empty);
				}
			}
		});
	});

	// Клик по блоку
	function nodeClickEvent(obj) {
		// Устанавливаем класс выбранного элемента
		$(".jtk-block-active").removeClass("jtk-block-active");
		obj.addClass("jtk-block-active");

		// Код типа блока
		var actionType = obj.attr('action-type');
		var blockId = obj.attr('id');

		if (blockIdCurrent != blockId) {
			blockIdCurrent = blockId;
			// Если html страницы со свойствами нет в памяти, то делаем get запрос в папку prop
			if (!(actionType in propPage)) {
				$.get("getprop?id=" + actionType, function (data) {
					propPage[actionType] = data;
					nodeClick(actionType, blockId);
				});
			}
			else {
				nodeClick(actionType, blockId);
			}
		}
	}
	function nodeClick(actionType, blockId) {
		// Устанавливаем свойства блока
		$("#prop-content").html(propPage[actionType]).promise().done(function () {
			// Все свойства блока устанавливаем в инпут
			$("#PropBlock_prop").val(JSON.stringify(nodesProperties[blockId]));
			$("#PropBlock_allprop").val(JSON.stringify(nodesProperties));

			// Для условия - открыл письмо, устанавливаем свои свойства
			if (actionType == 9 || actionType == 10) {
				// Формируем список писем из этой автоворонки
				$(".jtk-block").each(function (idx, elem) {
					var $elem = $(elem);
					if ($elem.attr('action-type') == 3) {
						$("#listMail").append($('<option></option>').val($elem.attr('id')).html(nodesProperties[$elem.attr('id')]['email_subject']));
					}
				});
			}

			properties = nodesProperties[blockId];
			for (var prop in properties) {
				input = $("#node-prop").find("[name^='PropBlock[" + prop + "]']");
				if (input.attr('type') == 'radio') {
					// Для радио кнопок значение устанавливается по своему
					input.filter('[value="' + properties[prop] + '"]').attr('checked', true);
				}
				else if (input.attr('type') == 'checkbox') {
					// Для чекбоксов
					input.filter('[value="' + properties[prop] + '"]').attr('checked', true);
				}
				else if (input.prop('type') == 'select-multiple') {
					// Для множественного списка
					$.each(properties[prop].split(","), function (i, e) {
						input.find("option[value='" + e + "']").prop("selected", true);
					});
				}
				else
					input.val(properties[prop]);
			}
			$("#PropBlock_blockId").val(blockId);

			// Для "отправить письмо" устанавливаем отправителя по-умолчанию
			if (actionType == 3) {
				if (typeof properties['id_mailing_author'] === 'undefined') {
					properties['id_mailing_author'] = $("#node-prop").find("[name='PropBlock[id_mailing_author]']").val();
				}
			}






			$(".prop-comment").popover({
				trigger: 'click',
				placement: 'bottom',
				html: true,
				content: '<textarea class="prop-comment_textarea"></textarea>',
				template: '<div class="popover"><div class="arrow"></div>' +
					'<h3 class="popover-title"></h3><div class="popover-content">' +
					'</div><div class="popover-footer"><button type="button" class="btn btn-primary popover-submit">' +
					'<i class="icon-ok icon-white"></i></button>&nbsp;' +
					'<button type="button" class="btn btn-default popover-cancel">' +
					'<i class="icon-remove"></i></button></div></div>'
			})
				.on('shown', function () {
					//hide any visible comment-popover
					$("[rel=comments]").not(this).popover('hide');
					var $this = $(this);
					//attach link text
					$('.prop-comment_textarea').val($this.text()).focus();
					//close on cancel
					$('.popover-cancel').click(function () {
						$this.popover('hide');
					});
					//update link text on submit
					$('.popover-submit').click(function () {
						$this.text($('.popover-textarea').val());
						$this.popover('hide');
					});
				});

		});
	}





	// Клик по блоку
	$('.flowchart-place').on("mouseup", ".jtk-block", function (event) {
		if (dragCheck == false && (event.target.classList[0] != "jtk-block_del") && (event.target.classList[0] != "jtk-block_contact")) {
			nodeClickEvent($(this));
		}
	});

	// Двойной клик по блоку
	$('.flowchart-place').on("dblclick", ".jtk-block", function (event) {
		if (dragCheck == false && (event.target.classList[0] != "jtk-block_del")) {
			// Не вызываем nodeClickEvent($(this)) т.к. двойной клик дублирует mouseup
			$('.nav-tabs a[href="#tb-prop"]').tab('show');
		}
	});

	// Клик по пустому пространству, убирает активность с элемента
	$('.ag-editor').mouseup(function (e) {
		var container = $(".jtk-block");
		if (!container.is(e.target) && container.has(e.target).length === 0) {
			$('.selectpicker').selectpicker('destroy');
			blockIdCurrent = 0;
			$(".jtk-block-active").removeClass("jtk-block-active");
			$("#prop-content").html(propPage.empty);
		}
	});

	$('.ag-editor').click(function (e) {
		if ($('.dropdown-menu.show').length == 2) {
			$('.selectpicker').selectpicker('toggle');
		}
	});



	/**
	 * Установка подсказки на блоке
	 */
	function setHelper() {
		var type = $('*[name="PropBlock[type]"]', '#prop-content').val();

		// Если тип "любой", то подсказка должна быть соответствующая
		if (type == 2) {
			helper = $('*[name="PropBlock[type]"]').find("option:selected").text();
			helper = '&#171;' + helper.substring(0, 50) + '&#187;';
		}
		else {
			// Конкретные подсказки
			var field = $('.prop-helper', '#prop-content');

			if (($(field[1]).length > 0 && field[1].tagName == 'SELECT') || field[0].tagName == 'SELECT') {
				helperArr = [];
				field.find(":selected").each(function () {
					if ($(this).length) {
						helperArr.push($(this).text());
					}
				});
				helper = helperArr.join(', ')
			}
			else {
				helper = field.val();
			}
			helper = '&#171;' + helper.substring(0, 50) + '&#187;';
		}

		$('#' + $("#PropBlock_blockId").val()).find(".jtk-block_desc_text_help").html(helper);
		// Сохраняем в памяти
		nodesHelper[$("#PropBlock_blockId").val()] = helper;
	}

	// Изменение свойств блока
	$('#prop-content').on('change', '*[name*="PropBlock"]', function () {
		if ($(this).attr('type') == 'checkbox') {
			if ($(this).prop('checked'))
				val = 1;
			else
				val = 0;
		}
		else {
			val = $(this).val();
			if ($(this).prop('type') == 'select-multiple' && typeof val == 'object') {
				val = val.toString();
			}
		}

		prop = $(this).attr("name").substring(10).replace(']', '').replace('[]', '');
		nodesProperties[$("#PropBlock_blockId").val()][prop] = val;


		if (prop == 'type') {
			setHelper();
		}

		// Если изменили поле, которое дублируется в виде подсказки на блоке
		if ($(this).hasClass("prop-helper")) {
			setHelper();
		}

		// Убираем сообщение об ошибках в заполнении
		$('#' + $("#PropBlock_blockId").val()).find(".jtk-block_err").remove();
	});

	$('#btn-save').click(function () {
		if ($('#run').val() == "1") {
			if (validate()) {
				save(0, true);
			}
			else {
				$.notify({
					message: 'Перед сохранением необходимо исправить ошибки!'
				}, {
						type: 'danger',
						delay: 10000,
						placement: {
							from: "bottom",
							align: "left"
						},
					});
			}
		}
		else {
			save(0, true);
		}
	});

	key('ctrl+s', function () { save(0, true); return false; });

	// Загрузка состояния редактора при запуске
	preload();

	// Изменение масштаба
	function setZoom(zoom) {
		transformOrigin = [0.5, 0.5];
		el = instance.getContainer();
		var p = ["webkit", "moz", "ms", "o"],
			s = "scale(" + zoom + ")",
			oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

		for (var i = 0; i < p.length; i++) {
			el.style[p[i] + "Transform"] = s;
			el.style[p[i] + "TransformOrigin"] = oString;
		}

		el.style["transform"] = s;
		el.style["transformOrigin"] = oString;
	};
	function changeZoom(s) {
		var allowedZoom = ['1', '0.75', '0.5', '0.25'];
		if (s == 0) {
			// уменьшаем
			newZoom = zoom + 1;
		}
		else {
			// увеличиваем
			newZoom = zoom - 1;
		}
		if (typeof allowedZoom[newZoom] !== 'undefined') {
			setZoom(allowedZoom[newZoom]);
			$('.zoom_val').html((allowedZoom[newZoom] * 100) + "%");
			zoom = newZoom;
		}

		jsPlumb.repaintEverything();
		instance.repaintEverything();
	}
	// Уменьшение масштаба
	$('.zoom_out').click(function () {
		changeZoom(0);
	});
	// Увеличение масштаба
	$('.zoom_in').click(function () {
		changeZoom(1);
	});




	// Запуск проверки на ошибки
	function validate() {
		// Убираем старые ошибки
		$(".jtk-block").find(".jtk-block_err").remove();
		nodesError = [];
		successValidate = true;

		// Собираем ошибки свойств блоков
		$(".jtk-block").each(function (idx, elem) {
			var $elem = $(elem);
			var blockId = $elem.attr('id');
			var action_type_group = $elem.attr('action-type-group');
			var action_type = $elem.attr('action-type');
			var properties = nodesProperties[blockId];

			// Валидация свойств конкретного блока
			blockError = validateProperties(action_type, properties);

			// Собираем ошибки связей
			connError = validateConnections(action_type_group, instance.getConnections(), blockId);
			if (connError) {
				blockError["conn"] = connError;
				successValidate = false;
			}

			// Если у блока есть ошибки
			if (Object.keys(blockError).length) {
				nodesError[blockId] = blockError;
				successValidate = false;
			}
		});

		// Размещаем подсказки об ошибках
		for (var blockId in nodesError) {
			var $elem = $("#" + blockId);
			var error = "";
			for (var prop in nodesError[blockId]) {
				error += nodesError[blockId][prop] + '\n';
			}
			$elem.append('<div class="jtk-block_err" data-toggle="tooltip" data-placement="top" title="' + error + '"></div>');
		}
		$('[data-toggle="tooltip"]').tooltip();

		return successValidate;
	}

	$('#btn-start').click(function () {
		if (validate()) {
			bootbox.confirm({
				message: "Запустить данную автоворонку?<br/>Все изменения будут сохранены",
				buttons: {
					confirm: { label: 'Да' },
					cancel: { label: 'Нет' }
				},
				callback: function (result) {
					if (result == true) {
						$("#btn-start").hide();
						$("#btn-stop").show();
						save(1, false);
						$.notify({
							message: 'Автоворонка запущена!'
						}, {
								type: 'success',
								delay: 3000,
								placement: {
									from: "bottom",
									align: "left"
								},
							});
					}
				}
			});
		}
		else {
			$.notify({
				message: 'Перед запуском необходимо исправить ошибки!'
			}, {
					type: 'danger',
					delay: 10000,
					placement: {
						from: "bottom",
						align: "left"
					},
				});
		}

	});

	$('#btn-stop').click(function () {
		bootbox.confirm({
			message: "Остановить данную автоворонку?",
			buttons: {
				confirm: { label: 'Да' },
				cancel: { label: 'Нет' }
			},
			callback: function (result) {
				if (result == true) {
					$("#btn-start").show();
					$("#btn-stop").hide();
					save(2, false);
					$.notify({
						message: 'Автоворонка остановлена!'
					}, {
							type: 'success',
							delay: 3000,
							placement: {
								from: "bottom",
								align: "left"
							},
						});
				}
			}
		});
	});

});


$(function () {

	// Клик по кол-ву контактов
	$('.flowchart-place').on("click", ".jtk-block_contact", function (event) {
		contactClickEvent($(this).attr('data-action-type-group'), $(this).attr('data-action_type'), $(this).attr('data-blockId'));
	});
	function contactClickEvent(actionTypeGroup, actionType, blockId) {
		$.ajax({
			method: "GET",
			url: "GetContactList",
			data: { id_automation: $("#id_automation").val(), actionTypeGroup: actionTypeGroup, actionType: actionType, blockId: blockId }
		}).done(function (result) {
			$('#contactModal').modal('show');
			$('#contactModal').find('.modal-content').html(result);
		});
	}

	$(document).on('submit', '#node-prop', function (e) {
		e.preventDefault();
	});

	scrollLeft = $("#canvas")[0].scrollWidth / 2 - ($("#canvas").width() / 2);
	$(".ag-editor").scrollLeft(scrollLeft);

	/**
	 * Перетаскивание холста
	 */
	var curDown = false,
		curYPos = 0,
		curXPos = 0,
		scrollTop = 0,
		scrollLeft = 0;

	$(".ag-editor").mousemove(function (m) {
		if (curDown === true) {
			$(this).scrollTop(scrollTop + (curYPos - m.offsetY));
			$(this).scrollLeft(scrollLeft + (curXPos - m.offsetX));
		}
	});

	$(".ag-editor").mousedown(function (m) {
		curDown = true;
		$(this).css('cursor', 'move');
		curYPos = m.offsetY;
		curXPos = m.offsetX;
		scrollTop = $(this).scrollTop();
		scrollLeft = $(this).scrollLeft();
	});

	$(".ag-editor").mouseup(function () {
		curDown = false;
		$(this).css('cursor', 'auto');
	});
});