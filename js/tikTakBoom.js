// TODO Расширить список вопросов в tikTakBoomTasks.js
// TODO Перед ходом игрока делать задержку 3 секунды и ее отображение в gameStatusField
// TODO В случае верного ответа добавлять к таймеру 5 секунд, иначе - отнимать
// TODO Если игрок дает 3 неверных ответа - он выбывает из игры. Если выбыли все - бомба взрывается
// TODO Побеждает игрок с меньшим количеством ошибок. При равном количестве - пенальти: 5 секунд на ответ и 1 попытка
// TODO Рандомизировать количество (от 2 до 5) и порядок ответов
// TODO Реализовать "вопрос на миллион" - ситуацию, когда ответ на вопрос сразу дает победу. Добавить визуальный эффект к такому вопросу.
// TODO Реализовать "вопрос-восьмерку"
// TODO У каждого игрока таймер бомбы должен идти отдельно

tikTakBoom = {
    init(
        tasks,
        timerField,
        gameStatusField,
        textFieldQuestion,
        textFieldAnswer1,
        textFieldAnswer2,
        textFieldAnswer3,
        textFieldAnswer4,
        textFieldAnswer5
    ) {
        this.boomTimer = 15;
        this.countOfPlayers = 2;
        this.tasks = JSON.parse(tasks);

        this.startGame = startGame;
        this.stopGame = stopGame;
        this.timerField = timerField;
        this.gameStatusField = gameStatusField;
        this.textFieldQuestion = textFieldQuestion;
        this.textFieldAnswer1 = textFieldAnswer1;
        this.textFieldAnswer2 = textFieldAnswer2;
        this.textFieldAnswer3 = textFieldAnswer3;
        this.textFieldAnswer4 = textFieldAnswer4;
        this.textFieldAnswer5 = textFieldAnswer5;

        this.screenFinish = screenFinish;
        this.textFinish = textFinish;

        this.buttonReplay = buttonReplay;
        
        this.needRightAnswers = 3;
    },

    
    run() {
        this.state = 1;

        this.rightAnswers = 0;

        this.turnOn();

        this.timer();
    },

    turnOn() {
        this.gameStatusField.innerText += ` Вопрос игроку №${this.state}`;

        const taskNumber = randomIntNumber(this.tasks.length - 1);
        this.printQuestion(this.tasks[taskNumber]);

        this.tasks.splice(taskNumber, 1);

        this.state = (this.state === this.countOfPlayers) ? 1 : this.state + 1;
    },

    turnOff(value) {
        if (this.currentTask[value].result) {
            this.gameStatusField.innerText = 'Верно!';
            this.rightAnswers += 1;
        } else {
            this.gameStatusField.innerText = 'Неверно!';
        }
        if (this.rightAnswers < this.needRightAnswers) {
            if (this.tasks.length === 0) {
                this.finish('lose');
            } else {
                this.turnOn();
            }
        } else {
            this.finish('won');
        }

        this.textFieldAnswer1.removeEventListener('click', answer1);
        this.textFieldAnswer2.removeEventListener('click', answer2);
    },

    printQuestion(task) {
        this.textFieldQuestion.innerText = task.question;
        this.textFieldAnswer1.innerText = task.answer1.value;
        this.textFieldAnswer2.innerText = task.answer2.value;

        this.textFieldAnswer1.addEventListener('click', answer1 = () => this.turnOff('answer1'));
        this.textFieldAnswer2.addEventListener('click', answer2 = () => this.turnOff('answer2'));

        this.stopGame.addEventListener('click', () => this.finish());

        this.currentTask = task;
    },

    

    finish(result = 'lose') {
        this.state = 0;
        if (result === 'lose') {
            this.screenFinish.classList.add('screen-finish__lose_show');
            this.textFinish.classList.add('text__lose_show');
            const boomSound = new Audio('./sound/Boom.mp3');
            boomSound.play();
        }
        if (result === 'won') {
            this.screenFinish.classList.add('screen-finish__win_show');
            this.textFinish.classList.add('text__win_show');
            const winSound = new Audio('./sound/Win.mp3');
            winSound.play();
        }

        setTimeout(() => {
            this.buttonReplay.classList.add('show');
            this.textFieldQuestion.innerText = ``;
            this.textFieldAnswer1.innerText = ``;
            this.textFieldAnswer2.innerText = ``;
        }, 6000);



        console.log(this);
    },

    timer() {
        if (this.state) {
            this.boomTimer -= 1;
            let sec = this.boomTimer % 60;
            let min = (this.boomTimer - sec) / 60;
            sec = (sec >= 10) ? sec : '0' + sec;
            min = (min >= 10) ? min : '0' + min;
            this.timerField.innerText = `${min}:${sec}`;

            if (this.boomTimer <=10){
                this.timerField.classList.toggle('timer-output_red', true);
            }

            if (this.boomTimer > 0) {
                setTimeout(
                    () => {
                        this.timer()
                    },
                    1000,
                )
            } else {
                this.finish('lose');
            }
        }
    },
}
