if(!localStorage.getItem('isLoggedIn')){
    window.location.href = 'index.html';
}
const albumId = new URLSearchParams(window.location.search).get('albumId');
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

async function removeFromAlbum(musicId){
    const response = await fetch(`/api/music/album/music/remove`, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            albumId,
            musicId
        })
    })
    const result = await response.json();
    if(response.ok){
        alert('Music removed from album successfully!');
        // Reload the album details to reflect the changes
        loadAlbumDetails();
    } else {
        alert(result.message);
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

// time format karna
function formatTime(seconds) {
    if(isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

audio.addEventListener('ended', function() {
    playMusicByIndex(currentIndex + 1);  
});

async function loadAlbumDetails(){
    const response = await fetch(`/api/music/album-details/${albumId}`, {
        credentials: 'include'
    })

    const data = await response.json();
    const container = document.getElementById('musicContainer');
  
    const albumTitle = document.getElementById('albumTitle');
    albumTitle.textContent = data.album.title;

    currentList = data.album.musics;
    playerImg.src = data.album.musics[0] ? data.album.musics[0].image : 'default-album.png';
    playerTitle.textContent = data.album.musics[0] ? data.album.musics[0].title : 'No music';
    playerArtist.textContent = data.album.musics[0] ? data.album.musics[0].artist.username : 'Unknown Artist';

    data.album.musics.forEach(function(music) {
        if(data.album.musics.length === 0) return;
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
            <img src="${music.image}" alt="${music.title}">
            <h3>${music.title}</h3>
            <p>${music.artist.username}</p>
            <img class="Remove" src="https://png.pngtree.com/png-clipart/20250421/original/pngtree-cross-icon-wrong-sign-vector-with-transparent-background-png-image_20826131.png" alt="Remove" >
             `;
        card.onclick = function(){
          playMusicByIndex(currentList.indexOf(music));
        }
         card.querySelector('.Remove').addEventListener('click', async function(event) {
            event.stopPropagation();
            console.log('Remove button clicked for music ID:', music._id);
            await removeFromAlbum(music._id);
        });
         container.appendChild(card);
    });
}

document.getElementById('updateAlbumBtn').addEventListener('click', async function(){
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
        <h2>Update Album Name</h2>
        <input type="text" id="newAlbumName" placeholder="New Album Name" style="width: 100%; padding: 10px; margin-bottom: 10px;">
        <button id="updateAlbumNameBtn" style="padding: 10px 20px; background-color: #1DB954; border: none; color: white; cursor: pointer;">Update</button>
        <button id="cancelBtn" style="padding: 10px 20px; background-color: #ff4d4d; border: none; color: white; cursor: pointer; margin-left: 10px;">Cancel</button>
      `;

     overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Update button click
    modal.querySelector('#updateAlbumNameBtn').addEventListener('click', async function(){
        const newName = modal.querySelector('#newAlbumName').value;
        if(!newName) {
            alert('Please enter album name');
            return;
        }

        await updateAlbumName(newName);  // backend call - ye function banana hoga
        document.body.removeChild(overlay);
    });

    // Cancel button click
    modal.querySelector('#cancelBtn').addEventListener('click', function(){
        document.body.removeChild(overlay);
    });
});

async function updateAlbumName(newName){
    const response = await fetch(`/api/music/album/update/${albumId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newName })
    });

    const data = await response.json();
    if(response.ok){
        document.getElementById('albumTitle').textContent = newName;  // UI update
        alert('Album updated!');
    } else {
        alert(data.message);
    }
}

document.getElementById('deleteAlbumBtn').addEventListener('click', async function(){
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
        <h2>Delete Album</h2>
        <p>Are you sure you want to delete this album?</p>
        <button id="confirmDeleteBtn" style="padding: 10px 20px; background-color: #ff4d4d; border: none; color: white; cursor: pointer;">Delete</button>
        <button id="cancelBtn" style="padding: 10px 20px; background-color: #1DB954; border: none; color: white; cursor: pointer; margin-left: 10px;">Cancel</button>
      `;

     overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Delete button click
    modal.querySelector('#confirmDeleteBtn').addEventListener('click', async function(){
        await deleteAlbum();  // backend call - ye function banana hoga
        document.body.removeChild(overlay);
    });

    // Cancel button click
    modal.querySelector('#cancelBtn').addEventListener('click', function(){
        document.body.removeChild(overlay);
    });
});

async function deleteAlbum(){
    const response = await fetch(`/api/music/album/${albumId}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    const data = await response.json();
    if(response.ok){
        alert('Album deleted!');
        window.location.href = 'album.html';  // Redirect to albums page
    } else {
        alert(data.message);
    }
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

loadAlbumDetails();