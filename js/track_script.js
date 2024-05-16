document.addEventListener('DOMContentLoaded', fetch_tracks);

function fetch_tracks() {
    const params = new URLSearchParams(window.location.search);
    const playlistId = params.get('playlistId');

    const clientId = '1a9532de86a84636a8a0a5284ebd758a';
    const clientSecret = 'a0f61a620d8a4a3ab1d47180f76e0efb';
    const authUrl = 'https://accounts.spotify.com/api/token';

    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    });

    fetch(authUrl, {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials'
    })
    .then(response => response.json())
    .then(data => {
        const accessToken = data.access_token;

        const tracks_url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

        fetch(tracks_url, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        })
        .then(response => response.json())
        .then(data => {
            const track_container = document.getElementById('track-container');
            track_container.innerHTML = '';

            if (data && data.items && data.items.length > 0) {
                data.items.forEach(item => {
                    if (item && item.track && item.track.name && item.track.album && item.track.album.images && item.track.album.images.length > 0) {
                        const track_name = item.track.name;
                        const track_image = item.track.album.images[0].url;
                        const track_audio = item.track.preview_url;

                        const track_div_ele = document.createElement('div');
                        track_div_ele.classList.add('track');

                        const track_image_ele = document.createElement('img');
                        track_image_ele.src = track_image;
                        track_image_ele.alt = track_name;

                        const track_name_ele = document.createElement('p');
                        track_name_ele.textContent = track_name;

                        const download_btn = document.createElement('button');
                        download_btn.textContent = 'Download';
                        download_btn.classList.add('download-btn');

                        track_div_ele.appendChild(track_image_ele);
                        track_div_ele.appendChild(track_name_ele);
                        track_div_ele.appendChild(download_btn);

                        track_div_ele.addEventListener('click', () => {
                            play_music(track_audio);
                        });

                        track_container.appendChild(track_div_ele);
                    }
                });
            } else {
                const no_tracks = document.createElement('p');
                no_tracks.textContent = 'No tracks available!';
                track_container.appendChild(no_tracks);
            }
        })
        .catch(error => {
            console.error('Error fetching tracks:', error);
            const track_container = document.getElementById('track-container');
            track_container.innerHTML = '';
            const error_msg = document.createElement('p');
            error_msg.textContent = 'Error fetching tracks!';
            track_container.appendChild(error_msg);
        });
    });
}

function play_music(previewUrl) {
    const audio_player = document.getElementById('audio-player');
    if (previewUrl) {
        audio_player.src = previewUrl;
        audio_player.play();
    }
}
