# PHP REST API backend for VueJS

Небольшой и быстрый серверный движок, предоставляющий API для клиентских запросов.

Позволяет работать с многоуровневой **FLAT-FILE** базой данных, расположенной в директории **/content**. Автоматически генерирует многоуровневое меню, соответствующее структуре директории **/content**.

Структура директории **/content** должна состоять из иерархии директорий, каждая из которых содержит контент отдельной страницы сайта. Также директории могут содержать поддиректории /assets или /img, в которых можно располагать подгружаемые файлы для текущей страницы. Директории с любыми другими именами будут восприняты как подстраницы сайта. К директориям подстраниц применимы все те же правила, что и к директориям страниц.

Данные для title, seo, etc... задаются в файлах data.json директории страницы.

При обращении к корневой папке в формате **/folder/subfolder** - возвращает отрендеренную страницу из директории **/content/folder/subfolder**  для поисковых систем.


## API for VueJS

Пока находится в стадии разработки.
Файлы расположены в папке **/frontendVueJS**