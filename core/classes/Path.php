<?php
class Path {
	/**
	 * Return fixed path 4 Unix
	 */
	public static function fixSlashes($path)
	:string
	{
		$path = str_replace('\\', '/', $path);
		return preg_replace("#(?!https?|^)//+#", '/', $path);
	}


	public static function fromRoot($path)
	:string
	{
		return str_ireplace(self::fixSlashes($_SERVER['DOCUMENT_ROOT']) . '/', '', self::fixSlashes($path));
	}


	/**
	 * Return $needle or first parent folder
	 * in path $haystack
	 */
	public static function parentFolder(string $haystack, $needle = null)
	:string
	{
		$str = '';
		$arr = array_filter(explode('/', $haystack));

		for ($i=0; $i < count($arr) - 1; $i++) {
			$str .= $arr[$i] . '/';
			if($needle && $needle === $arr[0])
				break;
		}

		return $str;
	}

} // class Path