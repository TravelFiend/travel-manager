const Trip = require('./Trip');

describe('Trip model', () => {
    it('should require a departDate', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.departDate.message).toEqual('Path `departDate` is required.');
    });

    it('should require a returnDate', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.returnDate.message).toEqual('Path `returnDate` is required.');
    });

    it('should require a departCity', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.departCity.message).toEqual('Path `departCity` is required.');
    });

    it('should require an arriveCity', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.arriveCity.message).toEqual('Path `arriveCity` is required.');
    });

    it('should require a returnFromCity', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.returnFromCity.message).toEqual('Path `returnFromCity` is required.');
    });

    it('should require a returnToCity', () => {
        const trip = new Trip();
        const { errors } = trip.validateSync();

        expect(errors.returnToCity.message).toEqual('Path `returnToCity` is required.');
    });
});
