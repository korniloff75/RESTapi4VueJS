<?php
require_once 'Api.php';
// require_once 'Db.php';
// require_once 'Users.php';

class DefaultApi extends Api
{
    public $apiName = 'Default';

    /**
     * Метод GET
     * Вывод списка всех записей
     * http://ДОМЕН/users
     * @return string
     */
		public function indexAction()
		:string
    {
        $allData = $this->dataObj->get();
        if(count($allData)){
            return $this->response($allData, 200);
        }
        return $this->response('Data not found', 404);
    }

    /**
     * Метод GET
     * Просмотр отдельной записи (по id)
     * http://ДОМЕН/users/1
     * @return string
     */
    public function viewAction()
    {
        //id должен быть первым параметром после /users/x
        $id = array_shift($this->requestUri);

        if($id && ($data = $this->dataObj->get($id))) {
            return $this->response($data, 200);
        }
        return $this->response('Data not found', 404);
    }

    /**
     * Метод POST
     * Создание новой записи
     * http://ДОМЕН/users + параметр запроса newData
     * @return string
     */
    public function createAction()
    {
        extract($this->requestParams);
        if($newData){
					array_push($this->dataObj->db, $newData);
					$this->dataObj->set($this->dataObj->db);

        	return $this->response('Data saved.', 200);
        }
        return $this->response("Saving error", 500);
    }

    /**
     * Метод PUT
     * Обновление отдельной записи (по ее id)
     * http://ДОМЕН/users/1 + параметры запроса name, email
     * @return string
     */
    public function updateAction()
    {
        return $this->response("Update error", 400);
    }


    /**
     * Метод DELETE
     * Удаление отдельной записи (по ее id)
     * http://ДОМЕН/users/1
     * @return string
     */
    public function deleteAction()
    {
        return $this->response("Delete error", 500);
    }

}