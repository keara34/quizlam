
(function (scope)
{
    //Player Class
    function QuizPlayer()
    {
    var that                = this;
    that.mainContainer      = document.getElementById("quizContainer");
    that.questionContainer  = null;
    that.quiz               = [];
    that.currentIndex       = 0;
    that.currentQuestion    = null;
    that.correctAnswers     = 0;
    that.answered           = false;

        /*TODO : HANDLE MCQ/UCQ (quiz type) */
        /*TODO : HANDLE TRANSITIONS*/
        if(QuizPlayer.prototype.initializer === true) return;

        QuizPlayer.prototype.initializer = true;


        QuizPlayer.prototype.load = function(quiz)
        {
            if(typeof(quiz) !== undefined) {
                that.quiz = quiz;
                that.launch();
            }
        };
        QuizPlayer.prototype.launch = function()
        {
            that.currentIndex = 0;
            that.currentQuestion = that.quiz.Questions[that.currentIndex];
            that.displayQuiz();
        };
        QuizPlayer.prototype.show = function() {
            that.mainContainer.className = "quizContainer overlap";
            that.backBtn.className = "fa fa-bars fa-2x backBtn visible";
        }
        QuizPlayer.prototype.displayQuiz = function() {
            that.render(that.mainContainer, that.getQuizTemplate(), function() {
                that.questionContainer = document.getElementById("questionContainer");
                that.displayQue();
                that.setMainHandlers();
                that.show();
            });
        };

        QuizPlayer.prototype.displayRecapScreen = function() {
            that.render(that.mainContainer, that.getRecapTemplate());
        }
        QuizPlayer.prototype.displayQue = function(target)
        {
            that.updateProgressBar();
            that.render(that.questionContainer, that.getQuestionTemplate(), function() {
                that.setQuestionHandlers();
            });
        };
        QuizPlayer.prototype.render = function(target, data, cb)
        {
            target.innerHTML = data;
            if(typeof(cb) !== 'undefined') {
                cb();
            }
        };
        QuizPlayer.prototype.getRecapTemplate = function() {
            var modelData = that.quiz;
            var htmlData;
            var template;
            var tempFunc;
            var html;

            modelData.points = that.correctAnswers;
            modelData.nbQuestions = that.quiz.Questions.length;
            modelData.percent = modelData.points/modelData.nbQuestions*100;
            $.ajax({
                type: 'GET',
                url: 'src/views/html/recap.html',
                dataType: 'html',
                async: false,
                cache: false,
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
        }
        QuizPlayer.prototype.getQuizTemplate = function() {
            var modelData = that.quiz;
            var htmlData;
            var template;
            var tempFunc;
            var html;

            // modelData.currentQuestionIndex = that.currentIndex + 1;
            // modelData.nbQuestions = that.quiz.Questions.length;
            $.ajax({
                type: 'GET',
                url: 'src/views/html/quiz.html',
                dataType: 'html',
                async: false,
                cache: false,
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
        QuizPlayer.prototype.getQuestionTemplate = function() {
            var modelData = that.currentQuestion;
            var htmlData;
            var template;
            var tempFunc;
            var html;


            $.ajax({
                type: 'GET',
                url: 'src/views/html/question.html',
                dataType: 'html',
                async: false,
                cache: false,
                success: function(data){
                    template = data;
                    tempFunc = doT.template(template);
                    html = tempFunc(modelData);
                },
                error: function(xhr, type, data){
                    alert("error");
                }
            });
            return html
        };
        QuizPlayer.prototype.submitQue = function()
        {
            that.answered = true;
            var propositions = document.getElementsByClassName("proposition selected");
            var answers = [];
            for (var i = propositions.length - 1; i >= 0; i--) {
                answers.push(propositions[i].getAttribute("data-id"));
            };
            if(answers.length > 0) {
                that.isCorrect(answers[0]);
            } else {
                return false;
            }
        };
        QuizPlayer.prototype.uncheckPropositions = function()
        {
            for (var i = that.propositions.length - 1; i >= 0; i--) {
                that.propositions[i].className = "proposition";
            };
        }
        /*TODO : MCQ (check quiz type: if mcq , remvoe unchecking) */
        QuizPlayer.prototype.selectProposition = function(element)
        {
            that.uncheckPropositions();
            element.className = "proposition selected";
        }
        QuizPlayer.prototype.isCorrect = function(id)
        {
            var isCorrect = false;
            var correctId = that.currentQuestion.correctAnswer;
            var props = that.currentQuestion.propositions;
            var propLen = props.length;
            var correctLabel;
            if(that.answered) {
                if(correctId === id) {
                    that.correctAnswers++;
                    isCorrect = true;
                    that.answered = false;
                }
                for (var i = 0; i < propLen; i++) {
                    if(correctId === props[i].id) {
                        correctLabel = props[i].label;
                    }
                };
                that.showAnswer(isCorrect, correctLabel);
                that.highlightProposition(id, isCorrect, correctId);
            }
        }
        QuizPlayer.prototype.highlightValidProposition = function(id)
        {
            var props = document.getElementsByClassName("proposition");
            for (var i = props.length - 1; i >= 0; i--) {
                if(props[i].getAttribute("data-id") === id ) {
                    props[i].className = 'proposition correct';
                }
            };
        }
        QuizPlayer.prototype.highlightProposition = function(id, isValid, correctId)
        {
            var classLbl = (isValid ? "correct" :  "wrong");
            var props = document.getElementsByClassName("proposition");
            for (var i = props.length - 1; i >= 0; i--) {
                if(props[i].getAttribute("data-id") === id ) {
                    props[i].className = 'proposition '+classLbl;
                }
            };
            that.highlightValidProposition(correctId);
        }
        QuizPlayer.prototype.showAnswer = function(isValid, answer)
        {

            var msgContainer = document.getElementById('msgContainer');
            var msg = "";
            if(isValid) {

                msg = "Correct ! The answer was '"+answer+"'.";
                msgContainer.className = "correctMsg msg";
            } else {
                msg = "Wrong answer, the right answer was '" + answer +"'.";
                msgContainer.className = "wrongMsg msg";
            }
            msgContainer.innerHTML = msg;
        };
        QuizPlayer.prototype.updateProgressBar = function()
        {
            var bar = document.getElementById("progress");
            var index = that.currentIndex+1;
            var percent = index/that.quiz.Questions.length*100;

            bar.style.width = percent + '%';
        }
        QuizPlayer.prototype.next = function()
        {
            if(that.currentIndex < that.quiz.Questions.length-1) {
                that.currentIndex ++;
                that.updateProgressBar();
                that.currentQuestion = that.quiz.Questions[that.currentIndex];
                that.displayQue();
                that.clearMessage();
            } else {
                that.displayRecapScreen();
            }
        };
        QuizPlayer.prototype.clearMessage = function()
        {
            var msgContainer = document.getElementById('msgContainer');
            msgContainer.innerHTML = "";
        }
        QuizPlayer.prototype.setQuestionHandlers = function()
        {
            that.propositions = document.getElementsByClassName('proposition');

            for(var i = 0; i < that.propositions.length; i++) {
                that.propositions[i].addEventListener("click", function(event) {
                    that.selectProposition(event.target);
                }, false);
            }
        }
        QuizPlayer.prototype.hide = function()
        {
            that.mainContainer.className = "hidden";
            var container = $('#quizContainer');
            var width = $(window).width();
            // console.log(width);
            // container.css('right', -width);
        }
        QuizPlayer.prototype.setMainHandlers = function()
        {

            that.submitBtn = document.getElementById("submit");
            that.nextBtn = document.getElementById("next");
            that.backBtn = document.getElementById("backButton");

            that.submitBtn.addEventListener("click", function(event) {
                that.submitQue();
            }, false);

            that.nextBtn.addEventListener("click", function(event) {
                that.next();
            }, false);

            that.backBtn.addEventListener("click", function(event) {
                // that.destroy();
                Core.go('QuizManager');
            }, false);
        };
        QuizPlayer.prototype.unsetHandlers = function()
        {
            that.submitBtn = null;
            that.nextBtn = null;
            that.backBtn.className = "fa fa-bars fa-2x backBtn hidden";
        };
        QuizPlayer.prototype.destroy = function()
        {
            console.log('DEBUG : destroyed');
            that.unsetHandlers();
            that.correctAnswers = 0;
            that.mainContainer.innerHTML = "";
            that.hide();
        };
    }

    scope.Player = new QuizPlayer();

})(window);

Core.register('quizPlayer', function(quiz)
{
    Player.load(quiz);
    return Player;
});