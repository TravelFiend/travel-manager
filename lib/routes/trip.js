const { Router } = require('express');
const Trip = require('../models/Trip');
const Itineraries = require('../models/Itineraries');

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
            .findById(req.params.id)
            .populate('itineraries')
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
    });
