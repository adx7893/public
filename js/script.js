// Function to capitalize the first letter of a string
function cap_fun(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to create an image element for a genre
function loc_img(genre) {
    const img = document.createElement('img');
    img.src = `images/${genre}.png`;
    img.alt = genre;
    return img;
}

// Event listener when DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetching_spotify_data();
    document.getElementById('search-form').addEventListener('submit', (event) => {
        event.preventDefault(); // Preventing default form submission behavior
        search_genres();
    });
    document.getElementById('reset-button').addEventListener('click', reset__page);
});

// Function to fetch data from Spotify API
function fetching_spotify_data() {
    const clientId = '1a9532de86a84636a8a0a5284ebd758a';                                    //if these keys dsnt works change the keys with the below give keys
    const clientSecret = 'a0f61a620d8a4a3ab1d47180f76e0efb';                                //if these keys dsnt works change the keys with the below give keys
    // const clientId = 'e7d2b826a31148f9aa46734ba616304d';
    // const clientSecret = 'c5737bca70944576be79a4af4c0f18b0';
    const auth_url = 'https://accounts.spotify.com/api/token';
    const api_url = 'https://api.spotify.com/v1/recommendations/available-genre-seeds';
    const headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
    });

    fetch(auth_url, {
        method: 'POST',
        headers: headers,
        body: 'grant_type=client_credentials'
    })
    .then(response => response.json()) // Convert response to JSON
.then(data => { // Handle the JSON data
    const accessToken = data.access_token; // Extract the access token
    console.log('Access Token = ', accessToken); // Log the access token for reference
    return fetch(api_url, { // Fetch data using the access token
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + accessToken } // Add authorization header
    })
    .then(response => response.json()) // Parse the JSON response for genre data
    .then(data => { // Handle the genre data
        const genres = data.genres; // Extract the genres
        const genre_container = document.getElementById('genre-container'); // Get the genre container element
        genres.forEach(genre => { // Loop through each genre
            genre = cap_fun(genre); // Capitalize the genre name
            const genre_section = document.createElement('div'); // Create a div for the genre section
            genre_section.classList.add('genre-section'); // Add CSS class for styling
            const genre_heading = document.createElement('h2'); // Create a heading element for the genre
            genre_heading.classList.add('genre-heading'); // Add CSS class for styling
            genre_heading.textContent = genre; // Set the text content of the heading to the genre name
            genre_section.appendChild(genre_heading); // Append the heading to the genre section
            const genre_element = document.createElement('div'); // Create a div for the genre element
            genre_element.classList.add('genre'); // Add CSS class for styling
            const img = loc_img(genre); // Get the image for the genre
            genre_element.appendChild(img); // Append the image to the genre element
            genre_section.appendChild(genre_element); // Append the genre element to the genre section
            genre_section.addEventListener('click', () => { // Add event listener for genre section click
                navigate_playlist(genre); // Navigate to playlist for the clicked genre
            });
            genre_container.appendChild(genre_section); // Append the genre section to the genre container
        });
    });
});
}


function navigate_playlist(genre) {
    const show_checkbox = document.getElementById('show-playlist-checkbox');
    if (show_checkbox.checked) {
        window.location.href = `playlist.html?genre=${genre}`;
    }
}//this function will take u to the playist page if the checkbox is checked

document.addEventListener('DOMContentLoaded', () => {
    const submit_input = document.getElementById('search-input');
    submit_input.addEventListener('keyup', search_genres);
});//event listener for the submit button or onkeyup


function search_genres() {
    const submit_input = document.getElementById('search-input').value.trim().toLowerCase();
    const genre_sections = document.querySelectorAll('.genre-section');
    genre_sections.forEach(genre_section => {
        const genre_name = genre_section.querySelector('.genre-heading').textContent.trim().toLowerCase();
        if (genre_name.includes(submit_input)) {
            genre_section.style.display = 'block';
        } else {
            genre_section.style.display = 'none';
        }
    });
}//this function will search for the genres

function reset__page() {
    document.getElementById('search-input').value = '';
    const genre_sections = document.querySelectorAll('.genre-section');
    genre_sections.forEach(genre_section => {
        genre_section.style.display = 'block';
    });
}//it'll reset the whole page by clicking the button
//references
//https://stackoverflow.com/questions/50145472/javascript-spotify-api-fetching-playlist-tracks
//https://developer.spotify.com/documentation/web-api/reference/get-playlist
//https://www.toolify.ai/ai-news/explore-the-power-of-spotifys-web-api-with-javascript-397522