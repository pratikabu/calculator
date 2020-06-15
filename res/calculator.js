const pformatter = (function () {
	function format(number) {
		// formatted string
		return number;
	}

	function parse(numberString) {
		// parse formatted string to number
		return numberString;
	}

	function getDecimalCharacter() {
		return ".";
	}

	return {
		format: format,
		parse: parse,
		getDecimalCharacter: getDecimalCharacter
	}
})();

const plog = (function () {
	const LOCAL_STORAGE_KEY = "pratikabu-calculator-key";

	function getHistoryLogDiv() {
		return $("#historyLog");
	}

	function addToDiv(expression, result, date) {
		const line = "<div class='logLine'><span class='expressionLog'>" + expression
			+ "</span> = " + "<span class='resultLog'>" + result + "</span>" + "</div>";
		getHistoryLogDiv().prepend(line);
	}

	function log(expression, result) {
		const now = new Date();
		addToDiv(expression, result, now);
		addToLocalStorage(now, expression, result);
	}

	function addToLocalStorage(date, expression, result) {
		if(isLocalStorageAvailable()) {
			const jsonData = {
				"expression": expression,
				"result": result
			};
			const dataArray = getDataFromStorage();
			dataArray.push(jsonData);// insert in begening
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataArray));
		}
	}

	function loadOldExpressions() {
		if(isLocalStorageAvailable()) {
			const dataArray = getDataFromStorage();
			for (var i = 0; i < dataArray.length; i++) {
				addToDiv(dataArray[i]["expression"], dataArray[i]["result"]);
			}
		}
	}

	function getDataFromStorage() {
		if(isLocalStorageAvailable()) {
			let dataArray = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
			if(null == dataArray || typeof(dataArray) === 'undefined') {
				dataArray = [];
			}
	
			return dataArray;
		}

		return null;
	}

	function isLocalStorageAvailable() {
		let storageAvailable = typeof(Storage) !== "undefined";

		if (!storageAvailable) {
			console.log("Local storage not available");
		}
		return storageAvailable;
	}

	function clearLogs() {
		if(isLocalStorageAvailable()) {
			localStorage.clear();
			getHistoryLogDiv().empty();
		}
	}

	return {
		log: log,
		loadOldExpressions: loadOldExpressions,
		clearLogs: clearLogs
	}
})();

const peditor = (function () {
	const DEFAULT_EDITOR_VALUE = "0";
	let isResultCalculated = false;

	function getEditor() {
		return $("#result");
	}

	function getExpressionDiv() {
		return $("#expressionDiv");
	}

	function isNumeric(num) {
		// TODO this can be changed to a regex to avoid number limits
		return !isNaN(num);
	}

	function appendToEditor(value) {
		if(isDefaultValueInEditor()) {
			if(pformatter.getDecimalCharacter() !== value) {
				getEditor().val("");// remove default value for other numbers
			}
		}

		let existingValue = pformatter.parse(getEditor().val());
		existingValue = "" + existingValue + value;// convert to string
		if (isNumeric(existingValue)) {
			getEditor().val(pformatter.format(existingValue));
		}
	}

	function clearExpression() {
		getExpressionDiv().text("");
	}

	function clearEditor() {
		getEditor().val(DEFAULT_EDITOR_VALUE);
	}

	function allClear() {
		clearExpression();
		clearEditor();
	}

	function backspace() {
		let editorValue = getEditor().val();
		if("0" !== editorValue) {
			let size = editorValue.length - 1;
			if(0 == size) {
				clearEditor();
			} else {
				let newValue = editorValue.substr(0, size);
				getEditor().val(newValue);
			}
		}
	}

	function isExpressionEmpty() {
		return "" === getExpressionDiv().text();
	}

	function isDefaultValueInEditor() {
		return DEFAULT_EDITOR_VALUE === getEditor().val();
	}

	function appendToExpression(obj) {
		if(!isExpressionEmpty()) {
			getExpressionDiv().append(" ");
		}
		getExpressionDiv().append(obj);
	}

	function moveEditorToExp() {
		if(isDefaultValueInEditor()) {
			return false;
		} else {
			if(isResultCalculated) {
				clearExpression();
				isResultCalculated = false;
			}
			appendToExpression(getEditor().val());
			getEditor().val(DEFAULT_EDITOR_VALUE);
			return true;
		}
	}

	function addOperator(operator) {
		appendToExpression(operator);
	}

	function getExpression() {
		return getExpressionDiv().text();
	}

	function setResult(resultNum) {
		isResultCalculated = true;
		getEditor().val(resultNum);
	}

	return {
		append: appendToEditor,
		clear: allClear,
		backspace: backspace,
		addOperator: addOperator,
		getExpression: getExpression,
		setResult: setResult,
		moveEditorToExp: moveEditorToExp
	}
})();

const pcalc = (function () {
	function evalExp(expression) {
		const result = math.evaluate(expression);
		peditor.setResult(result);
		plog.log(expression, result);
	}

	function performFuncButtons(operator) {
		if ("C" === operator) {
			peditor.clear();
		} else if ("←" === operator) {
			peditor.backspace();
		} else {
			const validMove = peditor.moveEditorToExp();
			if (validMove) {
				if ("=" === operator) {
					evalExp(peditor.getExpression());
				} else {
					peditor.addOperator(operator);
				}
			}
		}
	}

	function addNumberToEditor(number) {
		peditor.append(number);
	}

	function init() {
		$(".btnnum").on("click", function (e) {
			addNumberToEditor($(this).text());
			e.preventDefault();
		});

		$(".btnfunc").on("click", function (e) {
			performFuncButtons($(this).text());
			e.preventDefault();
		});

		$("#clearLogs").on("click", function (e) {
			plog.clearLogs();
			e.preventDefault();
		});
	}

	return {init: init}
})();

$(document).ready(function () {
	pcalc.init();
	plog.loadOldExpressions();
});