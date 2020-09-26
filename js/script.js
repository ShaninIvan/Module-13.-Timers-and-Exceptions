window.onload = function()
{   
    // TODO дописать элементы в init как тут, так и в tikTakBoom.js
    tikTakBoom.init(
        tasks,
        document.querySelector('#timerField'),
        document.querySelector('#gameStatusField'),
        document.querySelector('#questionField'),
        document.querySelector('#answer1'),
        document.querySelector('#answer2'),
        document.querySelector('#answer3'),
        document.querySelector('#answer4'),
        document.querySelector('#answer5'),
    )
    document.querySelector('.screen-start').classList.add('screen-start__show');
    // TODO перед стартом игры проверять JSON-файл на корректность
    document.querySelector('#startGame').addEventListener('click', () =>{
        document.querySelector('.screen-start').classList.remove('screen-start__show');    
        tikTakBoom.run();
    });
}
