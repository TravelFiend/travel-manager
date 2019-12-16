const Itineraries = require('./Itineraries');

describe('Itineraries model', () => {
    it('should require an event', () => {
        const itineraries = new Itineraries();
        const {
            errors
        } = itineraries.validateSync();

        expect(errors.event.message).toEqual('Path `event` is required.');
    });

    it('should require a eventDate', () => {
        const itineraries = new Itineraries();
        const {
            errors
        } = itineraries.validateSync();

        expect(errors.eventDate.message).toEqual('Path `eventDate` is required.');
    });

    it('should require a eventCity', () => {
        const itineraries = new Itineraries();
        const {
            errors
        } = itineraries.validateSync();

        expect(errors.eventCity.message).toEqual('Path `eventCity` is required.');
    });

    it('should require a eventDaysDuration', () => {
        const itineraries = new Itineraries();
        const {
            errors
        } = itineraries.validateSync();

        expect(errors.eventDaysDuration.message).toEqual('Path `eventDaysDuration` is required.');
    });
});
