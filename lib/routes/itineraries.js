const { Router } = require('express');
const Itineraries = require('../models/Itineraries');

module.exports = Router()
    .post('/', (req, res) => {
        Itineraries
            .create(req.body)
            .then(itinerary => res.send(itinerary));
    })

    .delete('/:id', (req, res) => {
        Itineraries
            .findByIdAndDelete(req.params.id)
            .then(itinerary => res.send(itinerary));
    });
