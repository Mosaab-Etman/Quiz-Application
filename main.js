// First: The Global Variables
let infoQCount = document.querySelector('.count'),
    QArea = document.querySelector('.questions-area'),
    AArea = document.querySelector('.answers-area'),
    result = document.querySelector('.result'),
    submit = document.querySelector('.submit'),
    quizBase = document.querySelector('.quiz-base'),
    bulletsArea = document.querySelector('.bullets');

// Second: The Used Controls
let currentIndex = 0,
    rAnswersCount = 0,
    countDown;

// Third: The Ajax Requests

let QRequest = new XMLHttpRequest();

QRequest.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {

        let questions = JSON.parse(this.responseText),
             QCount = questions.length;

        infoQCount.innerHTML += QCount;

        // createBullests Function 
        createBullests(QCount);

        // createQuestion Function
        createQuestion(questions[currentIndex], currentIndex, QCount);

        // Timer Function
        timer(90)

        // Submit the answer
        submit.onclick = function() {

            // checkAnswer Function
            checkAnswer(questions[currentIndex]);

            currentIndex++;

            // Removing done question
            document.querySelector('.questions-area h1').remove();
            AArea.innerHTML = '';

            // createQuestion Function
            createQuestion(questions[currentIndex], currentIndex, QCount);

            clearInterval(countDown);
            timer(90);

            // Mark the Next Span 
            nextSpan(currentIndex, QCount);

            // Show Result Function
            showResult(currentIndex, QCount)
        }
    }
}

QRequest.open("Get", "./questions.json");
QRequest.send();

// Four: The Used Functions


// createBullets Function

function createBullests(num) {

    'use strict';
    for (let i = 0; i < num; i++) {

        let span = document.createElement('span');
        bulletsArea.appendChild(span);
        
        if (i === 0) {
            span.classList = 'on'
        }
    }

}
// createQuestion Function 
function createQuestion(QObject, currentIndex, QCount) {

    'use strict';

    if (currentIndex < QCount) {

        // First Create the question title
        let question = document.createElement('h1'),
        questionText = document.createTextNode(QObject.title);

        question.appendChild(questionText);
        QArea.prepend(question);

        // Second Create the alternative answers
        for (let i = 1; i <= 4; i++) {

            // First Parent answer div
            let answer = document.createElement('div');
            answer.className = 'answer';

            // Second Answer Input Radio
            let answerInput = document.createElement('input');
            answerInput.type = 'radio';
            answerInput.id = `answer-${i}`;
            answerInput.name = 'answer';
            answerInput.dataset.answer = QObject[`answer-${i}`];

            // Third Answer label
            let answerLabel = document.createElement('label'),
                answerLabelText = document.createTextNode(QObject[`answer-${i}`]);

            answerLabel.appendChild(answerLabelText);
            answerLabel.htmlFor = `answer-${i}`

            // Fourth Appending answers into the answer area
            answer.appendChild(answerInput);
            answer.appendChild(answerLabel);
            AArea.appendChild(answer);

            if (i === 1) {
                answerInput.checked = true;
            }
        } 
    }   
}

// CheckAnswer Function

function checkAnswer(object) {

    'use strict';
    let rightAnswer = object['right-answer'],
        inputAnswers = document.querySelectorAll('input'),
        choosenAnswer;

    for (let i = 0; i < 4; i++) {

        if (inputAnswers[i].checked && inputAnswers[i].dataset.answer == rightAnswer) {
            
            rAnswersCount++;
        }
    }  
};

// Mark next Span Function
function nextSpan(currentIndex, QCount) {

    'use stritct';
    if (currentIndex < QCount) {

        let span = document.querySelectorAll('.bullets span');
        span[currentIndex].classList = 'on';
    }
};

// Show Result Function 
function showResult(currentIndex, QCount) {

    'use strict';
    if (currentIndex == QCount) {
        QArea.remove();
        submit.remove();
        quizBase.remove();

        if (rAnswersCount <= 2) {
            result.innerHTML = `${rAnswersCount} out of ${QCount} is Bad`;
        }  else if (rAnswersCount > 2 && rAnswersCount < 5) {
            result.innerHTML = `${rAnswersCount} out of ${QCount} is good`
        } else {
            result.innerHTML = `${rAnswersCount} out of ${QCount} is Excellent`
        }
    }
}

// Timer Function 
function timer(duration) {

    'use strict';
    let minutes = document.querySelector('.timer .minutes'),
        seconds = document.querySelector('.timer .seconds');

        countDown = setInterval(() => {
            minutes.innerHTML = Math.floor(duration / 60) + ' :';
            seconds.innerHTML = duration % 60;

            duration--;

            if (duration < 0) {
                clearInterval(countDown);
                submit.click();
            }
        }, 1000);
}