$("#expandable").click(function() {
	var foldStatus = $(this).attr("class");
	if (foldStatus == "unfolded") {
		$("#content").hide(10);
		$(this).removeClass("unfolded").addClass("folded").text("Show");
	} else {
		$("#content").show(10)
		$(this).removeClass("folded").addClass("unfolded").text("Hide");
	}
});
