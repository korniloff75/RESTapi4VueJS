// var APIpath = 'http://restapi:90/';
var APIpath = '/';

axios.defaults.headers.common = {
	Accept: 'application/json'
};
// console.log(axios.defaults.headers.common);

window.onpopstate = function (e) {
	vm.response.main = e.state.main;
	document.title = e.state.title;
	// console.log("location: " + document.location, "\n state: ", e.state);
};

Vue.store = {};

Vue.H = Vue.H || {
	cache: null,

	/**
	 * Разбираем @elem на JS и HTML
	 * Возвращаем объект с ними и методом eval
	 *
	 * @param {string | document} elem
	 */
	parseJS(elem) {
		if(typeof elem === 'string') {
			elem = (new DOMParser()).parseFromString(elem, "text/html");
		}
		var out = {scripts: []};

		[].forEach.call(
		elem.querySelectorAll('script'),
		i => {
			out.scripts.push(i);
			i.remove();
		});

		out.html = elem.documentElement.innerHTML;

		/**
		 * При вызове исполняет скрипты
		 * и возвращает на них ссылки DOM
		 */
		out.eval = function() {
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
			return links;
		}
		return out;
	}, // parseJS

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
		updateContent: function(url) {
			var _thisComp = this;

			console.clear();
			console.log('\nupdateContent',
				'\n_thisComp = ', _thisComp,
			);

			axios.get(url, {
				// headers: new Headers(),
				mode: 'cors',
				// cache: 'default'
			})
			.then(function(response) {
				_thisComp.$root.ajax = 1;

				// Делим документ на скрипты и html
				_thisComp.$root.parsedPage = Vue.H.parseJS(response.data.body);

				document.title = response.data.title;

				console.log(
					'\nresponse.data = ',
					typeof response.data,
					// '\n_this.$root = ', _this.$root, (_this.$root === _this)
				);

				_thisComp.$root.response.main = '<h1>' + document.title + '</h1>\n' + _thisComp.$root.parsedPage.html;

				_thisComp.$root.$nextTick(function() {
					_thisComp.$root.scriptLinks = _thisComp.$root.parsedPage.eval();
				});

				history.pushState({
					title: document.title,
					main: _thisComp.$root.response.main
					// parsedPage: _thisComp.$root.parsedPage
				}, document.title, url.split('page=')[1]);

			})
			.catch(function (error) {
				console.log(error);
			});
			// ,
				// href = t.getAttribute('data-href');

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
		// this.fixSRC();
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
			var t = e.target.closest('a'),
				_this = this;

			if(!t) return;

			var li = t.parentNode,
				href = t.getAttribute('data-href');

			this.updateContent(APIpath + 'api/ContentJson/main/?page=' + href);
		},

	}, // methods

	computed: {
		isActive (ind) {
			// don't used
			// console.log('this.$props = ', this.$props);
			return ind === this.$root.defineCurPage.ind
		}
	},


	template: '<nav @click.prevent="navHandler" ><slot/></nav>'

}); // menu-items


// Удаляем JS из содержимого [is=main-content]
var main = document.querySelector('[is=main-content]');
Vue.store.parseMain = Vue.H.parseJS(main.innerHTML);
main.innerHTML = '';


// Компонент с контентом
Vue.component('main-content',  {
	data: function() {
		return {
			store: Vue.store,
			html: this.$root.response.main
		}
	},
	updated() {
		var _this = this;
		this.$root.$nextTick(function() {
			console.log(
				'\nmainComponent.$root.$nextTick',
				// '\nthis = ', this,
				// '\n_this.$template = ', _this
			);
		});
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

	mixins: [Mixins],


	// Hooks
	beforeUpdate() {
		// Clean old scripts
		this.scriptLinks.forEach(i=>{
			i.remove();
		})
	},

	created: function () {
		// Кешируем глобал
		Vue.H.cache = Vue.H.cache || Object.keys(window);
		/* console.log(
			'\n vm.doc  = ',  this.doc,
			'\n vm.$el  = ',  this.$el,
		); */

	}, // created

	// beforeUpdate

}); // vm