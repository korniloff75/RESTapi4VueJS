<?php
class ParseContent
{
	public
		$allInDirFilterIterator,
		$ContentMap=[]; # array with $allInDirFilterIterator

	protected
		$path,
		$fileExts = ['php', 'htm', 'html'], # allowed extensions
		$serveDirs = ['assets', 'img'];

	/**
	 * @path - путь к папке с контентом
	 */
	public function __construct($path=null)
	{
		$this->path = $path ?? CONTENT_DIR . "/";

		# Open map's file
		$cache = new Caching;
		# Define ContentMap
		$this->ContentMap = json_decode($cache->get('ContentMap.json', function() {
			return $this->toArray();
		}), 1);

	}


	public function run()
	{
		$allInDir = new RecursiveDirectoryIterator ($this->path , FilesystemIterator::SKIP_DOTS);

		// var_dump($allInDir);

		#
		$allInDirFilter = new RecursiveCallbackFilterIterator (
			$allInDir,
			function($cur, $key, $iterator) {
				// Разрешить рекурсию
				if (
					$iterator->hasChildren()
					// && $iterator->getChildren()->isDir()
					&& !in_array($iterator->getFilename(), $this->serveDirs)
				) {
					/* print_r("\$filterItem1 = ");
					print_r(
						$iterator->getChildren()->isDir() . ' _ ' . $iterator->getChildren()->getFilename() . ' _ ' . !in_array($iterator->getFilename(), $this->serveDirs)
					); */
					return true;
				}

				# Выкидываем папки $this->serveDirs
				if(
					$cur->isDir()
					&& !in_array($cur->getFilename(), $this->serveDirs)
				) {
					// print_r("\n\$filterItem2 = ");
					// var_dump($cur->__toString());
					return true;
				}
				# Оставляем расширения файлов $this->fileExts
				elseif(
					$cur->isFile()
					&& $cur->getExtension()
					&& in_array($cur->getExtension(),$this->fileExts)
				) {
					// print_r("\n\$filterItem3 = ");
					// var_dump($cur->__toString());
					return true;
				}

				return false;
			}
		); // $allInDirFilter
		// print_r (new RecursiveTreeIterator ($allInDir));

		// print_r("\n===\nallFilterFoldersIterator\n===\n");
		// var_dump($this->allInDirFilterIterator);

		# Итератор щля отфильтрованный файлов
		return $this->allInDirFilterIterator = new RecursiveIteratorIterator($allInDirFilter);
		// , RecursiveIteratorIterator::SELF_FIRST

	} // run


	/**
	 * Получаем данные из $this->ContentMap
	 * optional @url - путь к папке страницы относительно папки CONTENT_DIRNAME
	 */
	public function getFromMap($url=null)
	{
		global $SV;

		$url = \Path::fixSlashes($url ?? $_SERVER['REQUEST_URI']);

		# Define default | current page
		$url = $this->getURL($url);

		// var_dump($url);

		\H::$URI = dirname(trim($url,'\\/.'));
		\H::$File = \Path::fromRoot(CONTENT_DIRNAME . '/' . $url);

		\H::$Dir = dirname(\H::$File) . '/';
		$path = explode('/', \H::$URI);

		// var_dump($url, \H::$URI, \H::$File, \H::$Dir);

		$ev = '$this->ContentMap';
		foreach($path as $i) {
			$i = str_ireplace('\'', "\\'", $i);
			$ev .= "['children']['$i']";
			/* eval("\$check = $ev;");

		 	if(empty($check)) {
				// print_r(realpath(CACHE_DIR . '/'));
				if(\H::remove(CACHE_DIR)) {
					break;
					$this->__construct($this->path);
					// var_dump(__METHOD__);
					return (__METHOD__)($url);
				}
				die();
			} */
		}

		eval("\$cur = $ev;");

		if(empty($cur) || empty($cur['path'])) {
			\H::shead(404);
		}
		$cur['path'] = array_unique($cur['path'] );

		$cur['data'] = array_merge([
			'title' => basename(dirname($cur['path'][0])),
			'seo' => []
		], ($cur['data'] ?? []));

		if(!empty($cur['data']['seo'][1])) {
			$cur['data']['seo'][1] = preg_replace("#,\s+?#", ',', $cur['data']['seo'][1]);
		}

		ob_start();
		foreach($cur['path'] as $path) {
			$path = \BASE_DIR . "/$path";
			// var_dump($path, file_exists($path), realpath($path));
			if(file_exists($path)) require_once($path);
		}

		# Подгружаем скрипты из TEMPLATE/js/__defer/
		$defers = glob(\Path::fromRoot(\BASE_DIR . '/' . TEMPLATE . '/js/__defer/*.js'));
		// var_dump($defers, \Path::fromRoot(\BASE_DIR . '/' . TEMPLATE . '/js/__defer/*.js'));
		foreach($defers as $script) {
			echo "<script src='/$script' defer='defer'></script>";
		}

		$cur['content'] = ob_get_clean();

		return $cur;
	} // getFromMap


	public function getURL($url = null)
	{
		if(!empty($url) && $url !== '/') return $url;

		$this->allInDirFilterIterator = $this->allInDirFilterIterator ?? $this->run();

		$this->allInDirFilterIterator->rewind();
		// var_dump($this->allInDirFilterIterator->current()->getFilename());

		while($this->allInDirFilterIterator->current()->getPath() === CONTENT_DIRNAME) {
			// var_dump($this->allInDirFilterIterator->current()->getPathname());
			$this->allInDirFilterIterator->next();
		}

		$url = $this->allInDirFilterIterator->current()->getPathname();
		$url = \Path::fixSlashes($url);
		return str_replace(CONTENT_DIRNAME, '', $url);
	}


	# Преобразуем $this->allInDirFilterIterator в массив
	public function toArray()
	:array
	{
		$ritit = $this->run();
		$out = [];
		// echo '<pre>';

		// var_dump($ritit);

		foreach ($ritit as $pathname=>$splFileInfo) {
			$level = $ritit->getDepth();
			// print_r("<h2>$pathname</h2><hr>");

			$item = [
				'content' => [$splFileInfo->getFilename()],
				'path' => [\Path::fixSlashes($pathname)],
				// 'path' => [\Path::fixSlashes($pathname)],
			];

			$data = $splFileInfo->getPath() . "/data.json";
			// var_dump($data);

			if(file_exists($data)) {
				$item = array_merge($item, ['data' => json_decode(file_get_contents($data), 1)]);
			}

		  for ($depth = $level - 1; $depth >= 0; $depth--) {
				$cur = $ritit->getSubIterator($depth)->current();
		    $item = [
					'children' => [
						$cur->getFilename() => $item
					],
				];
				// print_r( $item);
			}

			// print_r( $item);

		  $out = array_merge_recursive($out, $item);
		}

		// echo '</pre>';
		return $out;
	} // toArray



	# Создаём меню
	public function createMenu($map=null, $nav='')
	:string
	{
		$map = $map ?? $this->ContentMap;
		if(empty($map['children'])) return $nav;
		// var_dump($map);

		$nav .= "<ul>\n";

		foreach($map['children'] as $name=>$child) {
			$data = $child['data'] ?? [];
			// var_dump($child);
			if(!empty($child['path'])) {
				$path = $child['path'][0];

				$path = urldecode(str_ireplace(CONTENT_DIRNAME . '/', '', $path));

				# FIX array in title
				if(isset($data['title']) && is_array($data['title'])) {
					$data['title'] = $data['title'][0];
					// var_dump($data['title'] ?? basename(dirname($path)));
				}


				$nav .= "<li><a href=\"/{@$path}\" data-href=\"/$path\" data-json='" . \Caching::toJSON($data) . "'>" . ($data['title'] ?? basename(dirname($path))) . "</a></li>\n";
			}

			if(!empty($child['children'])) {
				$nav .= "<li class='sublist'>" . \H::translit($name, 'lat-cyr');
				ksort($child['children'], SORT_NATURAL);
				$nav = $this->createMenu($child, $nav);
				$nav .= "</li>\n";
			}
		}

		$nav .= "</ul>\n";

		return $nav;
	} // createMenu


} // ParseContent
