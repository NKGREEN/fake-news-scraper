$('.savedArticleBtn').on('click', function () {
	var thisId =  $(this).attr("data-id");

	$.ajax({
		method: "GET",
		url: "/savedArticles/" + thisId
	}).done(function (data) {
		console.log(data);


	})


})