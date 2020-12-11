
module.exports = {
  ENV: "DEV",
  PORT: 3000,
  RATE_LIMITING: {
    max: 10, // Request count
    timeWindow: '1 minute',
    addHeaders: {
      'x-ratelimit-limit': false,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
      'retry-after': true
    }
  }
}
