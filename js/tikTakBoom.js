// TODO Расширить список вопросов в tikTakBoomTasks.js
// TODO Побеждает игрок с меньшим количеством ошибок. При равном количестве - пенальти: 5 секунд на ответ и 1 попытка


tikTakBoom = {
    init() {

        this.tasks = JSON.parse(tasks);

        this.playersBar = playersBar;
        this.players = [];
        this.questionType = 'normal';

        this.startGame = startGame;
        this.timerField = timerField;
        this.gameStatusField = gameStatusField;
        this.questionBlock = questionBlock;
        this.textFieldQuestion = questionField;

        this.screenFinish = screenFinish;
        this.textFinish = textFinish;

        this.buttonReplay = buttonReplay;

        this.boomSound = new Audio('../sound/Boom.mp3');
        this.winSound = new Audio('../sound/Win.mp3');
        this.timerSound = new Audio('../sound/Timer.mp3');
        this.correctSound = new Audio('../sound/Correct.mp3');
        this.ErrorSound = new Audio('../sound/Error.mp3');

    },

    //Перерисовка панели игроков в соответствии с их состоянием
    playersBarRefresh() {
        this.playersBar.innerHTML = "";
        this.players.forEach(el => {
            let newUl = document.createElement("ul");
            newUl.innerHTML += `${el.name}: `
            for (let i = 0; i < el.life; i++) {
                newUl.innerHTML += `<li></li>`
            }
            this.playersBar.append(newUl);
        })
    },

    run() {
        this.timerON = 1;
        this.activePlayer = 0;

        this.playerName = this.players[this.activePlayer].name;
        this.playerLife = this.players[this.activePlayer].life;
        this.boomTimer = this.players[this.activePlayer].timer;

        this.turnOn();
        this.playersBarRefresh();
        this.timer();
    },

    
    waiting(wait){
        this.gameStatusField.innerText = `${this.playerName}, твой вопрос через: ${wait}...`
        setTimeout(() => {
            if (wait ==1){this.updateTimer()};
            if (wait>0){
                this.waiting(wait-=1);
            }else{
                this.timerON = 1
                this.timer();
                this.turnOn();
            };
        }, 1000);  
    },

    //может вызвать "золотой вопрос" или "опасный вопрос", каждый с шансом 5%
    specialQuestion(){
        this.textFieldQuestion.classList.toggle('questions__header_gold', false);
        this.textFieldQuestion.classList.toggle('questions__header_danger', false);
        this.questionType = 'normal';

        const special = randomIntNumber(100, 1);

        if (special>95){
            this.textFieldQuestion.classList.toggle('questions__header_gold', true);
            this.questionType = 'gold';
        }

        if (special<6){
            this.textFieldQuestion.classList.toggle('questions__header_danger', true);
            this.questionType = 'danger';
        }

    },

    turnOn() {
        this.gameStatusField.innerText = ` Вопрос к ${this.playerName}`;

        this.specialQuestion();
        const taskNumber = randomIntNumber(this.tasks.length - 1);
        this.printQuestion(this.tasks[taskNumber]);

        this.tasks.splice(taskNumber, 1);

    },

    whoNext(playerName){
        
        const index = this.players.findIndex(el =>el.name == playerName);
        const nextIndex = (index < this.players.length-1) ? index+1 : 0;

        //Обновление параметров текущего игрока, удаление "мертвых"
        this.players[index].life = this.playerLife;
        this.players[index].timer = this.boomTimer;

        //Вызываются параметры следующего игрока
        this.playerName = this.players[nextIndex].name;
        this.playerLife = this.players[nextIndex].life;
        this.boomTimer = this.players[nextIndex].timer;
    },

    whoWin(){

    },

    turnOff(value) {
        if (value) {
            this.textFieldQuestion.innerText = 'Верно!';
            //Если вопрос был "золотым", текущий игрок сразу побеждает
            if (this.questionType == 'gold'){
                this.finish('won', this.playerName);
                return false;
            }
            //При верном ответе добавляется 5 секунд
            this.correctSound.play();
            this.boomTimer += 5;
            this.timerField.classList.toggle('timer-output_green', true);
            setTimeout(() => {
                this.timerField.classList.toggle('timer-output_green', false);
            }, 250);
        
        } else {
            //Если вопрос был "опасным", бомба взрывается для всех
            if (this.questionType == 'danger'){
                this.finish();
                return false;
            }
            
            //При неправильном ответе отнимается 5 секунд
            this.ErrorSound.play();
            if (this.boomTimer>5){
                this.textFieldQuestion.innerText = 'Неверно!';
                this.boomTimer -= 5
            }else{
                this.textFieldQuestion.innerText = `Время ${this.playerName} закончилось!`;
                this.boomTimer = 0;
                this.playerLife = 0;
            }
            this.timerField.classList.toggle('timer-output_orange', true);
            setTimeout(() => {
                this.timerField.classList.toggle('timer-output_orange', false);
            }, 250);
            //и отбирается одна жизнь
            this.playerLife -=1;
        }
        this.updateTimer();

        this.whoNext(this.playerName);   

        //Игроки с 0 жизни выбывают
        this.players = this.players.filter(player => (player.life > 0));
        
        this.playersBarRefresh();

        if (this.players.length == 0){
            this.finish('lose');
            return false;
        };

        if (this.tasks.length === 0) {
            this.whoWin();
        }else {
            //кнопки с ответами удаляются со страницы
            [...document.querySelectorAll('.questions__answer')].forEach(node => {
                node.remove();
            });
            
            this.timerON = 0;
            this.waiting(3); 
        };
            
    },

    //принимает упорядоченные ответы на входе и возвращает от 2 до 5 перемешанных ответов. Правильный ответ есть всегда.
    randomAnswers(answers) {
        let result = [];
        while (answers.length > 0) {
            const index = randomIntNumber(answers.length - 1, 0);
            result.push(answers[index]);
            answers.splice(index, 1);
        }

        const answersCount = randomIntNumber(5, 2);

        while (result.length > answersCount) {
            const index = randomIntNumber(result.length - 1, 0);
            if (result[index][1].result === true) { continue };

            result.splice(index, 1);
        }
        return result;
    },

    printQuestion(task) {
        //Размер шрифта вопроса скалируется от длины текста
        const question = task.question
        let fSize = 18;

        switch (true){
            case question.length > 60:
                fSize = 14;
                break;
            case question.length > 100:
                fSize = 10;
                break;
        }
        this.textFieldQuestion.style.fontSize = `${fSize}px`;
        this.textFieldQuestion.innerText = question;

        //перевод объекта в двумерный массив и избавление от question
        let answers = Object.entries(task).filter(el => (el[0] != "question"));

        answers = this.randomAnswers(answers);

        //Генерация кнопок с ответами
        for (let answer of answers) {

            const divAnswer = document.createElement('div');
            divAnswer.id = answer[0];
            divAnswer.className = 'questions__answer';
            divAnswer.innerText = answer[1].value;

            this.questionBlock.append(divAnswer);
            divAnswer.addEventListener('click', () => this.turnOff(answer[1].result));
        };

    },


    finish(result = 'lose', playerName) {
        this.timerON = 0;
        this.timerSound.pause();
        if (result === 'lose') {
            this.screenFinish.classList.add('screen-finish__lose_show');
            this.textFinish.classList.add('text__lose_show');
            this.boomSound.play();
        }
        if (result === 'won') {
            this.textFinish.innerText = `${playerName}, `;
            this.screenFinish.classList.add('screen-finish__win_show');
            this.textFinish.classList.add('text__win_show');
            this.winSound.play();
        }

        setTimeout(() => {
            this.buttonReplay.classList.add('show');
            this.textFieldQuestion.innerText = ``;
        }, 6000);


    },

    updateTimer(){
        let sec = this.boomTimer % 60;
        let min = (this.boomTimer - sec) / 60;
        sec = (sec >= 10) ? sec : '0' + sec;
        min = (min >= 10) ? min : '0' + min;
        this.timerField.innerText = `${min}:${sec}`;

        //Декоративный эффект, цифры таймера краснеют при 10 sec и меньше
        if (this.boomTimer <= 10) {
            this.timerField.classList.toggle('timer-output_red', true);
        } else {
            this.timerField.classList.toggle('timer-output_red', false);
        };
    },

    timer() {
        if (this.timerON ==1) {

            this.boomTimer -= 1;

            this.updateTimer();

            if (this.players.length > 0) {
                setTimeout(
                    () => {
                        this.timerSound.play();
                        this.timer()
                    },
                    1000,
                )
            } 
            if (this.boomTimer<=0){
                this.playerLife = 0;
                this.turnOff(false);
            }
        } else {
        }
    },
}
