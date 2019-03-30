<?php
class ParseContent
{
	public
		$allInDirFilterIterator,
		$ContentMap=[]; # array with $allInDirFilterIterator

	protected
		$path,
		$fileExts = ['htm', 'html'], # allowed extensions
		$serveDirs = ['assets', 'img'];

	public function __construct($path=null)
	{
		$this->path = $path ?? "{CONTENT_DIRNAME}/";

		$this->run($path);

		# Open map's file
		$cache = new Caching;
		# Define ContentMap
		$this->ContentMap = json_decode($cache->get('ContentMap.json', function() {
			return $this->toArray();
		}), 1);
		$ContentObj = null;

		// $ContentObj = new DbJSON('/db/ContentMap.json');

		# Обновляем базу при заходе через корневой index.php
		/* if(\DEV && realpath('') === realpath(BASE_DIR)) {
			# Rewrite map's file
			$ContentObj->replace($this->toArray());
		}
		elseif(!count($ContentObj->db))
		{
			# Create map's file
			$ContentObj->set($this->toArray());
		}
		else
		{

		} */
		# Define ContentMap
		// $this->ContentMap = $ContentObj->db;

	}


	/**
	 * @path - путь к папке с контентом
	 */
	public function run($path)
	{
		$allInDir = new RecursiveDirectoryIterator ($path , FilesystemIterator::SKIP_DOTS);

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
		// $tree = new RecursiveTreeIterator ($allInDir);

		# Итератор щля отфильтрованный файлов
		$this->allInDirFilterIterator = new RecursiveIteratorIterator($allInDirFilter);
		// , RecursiveIteratorIterator::SELF_FIRST

		// print_r("\n===\nallFilterFoldersIterator\n===\n");

	} // run


	/**
	 * Получаем данные из $this->ContentMap
	 * optional @url - путь к папке страницы относительно папки CONTENT_DIRNAME
	 */
	public function getFromMap($url=null)
	{
		$url = $url ?? $_SERVER['REQUEST_URI'];

		# Define default page
		if($url === '/') {
			$this->allInDirFilterIterator->rewind();
			// var_dump($this->allInDirFilterIterator->current()->isFile(), $this->allInDirFilterIterator->current()->getPathname());

			$url = $this->allInDirFilterIterator->current()->getPathname();
			$url = str_replace(CONTENT_DIRNAME, '', $url);
		}

		$url = \Path::fixSlashes($url);

		$path = explode('/', dirname(trim($url,'\\/')));
		// var_dump($url, $path);

		$ev = '$cur = $this->ContentMap';
		foreach($path as $i) {
		 $ev .= "['children']['$i']";
		}

		eval($ev . ';');

		$cur['data'] = array_merge([
			'title' => basename(dirname($cur['path'][0])),
			'seo' => []
		], ($cur['data'] ?? []));

		if(!empty($cur['data']['seo'][1])) {
			$cur['data']['seo'][1] = preg_replace("#,\s+?#", ',', $cur['data']['seo'][1]);
		}

		return $cur;
	}


	# Преобразуем $this->allInDirFilterIterator в массив
	public function toArray()
	:array
	{
		$ritit = $this->allInDirFilterIterator;
		$out = [];
		// echo '<pre>';

		// var_dump($ritit);

		foreach ($ritit as $pathname=>$splFileInfo) {
			$level = $ritit->getDepth();
			// print_r("<h2>$pathname</h2><hr>");

			$item = [
				'content' => [$splFileInfo->getFilename()],
				'path' => [$pathname]
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
		// global $nav;
		$map = $map ?? $this->ContentMap;
		if(empty($map['children'])) return $nav;
		// var_dump($map);

		$nav .= "<ul>\n";

		foreach($map['children'] as $name=>$child) {
			$data = $child['data'] ?? [];
			// var_dump($child);
			if(!empty($child['path'])) {
				$path = $child['path'][0];

				// var_dump($path);
				$path = str_ireplace(CONTENT_DIRNAME . DIRECTORY_SEPARATOR, '', $path);

				$nav .= "<li><a href='/$path' data-href='/$path' data-json='" . \DbJSON::toJSON($data) . "'>" . ($data['title'] ?? basename(dirname($path))) . "</a></li>\n";
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
