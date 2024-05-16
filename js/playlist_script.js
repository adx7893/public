document.addEventListener('DOMContentLoaded', fetch_playlist);//event listner for DOM of fetchplaylist

function fetch_playlist() {
    const params = new URLSearchParams(window.location.search);
    const genre = params.get('genre');
    const heading = document.getElementById('genre-heading');
    heading.textContent = genre ? `Playlists for ${genre}` : 'Playlists';

    const clientId = '1a9532de86a84636a8a0a5284ebd758a';//if these keys dsnt works change the keys with the below give keys
    const clientSecret = 'a0f61a620d8a4a3ab1d47180f76e0efb';//if these keys dsnt works change the keys with the below give keys
    // const clientId = 'e7d2b826a31148f9aa46734ba616304d';
    // const clientSecret = 'c5737bca70944576be79a4af4c0f18b0';
    const auth_url = 'https://accounts.spotify.com/api/token';

    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    });

    fetch(auth_url, {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;

        const search_url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(genre)}&type=playlist`;

        fetch(search_url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
        .then(response => response.json())
        .then(searchData => {
            disp_playlist(searchData.playlists.items, accessToken);
        });
    });
}

function disp_playlist(playlists, accessToken) {
    const playlist_container = document.getElementById('playlist-container');
    playlist_container.innerHTML = '';
    const limitedPlaylists = playlists.slice(0, 2);

    playlists.forEach(playlist => {
        const playlist_div_ele = document.createElement('div');
        playlist_div_ele.classList.add('playlist');
        playlist_div_ele.dataset.playlistId = playlist.id;

        const playlist_image = document.createElement('img');
        playlist_image.src = playlist.images.length > 0 ? playlist.images[0].url : 'placeholder.jpg';
        playlist_image.alt = playlist.name;
        playlist_div_ele.appendChild(playlist_image);

        playlist_div_ele.addEventListener('click', () => {
            window.location.href = `track.html?playlistId=${playlist.id}`;//it'll navigate to tracks page with specific tracks of that playlist
        });
        const tracks_url = playlist.tracks.href;
        fetch(tracks_url, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
        .then(response => response.json())
        .then(data => {
            const tracks = data.items;
            if (tracks.length > 0) {
                const track_list = document.createElement('ul');
                track_list.classList.add('track-list');
                tracks.forEach(track => {
                    const track_item = document.createElement('li');
                    track_item.textContent = track.track.name;
                    track_list.appendChild(track_item);
                });
                playlist_div_ele.appendChild(track_list);
            }
        });

        playlist_container.appendChild(playlist_div_ele);
    });
}
