let tasks = [];

export const JSONInit = (JSONConst) =>{
    try{
        tasks = JSON.parse(JSONConst);
        
        let index = 1;
        tasks.forEach(task =>{
            //Проверка наличия question
            if ('question' in task == false) throw new Error(`В задаче №${index} нет ключа "question"`);
            //Проверка, что вопрос не пустой
            if (task.question =="") throw new Error(`В задаче №${index} нет текста вопроса`);

            //Проверка количества ответов
            if (Object.keys(task).length !=6) throw new Error(`В задаче "${task.question}" должно быть 5 ответов`);

            let answers = Object.entries(task).filter(el => (el[0] != "question"));
            let trueCount = 0;
            answers.forEach(answer =>{
                //Наличие необходимых ключей в ответах
                if ('value' in answer[1] == false) throw new Error(`В ответе ${answer[0]} задачи "${task.question}" нет ключа "value"`);
                if ('result' in answer[1] == false) throw new Error(`В ответе ${answer[0]} задачи "${task.question}" нет ключа "result"`);
                //Проверка на непустые ответы
                if (answer[1].value =="") throw new Error(`В ответе ${answer[0]} задачи "${task.question}" нет текста (ключ "value")`);
                if (answer[1].result === true) trueCount++;
            });
            //Проверка что есть только 1 правильный ответ
            if (trueCount !=1) throw new Error(`В задаче "${task.question}" должен быть один правильный ответ ("result": true)`);
            
            index++;
        })
    }catch(anyException){

        let msg = anyException.message;
        switch (true){
            case (msg.includes('Unexpected string')):
                alert('Ошибка в синтаксисе JSON-файла');
                return false;
            default:
                alert(msg);
                return false;
        }
        
    }
    return true;
}

export let taskType = 'random';

export const getTask = () =>{
    if (tasks.length > 0){
        taskType = 'JSON';
        return taskFromJSON();
    }else{
        taskType = 'random';
        return taskFromRandom();
    };
}

const taskFromJSON = () =>{
    const taskNumber = randomIntNumber(tasks.length - 1);
    const task = tasks[taskNumber];
    tasks.splice(taskNumber, 1);
    return task;
};

const taskFromRandom = () =>{
    const rightAnswer = randomIntNumber(1000, 1);
    const operand = randomIntNumber(900, 1);
    const operand2 = rightAnswer - operand;

    const task = {};
    task.question = `${operand} + ${operand2} =`;
    task.answer1 = { result: true, value: `${rightAnswer}` };
    task.answer2 = { result: false, value: `${rightAnswer + 5}` };
    task.answer3 = { result: false, value: `${rightAnswer - 10}` };
    task.answer4 = { result: false, value: `${rightAnswer + 33}` };
    task.answer5 = { result: false, value: `${rightAnswer - 100}` };

    return task;
};

