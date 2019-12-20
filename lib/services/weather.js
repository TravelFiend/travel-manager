const superagent = require('superagent');

const getWoeid = (city) => {
    return superagent
        .get(`https://www.metaweather.com/api/location/search/?query=${city}`)
        .then(res => {
            const [{ woeid }] = res.body;
            return woeid;
        });
};

const getWeather = (woeid, year, month, day) => {
    return superagent
        .get(`https://www.metaweather.com/api/location/${woeid}/${year}/${month}/${day}`)
        .then(response => {
            return response.body[0];
        });
};

module.exports = { getWeather, getWoeid };
