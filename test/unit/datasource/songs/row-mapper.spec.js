const mapper = require('../../../../src/datasource/songs/row-mapper');

describe('Songs row mapper', () => {
    describe('from songs row', () => {
        it('maps database data to business object', () => {
            const dataObject = {};
            const expectedObject = {};
            expect(mapper.fromSongRow(dataObject)).toEqual(expectedObject);
        });
    });

    describe('to insert params', () => {
        it('maps database data to business object', () => {
            const dataObject = {};
            const expectedObject = {};
            expect(mapper.toInsertParams(dataObject)).toEqual(expectedObject);
        });
    });

    describe('to update params', () => {
        it('maps database data to business object', () => {
            const dataObject = {};
            const expectedObject = {};
            expect(mapper.toUpdateParams(dataObject)).toEqual(expectedObject);
        });
    });
});
