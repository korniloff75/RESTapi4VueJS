<?php

namespace classes;

class Render
{
	function __construct()
	{
		global $CurrentInMap;
		$this->Data = $CurrentInMap['data'];
	} // __construct


	public static function meta()
	: string
	{
		$_SESSION['captcha'] = random_int(1e3,1e6);

		$meta = "<meta charset=\"UTF-8\">
		<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
		<meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n
		<meta name=\"author\" content=\"" . \OWNER['name'] . "\">
		<meta name=\"robots\" content=\"" . (empty($this->Data['hidden']) ? "index, follow" : "noindex, nofollow") . "\">
		<meta name=\"generator\" content=\"" . \VERSION . " -  js-master.ru\">";

		#SEO
		if(isset($this->Data['seo']))
		{
			$this->Data['seo'] = array_replace([null,null], $this->Data['seo']);
			// var_dump($this->Data['seo']);
			list($this->Data['description'], $this->Data['keywords']) = $this->Data['seo'];
		}

		// \H::$this->Data = $this->Data;

		if(isset($this->Data['description']))
		{
			$meta .= "<meta name=\"description\" content=\"{$this->Data['description']}\"/>\n";
		}

		if(isset($this->Data['keywords']))
		{
			$this->Data['keywords'] = preg_replace("#\,\s+#", ',', $this->Data['keywords']);
			$meta .= "<meta name=\"keywords\" content=\"{$this->Data['keywords']}\"/>\n";
		}

		# favicon
		foreach(['ico', 'gif', 'png'] as &$ext) {
			if(!file_exists('favicon.' . $ext)) continue;
			$meta .= '<link rel="icon" type="image/' . ($ext === 'ico' ? 'x-icon' : $ext) . '" href="/favicon.' . $ext . '" />'
			. '<link rel="shortcut icon" type="image/x-icon" href="/favicon.' . $ext . '" />';
			break;
		}
		// var_dump(__FILE__, __LINE__, $meta);
		return $meta;
	} // meta


	public static function head()
	: string
	{
		global $SV;

		return self::meta()
		. "\n<title>{$this->Data['title']} - " . \SITENAME . '</title>'
		. "\n" . '<link rel="stylesheet" type="text/css" href="/css/base.css">'
		. "\n" . '<link rel="stylesheet" type="text/css" href="/assets/font-awesome/css/font-awesome.min.css">'
		. (\ADMIN ? '<link rel="stylesheet/less" type="text/css" href="/css/admin.less">' : '')
		. "\n" . (
			\ADMIN && \USE_BROWS_LESS ? (

				\H::addFromDir($this->Data['template'], 'less')
			) :
			\H::addFromDir($this->Data['template'], 'css')
			)
		. "\n"
		. $SV
		. "\n" . ($opts['link'] ?? '')
		. "\n" . \H::addFromDir('js/');
	}


	public static function contentCollect($dir, $opts = [])
	: string
	{

		$current = $dir === \DIR;
		\H::$Dir = $dir;
		// define('DIR', $dir);
		ob_start();

		$idf = new \DirFilter($dir);
		$data = $current ? $this->Data : Navigate::setData($dir);
		$images = $current ? \IMAGES : (new \DirFilter($dir, "#\.(jpe?g|png)$#"))->natSort();
		$cond = \ADMIN && empty($opts['rss']);
		$hidden = $data['hidden'] ?? null;

		if(!empty($data['hidden'])) return '';

		$eswitcher = '<select size="1" class="core note editorSwitcher">
		<option class="core info" title="Без редактирования" selected="selected">normal</option>
		<option class="core note" title="Визуальный редактор">contentEditable</option>
		<option class="core warning" title="Открыть файл">editFile</option>
		</select>';

		if(count($content_htm = $idf->natSort()))
		{
			foreach($content_htm as &$htm) {
				if($cond) echo "$eswitcher<div data-path=\"$htm\" class=\"editor\">";
				include_once $htm;
				if($cond) echo "</div>";
			}
		}

		# Add thumbs
		if(\MODULES['Thumb']['enable'] && (!isset($data['thumb']) || $data['thumb'] == true) && $images)
			echo \H::includeModule('Thumb')->toPage();
			// exit;

		# Add content from *.md files
		if(count($content_md = (new \DirFilter($idf->iterator, "#\.(md)$#"))->natSort()))
		{
			foreach($content_md as &$md) {
				$out .= file_get_contents($md);
			}

			echo \H::includeModule('Parsedown')->text($out);
			// require_once 'php/modules/Parsedown.php';
			// echo (new \Parsedown)->text($out);
		}

		$content = ob_get_clean();

		return "<header>
		<h1" . ($hidden ? " class=hidden" : "") . ">{$data['title']}</h1>
		</header>\n$content";
	}


	public static function content()

	{
		global $SV;
		$out = '';
		$hidden = !empty($this->Data['hidden']);

		if(!\ADMIN && $hidden)
			\H::shead(403);

		$content = "<div class=\"content\">\n" . self::contentCollect(\H::$Dir) . "\n</div>\n<!-- /.content -->\n";

		// var_dump(\DIR, $content); exit;

		if(!strlen($content))
			die (\H::shead(404));
		else
		{
			# Add comments & return
			#
			// $content = self::breadCrumbs() . $content;

			if(\MODULES['comments'])
				$content .= self::comments();

			/*  */
			if(!empty(\CF['counter']) && !\LOCALHOST)
			{
				$content .= \CF['counter'];
			}
			if(\ADMIN)
			{
				$content .= \H::profile('base', basename(__FILE__) . ' : ' . __LINE__);
			}
		}

		return $content;

	} // content


	public static function comments()
	:string
	{

		if(isset($this->Data['comments']) && $this->Data['comments'] == -1)
			return '';

		# Add comments
		ob_start();
		echo '<section id="comments">';
		require_once 'php/modules/comments/comments.php';
		echo '</section>';

		return ob_get_clean();
	}


	public static function breadCrumbs($arr = [])
	:string
	{

	}

	public static function breadCrumbsRecurse($arr = [])

	{
		global $Nav;

		// $arr = explode('/', \H::$fileInfo->getPath());


		$crumb_path = dirname($crumb_path ?? \DIR);
		if(\Navigate::skipSlashes($crumb_path) === \Navigate::skipSlashes(\CONT)) return;

		var_dump($crumb_path);
		$data = $Nav->setData($crumb_path);
		var_dump($data);
		$arr[$data['title']] = $crumb_path;

		self::breadCrumbsRecurse($arr);
		die;


		$str = '<div id="breadcrumbs" style="margin: 15px 0 -2em;">';
		$path = '/' . \CONT;

		for ($i=1; $i < count($arr); $i++) {
			$c = $arr[$i];
			$path .= "$c/";
			$str .= "<a href=\"$path\" title=$c>$c</a> &middot; ";
		}

		return $str . '</div>';
	}


	public static function footer()
	: string
	{
		$f = '<script>
		// less options in template
		var less = {
			env: \'' . (LOCALHOST ? 'development' : 'production') . '\',
			javascriptEnabled: false
		}
		</script>';

		if(UPD_LESS_FROM_BROUSER) {
			# Не нашел способа получить контент из тега style, либо из результата работы less в броузере.
			$f .= "<script>
				$.post('css/handler.php', {
						css: $('#less:css-less-core')
					},
					function() {}
				);
			</script>";
		}

		$f .= \H::addFromDir('js/__defer/', [
			'ext' => 'js',
			'defer' => 1,
			'except' => \ADMIN || USE_BROWS_LESS ? 0 : 'LESS'
		]);

		if(\ADMIN) $f .= '<script src="/js/modules/admin.js"></script>';

		return $f;
	} // footer


	protected static function createAdminItem ($name, $val)
	:string
	{
		$str = '';
		if(is_array($val))
		{
			foreach($val as $n => &$i) {
				$str .= self::createAdminItem("$name-$n", $i);
			}
		}
		else
		{
			$str = "<div class=\"flex\"><label>$name</label> - <input value=\"" . $val . "\"></div>";
		}
		return $str;
	}


	public static function adminBlock ()
	:string
	{
		global $this->Data;

		if(!\ADMIN) return '';

		ob_start();
		?>

		<button id="save-data" class="core message button" onclick="_A.saveSettings($(this))">Save</button>
		<div id="page_settings">
		<?php
		// var_dump($this->Data);
		// if(!count($this->Data)) $this->Data = ["title" => "Untitled"];

		foreach($this->Data as $name => &$val) {
			// echo self::createAdminItem($name, str_replace('"', '', json_encode($val, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK)));
			if($name === 'template' && $val === \TEMPLATE) continue;
			echo self::createAdminItem($name, $val);

		}
		?>

		</div>
		<button id="add_setting" class="core note button" onclick="_A.addSetting($('#page_settings'))">Add NEW</button>

		<?php
		// print_r(\H::$notes);

		foreach(\H::$notes as $fn => &$n) {
			?>

			<h5 style="margin: 1em 0;"><?=$fn?></h5>
			<div>
				<?php
				foreach($n as $l => &$t) {
					echo "<h6>$l</h6>";
					var_dump($t);
				}
				?>
			</div>

			<?php
		}

		return "<pre id=\"adm\" class=\"DA_del\">" . ob_get_clean() . '</pre>';

		/* if(LOCALHOST) echo "<!-- livereload -->
		<script>document.write('<script src=\"http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1\"></' + 'script>')</script>"; */

	} // adminBlock


	public static function finalPage ($opts = [])
	: string
	{
		# final rendering
		global $this->Data, $Nav, $notes;

		note($this->Data, __FILE__, __LINE__);

		# Wrap content in template
		eval (\H::addFromDir($this->Data['template'], 'php'));


		# Close main buff
		# opened in Index
		$html = ob_get_clean();

		// var_dump($html);

		if(\ADMIN) $html = preg_replace('~(<body)[^>]*>~', "$1 style=\"/*padding-top:15px;*/\">\n" . self::adminBlock(), $html, 1);


		$html = preg_replace([
			'~</head>~', '~<!--\s*\$TITLE\$\s*-->~', '~<!--\s*\$CONTENT\$\s*-->~', '~</body>~'
		], [
			self::head() . "\n$0",
			$this->Data['title'],
			'<div id="ajax-content">' . self::content() . "</div>\n",
			self::footer() . "\n$0"
		], $html, 1);

		// var_dump($this->Data);
		// var_dump($html);

		return $html;
	}
}