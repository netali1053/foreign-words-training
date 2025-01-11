'use strict';

const cardFront = document.querySelector('#card-front');
const cardBack = document.querySelector('#card-back');
const flipCard = document.querySelector('.flip-card');
const backBtn = document.querySelector('#back');
const nextBtn = document.querySelector('#next');
const examBtn = document.querySelector('#exam');
const currentWord = document.querySelector('#current-word');
const shuffleWords = document.querySelector('#shuffle-words');
const examCards = document.querySelector('#exam-cards');
const wordsProgress = document.querySelector('#words-progress');
const examMode = document.querySelector('#exam-mode');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const timeTesting = document.querySelector('#time');
const studyCards = document.querySelector('.study-cards');
const studyMode = document.querySelector('#study-mode');
const templateWordStats = document.querySelector('#word-stats');
const resultsModal = document.querySelector('.results-modal');
const timerResults = document.querySelector('#timer');
const resultsContent = document.querySelector('.results-content');

class Cards {
    constructor(engWord, rusWord, example) {
        this.title = engWord;
        this.translation = rusWord;
        this.example = example;
        this.attempts = 1;
    }
};

const card1 = new Cards('snow', 'снег', 'Let it snow, let it snow, let it snow.');
const card2 = new Cards('infinity', 'бесконечность', 'I love you for infinity.');
const card3 = new Cards('desert', 'пустыня', 'Sweet desert rose, this desert flower.');
const card4 = new Cards('umbrella', 'зонт', 'You can stand under my umbrella.');
const card5 = new Cards('forever', 'навсегда', 'Let us die young or let us live forever.');

const arrCards = [card1, card2, card3, card4, card5];

let currentIndex = 0;
const testCards = [];

function prepareCard(item) {
    cardFront.querySelector('h1').textContent = item.title;
    cardBack.querySelector('h1').textContent = item.translation;
    cardBack.querySelector('span').textContent = item.example;
    wordsProgress.value = (currentIndex + 1) / arrCards.length * 100;
    currentWord.textContent = currentIndex + 1;
};

prepareCard(arrCards[currentIndex]);

flipCard.addEventListener('click', function() {
    flipCard.classList.toggle('active');
});

function deletingClass() {
    if (flipCard.classList.contains('active')) {
        flipCard.classList.remove('active')
    }
};

nextBtn.addEventListener('click', function() {
    currentIndex++;

    prepareCard(arrCards[currentIndex]);
    disabledBtn();
    deletingClass();
});

backBtn.addEventListener('click', function() {
    currentIndex--;

    prepareCard(arrCards[currentIndex]);
    disabledBtn();
    deletingClass();
});

function disabledBtn() {
    if (currentIndex === 0) {
        backBtn.disabled = true;
    } else {
        backBtn.disabled = false;
    }

    if (currentIndex === arrCards.length - 1) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }
};

function shuffleCards(arr) {
    return arr.sort(() => Math.random() - 0.5);
};

shuffleWords.addEventListener('click', function() {
    shuffleCards(arrCards);
    prepareCard(arrCards[currentIndex]);
});

let timeLeft = 0;
let timerId = null;

function addingZero(num) {
    if (num < 10) {
        return `0${num}`;
    } else {
        return num;
    }
};

function startTimer() {
    timerId = setInterval(() => {
        timeLeft++;

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        timeTesting.textContent = `${addingZero(minutes)}:${addingZero(seconds)}`;
    }, 1000);
};

examBtn.addEventListener('click', function() {
    studyMode.classList.add('hidden');
    studyCards.classList.add('hidden');
    examMode.classList.remove('hidden');

    createTestCards();
    startTimer();
});

function createTestCards() {
    arrCards.forEach((item) => {
        testCards.push(item.title, item.translation);
    });

    shuffleCards(testCards);

    const fragment = new DocumentFragment();

    testCards.forEach((item) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.textContent = item;

        fragment.append(cardElement);
    });

    examCards.append(fragment);
};

let firstClick = 0;
let selectedWord = null;
let wordInfo = null;
let clickCard = null;

examCards.addEventListener('click', (event) => {
    clickCard = event.target.closest('.card');

    if (clickCard.classList.contains('fade-out')) {
        return
    }

    firstClick++;

    if (firstClick === 1) {
        clickCard.classList.add('correct');
        selectedWord = clickCard;

        wordInfo = arrCards.find((item) => item.title === selectedWord.textContent || item.translation === selectedWord.textContent);
    } else {
        compareСards();
    }
});

function compareСards() {
    if (clickCard.textContent === wordInfo.title && clickCard !== selectedWord || clickCard.textContent === wordInfo.translation && clickCard !== selectedWord) {
        clickCard.classList.add('correct', 'fade-out');
        selectedWord.classList.add('fade-out');

        firstClick = 0;

        examProgress.value += (1 / arrCards.length) * 100;
        correctPercent.textContent = examProgress.value + '%';

        if (examProgress.value === 100) {
            clearInterval(timerId);

            setTimeout(() => {
                alert('Проверка знаний завершенна успешно!')
            }, 550)

            showStatistics();
        }
    } else {
        clickCard.classList.add('wrong');
        firstClick = 0;

        arrCards.forEach((item) => {
            if (item.title === selectedWord.textContent || item.translation === selectedWord.textContent) {
                item.attempts += 1;
            }
        });

        setTimeout(() => {
            clickCard.classList.remove('wrong');
            selectedWord.classList.remove('correct');
        }, 500)
    }
};

function showStatistics() {
    setTimeout(() => {
        clearInterval(timerId);
        examCards.classList.add('hidden');
        resultsModal.classList.remove("hidden");

        timerResults.textContent = timeTesting.textContent;

        arrCards.forEach((item) => {
            makeStatsByTemplate(item);
        });
    }, 550);
};

function makeStatsByTemplate(objWord) {
    const stats = templateWordStats.content.cloneNode(true);
    stats.querySelector('.word span').textContent = objWord.title;
    stats.querySelector('.attempts span').textContent = objWord.attempts;

    resultsContent.append(stats);
};