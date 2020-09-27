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
document.querySelector('#startGame').addEventListener('click', () =>{
    document.querySelector('.screen-start').classList.remove('screen-start__show');    
    
    let players;
    let timer;

    [...inpRadio].forEach(el =>{
        if ((el.name == "player") && (el.checked == true)){players = parseInt(el.value)}
        if ((el.name == "timer") && (el.checked == true)){timer = parseInt(el.value)}
    });

    tikTakBoom.countOfPlayers = players;
    tikTakBoom.boomTimer = timer;
    tikTakBoom.run();
});

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
    window.location.reload();
});