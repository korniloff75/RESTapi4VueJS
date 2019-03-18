<?php
require_once BASE_DIR . '/classes/DbJSON.php';

abstract class Api
{
		protected
			$dbPath = 'db/',
			$dataObj, // Object new DbJSON
			$headers = [
				"Access-Control-Allow-Orgin: *",
				"Access-Control-Allow-Methods: *",
				"Content-Type: application/json"
			],
			$method = ''; //GET|POST|PUT|DELETE

		public
			$apiName = '',
			$requestUri = [],
    	$requestParams = [];

    protected $action = ''; //Название метода для выполнения


    public function __construct($id = null) {

    	//Массив GET параметров разделенных слешем
    	$this->requestUri = explode('/', trim($_SERVER['REQUEST_URI'],'\\/'));
			$this->requestParams = $_REQUEST;

			$this->id = $id;

			# Определение метода запроса
			$this->method = $_SERVER['REQUEST_METHOD'];
			if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
				if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
					$this->method = 'DELETE';
				} elseif ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
					$this->method = 'PUT';
				} else {
					throw new Exception("Unexpected Header");
				}
			}

			echo $this->run();

			$content = ob_get_clean();

			foreach($this->headers as $h) {
				header($h);
			}
			echo $content;

    }


    public function run() {
			# Открываем базу
			$this->dataObj = new \DbJSON($this->dbPath . 	$this->apiName . '.json');
			// print_r($this->dataObj);

    	# Определение действия для обработки
    	$this->action = $this->getAction();

    	if (method_exists($this, $this->action)) {
    		return $this->{$this->action}();
    	} else {
    		throw new RuntimeException('Invalid Method', 405);
			}

    }

		protected function inRequest(string $name) {
			return $this->requestParams[$name] ?? null;
		}

    protected function response($data, $status = 500) {
			$header = "HTTP/1.1 " . $status . " " . $this->requestStatus($status);
			if($status == 200) {
				$this->headers[] = $header;
			} else {
				$this->headers = [$header];
			}

			return is_string($data) ? $data : \DbJSON::toJSON($data);
    }

    private function requestStatus($code) {
        $status = [
            200 => 'OK',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
				];
        return $status[$code] ?? $status[500];
    }

		protected function getAction()
		{
			$method = $this->method;
			switch ($method) {
				case 'GET':
					if($this->id) {
					return 'viewAction';
				} else {
					return 'indexAction';
				}
				break;
				case 'POST':
				    return 'createAction';
				    break;
				case 'PUT':
				    return 'updateAction';
				    break;
				case 'DELETE':
				    return 'deleteAction';
				    break;
				default:
				    return null;
			}
		}

    abstract protected function indexAction();
    abstract protected function viewAction();
    abstract protected function createAction();
    abstract protected function updateAction();
    abstract protected function deleteAction();
}