const superagent = require('superagent');

const getWeather = (city, year, month, day) => {
    return superagent
        .get(`/api/location/search/?query=${city}`)
        .then(res => {
            const [{ woeid }] = res.body;

            return woeid;
        })
        .then(woeid => {
            .get(`/api/location/${woeid}/${year}/${month}/${day}`)
            .then(response => {
                
            })
        })
};

module.exports = getWeather;
