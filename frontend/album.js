async function loadAlbums(){
    const response = await fetch(`/api/music/albums`, {
        credentials: 'include'
    })
    const data = await response.json();

    const container = document.getElementById('albumContainer')

    data.albums.forEach(function(album){
        if(album.musics.length === 0) return;
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = `
            <img src="${album.musics[0]?.image || ''}" alt="${album.title}">
            <h3>${album.title}</h3>
            <p>${album.artist.username}</p>
        `
        container.appendChild(card)
        card.onclick = function(){
            window.location.href = `album-details.html?albumId=${album._id}`
        };
    })
} 

document.getElementById('logoutBtn').addEventListener('click', function(){
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    window.location.href = 'index.html'
})

loadAlbums();