<?php
\H::getInstance();

class H {
	public static
		$File,
		$Dir;

	private function __construct()
	{
		self::$File = \Path::fromRoot('content/' . trim($_SERVER['REQUEST_URI'],'\\/'));
		self::$Dir = dirname(self::$File) . '/';
	}

	public static function translit(string $s, $napr = 0)
	:string
	{
		$translit = [
		'а' => 'a', 'б' => 'b', 'в' => 'v','г' => 'g', 'д' => 'd', 'е' => 'e','ё' => 'yo', 'ж' => 'zh', 'з' => 'z','и' => 'i', 'й' => 'j', 'к' => 'k','л' => 'l', 'м' => 'm', 'н' => 'n','о' => 'o', 'п' => 'p', 'р' => 'r','с' => 's', 'т' => 't', 'у' => 'u','ф' => 'f', 'х' => 'x', 'ц' => 'c','ч' => 'ch', 'ш' => 'sh', 'щ' => 'shh','ь' => '\'', 'ы' => 'y', 'ъ' => '\'\'','э' => 'e\'', 'ю' => 'yu', 'я' => 'ya', ' ' => '_',

		 'А' => 'A', 'Б' => 'B', 'В' => 'V','Г' => 'G', 'Д' => 'D', 'Е' => 'E','Ё' => 'YO', 'Ж' => 'Zh', 'З' => 'Z','И' => 'I', 'Й' => 'J', 'К' => 'K','Л' => 'L', 'М' => 'M', 'Н' => 'N','О' => 'O', 'П' => 'P', 'Р' => 'R','С' => 'S', 'Т' => 'T', 'У' => 'U','Ф' => 'F', 'Х' => 'X', 'Ц' => 'C','Ч' => 'CH', 'Ш' => 'SH', 'Щ' => 'SHH','Ь' => '\'', 'Ы' => 'Y\'', 'Ъ' => '\'\'','Э' => 'E\'', 'Ю' => 'YU', 'Я' => 'YA',

		];

		if($napr && $napr !== 'cyr-lat') {
			$translit = array_flip(
				array_diff_key($translit, [
				'Ь' => 1, 'Ъ' => 1
			]));
		}

		return strtr($s, $translit);
	}

	public static function remove($path)
	{
		$success = file_exists($path) ? false : true;
		if(is_dir($path)) {
			if ($objs = glob($path."/*")) {
				 foreach($objs as $item) {
					 (__METHOD__)($item);
					//  is_dir($obj) ? removeDirectory($obj) : unlink($obj);
				 }
			}
			$success = rmdir($path);
		}
		elseif(is_file($path)) {
			$success = unlink($path);
		}
		return $success;
	}


	public static function shead ($s, $o = '')

	{
		header('Content-type: text/html; charset=utf-8');

		if ($s == 401)
			header('HTTP/1.0 401 Unauthorized');

		elseif ($s == 404)
		{
			self::remove(BASE_DIR . '/' . CACHE_DIR);
			header('HTTP/1.0 404 Not Found');
			$o = "<div>
				<p>Данная страница не найдена...</p>
				<p>Пожалуйсла, перейдите на <a href=\"/\">Главную страницу</a> сайта.</p>
			<div>";
		}
		elseif ($s == 403)
		{
			header('HTTP/1.0 403 Forbidden');
		}

		$CurrentInMap['data']['title'] = "Error $s";

		if(!include("templates/errorpages/$s.htm"))
		 $o = '<h1>' . $CurrentInMap['data']['title'] . "</h1>\n" . $o;

		 die($o);

	}

	public static function getPath()
	{
		// return ;
	}

	# Singlton methods
	protected static $_instance;
	public static function getInstance()
	{
		self::$_instance = self::$_instance ?? new self;
		return self::$_instance;
	}

	private function __clone() {}
	private function __wakeup() {}
}