let tasks = [];

export const JSONInit = (JSONConst) =>{
    tasks = JSON.parse(JSONConst);
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

