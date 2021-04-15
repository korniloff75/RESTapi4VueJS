<script src="../js/vue.js"></script>
<script src="../js/axios/0.18.0/axios.min.js"></script>
<link rel="stylesheet" href="style.css">

<pre>
<?php
/* var_dump(isset($_SERVER['HTTP_X_REQUESTED_WITH']) , !empty($_SERVER['HTTP_X_REQUESTED_WITH']) , (strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest')); */

/**
 * Получаем JSON из входного потока
 */
	if($input = file_get_contents('php://input'))
	{
		echo 'php://input exist!';
		extract(json_decode($input, true));

		if(!empty($saveTasks)) {
			file_put_contents('tasks.json', $input);
			exit;
		}

	}

?>
</pre>

<script>
Vue.config.silent = true;
Vue.config.devtools = true;
Vue.config.productionTip = false;

const list = <?=file_get_contents('tasks.json')?>['saveTasks'] || [
  {
    name: "First Task",
    isActive: 1,
    editable: 0,
  },
  {
    name: "Second Task",
    isActive: 0,
    editable: 0,
  },

];
</script>


<div id="app" class="columns">
  <h2>To Do</h2>
  <p><label>Add task and press Enter -
    <input type="text" placeholder="Новое задание" @keypress.enter="AddTask" style="width:50%; "></label>
    <button @click="AddTask"> + </button>

  </p>
  <ul class="column">
    <li is="item" v-for="(item,ind) in list" :item="item" :ind="ind">
    </li>
	</ul>
	<p><button onclick="console.log(list)"> Show list in console </button></p>
	<p><button @click="saveTasks"> SAVE </button></p>
	<p><button onclick="location.reload()"> RELOAD </button></p>
</div>


<!-- Component item Template -->

<script type="text/x-template" id="item-template">
  <li>
    <input type="checkbox" :checked="item.isActive" @change="item.isActive=$event.target.checked; $root.gl.console.log($event.target.checked);">

    <span v-if="!item.editable" title="Edit on dblclick" @dblclick.prevent="item.editable = 1; this.focus();">
      {{item.name}}
    </span>
    <input v-else class="edit" v-model="item.name" @blur="item.editable = 0;" />

    <button class="del" @click="$root.list.splice(ind,1); $root.gl.console.log($root.list)"> X </button>
<!--     {{item}} -->
  </li>
</script>

<!-- /Component item Template -->


<script src="VueApp.js"></script>