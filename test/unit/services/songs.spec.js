const SongsService = require('../../../src/services/songs');

describe('songs Service', () => {
    const songId = 'songId';
    const datasourceResult = 'datsourceResult';
    const songData = { data: 'some-data' };
    let result;
    let service;
    let error;
    beforeEach(() => {
        service = new SongsService();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('get song by id', () => {
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'getSongById'
                ).mockResolvedValue(datasourceResult);
                result = await service.getSongById(songId);
            });
            it('invokes datasource to get song', () => {
                expect(
                    service.songsDatasource.getSongById
                ).toHaveBeenCalledWith(songId);
            });
            it('returns retrieved result from datasource', () => {
                expect(result).toBe(datasourceResult);
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'getSongById'
                ).mockRejectedValue('err');
                try {
                    result = await service.getSongById(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('update song', () => {
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'updateSong'
                ).mockResolvedValue();
                result = await service.updateSong(songId, songData);
            });
            it('invokes datasource to update song', () => {
                expect(service.songsDatasource.updateSong).toHaveBeenCalledWith(
                    songId,
                    songData
                );
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBeUndefined();
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'updateSong'
                ).mockRejectedValue('err');
                try {
                    result = await service.updateSong(songId, songData);
                } catch (err) {
                    error = err;
                }
            });

            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('delete song', () => {
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'deleteSong'
                ).mockResolvedValue();
                result = await service.deleteSong(songId);
            });
            it('invokes datasource to delete song', () => {
                expect(service.songsDatasource.deleteSong).toHaveBeenCalledWith(
                    songId
                );
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBeUndefined();
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'deleteSong'
                ).mockRejectedValue('err');
                try {
                    result = await service.deleteSong(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('create song', () => {
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'createSong'
                ).mockResolvedValue();
                result = await service.createSong(songData);
            });
            it('invokes datasource to delete song', () => {
                expect(service.songsDatasource.createSong).toHaveBeenCalledWith(
                    songData
                );
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBeUndefined();
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'createSong'
                ).mockRejectedValue('err');
                try {
                    result = await service.createSong(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('search song by title', () => {
        const songSearch = 'searchText';
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByTitle'
                ).mockResolvedValue(datasourceResult);
                result = await service.searchSongsByTitle(songSearch);
            });
            it('invokes datasource to search song', () => {
                expect(
                    service.songsDatasource.searchSongsByTitle
                ).toHaveBeenCalledWith(songSearch);
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBe(datasourceResult);
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByTitle'
                ).mockRejectedValue('err');
                try {
                    result = await service.searchSongsByTitle(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('search song by artist', () => {
        const songSearch = 'searchText';
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByArtist'
                ).mockResolvedValue(datasourceResult);
                result = await service.searchSongsByArtist(songSearch);
            });
            it('invokes datasource to search song', () => {
                expect(
                    service.songsDatasource.searchSongsByArtist
                ).toHaveBeenCalledWith(songSearch);
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBe(datasourceResult);
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByArtist'
                ).mockRejectedValue('err');
                try {
                    result = await service.searchSongsByArtist(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });

    describe('search song by text', () => {
        const songSearch = 'searchText';
        describe('normal scenario', () => {
            beforeEach(async () => {
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByText'
                ).mockResolvedValue(datasourceResult);
                result = await service.searchSongsByText(songSearch);
            });
            it('invokes datasource to delete song', () => {
                expect(
                    service.songsDatasource.searchSongsByText
                ).toHaveBeenCalledWith(songSearch);
            });

            it('returns retrieved result from datasource', () => {
                expect(result).toBe(datasourceResult);
            });
        });

        describe('when datasource throws error', () => {
            beforeEach(async () => {
                result = null;
                jest.spyOn(
                    service.songsDatasource,
                    'searchSongsByText'
                ).mockRejectedValue('err');
                try {
                    result = await service.searchSongsByText(songId);
                } catch (err) {
                    error = err;
                }
            });
            it('reflects error to a different error', () => {
                expect(result).toBe(null);
                expect(error).toBeInstanceOf(Error);
            });
        });
    });
});
