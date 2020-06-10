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
	function isNumeric(num) {
		// TODO this can be changed to a regex to avoid number limits
		return !isNaN(num);
	}

	function appendToEditor(value) {
		let existingValue = pformatter.parse($("#result").val());
		existingValue = "" + existingValue + value;// convert to string
		if (isNumeric(existingValue)) {
			$("#result").val(pformatter.format(existingValue));
		}
	}

	return {append: appendToEditor}
})();

const pcalc = (function () {
	function evalExp(expression) {
		const result = math.evaluate(expression);
		$("#result").val(result);
		plog.log(expression, result);
	}

	function init() {
		$(".btnnum").on("click", function () {
			peditor.append($(this).val());
		});

		$(".btnfunc").on("click", function () {
			if ("AC" == $(this).val()) {
				$("#expressionDiv").text("");
				$("#result").val("");
			} else if ("←" == $(this).val()) {
				// backspace
			} else {
				const expression = $("#result").val();
				$("#expressionDiv").append(" " + expression);
				if ("=" == $(this).val()) {
					evalExp($("#expressionDiv").text());
				} else {
					$("#expressionDiv").append(" " + $(this).val());
					$("#result").val("");
				}
			}
		});

		$("#btnClear").on("click", function () {
			$("#result").val("");
			$("#result").focus();
		});
		$("#result").focus();
	}

	return {init: init}
})();

$(document).ready(function () {
	pcalc.init();
});