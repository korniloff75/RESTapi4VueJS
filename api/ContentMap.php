<?php
require_once 'Api.php';

class ContentMap extends Api
{
		public $apiName = __CLASS__;
		protected
			$dbPath = '../db/';

		/**
		 * Метод GET
		 * Вывод списка всех записей
		 * http://ДОМЕН/apiName
		 * @return string
		 */
		public function indexAction()
		:string
    {
			$allData = $this->dataObj->get();
			if(count($allData)) {
				return $this->response($allData, 200);
			}
			// print_r
			return $this->response('Data not found', 404);
    }

		/**
		 * Метод GET
		 * Просмотр отдельной записи (по id)
		 * http://ДОМЕН/apiName/1
		 * @return string
		 */
		public function viewAction()
		{
			if($this->id && ($data = $this->dataObj->get($this->id))) {
			    return $this->response($data, 200);
			}
			return $this->response('Data not found', 404);
    }

    /**
     * Метод POST
     * Создание новой записи
     * http://ДОМЕН/apiName + параметр запроса newData
     * @return string
     */
    public function createAction()
    {
			if($newData = $this->inRequest('newData')) {
				array_push($this->dataObj->db, $newData);
				$this->dataObj->set($this->dataObj->db);

				return $this->response('Data saved.', 200);
			}
			return $this->response("Saving error", 500);
    }

    /**
     * Метод PUT
     * Обновление отдельной записи (по ее id)
     * http://ДОМЕН/useapiNamers/1 + параметры запроса name, email
     * @return string
     */
    public function updateAction()
    {
			if($this->id && ($newData = $this->inRequest('newData'))) {
				$this->dataObj->db[$this->id] = $newData;
				$this->dataObj->set($this->dataObj->db);
				return $this->response("Update success", 200);
			}

			return $this->response("Update error", 400);
    }


		/**
		 * Метод DELETE
		 * Удаление отдельной записи (по ее id)
		 * http://ДОМЕН/apiName/1
		 * @return string
		 */
		public function deleteAction()
		{
		  return $this->response("Delete error", 500);
		}

}