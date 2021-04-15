'use strict';

var CC= CC || {
	__proto__: null,
	sts:{ //
		lineNumbers: 1
	},

	parseCode: function(cA) { //== Parser
		var tags= /(<|&lt;)([^!>]+?)(>|&gt;|[\s!])/g, ops=/\b(document|return|forEach|for|if|else|null|var)\b/g,
		funcs= /\b(function|querySelector|querySelectorAll|use strict|onreadystatechange)\b/g, // /(<)([^>\s]+)([^>]*?>[\s\S]+)(<\/\2>)/g
		other = /\b(console\..+?)\b/g;

		// console.log('cA.textContent = ',cA, cA.textContent);

		cA.innerHTML= cA.textContent
			.replace(tags,"$1<span class='tag'>$2</span>$3") // <span class='attrs'>$3</span>
		//	.replace(/([^\s]+\=)([^\s>]+)/g, "<span class='attrs'>$1$2</span>")
			.replace(ops, "<span class='ops'>$1</span>")
			.replace(funcs, "<span class='funcs'>$1</span>")
			.replace(other, "<span class='other'>$1</span>")
			.replace(/(([\"])[^\2>]*?\2)/g, "<span class='str'>$1</span>")
		//	.replace(/=\s*?(\d+)/g, "= <span class='num'>$1</span>")
			.replace(/(\d+(?:%|px)?)/g, "<span class='num'>$1</span>")
			.replace(/([^:\"\'])(\/\/.+$|\/\*[\s\S]+?\*\/|<!--[\s\S]+?-->)/mg, "$1<span class='comments'>$2</span>").replace(/<(!--)/g,'&lt;$1')
			// tab -> 1 space
			.replace(/\t/g, '    ')
			.replace(/ {4}/g, ' ');

			// Убираем подсветку в комментах
			[].forEach.call(cA.querySelectorAll('span.comments span'), function(i) {
				i.removeAttribute('class');
			});

		if(CC.sts.lineNumbers) CC.addLineNumbers(cA);
	},


	exterCode: function() {
		function addClick (i) {
			var saldom = i.hasAttribute('saldom'),
				lib = i.getAttribute('data-lib'),
				noLib = i.getAttribute('saldom') === 'noLib' || i.hasAttribute('noLib');

			if(i.pre && (!saldom || lib)) {
				i.pre.style.position = 'relative';

				// console.log(lib);
				var span = CC.doc.createElement('span');
				span.style.cssText = "position:absolute; right:5px; top:-7px; font-weight:600; color:#159; background: #eee; padding: 3px; border-radius: 3px;";
				span.textContent = 'use ' + (lib || 'native ES-5');
				i.pre.appendChild(span);
			}

			i.title='выделить код';
			i.addEventListener ('click',  i.select );
		} // addClick


		var codes = CC.doc.querySelectorAll('code' ),
			codesInDoc = document.querySelectorAll('code' );

		if (!codes.length) return console.warn('codes = ', codes);
		else [].forEach.call(codes, function(cA, ind) {
			if(!cA.parentNode) return; //== nE

			var pre = cA.closest('pre');
			cA.classList.add('http');

			// console.log('pre = ', pre);

			if(!pre) {
				cA.setAttribute('saldom', 'noLib');
			} else {
				pre.style.overflowX = 'auto';
				var div = CC.doc.createElement('div');
				div.className = 'code';
				cA.pre = cA.parentNode.parentNode.insertBefore(div, cA.parentNode);
				cA.pre.appendChild(cA.parentNode);
			}

			var tmpDiv= CC.doc.createElement('div'),
				sourse = cA.getAttribute('for'); //

			if(!!sourse) {
				var sourseElement = CC.doc.querySelector( sourse );

				// console.log(sourse, sourseElement);
				if(!sourseElement) console.warn('Узла с селектором ' + sourse + ' не существует!');
				else
					tmpDiv.innerHTML = cA.innerHTML + sourseElement.innerHTML;

				[].forEach.call(tmpDiv.querySelectorAll('div'), function(i) {
					if (i.style.display==='none')
						i.remove();
				});
			}
			else {
				tmpDiv.innerHTML = cA.innerHTML;
			}

			cA.textContent = tmpDiv.innerHTML;

			// var tmp = document.importNode(tmpDiv, true);
			// codesInDoc[ind].textContent = tmp.innerHTML;

			addClick(cA);

		});

		[].forEach.call(CC.doc.querySelectorAll('.helpLib' ), function(i) {
			var b = i.parentNode.querySelector('blockquote');
			i.onclick= function() {
				b.hidden = !b.hidden;
			}
		});

	}, // exterCode


	addLineNumbers: function (cA) {
		var wrapCA = cA.parentNode,
			lN= wrapCA.querySelector('span.line-numbers-rows');
		// console.log('lN = ', lN);

		if(lN) {
			lN.innerHTML = '';
		}
		else {
			var span = CC.doc.createElement('span');
			span.className = 'line-numbers-rows';
			lN = wrapCA.insertBefore(span, cA);
		}

		if(!lN) return;

		for (var i=1, L=cA.textContent.split('\n').length; i <= L; i++) {
			var span = CC.doc.createElement('span');
			span.textContent = i;
			lN.appendChild(span);
		};

		// console.log('lN = ', lN);

	},


	init : function(doc) {
		CC.doc = doc || document;
		//== nE
		(!window.hljs || !hljs.inited) && CC.exterCode();

		var virt = doc.querySelectorAll('body pre>code');

		[].forEach.call(virt, CC.parseCode);

		[...document.querySelectorAll('body pre>code')].forEach((i, ind)=> {

			var newI = document.importNode(virt[ind].parentNode.parentNode, true);
			i.parentNode.parentNode.replaceChild(newI, i.parentNode);
		});


		console.log(
			'CC inited\n',
			// virt,
			// CC.doc.querySelectorAll('body pre>code')
		);
	}
}; // CC


//== Inited ColorCode

if(!CC.inited) {
	CC.inited= document.createElement('link');
	CC.inited = Object.assign(CC.inited, {
		href:'/assets/css/ColorCode.css',
		rel:"stylesheet",
		type:"text/css",
		charset:"utf-8"
	});
	document.head.appendChild(CC.inited);

	// CC.init();
}


window._H.defer.add(CC.init);
console.log(
	'defer add CC.init', _H.defer.funcs
);