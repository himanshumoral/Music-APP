if(!localStorage.getItem('isLoggedIn')){
    window.location.href = 'index.html';
}

const audio = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playerImg = document.getElementById('playerImg');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');

let currentList = [];
let currentIndex = 0;

async function CreateAlbum(title, musicId){
    const musics = [musicId];
    try{ 
        const response = await fetch(`/api/music/album`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, musics })
    })
}
catch(err){
    console.log('error', err);
}
}

async function addToAlbum(musicId) {
    // albums fetch karo
    const response = await fetch(`/api/music/albums`, {
        credentials: 'include'
    });
    const data = await response.json();

    // overlay banao — background dim hoga
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // modal banao
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #282828;
        padding: 20px;
        border-radius: 10px;
        width: 300px;
        color: white;
    `;

    modal.innerHTML = `<h3>Add to Playlist</h3>
    <button id="createAlbum" style="width:100%; padding:10px; background:#1DB954; border:none; color:white; cursor:pointer; margin-bottom:10px;">Create New Playlist</button>
    `;

    // albums list
    data.albums.forEach(function(album) {
        const item = document.createElement('div');
        item.style.cssText = `
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
        `;
        item.innerHTML = `
            <img src="${album.musics[0]?.image}" style="width:40px; height:40px; border-radius:5px;">
            <span>${album.title}</span>
        `;

        // album pe click karo — music add ho jaayega
        item.onclick = function() {
            addMusicToAlbum(musicId, album._id);
            document.body.removeChild(overlay); // modal band karo
        };

        modal.appendChild(item);
    });

    // create album button
    modal.querySelector('#createAlbum').addEventListener('click', function(){
        modal.innerHTML = `<h3>Create Album</h3>
        <input type="text" id="newAlbumTitle" placeholder="Album Title" style="width:100%; padding:5px; margin-bottom:10px;">
        <button id="submitNewAlbum" style="width:100%; padding:10px; background:#1DB954; border:none; color:white; cursor:pointer;">Create</button>`;
    
    // submit new album button
    modal.querySelector('#submitNewAlbum').addEventListener('click', async function(){
        const title = modal.querySelector('#newAlbumTitle').value;
        if(!title) {
            alert('Please enter album title');
            return;
        }
        await CreateAlbum(title, musicId);
        document.body.removeChild(overlay);
         });
    });

    // close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = `
        margin-top: 10px;
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };

    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
}

async function addMusicToAlbum(musicId, album) {
    const response = await fetch(`/api/music/album/music`, {
        method: 'post',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ musicId, album })
    });

    const data = await response.json();
    if(response.ok) {
        alert('Added to playlist!');
    } else {
        alert(data.message);
    }
}

function playMusicByIndex(index) {
    if(index < 0 ) return;
    if(index >= currentList.length) index = 0;
    currentIndex = index;
    const music = currentList[index];
    // song set karo
    audio.src = music.uri;
    audio.play();

    // player info update karo
    document.getElementById('playerTitle').textContent = music.title;
    document.getElementById('playerArtist').textContent = music.artist.username;
    document.getElementById('playerImg').src = music.image;

    playPauseBtn.textContent = '⏸';
}

// play/pause toggle
playPauseBtn.addEventListener('click', function() {
    if(audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶';
    }
});

// progress bar update
audio.addEventListener('timeupdate', function() {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
});

// progress bar se seek karna
progressBar.addEventListener('input', function() {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

audio.addEventListener('ended', function() {
    playMusicByIndex(currentIndex + 1);  // next song
});

// time format karna
function formatTime(seconds) {
    if(isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

async function addMusic(){
     const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    // modal banao
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: #282828;
        padding: 20px;
        border-radius: 10px;
        width: 300px;
        color: white;
    `;

    modal.innerHTML = `
    <h3>Add Music</h3>
    <input type="text" id="musicTitle" placeholder="Music Title" style="width:100%; padding:5px; margin-bottom:10px;">
    <input type="file" id="musicFile" accept="audio/*" style="margin-bottom:10px;">
    <input type="file" id="imageFile" accept="image/*" style="margin-bottom:10px;">
    <button id="submitMusic" style="width:100%; padding:10px; background:#1DB954; border:none; color:white; cursor:pointer;">Upload</button>`;

    modal.querySelector('#submitMusic').addEventListener('click', async function(){
        const title = modal.querySelector('#musicTitle').value;
        const musicFile = modal.querySelector('#musicFile').files[0];
        const imageFile = modal.querySelector('#imageFile').files[0];

        if(!title || !musicFile || !imageFile) {
            alert('Please fill all fields');
            return;
        }

        const submitBtn = modal.querySelector('#submitMusic');
    
        // Button ko disable karo aur spinner dikhao
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner"></span> Uploading...`;

        await addMusicToHome(title, musicFile, imageFile);
        document.body.removeChild(overlay); 
    })

    // close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕ Close';
    closeBtn.style.cssText = `
        margin-top: 10px;
        background: none;
        border: none;
        color: #ccc;
        cursor: pointer;
    `;
    closeBtn.onclick = function() {
        document.body.removeChild(overlay);
    };

    modal.appendChild(closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);


}

async function addMusicToHome(title, musicFile, imageFile){
    const formData = new FormData();
    formData.append('title', title);
    formData.append('Music', musicFile);
    formData.append('Image', imageFile);

    const response = await fetch('/api/music/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
    });
    const result = await response.json();
    console.log(result);
}

async function loadMusics() {
    const response = await fetch(`/api/music/Musics`, {
        credentials: 'include'
    });
    const data = await response.json();

    currentList = data.musics;
    playerImg.src = data.musics[0] ? data.musics[0].image : 'default-album.png';
    playerTitle.textContent = data.musics[0] ? data.musics[0].title : 'No music';
    playerArtist.textContent = data.musics[0] ? data.musics[0].artist.username : 'Unknown Artist';

    const container = document.getElementById('musicContainer');

    data.musics.forEach(function(music) {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${music.image}" alt="${music.title}">
            <h3>${music.title}</h3>
            <p>${music.artist.username}</p>
            <img class="add-to-album" src="https://cdn-icons-png.flaticon.com/512/11762/11762700.png" alt="Add to Album" >
        `;
        card.onclick = function(){
          playMusicByIndex(currentList.indexOf(music));
        }

        card.querySelector('.add-to-album').addEventListener('click', function(event) {
            event.stopPropagation();
            addToAlbum(music._id);
        });

        container.appendChild(card);
    });
}

document.getElementById('prevBtn').addEventListener('click', function(){
    playMusicByIndex(currentIndex - 1);
});

document.getElementById('nextBtn').addEventListener('click', function(){
    playMusicByIndex(currentIndex + 1);
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    window.location.href = 'index.html';
});

document.getElementById('uploadBtn').addEventListener('click', function() {
    addMusic();
});

loadMusics();

if(localStorage.getItem('role') === 'artist'){
    document.getElementById('uploadBtn').style.display = 'block';
}