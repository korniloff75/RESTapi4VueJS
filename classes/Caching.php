<?php
class Caching {
	protected
		$cacheDir;

	public function __construct()
	{
		# Create cache folder
		if(!file_exists($this->cacheDir = CACHE_DIR)) mkdir($this->cacheDir);
	}

	private function fixPath($path)
	{
		$beginPath = $this->cacheDir . '/';
		return stripos($path, $beginPath) === 0 ? $path : $beginPath . $path;
	}

	/**
	 * @path - путь к файлу кэша, относительно cache/
	 * optional @callback - string (func name | json) | function
	 * Проверит наличие файла $this->fixPath(@path)
	 * Если нет - создат с содержимым, возвращённым @callback
	 * Вернёт его содержимое
	 */
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


	/**
	 * @path - путь к файлу кэша, относительно cache/
	 * @callback - string (func name | json) | function
	 * Создаст или перезапишет файл $this->fixPath(@path)
	 * результатом, возвращённым @callback
	 */
	public function set($path, $callback)
	{
		$path = $this->fixPath($path);

		$data = is_string($callback) && !function_exists($callback) ? $callback : $callback();
		$data = is_string($data) ? $data : self::toJSON($data);

		if(@file_put_contents($path, $data)) {
			return $data;
		}
		else throw new LogicException("Не удалось обновить кэш в файле $path", 403);
	}


	# Массив в JSON
	public static function toJSON(array $arr)
	{
		return json_encode($arr, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
	}
} // Caching