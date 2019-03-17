<?php
class ParseContent
{
	public
		$allInDirFilterIterator,
		// $arr, # array with $allInDirFilterIterator
		$ContentMap=[];

	protected
		$path,
		$fileExts = ['htm', 'html'],
		$serveDirs = ['assets', 'img'],
		$dirs,
		$files;

	public function __construct($path='content/')
	{
		$this->path = $path;

		$this->run($path);

		# Open map's file
		$ContentObj = new DbJSON('/db/ContentMap.json');
		# Обновляем базу при заходе через корневой index.php
		if(\DEV && realpath('') === realpath(BASE_DIR)) {
			$ContentObj->replace($this->toArray());
		}
		elseif(!count($ContentObj->db))
		{
			# Create map's file
			$ContentObj->set($this->toArray());
		}
		else
		{

		}
		# Define ContentMap
		$this->ContentMap = $ContentObj->db;

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
				elseif(
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
		// print_r("\n" . $this->allInDirFilterIterator->__toString());
		// var_dump(
		// 	$this->allInDirFilterIterator,
		// 	iterator_count($this->allInDirFilterIterator));
		// print_r("\n===\n/ allInDirFilterIterator\n===\n");

	} // run


	/**
	 * Получаем данные из $this->ContentMap
	 * @url - путь к папке страницы
	 */
	public function getFromMap($url=null)
	{
		$url = $url ?? $_SERVER['REQUEST_URI'];
		$path = explode('/', dirname(trim($url,'\\/')));
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


	# Получаем данные для текущей страницы
	public function current()
	{
		 $path = explode('/', dirname(trim($_SERVER['REQUEST_URI'],'\\/')));
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
		// print_r($ritit);
		$out = [];

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
			}

			// $item['level'] = $level;
			// var_dump($pathname, $item);
			// echo '===';

		  $out = array_merge_recursive($out, $item);
		}

		return $out;
	}


	# Создаём меню
	public function createMenu($map=null, $nav='')
	:string
	{
		// global $nav;
		$map = $map ?? $this->ContentMap;
		// var_dump($map);
		$nav .= '<ul>';

		if(!empty($map['children']))
		{
			foreach($map['children'] as $child) {
				$data = $child['data'] ?? [];
				// var_dump($child);
				if(!empty($child['path'])) {
					foreach($child['path'] as $path) {
						// var_dump($path);
						$path = str_ireplace('content' . DIRECTORY_SEPARATOR, '', $path);

						$nav .= "<li><a href='/$path'>" . ($data['title'] ?? basename(dirname($path))) . "</a></li>";
					}
				}

				$nav = $this->createMenu($child, $nav);

			}
		}

		return "{$nav}\n</ul>";
	}


	/* public function recurseFind(string $findName, $callback, $arr=null)
	:array
	{
		$arr = $arr ?? $this->arr;

		if(!empty($arr[$findName])) {
			foreach($arr[$findName] as $name=>&$item) {
				$item = $callback ($item, $name);

				#recurse
				if(!empty($item[$findName])) {
					return $this->recurseFind($findName, $callback, $item);
				}

			}
		} // $findName
		// return "<h1>END</h1>";
		return $arr;
	} */

}

