const pformatter = (function () {
	function format(number) {
		// formatted string
		return number;
	}

	function parse(numberString) {
		// parse formatted string to number
		return numberString;
	}

	return {
		format: format,
		parse: parse
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
		let existingValue = pformatter.parse(getEditor().val());
		existingValue = "" + existingValue + value;// convert to string
		if (isNumeric(existingValue)) {
			getEditor().val(pformatter.format(existingValue));
		}
	}

	function allClear() {
		getExpressionDiv().text("");
		getEditor().val("");
	}

	function backspace() {

	}

	function isExpressionEmpty() {
		return "" == getExpressionDiv().text();
	}

	function isEditorEmpty() {
		return "" == getEditor().val();
	}

	function appendToExpression(obj) {
		if(!isExpressionEmpty()) {
			getExpressionDiv().append(" ");
		}
		getExpressionDiv().append(obj);
	}

	function moveEditorToExp() {
		if(isEditorEmpty()) {
			return false;
		} else {
			appendToExpression(getEditor().val());
			getEditor().val("");
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

	function init() {
		$(".btnnum").on("click", function () {
			peditor.append($(this).val());
		});

		$(".btnfunc").on("click", function () {
			if ("AC" == $(this).val()) {
				peditor.clear();
			} else if ("←" == $(this).val()) {
				peditor.backspace();
			} else {
				const validMove = peditor.moveEditorToExp();
				if(validMove) {
					const operator = $(this).val();
					if ("=" == operator) {
						evalExp(peditor.getExpression());
					} else {
						peditor.addOperator(operator);
					}
				}
			}
		});
	}

	return {init: init}
})();

$(document).ready(function () {
	pcalc.init();
});