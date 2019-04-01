// Настройки соединяющих линий
var connectorPaintStyle = {
	strokeWidth: 3,
	stroke: "#9b9b9b",
	joinstyle: "round",
	outlineStroke: "white",
	outlineWidth: 2
};

// Настройки соединяющих линий с наведенным курсором
var connectorHoverStyle = {
	strokeWidth: 3,
	stroke: "#949697",
	outlineWidth: 5,
	outlineStroke: "white"
};

// Настройки входных точек
var targetEndpoint = {
	isTarget: true,
	endpoint: "Dot",
	paintStyle: {
		stroke: "#bdc3c7",
		fill: "#fff",
		radius: 10,
		strokeWidth: 2
	},
	hoverPaintStyle: {
		fill: "#949697",
		stroke: "#949697"
	},
	maxConnections: -1,
	dropOptions: { hoverClass: "hover", activeClass: "active" },
	overlays: [
		["Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible: false }]
	]
};

// Настройки выходных точек
var sourceEndpoint = {
	isSource: true,
	endpoint: "Dot",
	paintStyle: {
		stroke: "#bdc3c7",
		fill: "#fff",
		radius: 10,
		strokeWidth: 2
	},
	maxConnections: -1,
	connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
	connectorStyle: connectorPaintStyle,
	hoverPaintStyle: {
		fill: "#949697",
		stroke: "#949697"
	},
	connectorHoverStyle: connectorHoverStyle,
	dragOptions: { cursor: "move" },
	overlays: [
		["Label", {
			location: [0.5, 1.5],
			label: "Drag",
			cssClass: "endpointSourceLabel",
			visible: false
		}]
	]
};



// Настройки выходной точки, условия ДА
var sourceEndpointYes = {
	isSource: true,
	endpoint: "Dot",
	cssClass: "jtk-block_endpoint_yes",
	paintStyle: {
		stroke: "#00a154",
		fill: "#fff",//"transparent",
		radius: 10,
		strokeWidth: 2
	},
	hoverPaintStyle: {
		fill: "green",
		stroke: "#00a154"
	},

	connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
	connectorStyle: connectorPaintStyle,

	connectorHoverStyle: connectorHoverStyle,
	// dragOptions: {},
	overlays: [
		["Label", {
			location: [0.5, 1.5],
			label: "Drag",
			cssClass: "endpointSourceLabel",
			visible: false
		}]
	]
};

// Настройки выходной точки, условия НЕТ
var sourceEndpointNo = {
	endpoint: "Dot",
	cssClass: "jtk-block_endpoint_no",
	paintStyle: {
		stroke: "#e74c3c",
		fill: "#fff",
		radius: 10,
		strokeWidth: 2
	},
	hoverPaintStyle: {
		fill: "#e74c3c",
		stroke: "#949697"
	},
	isSource: true,
	connector: ["Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true }],
	connectorStyle: connectorPaintStyle,

	connectorHoverStyle: connectorHoverStyle,
	// dragOptions: {},
	overlays: [
		["Label", {
			location: [0.5, 1.5],
			label: "Drag",
			cssClass: "endpointSourceLabel",
			visible: false
		}]
	]
};


// Настройки размещение точек
// Две точки снизу
var anchorsBottomLeftYes = [0.3, 1, 0, 1, 0, 0, "BottomLeftYes"];
var anchorsBottomRightNo = [0.7, 1, 0, 1, 0, 0, "BottomRightNo"];




