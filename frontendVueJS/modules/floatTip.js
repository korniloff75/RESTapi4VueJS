"use strict";
/*========================================
=KorniloFF=
=//js-master.ru=
<script src="/js/modules/floatTip.js" type="text/javascript" charset="utf-8"></script>
/======================================== */
$.floatTip = $.floatTip || {
	sts: {
		NO: 0,
		arr: '*[title]',
		st: 'max-width: 250px; min-width: 50px; min-height: 25px; background: #f5f5f5;  border: 1px solid #666666; padding: 4px; font: 10pt sans-serif; color: #123; border-radius: 3px; box-shadow:2px 2px 1px 0 #bbb;',
		distX: 20,
		distY: 15
	},


	init: function () {
		// console.profile();
		if (this.inited) return;
		this.inited = 1;
		this.$obj = this.$obj || $('<div />', {id: 'floatTip', style: $.floatTip.sts.st, hidden:1})
		.appendTo('body').css({zIndex:5000, position: 'absolute'});

		this._constr();
		// console.profileEnd();

		$(window).on({
			mouseover: function (e) {
				e.target['data-title'] = e.target['data-title'] || e.target.title || (e.target.parentNode.tagName === 'CODE') && (e.target.parentNode.title || e.target.parentNode['data-title']);

				if (!e.target['data-title']) return;

				var target = e.target;
				target.title = '';

				// console.log(target, target['data-title']);

				$.floatTip.toolTip.call(target); $.floatTip.moveTip(e);
				e.stopPropagation();
			},

			mouseout: function() {
				$.floatTip.$obj[0].hidden=1;
			}

		});
	},


	_constr: function () {
		var ppts = {
			moveTip: function (e) {
				var x = e.pageX, y = e.pageY;

				$.floatTip.$obj.css({
					left: (((x + $.floatTip.$obj.width() + $.floatTip.sts.distX) < ($(window).width() + $(window).scrollLeft())) ? x + $.floatTip.sts.distX : x - $.floatTip.$obj.width() - $.floatTip.sts.distX) + 'px',

					top: (((y + $.floatTip.$obj.height() + $.floatTip.sts.distY) < ($(window).height() + $(window).scrollTop())) ? y + $.floatTip.sts.distY : y - $.floatTip.$obj.height() - $.floatTip.sts.distY) + 'px'
				}) ;
			},

			toolTip: function () {
				$.floatTip.$obj.html(this['data-title'])[0].hidden = 0;
			}
		}

		$.floatTip = Object.assign(ppts, $.floatTip);
	}
} //== /floatTip

//========================================= /

$($.floatTip.init.bind($.floatTip));