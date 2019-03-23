// var APIpath = 'http://restapi:90/';
var APIpath = '/';

axios.defaults.headers.common = {
	Accept: 'application/json'
};
// console.log(axios.defaults.headers.common);

window.onpopstate = function (e) {
	vm.html = e.state.content;
	document.title = e.state.title;
	// console.log("location: " + document.location, "\n state: ", e.state);
};

var Mixins = {
	methods: {
		updateContent: function(url) {
			var _this = vm || this;
			console.clear();

			axios.get(url, {
				// headers: new Headers(),
				mode: 'cors',
				// cache: 'default'
			})
			.then(function(response) {
				_this.doc = (new DOMParser()).parseFromString(response.data, "text/html");
				document.title = _this.doc.title;

				// console.log('navMenu response', response, response.data);
				_this.$root.response.main = _this.doc.documentElement.innerHTML;

				_this.$nextTick(_this.evalScripts);

				history.pushState({
					title: document.title,
					content: _this.html
				}, document.title, '?' + url);

			})
			.catch(function (error) {
				console.log(error);
			});
			// ,
				// href = t.getAttribute('data-href');

			axios.post(__aside.folder + url)
			.then(function (response) {
				_this.doc = (new DOMParser()).parseFromString(response.data, "text/html");
				document.title = _this.doc.title;

				_this.html = _this.doc.documentElement.innerHTML;

				_this.$nextTick(_this.evalScripts);

				console.log('_this.template = ', _this.$template);


				history.pushState({
					title: document.title,
					content: _this.html
				}, document.title, '?' + url);
			})
			.catch(function (error) {
				console.error(error);
			});

			console.log(
				// url,
				// '\n this.$el  = ',  this.$el
			);
		}, // updateContent

		/* fixSRC: function() {
			var imgs = this.doc.querySelectorAll('img');
			if(!imgs.length) return;

			[].forEach.call(imgs, function(i) {
				// console.log('i.src = ', i.src);
				i.src = i.src.replace(new RegExp('(' + location.host + location.pathname + ')', 'i'), '$1content/');

			});
		}, */

		evalScripts() {
			console.log('evalScripts / $nextTick\n');
			[].forEach.call(
			this.doc.querySelectorAll('script'),
			i => {
				console.log(i);
				if(i.src) {
					var s = document.createElement('script');
					s.src = i.src;
					i.remove();
					document.head.appendChild(s);
				} else eval(i.innerHTML);
			});
		},

		// Очищаем глобал перед обновлением
		clearClob() {
			if(this.cash) {
				var excludes = ['__VUE_DEVTOOLS_TOAST__'];
				Object.keys(window).forEach(k=>{
					var ind = this.cash.indexOf(k);
					if(ind === -1 && excludes.indexOf(k) === -1) {
						console.log('k_del = ', k);
						delete window[k];
					}
				});
			}
		},

	}, // methods


	created() {
		// Кешируем глобал
		this.cash = this.cash || Object.keys(window);
		// this.$forceUpdate()
	},

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
var navMenu = Vue.component('menu-items', {
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

			axios.get(APIpath + 'api/ContentJson/?page=' +
			 href, {
				// headers: new Headers(),
				mode: 'cors',
				// cache: 'default'
			})
			.then(function(response) {
				// console.log('navMenu response', response, response.data);
				_this.$root.response.main = response.data;

			})
			.catch(function (error) {
				console.log(error);
			});
		},

		_navHandler (e) {
			// console.log(arguments);
			var t = e.target.closest('a');

			if(!t) return;

			var li = t.parentNode;

			this.clearClob();
			this.updateContent(t.href.split('/').filter(i=>i.trim()).pop());

			e.currentTarget.querySelector('li.active') && e.currentTarget.querySelector('li.active').classList.remove('active');
			li.classList.add('active');

			activeItem = +(li.getAttribute('data-ind'));

		},

		isActive (ind) {
			// don't used
			// console.log('navMenu.$props = ', this.$props);
			return ind === this.$root.defineCurPage.ind
		}
	}, // methods

	created: function() {
		var _this = this;
		// updateContent(APIpath + 'api/ContentJson/');

		// console.log('navMenu ', axios.get(APIpath + 'ContentJson/') );

	},

	// v-html="$root.response.menu"
	template: '<nav @click.prevent="navHandler" ><slot/></nav>'

}); // menu-items


Vue.component(
	'main-content',  {
		data: function() {
			return {
				html: this.$root.response.main
			}
		},
		// v-html="$root.response.main"
		template: '<main><slot/></main>'
	}
); // main-content



//
var vm = new Vue({
	el: '#app',
	components: {
/* 		'main-content': {
			// get $root() {return this},
			data: function() {
				return {
					html: this.$root.response.main
				}
			},
			template: '<main v-html="response.main"></main>'
		} */
	},

	data: {
		doc: 'empty',
		html: 'html - Это корневой скоп.',
		response: {
			menu: 'Тут будет меню. Это корневой скоп.',
			main: 'А тут будет контент!!! Это корневой скоп.'
		},
	},

	mixins: [Mixins],

	methods: {

	}, // methods


	// Hooks
	created: function () {
		/* console.log(
			'\n vm.doc  = ',  this.doc,
			'\n vm.$el  = ',  this.$el,
		); */

	}, // created

	// beforeUpdate

}); // vm