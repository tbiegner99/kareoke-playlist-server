const SongsDatasource = require('../../../../src/datasource/songs/datasource');
const mapper = require('../../../../src/datasource/songs/row-mapper');
const queries = require('../../../../src/datasource/songs/queries');
const SqlClientFactory = require('../../../../src/utils/db-client/factory');

describe('Songs Datasource', () => {
    const mappedValue = 'mappedResponse';
    const convertedParams = 'convertedParams';
    const businessObject = 'businessObject';
    const id = 'songId';
    let datasource;
    let mockClient;
    let result;

    beforeEach(() => {
        mockClient = { query: jest.fn() };
        jest.spyOn(SqlClientFactory, 'getClient').mockReturnValue(mockClient);
        jest.spyOn(mapper, 'fromSongRow').mockReturnValue(mappedValue);
        datasource = new SongsDatasource();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('createSong', () => {
        beforeEach(async () => {
            jest.spyOn(mapper, 'toInsertParams').mockReturnValue(
                convertedParams
            );
            result = await datasource.createSong(businessObject);
        });
        it('maps object to parameters', () => {
            expect(mapper.toInsertParams).toHaveBeenCalledWith(businessObject);
        });

        it('runs insert query with mapped parameters', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.INSERT_QUERY,
                convertedParams
            );
        });

        it('returns no results', () => {
            expect(result).toBeUndefined();
        });
    });

    describe('updateSong', () => {
        beforeEach(async () => {
            jest.spyOn(mapper, 'toUpdateParams').mockReturnValue(
                convertedParams
            );
            result = await datasource.updateSong(id, businessObject);
        });
        it('maps object to parameters', () => {
            expect(mapper.toUpdateParams).toHaveBeenCalledWith(businessObject);
        });

        it('runs update query with mapped parameters', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.UPDATE_QUERY,
                convertedParams
            );
        });

        it('returns no results', () => {
            expect(result).toBeUndefined();
        });
    });

    describe('deleteSong', () => {
        beforeEach(async () => {
            result = await datasource.deleteSong(id);
        });

        it('runs delete query with mapped id', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.DELETE_QUERY,
                { songId: id }
            );
        });

        it('returns no results', () => {
            expect(result).toBeUndefined();
        });
    });

    describe('getSongById', () => {
        describe('when no song exists', () => {
            let err;
            beforeEach(async () => {
                result = null;
                const results = [];
                const fields = ['some-field'];
                mockClient.query.mockResolvedValue([results, fields]);
                try {
                    result = await datasource.getSongById(id);
                } catch (e) {
                    err = e;
                }
            });

            it('throws an error', () => {
                expect(result).toBe(null);
                expect(err).toBeDefined();
            });
        });
        describe('when song exists', () => {
            const mappedResult = 'mappedResult';
            const song = 'song';
            beforeEach(async () => {
                const results = [song];
                const fields = ['some-field'];
                mockClient.query.mockResolvedValue([results, fields]);
                jest.spyOn(mapper, 'fromSongRow').mockReturnValue(mappedResult);
                result = await datasource.getSongById(id);
            });

            it('runs get query with mapped id', () => {
                expect(mockClient.query).toHaveBeenCalledWith(
                    queries.SELECT_BY_ID_QUERY,
                    {
                        songId: id,
                    }
                );
            });

            it('maps response with result', () => {
                expect(mapper.fromSongRow).toHaveBeenCalledWith(song);
            });

            it('returns mapped result', () => {
                expect(result).toEqual(mappedResult);
            });
        });
    });

    describe('searchSongsByText', () => {
        const mappedResult = 'mappedResult';
        const song = 'song';
        const song2 = 'song2';
        const searchText = 'searchText';
        beforeEach(async () => {
            const results = [song, song2];
            const fields = ['some-field'];
            mockClient.query.mockResolvedValue([results, fields]);
            jest.spyOn(mapper, 'fromSongRow').mockReturnValue(mappedResult);
            result = await datasource.searchSongsByText(searchText);
        });

        it('runs search query with search Text', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.SEARCH_BY_TEXT_QUERY,
                {
                    text: searchText,
                }
            );
        });

        it('maps response with result', () => {
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song);
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song2);
        });

        it('returns mapped result', () => {
            expect(result).toEqual([mappedResult, mappedResult]);
        });
    });

    describe('searchSongsByTtitle', () => {
        const mappedResult = 'mappedResult';
        const song = 'song';
        const song2 = 'song2';
        const title = 'searchText';
        beforeEach(async () => {
            const results = [song, song2];
            const fields = ['some-field'];
            mockClient.query.mockResolvedValue([results, fields]);
            jest.spyOn(mapper, 'fromSongRow').mockReturnValue(mappedResult);
            result = await datasource.searchSongsByTitle(title);
        });

        it('runs search query with title', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.SEARCH_BY_TITLE_QUERY,
                {
                    title,
                }
            );
        });

        it('maps response with result', () => {
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song);
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song2);
        });

        it('returns mapped result', () => {
            expect(result).toEqual([mappedResult, mappedResult]);
        });
    });

    describe('searchSongsByArtits', () => {
        const mappedResult = 'mappedResult';
        const song = 'song';
        const song2 = 'song2';
        const artist = 'searchText';
        beforeEach(async () => {
            const results = [song, song2];
            const fields = ['some-field'];
            mockClient.query.mockResolvedValue([results, fields]);
            jest.spyOn(mapper, 'fromSongRow').mockReturnValue(mappedResult);
            result = await datasource.searchSongsByArtist(artist);
        });

        it('runs search query with artist', () => {
            expect(mockClient.query).toHaveBeenCalledWith(
                queries.SEARCH_BY_ARTIST_QUERY,
                {
                    artist,
                }
            );
        });

        it('maps response with result', () => {
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song);
            expect(mapper.fromSongRow).toHaveBeenCalledWith(song2);
        });

        it('returns mapped result', () => {
            expect(result).toEqual([mappedResult, mappedResult]);
        });
    });
});
