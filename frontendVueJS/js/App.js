// var APIpath = 'http://restapi:90/';
var APIpath = '/';

axios.defaults.headers.common = {
	Accept: 'application/json'
};

// Доработать исполнение скриптов
window.onpopstate = function (e) {
	vm.response.main = e.state.main;
	document.title = e.state.title;
	console.log(
		"\nonpopstate:\n",
		document.location,
		"\n state: ", e.state,
		"\n state.__proto__: ", e.state.__proto__,
	);
};

Vue.store = {};

// Helper 4 Vue
Vue.H = Vue.H || {
	cache: null,

	/**
	 * Разбираем @elem на JS и HTML
	 * Конструктор создаёт объект с ними и методом eval
	 *
	 * @param {string | document} elem
	 */
	ParseJS: function (elem) {
		if(typeof elem === 'string') {
			elem = (new DOMParser()).parseFromString(elem, "text/html");
		}
		this.scripts = [];

		[].forEach.call(
		elem.querySelectorAll('script'),
		i => {
			this.scripts.push(i);
			i.remove();
		});

		this.html = elem.documentElement.innerHTML;

		this.__proto__ = Vue.H.ParseJSProto;
		console.log(
			// '\nParseJS.prototype = \n',
			// this.prototype,
			// this.__proto__
		);
	}, // ParseJS

	ParseJSProto: {
		/**
		 * При вызове исполняет скрипты из this.scripts
		 * и возвращает на них ссылки DOM
		 */
		eval: function() {
			// Ссылки на созданные скрипты для их удаления
			var links = [];
			this.scripts.forEach(i => {
				if(i.src) {
					var s = document.createElement('script');
					s.src = i.src;
					document.head.appendChild(s);
					links.push(s);
				} else {
					// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
					eval(i.innerHTML);
				}

			});
			// console.log('ParseJS.prototype = ', this.__proto__);
			return links;
		}
	},


	// Очищаем глобал перед обновлением
	clearClob() {
		if(this.cache) {
			var excludes = ['__VUE_DEVTOOLS_TOAST__'];
			Object.keys(window).forEach(k=>{
				var ind = this.cache.indexOf(k);
				if(ind === -1 && excludes.indexOf(k) === -1) {
					console.log('k_del = ', k);
					delete window[k];
				}
			});
		}
	},

}


var Mixins = {
	methods: {
		/**
		 * Получаем ответ GET-запроса на @url
		 * Обновляем data в $root
		 *
		 * @param {string} url
		 */
		updateContent: function(url) {
			var _thisComp = this;

			console.clear();
			console.log('\nruning updateContent',
				// '\n_thisComp = ', _thisComp,
			);

			axios.get(url, {
				// headers: new Headers(),
				mode: 'cors',
				// cache: 'default'
			})
			.then(function(response) {
				_thisComp.$root.ajax = 1;

				// Делим документ на скрипты и html
				_thisComp.$root.parsedPage = new Vue.H.ParseJS(response.data.body);

				document.title = response.data.title;

				/* console.log(
					'\nresponse.data = ',
					typeof response.data,
				); */

				_thisComp.$root.response.main = '<h1>' + document.title + '</h1>\n' + _thisComp.$root.parsedPage.html;

				// Исполняем скрипты
				_thisComp.$root.$nextTick(function() {
					console.log(_thisComp.$root.parsedPage);
					_thisComp.$root.scriptLinks = _thisComp.$root.parsedPage.eval();
				});


				history.pushState({
					title: document.title,
					main: _thisComp.$root.response.main,
					__proto__: _thisComp.$root.parsedPage,
					// parsedPage: _thisComp.$root.parsedPage
				}, document.title, url.split('page=')[1]);

			})
			.catch(function (error) {
				console.log(error);
			});

			console.log(
				// url,
				// '\n this.$el  = ',  this.$el
			);
		}, // updateContent

	}, // methods


	// beforeUpdate
	updated() {
		// this.$nextTick(this.evalScripts);
		console.log(
			'updated\n',
			'this = ', this);
	},
}; // Mixins


// Menu
Vue.component('menu-items', {
  data () {
    return {
			activeItem: null
    }
	},

	mixins: [Mixins],

	methods: {
		navHandler (e) {
			var t = e.target.closest('a');

			if(!t) return;

			var li = t.closest('li'),
				href = t.getAttribute('data-href'),
				active = this.$el.querySelector('li.active');

			this.updateContent(APIpath + 'api/ContentJson/main/?page=' + href);

			this.activeItem = li;
			active && active.classList.remove('active');
			li.classList.add('active');
		},

	}, // methods

	computed: {

	},

	template: '<nav @click.prevent="navHandler" ><slot/></nav>'

}); // menu-items


// Удаляем JS из содержимого [is=main-content]
var main = document.querySelector('[is=main-content]');

Vue.store.parseMain = new Vue.H.ParseJS(main.innerHTML);
// console.log(Vue.store.parseMain);
main.innerHTML = '';


// Компонент с контентом
Vue.component('main-content',  {
	data() {
		return {
			store: Vue.store,
			html: this.$root.response.main
		}
	},

	// v-html="$root.response.main"
	template: `
	<main v-if="$root.ajax" v-html="$root.response.main">
	</main>
	<main v-else v-html="store.parseMain.html">
	</main>
	`
}); // main-content



//
var vm = new Vue({
	el: '#app',

	data: {
		ajax: 0,
		parsedPage: null,
		scriptLinks: null,
		response: {
			menu: 'Тут будет меню. Это корневой скоп.',
			main: 'А тут будет контент!!! Это корневой скоп.'
		},
	},

	// mixins: [Mixins],


	// Hooks
		created () {
		// Кешируем глобал
		Vue.H.cache = Vue.H.cache || Object.keys(window);
		/* console.log(
			'\n vm.doc  = ',  this.doc,
			'\n vm.$el  = ',  this.$el,
		); */

	}, // created

	beforeUpdate() {
		// Clean old scripts
		this.scriptLinks.forEach(i=>{
			i.remove();
		})
	}, // beforeUpdate

}); // vm