const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const { uploadFile , uploadImage } = require('../services/storage.service');
const jwt = require('jsonwebtoken');

async function createMusic(req, res){

    const {title} = req.body;
    const file = req.files['Music'][0];
    const image = req.files['Image'][0];

    if(!file) return res.status(400).json({ message: 'No file uploaded' });
    if(!image) return res.status(400).json({ message: 'No image uploaded' });

    const result = await uploadFile(file.buffer.toString('base64'));
    const imageResult = await uploadImage(image.buffer.toString('base64'));

    const music = await musicModel.create({
      uri: result.url || result.filePath || result.name,
      image: imageResult.url || imageResult.filePath || imageResult.name,
      title,
      artist: req.user.id
    });

    res.status(201).json({
      message: 'Music created successfully',
      music: {
        id: music._id,
        title: music.title,
        uri: music.uri,
        image: music.image,
        artist: music.artist
      }
    });
}

async function createAlbum(req, res){
  
      const {title, musics} = req.body;

      const album = await albumModel.create({
        title,
        musics: musics,
        artist: req.user.id
      });

      res.status(201).json({
        message: 'Album created successfully',
        album: {
          id: album._id,
          title: album.title,
          musics: album.musics,
          artist: album.artist
        }
      })
  
}

async function getAllMusics(req, res){
  const musics = await musicModel.find().populate('artist');

  res.status(200).json({
    message: 'Musics retrieved successfully',
    musics : musics
  })
}

async function getAllAlbums(req, res){
  const albums = await albumModel.find({artist: req.user.id}).populate('artist', 'username email').populate('musics')

  res.status(200).json({
    message: 'Albums retrieved successfully',
    albums: albums
  })
}

async function addToAlbum(req, res){
    try {
        const {musicId, album} = req.body;

        const response = await albumModel.findByIdAndUpdate(
            album, 
            { $push: { musics: musicId } }, 
            { new: true }
        );

        if(!response){
            return res.status(404).json({ message: 'Album not found' });
        }

        res.status(201).json({
            message: 'Music added in album',
            response
        });

    } catch(err) {
        res.status(400).json({
            message: 'Music not added in album',
            error: err.message
        });
    }
}

async function getAlbumDetails(req, res){
   try{
    const albumId = req.params.albumId;
    const album = await albumModel.findById(albumId)
    .populate({
        path: 'musics',
        populate: {
            path: 'artist',
            select: 'username email'
        }
    });

    if(!album){
        return res.status(404).json({ message: 'Album not found' });
    }

    res.status(200).json({
        message: 'Album details retrieved successfully',
        album: album
    });
   } catch(err){
    res.status(400).json({
        message: 'Error retrieving album details',
        error: err.message
    })
   }
}

async function removeFromAlbum(req, res){
  try {
    const { musicId, albumId } = req.body;
    const album = await albumModel.findByIdAndUpdate(
        albumId,
        { $pull: { musics: musicId } }, 
        { new: true }
    );
    if(album && album.musics.length === 0){
        await albumModel.findByIdAndDelete(albumId);
        return res.status(200).json({ message: 'Music removed, album was empty so deleted' });
    }
    res.status(200).json({
        message: 'Music removed from album successfully'
    });
  } catch(err) {
    res.status(400).json({
        message: 'Error removing music from album',
        error: err.message
    });
  }
}

async function updateAlbumName(req, res){
  try{
    const albumId = req.params.albumId;
    const { title } = req.body;
    const album = await albumModel.findByIdAndUpdate(
      albumId,
        { title },
        { new: true }
    );
    res.status(200).json({
      message: 'Album name updated successfully'
    })
  } catch(err){
    res.status(400).json({
      message: 'Error updating album name'
    })
  }
}

async function deleteAlbum(req, res){
    const { albumId } = req.params;
    await albumModel.findByIdAndDelete(albumId);
    res.status(200).json({ message: 'Album deleted' });
}

module.exports = {createMusic, createAlbum, getAllMusics, getAllAlbums, addToAlbum, getAlbumDetails, removeFromAlbum, updateAlbumName, deleteAlbum};