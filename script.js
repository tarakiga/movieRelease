// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Dynamically create a script element for the configuration
    const script = document.createElement('script');
    script.src = './config/config.js'; // Adjust the path based on your project structure
    script.type = 'text/javascript';

    // Append the script element to the document
    document.head.appendChild(script);

    // Callback function after the script is loaded
    script.onload = () => {
        // Check if the 'config' variable is defined
        if (typeof config !== 'undefined' && config.apiKey) {
            // Use the API key from the config file
            const apiKey = config.apiKey;

            // Get current date
            const currentDate = new Date();
            const month = currentDate.getMonth() + 1; // Months are zero-based
            const day = currentDate.getDate();

            // TMDb API endpoint for discovering movies released on a specific day
            const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&primary_release_date.gte=${currentDate.getFullYear()}-${month}-${day}&primary_release_date.lte=${currentDate.getFullYear()}-${month}-${day}&sort_by=popularity.desc`;

            // Fetch data from TMDb API
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    const messageElement = document.getElementById('message');
                    const nextReleaseElement = document.getElementById('nextRelease');
                    const nextReleasePoster = document.getElementById('nextReleasePoster');
                    const nextReleaseName = document.getElementById('nextReleaseName');
                    const nextReleaseDate = document.getElementById('nextReleaseDate');
                    const nextReleaseSynopsis = document.getElementById('nextReleaseSynopsis');

                    // Check if any movies are found
                    if (data.results.length > 0) {
                        const nextRelease = data.results[0];
                        const posterPath = nextRelease.poster_path;
                        const posterUrl = `https://image.tmdb.org/t/p/w500/${posterPath}`;

                        // Display the movie poster
                        const moviePoster = document.getElementById('moviePoster');
                        moviePoster.src = posterUrl;

                        // Display the release date and synopsis of the next release
                        nextReleaseDate.textContent = `Release Date: ${nextRelease.release_date}`;
                        nextReleaseSynopsis.textContent = `Synopsis: ${nextRelease.overview}`;
                    } else {
                        // No movies found for the current date
                        messageElement.textContent = 'No movies found for the current date.';
                    }

                    // Get information about the next available movie release
                    const nextReleaseUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&page=1&region=US`;
                    fetch(nextReleaseUrl)
                        .then(response => response.json())
                        .then(nextReleaseData => {
                            const nextRelease = nextReleaseData.results[0];
                            const nextReleasePosterPath = nextRelease.poster_path;
                            const nextReleasePosterUrl = `https://image.tmdb.org/t/p/w500/${nextReleasePosterPath}`;

                            // Display the poster and name of the next available movie release
                            nextReleasePoster.src = nextReleasePosterUrl;
                            nextReleaseName.textContent = nextRelease.original_title;

                            // Display the release date and synopsis of the next release
                            nextReleaseDate.textContent = `Release Date: ${nextRelease.release_date}`;
                            nextReleaseSynopsis.textContent = `Synopsis: ${nextRelease.overview}`;

                            nextReleaseElement.style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error fetching next release data:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        } else {
            console.error('API key is missing in the config file.');
        }
    };
});
