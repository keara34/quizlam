var QuizManagerView = function ( model ) {
	var that = this;
	that.model = model;

	return that;
};

QuizManagerView.prototype.output = function () {
	var instance = this;
	var modelData = instance.model;
	var htmlData;
	var template;
	var tempFunc;
	var html;

	$.ajax({
  		type: 'GET',
  		url: 'src/views/html/manager.html',
  		dataType: 'html',
  		async: false,
  		success: function(data){
 	  		template = data;
 	  		tempFunc = doT.template(template);
 	  		html = tempFunc(modelData);
  		},
  		error: function(xhr, type, data){
  			alert("error");
  		}
	});

	return html;
};

QuizManagerView.prototype.render = function () {
	var outputValue = this.output();
	var container = $(".mainContainer");
	container.html(outputValue);
	this.setHandlers();
	container.removeClass('left');
	container.addClass('center transition');
};

QuizManagerView.prototype.setHandlers = function() {
	var that = this;
	$(".quizListItem").click(function(event) {
		var quizId = $(this).children('.quiz').children('.quizLink').attr('data-quiz-id');
		var quiz  = that.model.getQuiz(quizId);
		that.launchQuiz(quiz);
		
	});

}
QuizManagerView.prototype.launchQuiz = function(quiz) {
	Core.go('quizPlayer', quiz);
}