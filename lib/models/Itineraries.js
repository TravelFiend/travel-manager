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

schema.virtual('year')
    .get(function(){
        return this.eventDate.getFullYear();
    })
    .set(function(year){
        return this.eventDate.setFullYear(year);
    });

schema.virtual('month')
    .get(function(){
        return this.eventDate.getMonth() + 1;
    })
    .set(function(month){
        return this.eventDate.setMonth(month - 1);
    });

schema.virtual('day')
    .get(function() {
        return this.dateOfEvent.getDate();
    })
    .set(function(day) {
        return this.dateOfEvent.setDate(day);
    });

module.exports = mongoose.model('Itineraries', schema);
