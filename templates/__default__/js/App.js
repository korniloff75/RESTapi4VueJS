'use strict';
// var APIpath = 'http://restapi:90/';
var APIpath = '/';

Vue.config.productionTip = !sv.DEV;

axios.defaults.headers.common = {
	Accept: 'application/json'
};


// Common storage
// Vue.set(vm, 'store', {});
Vue.store = {
	start: Date.now(),
	ajax: 0,
	menu: null,
	parsedPage: {
		html: ''
	},
	activeItem: null,
	scriptLinks: []
};

// Helper 4 Vue
Vue.H = Vue.H || {
	cache: null,

	/**
	 * Разбираем @elem на JS и HTML
	 * Конструктор создаёт объект с ними и методом eval
	 *
	 * @param {string | document} elem
	 */
	ParseJS: function ParseJS (elem) {
		if (!(this instanceof ParseJS)) {
			return new ParseJS(elem);
		}

		if(typeof elem === 'string') {
			elem = (new DOMParser()).parseFromString(elem, "text/html");
		}

		// Создаём копию оригинального document
		this.origDoc = document.implementation.createHTMLDocument('orig');
		this.origDoc.documentElement.innerHTML = elem.documentElement.innerHTML;

		this.scripts = [];

		[].forEach.call(
		elem.querySelectorAll('script'),
		i => {
			this.scripts.push(i);
			i.remove();
		});

		this.html = elem.documentElement.innerHTML;

		console.log(
			'\nParseJS =====',
			'\nthis.origDoc = ', this.origDoc,
			// this.__proto__
		);
	}, // ParseJS


	/**
	 *
	 * @param {Array} scripts
	 */
	chainPromises: scripts => scripts.reduce((acc, n) => {
	  return acc.then(() => new Promise((resolve, reject) => {
	    const s = document.createElement('script');
	    s.onload = resolve;
			s.onerror = reject;
			s.async = false;
	    s.src = n.src;
			document.head.appendChild(s);
			Vue.store.scriptLinks.push(s);
	  }));
	}, Promise.resolve(true)),


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

} // Vue.H


/**
 * При вызове исполняет скрипты из this.scripts
 * и возвращает на них ссылки DOM
 */
Vue.H.ParseJS.prototype.eval = function() {
	if(!this.scripts) {
		debugger;
		return;
	}
	// Ссылки на созданные скрипты для их удаления
	var loadingScripts = this.scripts.filter(i=>i.src),
		evalScripts = this.scripts.filter(i=>i.innerHTML);

	console.log(
		'loadingScripts = ', loadingScripts,
		'\nevalScripts = ', evalScripts,
	);

	Vue.H.chainPromises(loadingScripts)
		.then(
			() => {
				// console.log('Img = ', Img);
				evalScripts.forEach(i => {
					var s = document.createElement('script');
					document.head.appendChild(s);
					Vue.store.scriptLinks.push(s);

					s.innerHTML = i.innerHTML;
					// Исполняются сами
					// if(Vue.store.ajax) eval(i.innerHTML);
				});

				console.log('defer eval\n', _H.defer.funcs);

				_H.defer.eval(this.origDoc);
			}

		).catch(
			e => console.warn(e)
		)


	// debugger;
	console.log(
		'Vue.H.ParseJS evaluation!\n',
		// 'this in eval = ', this
	);

} // Vue.H.ParseJS.prototype.eval


var LogVue = {
	/* created() {
		console.log(
			'\n==Mixins==\nComponent ' + this.$options._componentTag + ' is created',
		);
	}, */
	mounted() {
		console.log(
			'\n==Mixins==\nComponent ' + this.$options._componentTag + ' is mounted',
		);
	},
	updated() {
		console.log(
			'\n==Mixins==\nComponent ' + this.$options._componentTag + ' is updated',
		);
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

			Vue.store.start = Date.now();
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
				Vue.store.ajax = 1;
				sv && (sv.DIR = response.data.dir);
				var data = response.data.data;

				// META
				document.title = data.title;
				['description', 'keywords'].forEach((i,ind) => {
					var meta = document.head.querySelector(`meta[name=${i}]`);
					meta && meta.setAttribute('content', data.seo[ind]);
				})

				// Делим документ на скрипты и html
				Vue.store.parsedPage = new Vue.H.ParseJS(response.data.body);

				Vue.store.parsedPage.html = '<h1>' + document.title + '</h1>\n' + Vue.store.parsedPage.html;

				console.info(`Контент обновился за ${Date.now() - Vue.store.start} мс`);

			})
			.catch(function (e) {
				console.warn(e);
			});

		}, // updateContent

	}, // methods

}; // Mixins



// Menu
Vue.component('menu-items', {
  data () {
    return {
			store: Vue.store,
			activeItem: null
    }
	},

	mixins: [LogVue, Mixins],

	created() {
		// Навигация по истории
		window.onpopstate = e => {
			// Vue.store.activeItem = e.state.activeItemIndex;
			this.updateContent(e.state.href);
			this.updateActive();
			document.title = e.state.title;
			/* console.log(
				"\nonpopstate:\n",
				document.location,
				"\n state: ", e.state,
			); */
		};
	},

	methods: {
		navHandler (e) {
			var t = e.target.closest('a');

			if(!t) return;

			var li = t.closest('li'),
				hrefAjax = decodeURIComponent(t.getAttribute('data-href')),

				href = APIpath + 'api/ContentJson/main/?page=' + hrefAjax;

			this.updateContent(href);
			this.updateActive(li);

			history.pushState({
				title: document.title,
				href: href,
				// activeItem: Vue.store.activeItem,
				// html: Vue.store.parsedPage.html,
				// scripts: Vue.store.parsedPage.scripts,
			}, document.title, hrefAjax);

		},

		updateActive(item) {
			item = item || this.findActive();
			var active = this.store.menu.querySelector('li.active');

			active && active.classList.remove('active');
			this.store.activeItem = item;
			item.classList.add('active');
		},

		findActive() {
			var active;
			[...document.querySelectorAll('nav a')].some(i=>{
				if(window.location.pathname === decodeURIComponent(i.getAttribute('data-href'))) active = i.closest('li');
				return active;
			});

			return active;
		}

	}, // methods

	computed: {

	},

	mounted() {
		this.store.menu = this.$el;
		this.updateActive();
	},


	template: '<nav @click.prevent="navHandler"><slot/></nav>'

}); // menu-items


// Компонент с контентом
var mainContent = Vue.component('main-content',  {
	data() {
		return {
			store: Vue.store,
		}
	},

	mixins: [LogVue],

	beforeUpdate() {
		/* console.log(
			'\nComponent ' + this.$options._componentTag + ' =====',
			'\nbeforeUpdate',
			'\n_H.defer.cleaning',

		); */

		// Clean old scripts
		Vue.store.scriptLinks.forEach(i=>{
			i.remove();
		});
		_H.defer.clean();
	},

	updated() {
		// Работает при каждом обновлении

		// this.$nextTick(Vue.store.parsedPage.eval.bind(Vue.store.parsedPage));

		// Исполняем скрипты
		// debugger;
		this.store.parsedPage.eval();

		console.log(
			'\nVue.store.activeItem = ', Vue.store.activeItem,
		);
		console.info(
			`Страница перерисована за ${Date.now() - Vue.store.start} мс`
		);

	},


	// mode="in-out"
	// :css="false"
	// @:enter="enter"
	template: `
	<transition name="fade" appear
		:duration="{ enter: 3700, leave: 0 }"
	>
	<main
		:key="store.parsedPage.html"
		v-if="store.parsedPage"
		v-html="store.parsedPage.html"
	>
	</main>
	</transition>
	`
}); // main-content


//
var vm = new Vue({
	el: '#app',

	data: {
		store: Vue.store,
	},

	mixins: [LogVue, Mixins],

	// Hooks
	beforeCreate() {
		// Удаляем JS из содержимого [is=main-content]
		// до запуска Vue
		var main = document.querySelector('[is=main-content]');
		main.innerHTML = '';

		/*
		Vue.store.parsedPage = new Vue.H.ParseJS(main.innerHTML);

	 */

	},

	created () {
		// Кешируем глобал
		Vue.H.cache = Vue.H.cache || Object.keys(window);
		var href = APIpath + 'api/ContentJson/main/?page=' + location.pathname;
		this.updateContent(href);

		console.log(
			'\n $root created\n',
			'\n vm.store.parsedPage  = ',  this.store.parsedPage,
		);

	}, // created

	mounted() {
		console.log(
			'\n $root mounted\n',
		);

		// Исполняем скрипты
		// this.$nextTick(this.store.parsedPage.eval.bind(this.store.parsedPage));
		// this.store.parsedPage.eval();
		// debugger;

	},

}); // #app