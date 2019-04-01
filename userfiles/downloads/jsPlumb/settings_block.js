/**
 * Шаблоны блоков
 * имя переменной формируется как jtk_block_ + id_action_type(из БД)
 * html код html блока
 * sourceAnchors размещение выходных точек
 * targetAnchors размещение входных точек
 */

/*
Вход
 */

var templates = {
	
	// Default
	jtk_block_0: {
		html: '<div class="jtk-block jtk-block-entry jtk-node"><div class="jtk-block_ico"><i class="far fa-user"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Подписка в группу <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: [],
		properties: { id: "" }
	},

	// Подписка в группу
	jtk_block_1: {
		html: '<div class="jtk-block jtk-block-entry jtk-node"><div class="jtk-block_ico"><i class="far fa-user"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Подписка в группу <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: [],
		properties: { id: "" }
	},

	// Выписал счет на товар
	jtk_block_2: {
		html: '<div class="jtk-block jtk-block-entry jtk-node"><div class="jtk-block_ico"><i class="fas fa-shopping-basket"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Заказал товар <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: [],
		properties: { id: "" }
	},
	// Купил товар товар
	jtk_block_16: {
		html: '<div class="jtk-block jtk-block-entry jtk-node"><div class="jtk-block_ico"><i class="far fa-money-bill-alt"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Купил товар <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: [],
		properties: { id: "" }
	},
	// Получил доступ к курсу
	jtk_block_22: {
		html: '<div class="jtk-block jtk-block-entry jtk-node"><div class="jtk-block_ico"><i class="fas fa-book"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Получил доступ к курсу <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: [],
		properties: { id: "" }
	},

	/*
	Действия
	 */
	// Отправить письмо
	jtk_block_3: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Отправить письмо <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { email_subject: "", email_text: "" }
	},
	// Копировать в группу
	jtk_block_4: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-clone"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Копировать в группу <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id_newsletter: "" }
	},
	// Перенести в группу
	jtk_block_5: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Перенести в группу</span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id_newsletter: "" }
	},
	// Удалить из группы
	jtk_block_6: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-minus-square"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Удалить из группы <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id_newsletter: "" }
	},
	// Пауза
	jtk_block_8: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-clock" aria-hidden="true"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Пауза</span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { type: "1", day: "1", hour: "0", minute: "0", waitto: "00:00", weekday: "1,2,3,4,5,6,7" }
	},
	// Копировать в автоворонку
	jtk_block_17: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="fas fa-sitemap"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Копировать в воронку <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id_automation: "" }
	},
	// Предоставить персональное предложение
	jtk_block_19: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="fas fa-percent"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Персональное предложение <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id_automation: "" }
	},
	// Удалить из автоворонки
	jtk_block_20: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-minus-square"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Удалить из автоворонки <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { id: "" }
	},
	// Отправить письмо сотруднику
	jtk_block_21: {
		html: '<div class="jtk-block jtk-block-action jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Оповестить сотрудника <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
		properties: { email_subject: "", email_text: "", id_employee: "" }
	},

	/*
	Условия
	 */
	// Открытие письма
	jtk_block_9: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope-open"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Открытие письма <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { id: "", deadline: "2", day: "3", hour: "0", minute: "0" }
	},
	// Клик по ссылке в письме
	jtk_block_10: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="far fa-hand-point-up"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Клик по ссылке в письме</span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { id_action: "", id_link: "", deadline: "2", day: "3", hour: "0", minute: "0" }
	},
	// Заказ товара
	jtk_block_11: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="fas fa-shopping-basket"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Заказ товара <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { id: "", deadline: "2", day: "3", hour: "0", minute: "0" }
	},
	// Оплата товара
	jtk_block_12: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="far fa-money-bill-alt"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Купил товар <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { id: "", deadline: "2", day: "3", hour: "0", minute: "0", earlierSuccess: "0", type: "1" }
	},
	// Подписан в группу
	jtk_block_18: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="far fa-user"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Подписан на группу <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { id: "", deadline: "2", day: "3", hour: "0", minute: "0", type: "1" }
	},
	// Условие по уроку 
	jtk_block_23: {
		html: '<div class="jtk-block jtk-block-condition jtk-node"><div class="jtk-block_ico"><i class="fas fa-book"></i></div><div class="jtk-block_desc"><span class="jtk-block_desc_text">Условие по уроку <span class="jtk-block_desc_text_help"></span></span></div><div class="jtk-block_del"></div></div>',
		sourceAnchors: [anchorsBottomLeftYes, anchorsBottomRightNo],
		targetAnchors: ["TopCenter"],
		properties: { type: "1" }
	},


	/*
	Фильтр - сегментация
	 */
	// Подписан на группы
	jtk_block_13: {
		html: '<div class="jtk-block jtk-block-filter jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc">Подписан на группы</div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
	},
	// Купил товары
	jtk_block_14: {
		html: '<div class="jtk-block jtk-block-filter jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc">Купил товары</div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
	},
	// Отобрать N первых
	jtk_block_15: {
		html: '<div class="jtk-block jtk-block-filter jtk-node"><div class="jtk-block_ico"><i class="far fa-envelope"></i></div><div class="jtk-block_desc">Отобрать N первых</div><div class="jtk-block_del"></div></div>',
		sourceAnchors: ["BottomCenter"],
		targetAnchors: ["TopCenter"],
	},
}
