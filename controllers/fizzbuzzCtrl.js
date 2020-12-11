const createError = require("http-errors");

const fizzbuzz = require("../services/fizzbuzz");

exports.getData = async function (req, res) {
  const num = parseInt(req.params.num);
  if (isNaN(num)) {
    log.error(`NaN as input:${num}`)
    res.send(createError(400, 'Invalid args.'))
  }
  else {
    res.send(fizzbuzz.getFizzBuzz(num))
  }
}
