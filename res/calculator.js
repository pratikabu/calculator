var plog = (function () {
	function log(expression, result) {
		var line = "<div class='logLine'><span class='expressionLog'>" + expression
			+ "</span> = " + "<span class='resultLog'>" + result + "</span>" + "</div>";
		$("#historyDiv").append(line);
	}

	return { log: log }
})();

var pcalc = (function () {
	function evalExp(expression) {
		var result = math.evaluate(expression);
		$("#result").val(result);
		plog.log(expression, result);
	}

	function init() {
		$(".btnnum").on("click", function () {
			$("#result").val($("#result").val() + $(this).val());
		});

		$(".btnfunc").on("click", function () {
			if("AC" == $(this).val()) {
				$("#expressionDiv").text("");
				$("#result").val("");
			} else if("←" == $(this).val()) {
				// backspace
			} else {
				var expression = $("#result").val();
				$("#expressionDiv").append(" " + expression);
				if("=" == $(this).val()) {
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

	return { init: init }
})();

$(document).ready(function () {
	pcalc.init();
});