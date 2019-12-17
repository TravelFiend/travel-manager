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
}, {
    toJSON: { 
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.id;
        }
    }
}
);

schema.virtual('itineraries', {
    ref: 'Itineraries',
    localField: '_id',
    foreignField: 'tripId'
});

module.exports = mongoose.model('Trip', schema);
