$(document).ready(function () {
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
});

function evalExp(expression) {
	var result = math.evaluate(expression);
	$("#result").val(result);
	log(expression, result);
}

function log(expression, result) {
	var line = "<div class='logLine'>" + expression + " = " + "<span class='resultLog'>" + result + "</span>" + "</div>";
	$("#historyDiv").append(line);
}