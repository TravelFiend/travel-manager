require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const Itineraries = require('../lib/models/Itineraries');
const Trip = require('../lib/models/Trip');

describe('Itineraries routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let trip;
    beforeEach(async() => {
        trip = await Trip.create({
            departDate: new Date('January 1, 2020'),
            returnDate: new Date('February 2, 2020'),
            departCity: 'Portland',
            arriveCity: 'Stockholm',
            returnFromCity: 'Hamburg',
            returnToCity: 'Portland'
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates an itinerary item', async() => {
        return request(app)
            .post('/api/v1/itineraries')
            .send({
                tripId: trip._id,
                event: 'Snowboard the Alps',
                eventDate: new Date('January 2, 2020'),
                eventCity: 'Stockholm',
                eventDaysDuration: 2
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    tripId: trip._id.toString(),
                    event: 'Snowboard the Alps',
                    eventDate: '2020-01-02T08:00:00.000Z',
                    eventCity: 'Stockholm',
                    eventDaysDuration: 2,
                    __v: 0
                });
            });
    });

    it('should delete an itinerary item by id', async() => {
        const itineraries = await Itineraries.create({
            tripId: trip._id,
            event: 'Snowboard the Alps',
            eventDate: new Date('January 2, 2020'),
            eventCity: 'Stockholm',
            eventDaysDuration: 2
        });
        return request(app)
            .delete(`/api/v1/itineraries/${itineraries._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: itineraries._id.toString(),
                    tripId: trip._id.toString(),
                    event: 'Snowboard the Alps',
                    eventDate: '2020-01-02T08:00:00.000Z',
                    eventCity: 'Stockholm',
                    eventDaysDuration: 2,
                    __v: 0
                });
            });
    });
});
