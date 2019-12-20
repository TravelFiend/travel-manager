const { Router } = require('express');
const Trip = require('../models/Trip');
const Itineraries = require('../models/Itineraries');
const middleWoe = require('../middleware/woeid');

module.exports = Router()
    .post('/', (req, res) => {
        Trip
            .create(req.body)
            .then(trip => res.send(trip));
    })

    .get('/', (req, res) => {
        Trip
            .find()
            .then(trips => res.send(trips));
    })

    .get('/:id', (req, res) => {
        Trip
            .getAllItinerariesAndWeather(req.params.id)
            .then(oneTrip => res.send(oneTrip));
    })

    .patch('/:id', (req, res) => {
        Trip
            .findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then(itinerary => res.send(itinerary));
    })

    .delete('/:id', (req, res) => {
        Promise.all([
            Trip.findByIdAndDelete(req.params.id),
            Itineraries.deleteMany({ tripId: req.params.id })
        ])
            .then(([trip]) => res.send(trip));
    })

    .post('/:id/day-plan', middleWoe, (req, res, next) => {
        Itineraries
            .create({ ...req.body, tripId: req.params.id, woeid: req.woeid })
            .then(() => Trip
                .findById(req.params.id)
                .populate('itineraries'))
            .then(trip => res.send(trip))
            .catch(next);
    })

    .delete('/:id/day-plan/:itineraryId', (req, res, next) => {
        Itineraries
            .findByIdAndDelete(req.params.itineraryId)
            .then(() => Trip
                .findById(req.params.id)
                .populate('itineraries'))
            .then(trip => res.send(trip))
            .catch(next);
    });
