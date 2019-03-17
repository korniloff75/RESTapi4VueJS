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

	private static function getPath()
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