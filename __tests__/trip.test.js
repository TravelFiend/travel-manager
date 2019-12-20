require('dotenv').config();
const app = require('../lib/app');
const superagent = require('superagent');
const connect = require('../lib/utils/connect');
const request = require('supertest');
const mongoose = require('mongoose');
const { getWeather, getWoeid } = require('../lib/services/weather');
const Trip = require('../lib/models/Trip');
const Itineraries = require('../lib/models/Itineraries');

describe('Trip routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('should create a new trip', () => {
        return request(app)
            .post('/api/v1/trip')
            .send({
                departDate: new Date('January 1, 2020'),
                returnDate: new Date('February 4, 2020'),
                departCity: 'Portland',
                arriveCity: 'Hamburg',
                returnFromCity: 'Prague',
                returnToCity: 'Portland'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    departDate: expect.any(String),
                    returnDate: expect.any(String),
                    departCity: 'Portland',
                    arriveCity: 'Hamburg',
                    returnFromCity: 'Prague',
                    returnToCity: 'Portland',
                    __v: 0
                });
            });
    });

    it('should get a full list of trips', async() => {
        const trips = await Trip.create([
            {
                departDate: new Date('January 1, 2020'),
                returnDate: new Date('February 4, 2020'),
                departCity: 'Portland',
                arriveCity: 'Hamburg',
                returnFromCity: 'Prague',
                returnToCity: 'Portland'
            },
            {
                departDate: new Date('April 19, 2020'),
                returnDate: new Date('October 4, 2020'),
                departCity: 'Cleveland',
                arriveCity: 'Phuket',
                returnFromCity: 'Bangkok',
                returnToCity: 'Cleveland'
            },
            {
                departDate: new Date('July 24, 2020'),
                returnDate: new Date('August 30, 2020'),
                departCity: 'Denver',
                arriveCity: 'Miami',
                returnFromCity: 'Orlando',
                returnToCity: 'Denver'
            }
        ]);

        return request(app)
            .get('/api/v1/trip')
            .then(res => {
                trips.forEach(trip => {
                    expect(res.body).toContainEqual({
                        _id: expect.any(String),
                        departDate: expect.any(String),
                        returnDate: expect.any(String),
                        departCity: trip.departCity,
                        arriveCity: trip.arriveCity,
                        returnFromCity: trip.returnFromCity,
                        returnToCity: trip.returnToCity,
                        __v: 0
                    });
                });
            });
    });

    it('should get a single trip by id', async() => {
        const trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 4, 2020'),
            departCity: 'Portland',
            arriveCity: 'Hamburg',
            returnFromCity: 'Prague',
            returnToCity: 'Portland'
        });
        
        const itinerary = await Itineraries.create(
            {
                tripId: trip._id,
                event: 'Mountain biking',
                eventDate: new Date('January 10, 2020'),
                eventCity: 'Hamburg',
                eventDaysDuration: 3,
                woeid: 2475687
            }
        );
        return request(app)
            .get(`/api/v1/trip/${trip._id}`)
            .then(res => {
                expect(res.body).toMatchObject({
                    _id: expect.any(String),
                    departDate: expect.any(String),
                    returnDate: expect.any(String),
                    departCity: 'Portland',
                    arriveCity: 'Hamburg',
                    returnFromCity: 'Prague',
                    returnToCity: 'Portland',
                    itineraries: [JSON.parse(JSON.stringify(itinerary))],
                    __v: 0
                });
            });
    });

    it('should update a trip by id', async() => {
        const trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 4, 2020'),
            departCity: 'Portland',
            arriveCity: 'Hamburg',
            returnFromCity: 'Prague',
            returnToCity: 'Portland'
        });

        return request(app)
            .patch(`/api/v1/trip/${trip._id}`)
            .send({ returnToCity: 'Denver' })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    departDate: expect.any(String),
                    returnDate: expect.any(String),
                    departCity: 'Portland',
                    arriveCity: 'Hamburg',
                    returnFromCity: 'Prague',
                    returnToCity: 'Denver',
                    __v: 0
                });
            });
    });

    it('should delete a trip by id', async() => {
        const trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 4, 2020'),
            departCity: 'Portland',
            arriveCity: 'Hamburg',
            returnFromCity: 'Prague',
            returnToCity: 'Portland'
        });
        return request(app)
            .delete(`/api/v1/trip/${trip._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    departDate: expect.any(String),
                    returnDate: expect.any(String),
                    departCity: 'Portland',
                    arriveCity: 'Hamburg',
                    returnFromCity: 'Prague',
                    returnToCity: 'Portland',
                    __v: 0
                });
                return Itineraries.find();
            })
            .then(itineraries => {
                expect(itineraries).toHaveLength(0);
            });
    });

    it('can get a woeid for a city', () => {
        return getWoeid('Portland')
            .then(res => {
                expect(res).toEqual(2475687);
            });
    });

    it('can get weather using woeid and date', () => {
        const date = new Date('February 21, 2019');
        const woeid = 2475687;
        return superagent
            .get(`metaweather.com/api/location/${woeid}/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`)
            .then(res => {
                expect(res.body[0]).toEqual({
                    id: 4779895051780096,
                    weather_state_name: 'Heavy Cloud',
                    weather_state_abbr: 'hc',
                    wind_direction_compass: 'NNE',
                    created: '2019-02-22T08:30:34.546252Z',
                    applicable_date: '2019-02-21',
                    min_temp: -1.9900000000000002,
                    max_temp: 8.6,
                    the_temp: 7.195,
                    wind_speed: 4.351856345101937,
                    wind_direction: 30.99303878738074,
                    air_pressure: 1018.31,
                    humidity: 71,
                    visibility: 6.904055316949018,
                    predictability: 71
                });
            });
    });

    it('returns weather body', () => {
        getWeather(2475687, 2017, 10, 4)
            .then(res => {
                expect(res).toEqual({
                    id: 4779895051780096,
                    weather_state_name: 'Heavy Cloud',
                    weather_state_abbr: 'hc',
                    wind_direction_compass: 'NNE',
                    created: '2019-02-22T08:30:34.546252Z',
                    applicable_date: '2019-02-21',
                    min_temp: -1.9900000000000002,
                    max_temp: 8.6,
                    the_temp: 7.195,
                    wind_speed: 4.351856345101937,
                    wind_direction: 30.99303878738074,
                    air_pressure: 1018.31,
                    humidity: 71,
                    visibility: 6.904055316949018,
                    predictability: 71
                });
            });
    });

    it('creates an itinerary item', async() => {
        const trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 4, 2020'),
            departCity: 'Portland',
            arriveCity: 'Hamburg',
            returnFromCity: 'Prague',
            returnToCity: 'Portland'
        });
        
        return request(app)
            .post(`/api/v1/trip/${trip._id}/day-plan`)
            .send({
                tripId: trip._id,
                event: 'Snowboard the Alps',
                eventDate: new Date('January 2, 2020'),
                eventCity: 'Prague',
                eventDaysDuration: 2,
                woeid: 2475687
            })
            .then(res => {
                expect(res.body.itineraries).toEqual([{
                    '__v': 0,
                    '_id': expect.any(String),
                    'event': 'Snowboard the Alps',
                    'eventCity': 'Prague',
                    'eventDate': '2020-01-02T08:00:00.000Z',
                    'eventDaysDuration': 2,
                    'tripId': expect.any(String),
                    'woeid': 796597
                }]);
            });
    });

    it('should delete an itinerary item by id', async() => {
        const trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 4, 2020'),
            departCity: 'Portland',
            arriveCity: 'Hamburg',
            returnFromCity: 'Prague',
            returnToCity: 'Portland'
        });
        const itinerary = await Itineraries.create({
            tripId: trip._id,
            event: 'Snowboard the Alps',
            eventDate: new Date('January 2, 2020'),
            eventCity: 'Stockholm',
            eventDaysDuration: 2,
            woeid: 2475687
        });
        return request(app)
            .delete(`/api/v1/trip/${trip._id}/day-plan/${itinerary._id}`)
            .then(res => {
                expect(res.body.itineraries).toHaveLength(0);
            });
    });
});
