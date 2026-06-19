const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const musicController = require('../controllers/music.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage()})

const router = express.Router();

router.post('/upload', authMiddleware.authArtist ,upload.fields([{ name: 'Music', maxCount: 1 }, { name: 'Image', maxCount: 1 }]),musicController.createMusic);
router.post('/album',authMiddleware.authArtist ,musicController.createAlbum);
router.post('/album/music', authMiddleware.authArtist ,musicController.addToAlbum);
router.post('/album/music/remove', authMiddleware.authArtist ,musicController.removeFromAlbum);
router.post('/album/update/:albumId', authMiddleware.authArtist , musicController.updateAlbumName);
router.delete('/album/:albumId', authMiddleware.authArtist , musicController.deleteAlbum);

router.get('/Musics', musicController.getAllMusics);
router.get('/albums',authMiddleware.authArtist , musicController.getAllAlbums);
router.get('/album-details/:albumId', authMiddleware.authArtist ,musicController.getAlbumDetails);

module.exports = router;
