import * as UI from './UI.js';
import * as taskGen from './taskGen.js';

export const game = {
    
    init() {

        this.players = [];
    },

    run() {
        this.playerName = this.players[0].name;
        this.playerLife = this.players[0].life;
        this.boomTimer = this.players[0].timer;

        this.penaltyStatus = 0;

        this.waiting(3);

        UI.playersBarRefresh(this.players);
    },

    waiting(wait) {
        UI.statusBarChange(`${this.playerName}, твой вопрос через: ${wait}...`)
        setTimeout(() => {
            if (wait == 1) { UI.timerFieldRefresh(this.boomTimer) };
            if (wait > 0) {
                this.waiting(wait -= 1);
            } else {
                this.timerON = 1
                this.timer();
                this.turnOn();
            };
        }, 1000);
    },

    turnOn() {
        UI.statusBarChange(` Вопрос к ${this.playerName}`);

        const task = taskGen.getTask();

        UI.randomQuestionType();
        UI.printQuestion(task);
    },

    whoNext(playerName) {
        //ищется имя игрока, который должен быть следующим
        const index = this.players.findIndex(el => el.name == playerName);
        let nextIndex = (index < this.players.length - 1) ? index + 1 : 0;
        const nextName = this.players[nextIndex].name;

        //Обновление параметров текущего игрока, удаление "мертвых"
        this.players[index].life = this.playerLife;
        this.players[index].timer = this.boomTimer;
        this.players = this.players.filter(player => (player.life > 0));
        
        //после отсева "мертвых", обновляется индекс следующего игрока
        nextIndex = this.players.findIndex(el => el.name == nextName);

        //если игрок остался один
        if (this.players.length == 1){nextIndex = 0};

        //Вызываются параметры следующего игрока
        this.playerName = this.players[nextIndex].name;
        this.playerLife = this.players[nextIndex].life;
        this.boomTimer = this.players[nextIndex].timer;
    },

    turnOff(value) {
        this.timerON = 0;
        UI.clearAnswers();

        if (value) {
            UI.questionFieldChange('Верно!');
            //Если вопрос был "золотым", текущий игрок сразу побеждает
            if (UI.questionType == 'gold') {
                this.finish('won', this.playerName);
                return false;
            };
            //Отдельная инструкция для победы в режиме пенальти
            if ((this.players.length == 1)) {
                this.finish('won', this.players[0].name);
                return false;
            };
            //При верном ответе добавляется 5 секунд
            UI.sound.correct();
            UI.timerGreenFlash();
            this.boomTimer += 5;

        } else {
            //Если вопрос был "опасным", бомба взрывается для всех
            if (UI.questionType == 'danger') {
                this.finish();
                return false;
            };
            
            //При неправильном ответе отнимается 5 секунд и отбирается одна жизнь. Если режим пенальти, то отбираются все жизни.
            if (taskGen.taskType =='JSON'){
                this.playerLife -= 1;
            }else{
                this.playerLife = 0;
            };

            UI.timerOrangeFlash();
            if (this.boomTimer > 5) {
                UI.questionFieldChange('Неверно!');
                this.boomTimer -= 5
                UI.sound.error();
            } else {
                UI.questionFieldChange(`Время ${this.playerName} закончилось!`);
                this.boomTimer = 0;
                this.playerLife = 0;
                UI.sound.boom();
            };

            if ((this.players.length == 1) && (this.playerLife == 0)) {
                this.finish();
                return false;
            };

        };

        this.whoNext(this.playerName);

        if (taskGen.taskType == 'random'){
            this.penalty();
        }

        UI.timerFieldRefresh(this.boomTimer);

        

        UI.playersBarRefresh(this.players);

        if (this.players.length == 0) {
            this.finish('lose');
            return false;
        };

        this.waiting(3);

    },

    penalty(){
        if (this.penaltyStatus == 1) return false;

        UI.questionFieldChange('ПЕНАЛЬТИ! Остаются только игроки с наибольшим количеством жизней!');

        let lifes = [];
        this.players.forEach(player => lifes.push(player.life));
        this.players = this.players.filter(player => player.life == Math.max(...lifes));
        UI.playersBarRefresh;

        this.playerName = this.players[0].name;
        this.playerLife = this.players[0].life;
        this.boomTimer = this.players[0].timer;

        this.penaltyStatus = 1;
    },

    finish(result = 'lose', playerName) {
        this.timerON = 0;
        if (result === 'lose') {
            UI.finishScreenLose();
            UI.sound.boom();
        }
        if (result === 'won') {
            UI.finishScreenWin(playerName);
            UI.sound.win();
        }
    },

    timer() {
        if (this.timerON === 1) {

            this.boomTimer -= 1;

            UI.timerFieldRefresh(this.boomTimer);

            if (this.players.length > 0) {
                setTimeout(
                    () => {
                        UI.sound.tick();
                        this.timer()
                    },
                    1000,
                )
            }
            if (this.boomTimer <= 0) {
                this.playerLife = 0;
                this.turnOff(false);
            }
        }
    },
};
