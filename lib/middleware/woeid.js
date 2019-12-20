const { getWoeid } = require('../services/weather');

module.exports = (req, res, next) => {
    getWoeid(req.body.eventCity)
        .then(woeid => {
            req.woeid = woeid;
            next();
        })
        .catch(next);
};
