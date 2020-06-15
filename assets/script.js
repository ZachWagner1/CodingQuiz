var page = document.getElementById('page');
var content = document.getElementById('content')
var displayTime = document.getElementById('timer');
var highScoresList = document.getElementById('high-score');
var btnStart = document.getElementById('btn-start');
var countDown = 60;
var scoreArr = uploadScore() || [];
var questionIndex = 0;

var questionArr = [
    {
        question: 'Commonly used data types do NOT include:',
        answer: [ 'strings', 'booleans', 'alerts', 'numbers' ],
        rightAnswer : 2
    }, {
        question: 'Arrays in Javascript can be used to store ___.',
        answer: [ 'numbers and strings', 'other arrays', 'booleans', 'all of the above'],
        rightAnswer : 3
    }, {
        question: 'The condition in an If/Else statement is enclosed with ___.',
        answer: [ 'quotes', 'curly braces', 'parenthesis', 'square brackets'],
        rightAnswer : 1
    }, {
        question: 'String values must be enclosed within ___.',
        answer: [ 'curly bracess', 'commas', 'quotes', 'parenthesis'],
        rightAnswer : 2
    }, {
        question: 'A very useful tool during development and debugging for printing content to the debugger:',
        answer: [ 'JavaScript', 'terminal/bash', 'for loops', 'console.log' ],
        rightAnswer : 3
    }
];

// start the quiz //
function quizStart() {
    timer();
    generateQuestion(questionArr[questionIndex]);
}
function timer() {
    startTimer = setInterval(function() {
        countDown--;
        countDown > 0 ? (displayTime.innerText = countDown) : (displayTime.innerText = 0);
        if (countDown === 0) {
            clearInterval(startTimer);
            
        }
    }, 1000);
}

function generateQuestion(questionObj) {
    content.innerHTML = '';
    questionIndex++;
    // container
    var questionEl = document.createElement('div');
    questionEl.className = 'question';
    questionEl.id = 'question';

    var questionFirst = document.createElement('h2');
    questionFirst.textContent = questionObj.question;
    questionEl.appendChild(questionFirst);

    var answerList = document.createElement('ul');
    answerList.className = 'answer';
    answerList.id = 'answer';

    var answer = questionObj.answer;
    for (var i = 0; i < answer.length; i++) {
        var answerElement = document.createElement('li');
        answerElement.className = 'answer-item';
        answerElement.innerHTML = `<button class="btn btn-answer">${i + 1}. ${answer[i]}</button>`;
        if(i === questionObj.rightAnswer) {
            answerElement.setAttribute('data-right-answer', 'true');
        }
        answerList.appendChild(answerElement);
    }
    questionEl.appendChild(answerList);
    content.appendChild(questionEl);
    answerList.addEventListener('click', checkChoice);
}

function checkChoice(event) {
    var click = event.target.closest('li.answer-item');
    var answerList = document.getElementById('answer');

    if(click) {
        var rightAnswer = click.hasAttribute('data-right-answer');
        if(rightAnswer) {
            var rightAnswerMessage = document.createElement('p');
            rightAnswerMessage.className = 'response-message';
            rightAnswerMessage.innerText = 'Correct!';
            answerList.appendChild(rightAnswerMessage);
        }
        else {
            countDown = countDown - 10;
            var wrongAnswerMessage = document.createElement('p');
            wrongAnswerMessage.className = 'response-message';
            wrongAnswerMessage.innerText = 'Wrong!';
            answerList.appendChild(wrongAnswerMessage);
        }
        answerList.removeEventListener('click', checkChoice);

        setTimeout(function() {
            if(countDown <= 0 || questionIndex >= questionArr.length) {
                gameOver();
            }
            else {
                generateQuestion(questionArr[questionIndex]);
            }
        }, 1000);
    }
}

function gameOver() {
    clearInterval(window.startTimer);
    content.innerHTML = '';
    var gameOverElement = document.createElement('div');
    gameOverElement.className = "gameover";
    gameOverElement.id = "gameover";

    var gameOverMessage = document.createElement('h2');
    gameOverMessage.innerText = 'All Done!';
    gameOverElement.appendChild(gameOverMessage);

    var scoreFinalMessage = document.createElement('h3');
    scoreFinalMessage.innerText = 'You final score is ';

    var scoreElement = document.createElement('span');
    scoreElement.id = 'user-score';

    if(countDown >= 0) {
        scoreElement.innerText = countDown + '.';
    }
    else {
        scoreElement.innerText = 0 + '.';
    }
    scoreFinalMessage.appendChild(scoreElement);
    gameOverElement.appendChild(scoreFinalMessage);

    var userStatsForm = document.createElement('form');
    userStatsForm.innerHTML = "<label for='initials'>Enter Initials:</label>" +
                              "<input type='text' id='initials' name='initials' maxlength=2>" +
                              "<button class='btn btn-short' type='submit'>Submit</button>";
    
    userStatsForm.addEventListener ('submit', enterStats);

    gameOverElement.appendChild(userStatsForm);
    content.appendChild(gameOverElement);
}

function enterStats(event) {
    event.preventDefault();
    var userInitials = document.querySelector("input[name='initials']").value.toUpperCase();
    var userScore = countDown > 0 ? countDown : 0;
    var userStatsObject = { user : userInitials, score : userScore};
    scoreArr.push(userStatsObject);
    savedScores();
    highScorePage();
}

function highScorePage() {
    page.innerHTML = '';

    var highScoresContainerElement = document.createElement('div');
    highScoresContainerElement.classList = 'container high-scores';
    highScoresContainerElement.id = 'high-scores';
    
    var headText = document.createElement('h2');
    headText.innertext = 'High Scores';
    highScoresContainerElement.appendChild(headText);
    var highScoresList = document.createElement('ul');
    for(var i = 0; i < scoreArr.length; i++) {
        var userStats = document.createElement('li');
        userStats.innertext = i + 1 + '. ' + scoreArr[i].user + ' - ' + scoreArr.score;
        highScoresList.appendChild(userStats);  
}
highScoresContainerElement.appendChild(highScoresList);
var actionContainer = document.createElement('div');
actionContainer.className = 'action';
var backBtn = document.createElement('a');
backBtn.id = 'back-page';
backBtn.setAttribute('href', './index.html');
backBtn.classlist = 'btn btn-short';
backBtn.innerText = 'Back';
actionContainer.appendChild(backBtn);
var clearScore = document.createElement('button');
clearScore.classlist = 'btn btn-short';
clearScore.innertext = 'Clear HighScores';
clearScore.addEventListener('click', clearHighScores);
actionContainer.appendChild(clearScore);

highScoresContainerElement.appendChild(actionContainer);
page.appendChild(highScoresContainerElement);

}




function clearHighScores() {
    scoreArr = [];
    highScorePage();
    savedScores();
}

function savedScores() {
    localStorage.setItem('stats', JSON.stringify(scoreArr));
}

function uploadScore() {
    var stats = localStorage.getItem('stats');
    if(!stats){
        return false;
    }
    return (stats = JSON.parse(stats));
}
//highScoresList.addEventListener('click', highScorePage);
btnStart.addEventListener('click', quizStart);
