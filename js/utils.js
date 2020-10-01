const randomIntNumber = (max = 1, min = 0) => Math.floor(Math.random() * (max - min + 1) + min);

//принимает упорядоченные ответы на входе и возвращает от 2 до 5 перемешанных ответов. Правильный ответ есть всегда.
const randomAnswers = (answers) => {
    let result = [];
    while (answers.length > 0) {
        const index = randomIntNumber(answers.length - 1, 0);
        result.push(answers[index]);
        answers.splice(index, 1);
    }

    const answersCount = randomIntNumber(5, 2);

    while (result.length > answersCount) {
        const index = randomIntNumber(result.length - 1, 0);
        if (result[index][1].result === true) { continue };

        result.splice(index, 1);
    }
    return result;
}