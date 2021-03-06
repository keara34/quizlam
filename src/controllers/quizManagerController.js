var QuizManagerController = function () {
	this.transition = 'left';
	this.container = $('.mainContainer');
	return this;
};

// if(QuizManagerController.prototype.initializer === true) return;
// QuizManagerController.prototype.initializer = true;

QuizManagerController.prototype.init = function () {
	var that = this;
	if(typeof(arguments[0]) !== 'undefined') {
		that.loadQuizzes.apply(that, arguments[0]);
	}
};

QuizManagerController.prototype.loadQuizzes = function () {
	var model = ManagerModel.find(arguments);
	var view = new QuizManagerView(model);

	view.render();
};
QuizManagerController.prototype.destroy = function () {
	$(".mainContainer").removeClass('center');
	$(".mainContainer").addClass('left');
	$(".mainContainer").addClass('transition');
};
Core.register('QuizManager', function()
{
	var controller = new QuizManagerController();
   	return controller;
});


