<?php
if (version_compare(PHP_VERSION, '7.0', '<') ) die("<h3>Обновите версию PHP!</h3>");

define('DEV', true);
define('BASE_DIR', __DIR__);

if(\DEV)
{
	# Develop
	ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(-1);
} else {
	#Production
	ini_set('display_errors', 0);
	ini_set('display_startup_errors', 0);
	error_reporting(0);
}

$tmp=[];

function profile(string $rem='base')
	{
		global $tmp;
		if(!\DEV) return '';

		$tmp['profile'] = $tmp['profile'] ?? [];

		# Start value
		if(empty($tmp{'profile'}[$rem]))
		{
			$tmp{'profile'}[$rem] = microtime(true);
		}
		# Computed value
		else
		{
			$info = '<p>Page generation - ' . bcsub(microtime(true), $tmp['profile']['base'], 5)*1000 . 'ms | Memory usage - now ( '. round (memory_get_usage()/1024) . ') max (' . round (memory_get_peak_usage()/1024) . ') Kbytes</p>';

			unset($tmp{'profile'}[$rem]);
			return  "<div class='core bar'><b>Technical Info $rem </b>: $info</div>";
		}

	}

	profile();
