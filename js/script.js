import * as UI from './UI.js';
import {game} from './game.js';

const settings = window.localStorage;
const inpRadio = document.querySelectorAll('input[type="radio"');

window.onload = function()
{   
    //Загрузка настроек
    [...inpRadio].forEach(el =>{
        const key = el.name+el.value;
        el.checked = (settings.getItem(key) == "false") ? false : true;
    });
    
    UI.startScreenShow();
};

// TODO перед стартом игры проверять JSON-файл на корректность
//Старт игры
document.querySelector('#startGame').addEventListener('click', () =>{
       
    game.init();

    let playersCount;
    let timer;

    //Применение настроек к игре
    [...inpRadio].forEach(el =>{
        if ((el.name == "player") && (el.checked == true)){playersCount = parseInt(el.value)}
        if ((el.name == "timer") && (el.checked == true)){timer = parseInt(el.value)}
    });

    const players = game.players;
    for (let i=1; i<=playersCount; i++){
        const player = {
            name: `Player ${i}`,
            life: 3,
            timer: timer
        }
        players.push(player);
    }

    game.run();
    UI.startScreenHide();
});

//Прерывание игры
stopGame.addEventListener('click', () => game.finish());

//Автосохранения настроек
window.addEventListener('unload', () =>{
    settings.clear;
    [...inpRadio].forEach(el =>{
        const key = el.name+el.value;
        settings.setItem(key, el.checked);
    });
})

//Перезагрузка страницы
document.querySelector('#buttonReplay').addEventListener('click', () =>{
    document.location.reload();
});