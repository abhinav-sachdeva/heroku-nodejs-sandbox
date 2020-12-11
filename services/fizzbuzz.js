exports.getFizzBuzz = function (num) {
    const respLimit = 100;
    if (num > respLimit) num = respLimit;
    log.info(`Trim input to ${respLimit}. Original input:${num}`);

    const result = []
    for (let i = 1; i <= num; i++) {
        let elem = '';
        if (i % 3 === 0) elem += 'fizz';
        if (i % 5 === 0) elem += 'buzz';
        result.push(elem || i)
    }
    return result;
}