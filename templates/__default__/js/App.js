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
	ajax: 0,
	menu: null,
	activeItem: null,
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

		_H.defer.eval(elem);

		[].forEach.call(
		elem.querySelectorAll('script'),
		i => {
			if(Vue.store.ajax) this.scripts.push(i);
			i.remove();
		});

		this.html = elem.documentElement.innerHTML;

		/* console.log(
			// '\nParseJS.prototype = \n',
			// this.prototype,
			// this.__proto__
		); */
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
	if(!this.scripts) {
		debugger;
		return;
	}
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

	});
	// debugger;
	console.log(
		'Vue.H.ParseJS evaluation!\n',
		// 'this in eval = ', this
	);

	delete this.scripts;
	// debugger;

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
				Vue.store.ajax = 1;

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
				// active = this.$el.querySelector('li.active'),
				href = APIpath + 'api/ContentJson/main/?page=' + hrefAjax;

			this.updateContent(href);

			history.pushState({
				title: document.title,
				href: href,
				// html: Vue.store.parsedPage.html,
				// scripts: Vue.store.parsedPage.scripts,
			}, document.title, hrefAjax);

			Vue.store.activeItem = li;
			// active && active.classList.remove('active');
			// li.classList.add('active');
		},

	}, // methods

	computed: {
		findActive() {
			var active = null;
			[...document.querySelectorAll('nav a')].forEach(i=>{
				if(window.location.pathname === decodeURIComponent(i.getAttribute('data-href'))) active = i.closest('li');
			});
			return active;
		}
	},

	mounted() {
		Vue.store.menu = this.$el;
		Vue.store.activeItem = this.findActive;
		Vue.store.activeItem.classList.add('active');
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

	beforeUpdate() {
		console.log(
			'mainContent\nbeforeUpdate',
			// '\nVue.store.activeItem = ', Vue.store.activeItem,
		);

		// Clean old scripts
		Vue.store.scriptLinks && Vue.store.scriptLinks.forEach(i=>{
			i.remove();
		});
		var active = Vue.store.menu.querySelector('li.active');
		active && active.classList.remove('active');
	},

	updated() {
		// Работает при каждом обновлении
		console.log(
			'\nComponent ' + this.$options._componentTag + ' is updated',
			'\nVue.store.activeItem = ', Vue.store.activeItem
		);

		Vue.store.activeItem.classList.add('active');

		// this.$nextTick(Vue.store.parsedPage.eval.bind(Vue.store.parsedPage));

		// Исполняем скрипты
		// debugger;
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
var vm = new Vue({
	el: '#app',

	data: {
		store: Vue.store,
	},

	// mixins: [Mixins],


	// Hooks
	created () {
		// Кешируем глобал
		Vue.H.cache = Vue.H.cache || Object.keys(window);
		/* console.log(
			'\n $root created\n',
			'\n vm.store.parsedPage  = ',  this.store.parsedPage,
		); */
	}, // created

	mounted() {
		console.log(
			'\n $root mounted\n',
			'\n_H.defer = ', _H.defer);

		// Исполняем скрипты
		// this.$nextTick(this.store.parsedPage.eval.bind(this.store.parsedPage));
		this.store.parsedPage.eval();
		// debugger;

	},

}); // #app