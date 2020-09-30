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
    init() {

        this.tasks = JSON.parse(tasks);

        this.playersBar = playersBar;
        this.players = [];

        this.startGame = startGame;
        this.timerField = timerField;
        this.gameStatusField = gameStatusField;
        this.textFieldQuestion = questionField;
        this.textFieldAnswer1 = answer1;
        this.textFieldAnswer2 = answer2;
        this.textFieldAnswer3 = answer3;
        this.textFieldAnswer4 = answer4;
        this.textFieldAnswer5 = answer5;

        this.screenFinish = screenFinish;
        this.textFinish = textFinish;

        this.buttonReplay = buttonReplay;

        this.boomSound = new Audio('../sound/Boom.mp3');
        this.winSound = new Audio('../sound/Win.mp3');
        this.timerSound = new Audio('../sound/Timer.mp3')
        
        
        this.needRightAnswers = 3;
    },

    //Перерисовка панели игроков в соответствии с их состоянием
    playersBarRefresh(){
        this.playersBar.innerHTML = "";
        this.players.forEach(el =>{
            let newUl = document.createElement("ul");
            newUl.innerHTML += `${el.name}: `
            for (let i = 0; i<el.life; i++){
                newUl.innerHTML += `<li></li>`
            }
            this.playersBar.append(newUl);
        })
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

    //принимает упорядоченные ответы на входе и возвращает от 2 до 5 перемешанных ответов. Правильный ответ есть всегда.
    randomAnswers(answers){
        let result = [];
        while (answers.length>0){
            const index = randomIntNumber(answers.length-1, 0);
            result.push(answers[index]);
            answers.splice(index, 1);
        }
        const answersCount = randomIntNumber(5, 2);
        console.log(answersCount);
        while (result.length>answersCount){
            const index = randomIntNumber(result.length-1, 0);
            if (result[index][1].result === true){continue};

            result.splice(index, 1);
        }
        return result;
    },

    printQuestion(task) {
        const question = task.question;
        
        //перевод объекта в двумерный массив и избавление от question
        let answers = Object.entries(task).filter(el => (el[0]!="question"));

        answers = randomAnswers(answers);

        console.log(answers);
        // this.textFieldAnswer1.addEventListener('click', answer1 = () => this.turnOff('answer1'));
        // this.textFieldAnswer2.addEventListener('click', answer2 = () => this.turnOff('answer2'));

        

        this.currentTask = task;
    },

    

    finish(result = 'lose') {
        this.state = 0;
        this.timerSound.pause();
        if (result === 'lose') {
            this.screenFinish.classList.add('screen-finish__lose_show');
            this.textFinish.classList.add('text__lose_show');
            this.boomSound.play();
        }
        if (result === 'won') {
            this.screenFinish.classList.add('screen-finish__win_show');
            this.textFinish.classList.add('text__win_show');
            this.winSound.play();
        }

        setTimeout(() => {
            this.buttonReplay.classList.add('show');
            this.textFieldQuestion.innerText = ``;
            this.textFieldAnswer1.innerText = ``;
            this.textFieldAnswer2.innerText = ``;
        }, 6000);


    },

    timer() {
        if (this.state) {
            this.timerSound.play();
            this.boomTimer -= 1;
            let sec = this.boomTimer % 60;
            let min = (this.boomTimer - sec) / 60;
            sec = (sec >= 10) ? sec : '0' + sec;
            min = (min >= 10) ? min : '0' + min;
            this.timerField.innerText = `${min}:${sec}`;

            //Декоративный эффект, цифры таймера краснеют при 10 sec и меньше
            if (this.boomTimer <=10){
                this.timerField.classList.toggle('timer-output_red', true);
            }else{
                this.timerField.classList.toggle('timer-output_red', false);
            };

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
        }else{
            this.timerSound.pause();
        }
    },
}
