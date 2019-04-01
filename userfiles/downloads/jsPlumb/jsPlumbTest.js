'use strict';

var DrawChart = {

	__scope: {
		countElements: 0,
		htmlBase: 'drawingArea',
		$htmlBase: $('#drawingArea'),
		$menu_buts: $('#task_menu .menu_button_container'),

		scale: 0.75,

		// groups in menu
		groups: {

			first: {
				name: 'Вход',
				props: {
					html: {
						header: 'Это первый элемент',
						content: '',
						footer: ''
					},
					ancors: [
						{
							type: 'source',
							position: 'BottomCenter',
							// 4 forks
							confirm: ''
						}
					]
				}
			},

			middle: {
				name: 'Действия',
				props: {
					html: {
						header: "Это средний элемент"
					},
					ancors: [
						{
							type: 'target',
							position: 'TopCenter'
						},
						{
							type: 'source',
							position: 'BottomCenter'
						}
					]
				}
			},

			fork: {
				name: 'Условия',
				props: {
					html: {
						header: "Это разветвляемый элемент"
					},
					ancors: [
						{
							type: 'target',
							position: 'TopCenter'
						},
						{
							type: 'source',
							confirm: 'Yes',
							position: 'LeftMiddle'
						},
						{
							type: 'source',
							confirm: 'No',
							position: 'RightMiddle'
						}
					]
				}
			},

			last: {
				name: 'Завершение',
				props: {
					html: {
						header: "Это завершающий элемент"
					},
					ancors: [
						{
							type: 'target',
							position: 'TopCenter'
						}
					]
				}
			}
		},

		fields: {
			first: [
				['to_group', 'Подписался в группу'],
				['order_goods', 'Заказал товар'],
				['buy_goods', 'Купил товар'],
				['get_access', 'Получил доступ к курсу'],
			],
			middle: [
				['send_mail', 'Отправить письмо', '<textarea placeholder="text"></textarea>'],
				['copy_to_group', 'Копировать в группу', '<input type="text" placeholder="groupname" size="11">'],
				['remove_from_group', 'Удалить из группы', '<input type="text" placeholder="groupname" size="11">'],
				['pause', 'Пауза', '<input type="text" value="24" size="7"> часов'],
				['copy_to_autocone', 'Копировать в автоворонку', '<input type="text" placeholder="autoconename" size="12">'],
				['personal', 'Персональное предложение', '<textarea placeholder="personal"></textarea>'],
				['remove_from_autocone', 'Удалить из автоворонки', '<input type="text" placeholder="autoconename" size="12">'],
				['notify_manager', 'Оповестить сотрудника', '<textarea placeholder="text"></textarea>'],
			],
			fork: [
				['if_open_mail', 'Открыл письмо'],
				['if_click_link', 'Кликнул по ссылке'],
				['if_order_goods', 'Заказал товар'],
				['if_buy_goods', 'Купил товар'],
				['if_in_grop', 'Подписан на группу'],
				['if_cond_lesson', 'Условие по уроку']
			],
			last: [
				['kill_bill', 'Прибил заказчика']
			]
		},

	},

	setZoom: function(zoom, jsPlumb, transformOrigin, el) {

		jsPlumb = jsPlumb || window.jsPlumb;
		transformOrigin = transformOrigin || [ 0.5, 0.5 ];

		el = el || jsPlumb.getContainer();
		var p = [ "webkit", "moz", "ms", "o" ],
			s = "scale(" + zoom + ")",
			oString = (transformOrigin[0] * 100) + "% " + (transformOrigin[1] * 100) + "%";

		for (var i = 0; i < p.length; i++) {
			el.style[p[i] + "Transform"] = s;
			el.style[p[i] + "TransformOrigin"] = oString;
		}

		el.style["transform"] = s;
		el.style["transformOrigin"] = oString;

		jsPlumb.setZoom(zoom);
	}, // setZoom


	save: function () {

		var $nodes = $(".jtk-node"),
			save_nodes = {},
			connections = [],
			flowChart;


		$nodes.each(function (ind, node) {
			var $node = $(node),
				endpoints = jsPlumb.getEndpoints(node.id);

			// console.log('endpoints = ', endpoints);

			save_nodes[node.id] = {
				props: node.props,
				position: {
					left: parseInt($node.css("left")),
					top: parseInt($node.css("top"))
				}
			};

			save_nodes[node.id].props.watch('value', function (id, oldval, newval) {
				console.log('save_nodes[' + node.id + '].props.' + id + ' изменено с ' + oldval + ' на ' + newval);
				return newval;
			});

		}); // $(".jtk-node").each

		// console.log('nodes = ', nodes);

		if(CKEDITOR) {
			var cki = CKEDITOR.instances;
			Object.keys(cki).forEach(function(i) {
				var id = cki[i].parent.id;

				console.log('before', id, save_nodes[id].props.value );

				(function(id) {

					save_nodes[id].props.value = save_nodes[id].props.value || cki[i].getData();

				})(id);

				console.log(
					// cki[i].parent,
					'after',
					id,
					cki[i].getData(),
					save_nodes[id].props.value
				);

			});
		}



		$.each(jsPlumb.getConnections(), function (idx, connection) {
			connections.push({
				id: connection.id,
				sourceId: connection.sourceId,
				targetId: connection.targetId,
				uuids: connection.getUuids(),
				anchors: connection.endpoints.map(function (ep) {
					return [[ep.anchor.x,
					ep.anchor.y,
					ep.anchor.orientation[0],
					ep.anchor.orientation[1],
					ep.anchor.offsets[0],
					ep.anchor.offsets[1]]];
				})
			});
		});

		flowChart = {
			nodes: save_nodes,
			connections: connections,
			length: $nodes.length
		}

		// console.log('flowChart = ', flowChart);

		$.cookie.set(flowChart, {json: 'flowChart'} );
		var flowChartJson = JSON.stringify(flowChart);
		// console.log('flowChartJson = ', flowChartJson);

		// $('#jsonOutput').text(flowChartJson);

	}, // DrawChart.save


	load: function () {

		var json = $('#jsonOutput').text() || $.cookie.get('flowChart');

		if(!json) return;

		jsPlumb.setSuspendDrawing(true);

		var flowChart = typeof json === 'string' ? JSON.parse(json) : json,
			nodes = flowChart.nodes,
			connections = flowChart.connections;


		Object.keys(nodes).forEach(function(id) {
			var props = nodes[id].props;
			// props.id = id;

			var $node = DrawChart.addItem(props, id, 'load');

			$node.css({
				left: nodes[id].position.left,
				top: nodes[id].position.top
			});

			// jsPlumb.recalculateOffsets($node);
			// jsPlumb.repaint(id);
		});

		connections.forEach(function (ctx) {
			jsPlumb.connect({
				source: ctx.sourceId,
				target: ctx.targetId,
				paintStyle: connectorPaintStyle,
				// endpointStyles: targetEndpoint,
				uuids: [ctx.uuids[0], ctx.uuids[1]],
				editable: true,
				anchors: ctx.anchors
			});

		});

		jsPlumb.setSuspendDrawing(false, true);
		// jsPlumb.repaintEverything();


		Gl.countElements = flowChart.length;
	}, // load


	constrItem: function(props, isLoad, htmlBase) {

		var fr = document.createDocumentFragment(),
		instance,
		$instance = $(fr).cr('div', {	class: 'jtk-node', 'data-type': props.type});

		++Gl.countElements;

		$instance.cr('div', {class: 'button_remove'});

		// .cr('select', {}, 'after');


		(htmlBase || Gl.$htmlBase).append(fr);

		instance = $instance[0];
		instance.props = props;
		// console.log(Gl.countElements, props.load);

		instance.id = (isLoad && props.id) || ('jtk-' + Gl.countElements);

		Object.keys(props.html).forEach(function(i) {
			// console.log( props.html[i]);
			if(!props.html[i]) return;
			$instance.cr('div', {class: 'node-' + i}).html(props.html[i]);
		});

		props.ancors.forEach(function(i) {
			// uuid - 4 connections
			var sourceUUID = 'UUID' + instance.id + i.position;

			jsPlumb.addEndpoint(instance, eval(window[ i.type + 'Endpoint' + (i.confirm || '')]), {
				anchor: i.position, uuid: sourceUUID
			});
		});

		jsPlumb.draggable(instance, {
			grid:[20,20]
		});

		// console.log($instance);

		return $instance;
	}, // constrItem


	addItem: function(props, id, isLoad) {
		if(props.type) props = Object.assign(Gl.groups[props.type || 'first'].props, props || {id: id || null});

		return new this.constrItem(props, isLoad);

	}, // addItem


	init: function() {
		jsPlumb.setContainer(Gl.$htmlBase);

		jsPlumb.importDefaults({
			PaintStyle : {
				strokeWidth:5,
				stroke: 'rgba(200,0,0,0.5)'
			},
			DragOptions : { cursor: "crosshair" },
			Connector:[ "Flowchart" ],
			ConnectionOverlays : [
				[ "Arrow", {
					location:1,
					id:"arrow",
					length:20,
					foldback:.5
				} ]
			]
		});


		/* Scaling */

		$(jsPlumb.getContainer()).css({
			"-webkit-transform":"scale(" + Gl.scale + ")",
			"-moz-transform":"scale(" + Gl.scale + ")",
			"-ms-transform":"scale(" + Gl.scale + ")",
			"-o-transform":"scale(" + Gl.scale + ")",
			"transform":"scale(" + Gl.scale + ")"
		});

		/* /Scaling */



		/*
			REM
		*/


		/* ...
		jsPlumb.setSuspendDrawing(true);
		- load up all your data here -
		При массовой подгрузке данных - рекомендуется приостанавливать чертеж до этого
		jsPlumb.setSuspendDrawing(false, true);
		... */


		// batch абстрагирует шаблон чертежа, что-то делает, а затем снова включает чертеж:
		/* jsPlumb.batch(function() {
			// import here
			for (var i = 0, j = connections.length; i < j; i++) {
					jsPlumb.connect(connections[i]);
			}
		} [, bool @OFFredrawing = false]); */
	}


} // DrawChart





/*  */
// Incapsul all to 2 global variables

var Gl = DrawChart.__scope;

jsPlumb.ready(DrawChart.init);



/* Handlers */

// controls
Gl.$htmlBase.e.add({
	wheel: function(e) {
		e = $().e.fix(e);
		// console.log();
		Gl.scale -= 0.05 * Math.sign(e.deltaY);
		Gl.scale = Math.min(Math.max(Gl.scale, .5), 1.5);
		DrawChart.setZoom(Gl.scale);
		e.stopPropagation();
		e.preventDefault();
	},

	click: function(e) {
		e = $().e.fix(e);
		e.stopPropagation();
	}
});

Gl.$htmlBase.parent().e.add({
	mouseover: function(e) {
		e = $().e.fix(e);
		e.stopPropagation();
	}
});

// Remove node
Gl.$htmlBase.on("click", ".button_remove", function () {
	var node = this.closest('.jtk-node');
	// jsPlumb.detachAllConnections(node);
	/* console.log(
		CKEDITOR && node.editor,
		CKEDITOR.instances[node.editor.name]
	); */

	if(CKEDITOR && node.editor) {
		CKEDITOR.remove(CKEDITOR.instances[node.editor.name]);
	}

	jsPlumb.removeAllEndpoints(node);
	$(node).remove();
});

// save changes
/* Gl.$htmlBase.on("input", ".jtk-node [value]", function () {
	this.closest('.jtk-node').props.value = this.value;
	console.log( this.closest('.jtk-node').props, this.value );
}); */

Gl.$htmlBase.on("input", function (e) {
	e = $().e.fix(e);
	var t = e.target;
	if(!t.value) return;

	console.log( t.value );
	t.closest('.jtk-node').props.value = t.value;
});


// menu load/save
$('#saveButton').click(function() {
	DrawChart.save();
});

$('#loadButton').click(function() {
	DrawChart.load();
});

// Menu main buttons
$("#task_menu .menu_button_container").on('click', '.menu_button', function () {
	var $cur = $(this);
	// console.log(this.content);
	DrawChart.addItem({type: $cur.attr('data-type'), action: $cur.attr('data-action'), html: {header: $cur.text(), content: this.content }});
});

/* /Handlers */



/* Create menu */

Object.keys(Gl.groups).forEach(function(i) {
	if(!Gl.fields[i]) return;

	Gl.$menu_buts.cr('h4', {}).text(Gl.groups[i].name);

	Gl.fields[i].forEach(function(fld) {
		var but = Gl.$menu_buts.cr('div', {class: 'button menu_button', 'data-action': fld[0], 'data-type': i})
		.text(fld[1]);

		but[0].content = fld[2] || null;
	});

});


////////////////////////
/* Server object map */

if (!window) obj = function() {
	var obj = {
		nodes: {
			// Коллекция всех графических элементов
			itemId: {
				position: {
					left: 'int',
					top: 'int'
				},
				props: {
					id: 'string id элемента',
					// important
					action: 'string идентификатор необходимого действия, см. ' + Gl.fields,
					// optional
					value: 'string значение из доп. поля. Например, в Паузе - это часы',
					// important
					type: 'string идентификатор группы, см. ' + Gl.groups,
					anchors: 'array with endPoints for jsPlumb',
					html: 'object содержит данные элемента'
				}
			},
			// ...
			length: 'int количество элементов'
		},
		connections: 'array with connections for jsPlumb'
	}
}

