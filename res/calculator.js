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
			if(10 < dataArray.length) {
				dataArray.shift();
			}
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
		if(checkAndClearResultCalculated()) {
			allClear();
		}

		if(isDefaultValueInEditor()) {
			if(0 === Number(value)) {
				return;// don't add zeros if on default
			} else if(pformatter.getDecimalCharacter() !== value) {
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
		if(checkAndClearResultCalculated()) {
			allClear();
		}

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
			if(checkAndClearResultCalculated()) {
				clearExpression();
			}
			appendToExpression(getEditorValue());
			getEditor().val(DEFAULT_EDITOR_VALUE);
			return true;
		}
	}

	function checkAndClearResultCalculated() {
		if(isResultCalculated) {
			isResultCalculated = false;
			return true;
		}
		return false;
	}

	function addOperator(operator) {
		appendToExpression(operator);
	}

	function updateOperator(operator) {
		let expression = getExpression();
		if(2 < expression.length) {
			expression = expression.substr(0, expression.length - 2);// remove space too
			getExpressionDiv().text(expression);
			appendToExpression(operator);
		}
	}

	function getExpression() {
		return getExpressionDiv().text();
	}

	function getValidExpression() {
		let lastExpr = getExpression();
		if(['+', '-', '*', '/'].includes(lastExpr.charAt(lastExpr.length - 1))) {
			return lastExpr.substr(0, lastExpr.length - 2);
		}

		return lastExpr;
	}

	function getEditorValue() {
		return getEditor().val();
	}

	function setResult(resultNum) {
		isResultCalculated = true;
		setEditorValue(resultNum);
	}

	function setEditorValue(resultNum) {
		getEditor().val(resultNum);
	}

	return {
		append: appendToEditor,
		clear: allClear,
		backspace: backspace,
		addOperator: addOperator,
		getValidExpression: getValidExpression,
		getEditorValue: getEditorValue,
		setEditorValue: setEditorValue,
		setResult: setResult,
		moveEditorToExp: moveEditorToExp,
		updateOperator: updateOperator,
		isNumeric: isNumeric
	}
})();

const pcalc = (function () {
	function evaluate(expression) {
		return math.evaluate(expression);
	}

	function evalExp(expression) {
		const result = evaluate(expression);
		peditor.setResult(result);
		plog.log(expression, result);
	}

	function performFuncButtons(operator) {
		if ("C" === operator) {
			peditor.clear();
		} else if ("←" === operator) {
			peditor.backspace();
		} else if("%" === operator) {
			const lastResult = evaluate(peditor.getValidExpression());
			const percentExpr = lastResult + " * " + peditor.getEditorValue() + " / 100";
			peditor.setEditorValue(evaluate(percentExpr));
		} else {
			const validMove = peditor.moveEditorToExp();
			if ("=" === operator) {
				evalExp(peditor.getValidExpression());
			} else if (validMove) {
				peditor.addOperator(operator);
			} else {
				if ("=" !== operator) {
					peditor.updateOperator(operator);
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

		$(document).keypress(function(e) {
			const keyCode = e.which || e.keyCode;
			let key = String.fromCharCode(keyCode);
			if(46 == keyCode ||
				48 <= keyCode && 57 >= keyCode) {
				addNumberToEditor(key);
			} else if([43, 45, 42, 47, 37].includes(keyCode)) {
				performFuncButtons(key);
			}
		});

		$(document).keydown(function(e) {
			const keyCode = e.which || e.keyCode;
			let key = String.fromCharCode(keyCode);
			if(13 == keyCode) {
				performFuncButtons("=");
			} else if(27 == keyCode) {
				performFuncButtons("C");
			} else if(8 == keyCode) {
				performFuncButtons("←");
			}
		});
	}

	return {init: init}
})();

$(document).ready(function () {
	pcalc.init();
	plog.loadOldExpressions();
});