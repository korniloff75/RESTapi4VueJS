'use strict';
// var APIpath = 'http://restapi:90/';
var APIpath = '/';

axios.defaults.headers.common = {
	Accept: 'application/json'
};


// Common storage
Vue.store = {

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
		this.scripts = [];

		[].forEach.call(
		elem.querySelectorAll('script'),
		i => {
			this.scripts.push(i);
			i.remove();
		});

		this.html = elem.documentElement.innerHTML;

		console.log(
			// '\nParseJS.prototype = \n',
			// this.prototype,
			// this.__proto__
		);
	}, // ParseJS


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
	// Ссылки на созданные скрипты для их удаления
	var links = [];
	this.scripts.forEach(i => {
		if(i.src) {
			var s = document.createElement('script');
			s.src = i.src;
			document.head.appendChild(s);
			links.push(s);
		}
		else {
			// https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
			eval(i.innerHTML);
		}
		console.log('this in eval = ', this);

	});

	Vue.store.scriptLinks = links;
	return links;
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
			var start = Date.now(),
				_thisComp = this;

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
				Vue.store.parsedPage = new Vue.H.ParseJS(response.data.body);

				document.title = response.data.data.title;

				Vue.store.parsedPage.html = '<h1>' + document.title + '</h1>\n' + Vue.store.parsedPage.html;

				console.info(`Контент обновился за ${Date.now() - start} мс`);

			})
			.catch(function (error) {
				console.log(error);
			});

		}, // updateContent

	}, // methods


	// beforeUpdate
	updated() {
		console.log(
			'\n==Mixins==\nComponent ' + this.$options._componentTag + ' is updated\n',
		);
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

	created() {
		// Навигация по истории
		window.onpopstate = e => {
			// Vue.store.parsedPage = e.state.parsedPage;
			this.updateContent(e.state.href);
			document.title = e.state.title;
			console.log(
				"\nonpopstate:\n",
				document.location,
				"\n state: ", e.state,
			);
		};
	},

	methods: {
		navHandler (e) {
			var t = e.target.closest('a');

			if(!t) return;

			var li = t.closest('li'),
				hrefAjax = decodeURIComponent(t.getAttribute('data-href')),
				active = this.$el.querySelector('li.active'),
				href = APIpath + 'api/ContentJson/main/?page=' + hrefAjax;

			this.updateContent(href);

			history.pushState({
				title: document.title,
				href: href,
				// html: Vue.store.parsedPage.html,
				// scripts: Vue.store.parsedPage.scripts,
			}, document.title, hrefAjax);

			this.activeItem = li;
			active && active.classList.remove('active');
			li.classList.add('active');
		},

	}, // methods

	computed: {

	},

	template: '<nav @click.prevent="navHandler" ><slot/></nav>'

}); // menu-items


// Компонент с контентом
var mainContent = Vue.component('main-content',  {
	data() {
		return {
			store: Vue.store,
		}
	},

	beforeUpdate() {
		// Clean old scripts
		Vue.store.scriptLinks && Vue.store.scriptLinks.forEach(i=>{
			i.remove();
		})
	},

	updated() {
		// Работает при каждом обновлении
		console.log(
			'\nComponent ' + this.$options._componentTag + ' is updated\n',
			// this
		);

		// this.$nextTick(Vue.store.parsedPage.eval.bind(Vue.store.parsedPage));

		// Исполняем скрипты
		this.store.parsedPage.eval();
	},

	// mode="out-in"
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


(function() {
	// Удаляем JS из содержимого [is=main-content]
	// до запуска Vue
	var main = document.querySelector('[is=main-content]');

	Vue.store.parsedPage = new Vue.H.ParseJS(main.innerHTML);

	main.innerHTML = '';

})();


//
new Vue({
	el: '#app',

	data: {
		ajax: 0,
		store: Vue.store,
	},

	// mixins: [Mixins],


	// Hooks
	created () {
		// Кешируем глобал
		Vue.H.cache = Vue.H.cache || Object.keys(window);
		console.log(
			'\n $root created\n',
			'\n vm.store.parsedPage  = ',  this.store.parsedPage,
		);
	}, // created

	mounted() {
		// Исполняем скрипты
		this.store.parsedPage.eval();
	},

}); // #app