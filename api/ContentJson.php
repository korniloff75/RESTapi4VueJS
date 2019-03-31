<?php
require_once 'Api.php';

class ContentJson extends Api
{
	public $apiName = __CLASS__;
	protected
		$contentObj,
		$db;

	public function __construct($id = null)
	{
		$this->contentObj = new \ParseContent();
		$currentItem = $this->contentObj->getFromMap($_REQUEST['page'] ?? null);

		$this->db = [
			/* 'menu' => $cache->get('menu.htm', function() {
				return $this->$contentObj->createMenu();
			}), */

			'main' => [
				'data' => $currentItem['data'],
				'body' => ''
			]
		];

		ob_start();
		foreach($currentItem['path'] as $path) {
			$path = BASE_DIR . "/$path";
			include_once($path);
			// print_r($path);
		}
		$this->db['main']['body'] = ob_get_clean();

		// print_r($currentItem);

		parent::__construct($id);

		// print_r($this->dataObj->db);
	}

	/**
	 * Метод GET
	 * Вывод списка всех записей
	 * http://ДОМЕН/ContentJson
	 * @return string
	 */
	public function indexAction()
	:string
	{
		// print_r($this->dataObj->get());
		return $this->response(
			$this->db,
			200
		);
	}

	/**
	 * Метод GET
	 * Просмотр отдельной записи (по id)
	 * http://ДОМЕН/ContentJson/1
	 * @return string
	 */
	public function viewAction()
	{
		// print_r($this->id . "\n");
		return $this->id && ($data = $this->db[$this->id])
		? $this->response($data, 200)
		: $this->response('Data not found', 404);
	}

	function createAction() {}
	function updateAction() {}
	function deleteAction() {}

}