const mongoose = require('mongoose');

const schema = mongoose.Schema({
    departDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    departCity: {
        type: String,
        required: true
    },
    arriveCity: {
        type: String,
        required: true
    },
    returnFromCity: {
        type: String,
        required: true
    },
    returnToCity: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Trip', schema);
