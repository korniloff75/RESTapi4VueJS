Vue.component('item',{
	props: ['item', 'ind'],

	data: {
		gl: window,
		// list
	},

	methods: {

	},

	created() {
		// this.list = this.gl.list;
		// console.log('this.gl = ', window);
	},


  template: "#item-template",
});


new Vue({
	el: '#app',

	methods: {
    AddTask(e) {
			var newTask = e.target.parentNode.querySelector('input').value;
			if(!newTask.trim()) return;

      this.list.push({
        // minValue: e.target.previousElementSibling.value,
        name: newTask,
      });
      console.log(this.list);
		},

		saveTasks() {
			axios.post('', {saveTasks: this.list});
		}

	},

  data: {
		list,
		gl: window
	},

	created() {
		// console.log(this.list);
		this.list = this.list.map(i => Object.assign({
			isActive: 1,
			editable: 0
		}, i));
	},

	mounted() {
		console.log(this.list);
	},


});