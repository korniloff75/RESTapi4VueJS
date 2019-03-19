<?php
require_once 'Api.php';

class ContentJson extends Api
{
	public $apiName = __CLASS__;
	protected
		$dbPath = '../db/',
		$cache;

	public function __construct($id = null)
	{
		$cache = new Caching;
		parent::__construct($id);

		$allData = $this->dataObj->get();

		if(!count($allData)) {
			$this->dataObj->set([
				'menu' => $cache->get('menu.htm', function() {
					return (new ParseContent('../content/'))->createMenu();
				})
			]);
		}
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
		return $this->id && ($data = $this->dataObj->get($this->id))
		? $this->response($data, 200)
		: $this->response('Data not found', 404);
	}

	function createAction() {}
	function updateAction() {}
	function deleteAction() {}

}