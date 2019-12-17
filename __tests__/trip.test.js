require('dotenv').config();
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const request = require('supertest');
const mongoose = require('mongoose');
const Trip = require('../lib/models/Trip');
const Itineraries = require('../lib/models/Itineraries');

describe('Trip routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        mongoose.connection.close();
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
                    departDate: new Date('January 1, 2020'),
                    returnDate: new Date('February 4, 2020'),
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
                departDate: new Date('Arpil 19, 2020'),
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
        const itinerary = await Itineraries.create([
            {
                tripId: trip._id,
                event: 'Mountain biking',
                eventDate: new Date('January 10, 2020'),
                eventCity: 'Hamburg',
                eventDayDuration: 3
            }
        ]);
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
                    itineraries: JSON.parse(JSON.stringify(itinerary)),
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
});
