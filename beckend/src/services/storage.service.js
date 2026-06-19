require('dotenv').config();
const { ImageKit } = require('@imagekit/nodejs');

const imagekitclient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

async function uploadFile(file){
    try {
        const result = await imagekitclient.files.upload({
            file,
            fileName: 'music_' + Date.now(),
            folder: 'yt-beckend/spotify'
        });

        return result;
    } catch (err) {
        console.error('ImageKit upload error:', err);
        throw err;
    }
}

async function uploadImage(file){
    try {
        const result = await imagekitclient.files.upload({
            file,
            fileName: 'image_' + Date.now(),
            folder: 'yt-beckend/spotify/thumbnails'
        });
        return result;
    } catch (err) {
        console.error('ImageKit image upload error:', err);
        throw err;
    }
}

module.exports = { uploadFile, uploadImage };