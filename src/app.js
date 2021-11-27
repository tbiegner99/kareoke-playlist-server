const express = require('express');
const bodyParser = require('body-parser');
const DBClientFactory = require('./utils/db-client/factory');
const dbConfig = require('./config/db');

DBClientFactory.initialize(
    dbConfig.credentials,
    dbConfig.connectionPoolSettings,
    dbConfig.databases.KAREOKE,
    Object.values(dbConfig.databases)
);

const JobScheduler = require('./services/jobs/scheduler');
const TVGuideUpdateJob = require('./services/jobs/runners/TVGuideUpdateJob');

JobScheduler.scheduleJob(new TVGuideUpdateJob());

const songsController = require('./web/controllers/kareoke/songs');
const playlistController = require('./web/controllers/kareoke/playlists');
const tvController = require('./web/controllers/tv');
const toDoController = require('./web/controllers/todo/todo');
const readingsController = require('./web/controllers/readings');

const app = express();
app.use(bodyParser.json());

const toDoRouter = express.Router();

toDoRouter.get('/list', toDoController.getAllLists);
toDoRouter.post('/list', toDoController.createList);
toDoRouter.get('/list/:listId', toDoController.getList);
toDoRouter.delete('/list/:listId', toDoController.deleteList);
toDoRouter.post('/list/:listId/items', toDoController.createListItem);
toDoRouter.get('/list/:listId/items', toDoController.getListItems);
toDoRouter.delete('/list/:listId/items', toDoController.clearList);
toDoRouter.delete('/list/:listId/items/:itemId', toDoController.deleteListItem);

const songsRouter = express.Router();

songsRouter.post('/songs', songsController.createSong);
songsRouter.get('/songs', songsController.getAllSongs);
songsRouter.get('/songs/:id', songsController.getSongById);
songsRouter.delete('/songs/:id', songsController.deleteSongById);
songsRouter.post('/songs/search', songsController.searchSong);

const readingsRouter = express.Router();

readingsRouter.post('/zones', readingsController.createZone);
readingsRouter.get('/zones', readingsController.getZones);
readingsRouter.get(
    '/zones/:zone/readings/:type/:filter',
    readingsController.getReadingsForZone
);
readingsRouter.post(
    '/zones/:zone/readings/:type',
    readingsController.createReading
);

const playlistRouter = express.Router();

playlistRouter.delete(
    '/playlist/:playlistId',
    playlistController.clearPlaylist
);

playlistRouter.get(
    '/playlist/:playlistId/items',
    playlistController.selectPlaylistItems
);

playlistRouter.post(
    '/playlist/:playlistId/items',
    playlistController.enqueueItem
);
playlistRouter.get('/playlist/:playlistId/items/peek', playlistController.peek);
playlistRouter.delete(
    '/playlist/:playlistId/items/dequeue',
    playlistController.dequeue
);
playlistRouter.delete(
    '/playlist/:playlistId/items/:position',
    playlistController.removePlaylistItem
);
playlistRouter.put(
    '/playlist/:playlistId/items/:position',
    playlistController.moveItem
);

const tvRouter = express.Router();

tvRouter.put('/channels/import', tvController.importChannels);
tvRouter.get('/channels', tvController.loadAllChannels);
tvRouter.put('/guide/update', tvController.updateGuide);
tvRouter.get('/guide', tvController.loadGuide);
tvRouter.get('/guide/:channelNumber', tvController.loadGuideForChannel);
tvRouter.get('/channels/hd', tvController.loadHDChannels);
tvRouter.get('/channels/sd', tvController.loadSDChannels);

app.use('/api/kareoke', songsRouter);
app.use('/api/tv', tvRouter);
app.use('/api/kareoke', playlistRouter);
app.use('/api/todo', toDoRouter);
app.use('/api/sensors', readingsRouter);

app.listen(8080, () => {
    console.log('App started on port 8080');
});
