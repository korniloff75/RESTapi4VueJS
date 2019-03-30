<?php
class DbJSON {
	public
		$path = '',
		# DataBase
		$db = [], # Array
		$json; # String


	public function __construct(string $path=null)
	{
		// if(!strlen($path)) throw new LogicException("Отсутствует \$path", 1);

		$this->path = (strpos($path, '/') === 0 ? $_SERVER['DOCUMENT_ROOT'] : '') . $path;
		$this->json = @file_get_contents($this->path);
		$this->db = json_decode($this->json, true) ?? [];

	}

	/**
	 * @id optional <string|int>
	 */
	public function get($id=null)
	{
		return empty($id) ? $this->db : (
			$this->db[$id] ?? null
		);
	}

	/**
	 * @data <array>
	 */
	public function set(array $data)
	{
		$this->db = array_replace_recursive($this->db, $data);
		$this->json = self::toJSON($this->db);
		file_put_contents($this->path, $this->json, LOCK_EX);
		return $this;
	}

	/**
	 * @data <array>
	 */
	public function replace(array $data)
	{
		$this->db = $data;
		return $this->set($data);
	}


	# Плоский массив из многомерного
	public function getFlat()
	{
		return array_values(iterator_to_array(
			new \RecursiveIteratorIterator(
				new \RecursiveArrayIterator($this->db)
			)
		));
	}


	# Массив в JSON
	public static function toJSON(array $arr)
	{
		return json_encode(($arr), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
	}
} // DbJSON