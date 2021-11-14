// функция фильтрации данных по типу
const filterByType = (type, ...values) => values.filter(value => typeof value === type),

	// функция сокрытия блоков с результатами
	hideAllResponseBlocks = () => {
		const responseBlocksArray = Array.from(document.querySelectorAll('div.dialog__response-block'));
		// для скрытия добавляем свойсту display значение none для каждого блока из responseBlocksArray
		responseBlocksArray.forEach(block => block.style.display = 'none');
	},

	// функция отображения блока с результатами
	showResponseBlock = (blockSelector, msgText, spanSelector) => {
		// вызов функции сокрытия блоков с результатами
		hideAllResponseBlocks();
		// присваиваем свойству отображения значения блок для переданого в функцию элемента
		document.querySelector(blockSelector).style.display = 'block';
		// проверка наличия элемента spanSelector
		if (spanSelector) {
			// присваиваем переданному блоку для оповещений значение сообщения (msgText)
			document.querySelector(spanSelector).textContent = msgText;
		}
	},
	// функция для отображения ошибки, добавляем класс с соответствующими стилями 
	showError = msgText => showResponseBlock('.dialog__response-block_error', msgText, '#error'),

	// функция для отображения результатов, добавляем класс с соответствующими стилями 
	showResults = msgText => showResponseBlock('.dialog__response-block_ok', msgText, '#ok'),

	// функция для отображения отсутствия результатов, добавляем класс с соответствующими стилями 
	showNoResults = () => showResponseBlock('.dialog__response-block_no-results'),

	// функция фильтрации результатов ввода по типу
	tryFilterByType = (type, values) => {
		// оборачиваем функцию в конструкцию отлова ошибок
		try {
			// передаем код, который будем парсить далее
			const valuesArray = eval(`filterByType('${type}', ${values})`).join(", ");
			// тернарный оператор для проверки на пустой масссив(строку, в случае с eval)
			const alertMsg = (valuesArray.length) ?
				`Данные с типом ${type}: ${valuesArray}` :
				`Отсутствуют данные типа ${type}`;
				// вызываем функцию для отображения сгенерированного выше сообщения
			showResults(alertMsg);
			// ловим ошибки
		} catch (e) {
			// выводим сообщение с кастомным сообщение ошибка - статус
			showError(`Ошибка: ${e}`);
		}
	};

//  возвращает первый элемент с id = filter-btn
const filterButton = document.querySelector('#filter-btn');

// обработчик события клика для filterButton
filterButton.addEventListener('click', e => {

	//  возвращает первый элемент с id = type
	const typeInput = document.querySelector('#type');
	// возвращает первый элемент с id = data
	const dataInput = document.querySelector('#data');

	// проверка на пустое поле
	if (dataInput.value === '') {
		// передаем сообщение при обработке события пустое поле
		dataInput.setCustomValidity('Поле не должно быть пустым!');
		// вызываем функцию для отображения отсутствия результатов
		showNoResults();
	} else {
		// устанавливаем специальное (пустое, в данном случае) сообщение для  выбранного элемента
		dataInput.setCustomValidity('');
		// вызываем функцию для прекращения обработки события по-умолчанию
		e.preventDefault();
		// фильтруем результаты (удаляем лишние пробелы в typeInput.value и dataInput.value)
		tryFilterByType(typeInput.value.trim(), dataInput.value.trim());
	}
});

