<?php
require_once 'Api.php';

class ContentJson extends Api
{
	public $apiName = __CLASS__;
	protected
		$dbPath = '../db/',
		$contentObj,
		$currentItem,
		$cache;

	public function __construct($id = null)
	{
		$cache = new Caching;

		$this->dataObj = new \DbJSON;
		$this->contentObj = new \ParseContent('../content/');
		$this->currentItem = $this->contentObj->getFromMap($_REQUEST['page'] ?? null);

		// print_r($this->currentItem);


		$this->dataObj->db = [
			'menu' => $cache->get('menu.htm', function() {
				return $this->$contentObj->createMenu();
			}),

			// 'main_' => !empty($_REQUEST['page']) ? file_get_contents(CONTENT_DIR . ($_REQUEST['page'])) : '', // Нужно определить контент по умолчанию

			'main' => [
				'title' => $this->currentItem['data']['title'],
				'body' => ''
			]
		];

		ob_start();
		foreach($this->currentItem['path'] as $path) {
			$path = BASE_DIR . "/$path";
			include_once($path);
			// print_r($path);
		}
		$this->dataObj->db['main']['body'] = ob_get_clean();

		// print_r($this->dataObj->db['main']);

		parent::__construct($id);

			// print_r($this->dataObj->db);
	}

	/**
	 * Метод GET
	 * Вывод списка всех записей
	 * http://ДОМЕН/apiName
	 * @return string
	 */
	public function indexAction()
	:string
	{
		// print_r($this->dataObj->get());
		return $this->response(
			$this->dataObj->get(),
			200
		);
	}

	/**
	 * Метод GET
	 * Просмотр отдельной записи (по id)
	 * http://ДОМЕН/apiName/1
	 * @return string
	 */
	public function viewAction()
	{
		// print_r($this->id . "\n");
		return $this->id && ($data = $this->dataObj->get($this->id))
		? $this->response($data, 200)
		: $this->response('Data not found', 404);
	}

	function createAction() {}
	function updateAction() {}
	function deleteAction() {}

}