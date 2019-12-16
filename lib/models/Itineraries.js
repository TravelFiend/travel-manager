const mongoose = require('mongoose');

const schema = mongoose.Schema({
    tripId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trip',
        required: true
    },
    event: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventCity: {
        type: String,
        required: true
    },
    eventDaysDuration: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Itineraries', schema);
