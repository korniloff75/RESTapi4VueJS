<?php
\H::protectScript(basename(__FILE__));
# Нуждается в переработке
// либо в переделке кода на REST
exit;

class EditDB
{
	protected $db_path, $id;

	function __construct()
	{
		if(!\ADMIN) return;

		extract($_REQUEST);

		$this->db_path = $db_path ?? null;
		$this->ip = $ip ?? null;
		$this->id = $id ?? null;
		$this->p_email = $p_email ?? null;

		echo '<h4 class="core bar">EditDB</h4>';

		// $template = 0;

		// var_dump($action);

		if(!empty($action))
			$this->Action($action);

		$this->Render();
	} // __construct


	function Action($a)
	{
		// var_dump($this->db_path);

		switch ($a) {
			case 'del_SMS':
				// echo '<pre>';
				$ip_arr = \H::json('db/sms.json', $this->ip);

				// var_dump($ip_arr, $ip_arr[$this->id], $this->id);
				// die;
				unset($ip_arr[$this->id]);

				// var_dump($ip_arr);

				\H::json('db/sms.json', [$this->ip => array_values($ip_arr)]);
				break;


			default:
				if(empty($this->db_path)) return;

				$db_arr = \H::json($this->db_path);

				$new_arr = array_diff_key($db_arr, [$this->id => 0]);

				// var_dump($new_arr);

				\H::json($this->db_path, $new_arr, 'rewrite');
				break;
		}
	} // Action


	function Render()
	{
		?>

		<!-- MAIN -->
		<nav style="margin-top: 3em; text-align: center;">
			<a href="#SMS">SMS</a>
		</nav>

		<?php
		#==================================================#
		# print saved emails

		$count_email = 10;

		$pager_email = \H::paginator(\H::json('db/email.json'), $count_email, 'p_email');
		// var_dump($pager_email);

		if($pager_email) :
		?>

		<div>
			<h2>email.json</h2>

			<div class="p_email">
				Страницы email: <?=$pager_email['paginator']?>
			</div>

			<ul>

			<?php

			$inc_email = 1;

			foreach($pager_email['fragm'] as $date => $arr) {
				@list($name, $email, $subject, $message, $answer) = $arr;

				$num= $pager_email['data_count'] + $count_email - $pager_email['lp'] - $inc_email++;

				echo "<li class=\"list\">"
					. '<img src="/assets/images/icons/del.png" alt="DEL" title="" class="pointer red alignright">'
					. "<h6 data-num=\"$num\">$date</h6>"
					. "<h5>$name</h5>"
					. "<h6>$subject</h6>"
					. "<pre>
						From - $email
						==================
						$message
						</pre>";

				if($answer) { echo "<div class=answer>
					$answer
					</div>";
				}

				if(!empty($e)) { echo "<ul class=\"core warning\">
					$e
					</ul>";
				}

				echo "</li>";

			}

			?>

			</ul>

			<div class="p_email">
				Страницы email: <?=$pager_email['paginator']?>
			</div>

		</div>

		<hr>

		<?php
		endif;

		$pager_sms = \H::paginator(\H::json('db/sms.json'), 4, 'p_sms');

		if($pager_sms) :
		?>

		<div>
			<h2 id="SMS">SMS.json</h2>

			<?php
			#==================================================#
			# print SMS


			/* echo '$pager_sms = ';
			var_dump($pager_sms); */

			?>

			<div class="p_email">
				Страницы SMS: <?=$pager_sms['paginator']?>
			</div>

			<?php

			foreach($pager_sms['fragm'] as $sms_ip => $db) {
				echo '<ol class="list">';
				echo "<h6>$sms_ip</h6>";

				// var_dump($db);

				foreach($db as $ind => $sms) {
					// var_dump($sms, $ind);

					$date = (int)$sms[0] + \CF['date']['delta'];

					echo '<li class="clear" data-time="' . $sms[0] . '" data-id=' . $ind . '><b>' . date(\CF['date']['format'], $date) . '</b> - ' . $sms[1];
					echo '<img src="/assets/images/icons/del.png" alt="DEL" title="" class="pointer red alignright"></li>';
				}
				echo '</ol>';
			}

			?>

			<div class="p_email">
				Страницы SMS: <?=$pager_sms['paginator']?>
			</div>

		</div>

		<?php
		endif;
		?>

		<script>
		'use strict';
		// console.log($('div#ajax-content'));
		if(!$.tmp.editDB) $('div#ajax-content').on('click', function(e) {
			e = $().e.fix(e);
			$.tmp.editDB = 1;

			var $t = $(e.target),
			$li = $t.closest('li'),
			dt = $li.attr('data-time'),
			self = this,
			$paginator = $t.closest('.paginator'),
			data = {
				page: sv.DIR,
				ajax: 1
			};

			if($li.length) {
				e.preventDefault();
				e.stopPropagation();

				if ($t[0].tagName !== 'IMG'|| !confirm('Удалить запись - ' + $li.text() + " ?"))
					return;

				data = Object.assign(data, {
					action : 'del_Item',
					db_path: 'db/email.json',
					id : $li.closest('.list').find('h6').first().text()
				});


				if(dt) {
					data = Object.assign(data, {
						action : 'del_SMS',
						id : $li.attr('data-id'),
						ip : $li.closest('.list').find('h6').first().text()
					});
				}
			} else if($paginator && $t[0].tagName === 'A') {
				e.preventDefault();
				e.stopPropagation();
				data[$paginator.attr('data-id')] = $t.text();
				console.log(data, $t);
			} else return;

			// return console.log(data);

			if(data) $(self).load("/" + data.page, data);

		});
		</script>

		<?php
	} // Render

} // EditDB

// new EditDB();
