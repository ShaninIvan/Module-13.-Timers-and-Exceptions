const settings = window.localStorage;
const inpRadio = document.querySelectorAll('input[type="radio"');

window.onload = function()
{   
    //Загрузка настроек
    [...inpRadio].forEach(el =>{
        const key = el.name+el.value;
        el.checked = (settings.getItem(key) == "false") ? false : true;
    });
    
    tikTakBoom.init();
    document.querySelector('.screen-start').classList.add('screen-start__show');
 
};

// TODO перед стартом игры проверять JSON-файл на корректность
//Старт игры
document.querySelector('#startGame').addEventListener('click', () =>{
    document.querySelector('.screen-start').classList.remove('screen-start__show');    
    
    let playersCount;
    let timer;

    //Применение настроек к игре
    [...inpRadio].forEach(el =>{
        if ((el.name == "player") && (el.checked == true)){playersCount = parseInt(el.value)}
        if ((el.name == "timer") && (el.checked == true)){timer = parseInt(el.value)}
    });

    tikTakBoom.countOfPlayers = playersCount;
    tikTakBoom.boomTimer = timer;

    const players = tikTakBoom.players;
    for (let i=1; i<=playersCount; i++){
        const player = {
            name: `Player ${i}`,
            life: 3,
            timer: timer
        }
        players.push(player);
    }
    tikTakBoom.playersBarRefresh();
    tikTakBoom.run();
});

//Прерывание игры
stopGame.addEventListener('click', () => tikTakBoom.finish());

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