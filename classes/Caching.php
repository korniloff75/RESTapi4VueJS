<?php
class Caching {
	// protected
	// 	$path

	public function __construct()
	{
		# Create cach folder
		if(!file_exists(BASE_DIR . '/cach')) mkdir(BASE_DIR . '/cach');
	}

	private function fixPath($path)
	{
		$beginPath = BASE_DIR . '/cach/';
		return stripos($path, $beginPath) === 0 ? $path : $beginPath . $path;
	}

	public function get($path, $callback=null)
	{
		$path = $this->fixPath($path);

		if(file_exists($path)) {
			return file_get_contents($path);
		}
		elseif(!empty($callback)) {
			return $this->set($path, $callback);
		}
		else throw new LogicException("Отсутствует файл кэша <b>$path</b>", 404);
	}


	public function set($path, $callback)
	{
		$path = $this->fixPath($path);

		$data = is_string($callback) && !function_exists($callback) ? $callback : $callback();

		if(@file_put_contents($path, $data)) {
			return $data;
		}
		else throw new LogicException("Не удалось обновить кэш в файле $path", 403);
	}
} // Caching