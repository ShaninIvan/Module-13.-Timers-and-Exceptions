//Модуль работы с интерфейсом
const startScreen = document.querySelector('.screen-start');
const statusBar = document.querySelector('#gameStatusField');
const timerField = document.querySelector('#timerField');
const playersBar = document.querySelector('#playersBar');
const questionField = document.querySelector('#questionField');
const questionBlock = document.querySelector('#questionBlock');


//Показать начальный экран
export const startScreenShow = () =>{
    startScreen.classList.toggle('screen-start__show', true); 
};

//Скрыть начальный экран
export const startScreenHide = () =>{
    startScreen.classList.toggle('screen-start__show', false); 
};

//Изменение надписи в статус-баре
export const statusBarChange = (text) =>{
    statusBar.innerText = text;
};

//Перерисовка таймера
export const timerFieldRefresh = (time) =>{
    let sec = time % 60;
    let min = (time - sec) / 60;
    sec = (sec >= 10) ? sec : '0' + sec;
    min = (min >= 10) ? min : '0' + min;
    timerField.innerText = `${min}:${sec}`;

    //Декоративный эффект, цифры таймера краснеют при 10 sec и меньше
    if (time <= 10) {
        timerField.classList.toggle('timer-output_red', true);
    } else {
        timerField.classList.toggle('timer-output_red', false);
    };
};

//Мигание таймера зеленым цветом
export const timerGreenFlash = () =>{
    timerField.classList.toggle('timer-output_green', true);
    setTimeout(() => {
        timerField.classList.toggle('timer-output_green', false);
    }, 250);
};

//Мигание таймера оранжевым цветом
export const timerOrangeFlash = () =>{
    timerField.classList.toggle('timer-output_orange', true);
    setTimeout(() => {
        timerField.classList.toggle('timer-output_orange', false);
    }, 250);
};

//Перерисовка панели игроков
export const playersBarRefresh = (players) => {
    playersBar.innerHTML = "";
    players.forEach(el => {
        let newUl = document.createElement("ul");
        newUl.innerHTML += `${el.name}: `
        for (let i = 0; i < el.life; i++) {
            newUl.innerHTML += `<li></li>`
        }
        playersBar.append(newUl);
    })
};


//Тип вопроса и соответсвующие эффекты
export let questionType = 'normal';

export const randomQuestionType = () =>{
    questionField.classList.toggle('questions__header_gold', false);
    questionField.classList.toggle('questions__header_danger', false);
    questionType = 'normal';

    const special = randomIntNumber(100, 1);

    if (special > 97) {
        questionField.classList.toggle('questions__header_gold', true);
        questionType = 'gold';
    };

    if (special < 4) {
        questionField.classList.toggle('questions__header_danger', true);
        questionType = 'danger';
    };
};

//Изменение текста вопроса
export const questionFieldChange = (text) =>{
    questionField.innerText = text;
}

//Отрисовка текста вопроса и кнопок ответов
export const printQuestion = (task, clickFunction) => {

    //Размер шрифта вопроса скалируется от длины текста
    const question = task.question;
    let fSize = 18;

    switch (true) {
        case question.length > 60:
            fSize = 14;
            break;
        case question.length > 100:
            fSize = 10;
            break;
    }
    questionField.style.fontSize = `${fSize}px`;
    questionField.innerText = question;

    //перевод объекта в двумерный массив и избавление от question
    let answers = Object.entries(task).filter(el => (el[0] != "question"));

    answers = randomAnswers(answers);

    //Генерация кнопок с ответами
    for (let answer of answers) {

        const divAnswer = document.createElement('div');
        divAnswer.id = answer[0];
        divAnswer.className = 'questions__answer';
        divAnswer.innerText = answer[1].value;

        questionBlock.append(divAnswer);

        divAnswer.addEventListener('click', () => clickFunction(answer[1].result));
    };
};

//удаление кнопок с ответами
export const clearAnswers = () =>{
    [...document.querySelectorAll('.questions__answer')].forEach(node => {
        node.remove();
    });
};