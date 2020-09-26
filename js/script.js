window.onload = function()
{
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
}
