const getWeather = require('../services/weather');

module.exports = (req, res, next) => {
    const { eventCity, year, month, day } = req.body;
    getWeather(eventCity, year, month, day)
        .then(body => {
            req.body = body;
        });

    next();
};
