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
	function log(expression, result) {
		const line = "<div class='logLine'><span class='expressionLog'>" + expression
			+ "</span> = " + "<span class='resultLog'>" + result + "</span>" + "</div>";
		$("#historyDiv").prepend(line);
	}

	return {log: log}
})();

const peditor = (function () {
	const DEFAULT_EDITOR_VALUE = "0";

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
			if(pformatter.getDecimalCharacter() != value) {
				getEditor().val("");// remove default value for other numbers
			}
		}

		let existingValue = pformatter.parse(getEditor().val());
		existingValue = "" + existingValue + value;// convert to string
		if (isNumeric(existingValue)) {
			getEditor().val(pformatter.format(existingValue));
		}
	}

	function allClear() {
		getExpressionDiv().text("");
		getEditor().val(DEFAULT_EDITOR_VALUE);
	}

	function backspace() {

	}

	function isExpressionEmpty() {
		return "" == getExpressionDiv().text();
	}

	function isDefaultValueInEditor() {
		return DEFAULT_EDITOR_VALUE == getEditor().val();
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
		if ("C" == operator) {
			peditor.clear();
		} else if ("←" == operator) {
			peditor.backspace();
		} else {
			const validMove = peditor.moveEditorToExp();
			if (validMove) {
				if ("=" == operator) {
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
	}

	return {init: init}
})();

$(document).ready(function () {
	pcalc.init();
});