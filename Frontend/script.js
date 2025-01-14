// function to toggle the navbar (for the hamburger menu)
function toggleNavbar() {
  // selecting the navigation links and hamburger icon
  const navbarLinks = document.querySelector("nav");
  const hamburger = document.querySelector(".hamburger");

  // Toggle the "active" class to show/hide the navbar
  navbarLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
}

// Toggle the search bar visibility when the page is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Selecting the search icon and search bar elements
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");

  // When the search icon is clicked, toggle the search bar visibility
  searchIcon.addEventListener("click", () => {
    searchBar.classList.toggle("active"); // Show/hide the search bar
  });
});

// Main logic for handling movie search functionality
document.addEventListener('DOMContentLoaded', function () {
  // When the search button is clicked
  document.getElementById('search-button').addEventListener('click', function () {
    // Getting the value entered by the user in the search input
    const query = document.getElementById('search-input').value; 

    // If the search input is empty, tell the user
    if (query.trim() === '') {
      alert('Please enter a search term'); //  for empty input
      return;
    }

    // Call the function to fetch movies based on the search term
    fetchMovies(query); 
  });

  /**
   * Fetch movies from the backend server
   * @param {string} query - The search term entered by the user
   */
  function fetchMovies(query) {
    // Sending a request to the backend server 
    fetch(`/search?query=${encodeURIComponent(query)}`) // Sending the search query
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok'); // Error if the server doesn't respond correctly
        }
        return response.json(); //  analysing the server response as JSON
      })
      .then((data) => {
        console.log(data); // Log the response from the backend
        displayMovies(data); // Calling the function to display the movies
      })
      .catch((error) => {
        console.error('Error fetching data:', error); // Log any errors
        alert('Failed to fetch movie data. Please try again later.'); // tell if fetching data fails
      });
  }

  /**
   * Display the fetched movies on the page
   * @param {Array} movies - Array of movie objects
   */
  function displayMovies(movies) {
    const movieList = document.getElementById('movie-list'); // Getting the container for movie items
    movieList.innerHTML = ''; // Clearing previous movie results

    // If no movies are found, show a message
    if (!movies || movies.length === 0) {
      movieList.innerHTML = '<p>No movies found</p>'; // Display message when no movies are found
      return;
    }

    // Loop through each movie in the movies array
    movies.forEach((movie) => {
      const movieItem = document.createElement('div'); // Creates a new div for each movie
      movieItem.classList.add('movie-item'); // Adds a class for styling

      const movieTitle = document.createElement('h3'); // Creates a title element for the movie
      movieTitle.textContent = movie.title; // Setting the movie title

      // Making the poster URL, using a placeholder if no poster is available
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Use actual poster URL
        : 'https://via.placeholder.com/200x300.png?text=No+Image+Available'; // Use a placeholder if no poster

      const moviePoster = document.createElement('img'); // Creating an image element for the movie poster
      moviePoster.src = posterUrl; // Setting the source to the poster URL
      moviePoster.alt = movie.title; // Set alt text for the image 

      // Append the title and poster to the movie item div
      movieItem.appendChild(movieTitle);
      movieItem.appendChild(moviePoster);

      // Finally, append the movie item to the movie list on the page
      movieList.appendChild(movieItem);
    });
  }
});
