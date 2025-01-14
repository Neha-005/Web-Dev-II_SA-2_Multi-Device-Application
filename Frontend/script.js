// Function to toggle the visibility of the navbar for the hamburger menu
function toggleNavbar() {
  // Selecting the navbar links and hamburger icon elements
  const navbarLinks = document.querySelector("nav");
  const hamburger = document.querySelector(".hamburger");

  // Toggling the "active" class to show or hide the navbar and animate the hamburger icon
  navbarLinks.classList.toggle("active");
  hamburger.classList.toggle("active");
}

// Event listener to toggle the visibility of the search bar when the search icon is clicked
document.addEventListener("DOMContentLoaded", () => {
  // Select the search icon and search bar elements
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");

  // Toggle the "active" class to show or hide the search bar when the search icon is clicked
  searchIcon.addEventListener("click", () => {
    searchBar.classList.toggle("active");
  });
});

// handling the movie search functionality
document.addEventListener('DOMContentLoaded', function () {
  // Event listener for the search button click event
  document.getElementById('search-button').addEventListener('click', function () {
    // Getting the value entered by the user in the search input
    const query = document.getElementById('search-input').value.trim(); 

    // If the search input is empty, shows a message
    if (query === '') {
      alert('Please enter a search term'); // tell the user if the input is empty
      return; // Stop further action if the input is empty
    }

    // Calls the function to fetch movies based on the search term
    fetchMovies(query); 
  });

  /**
   * Fetch movies from the backend server based on the search query
   * @param {string} query - The search term entered by the user
   */
  function fetchMovies(query) {
    // Sending a GET request to the backend to search for movies
    fetch(`/search?query=${encodeURIComponent(query)}`)
      .then((response) => {
        // If the server response is not okay, show an error
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); // Return the server response as JSON
      })
      .then((data) => {
        console.log('Movies fetched from the backend:', data); // Logs the fetched data
        // Displaying the movies on the page
        displayMovies(data); 
      })
      .catch((error) => {
        // Handle errors, such as network issues or server errors
        console.error('Error fetching data:', error); // Log the error
        alert('Failed to fetch movie data. Please try again later.'); //tell the user in case of failure
      });
  }

  /**
   * Display the fetched movies on the page
   * @param {Array} movies - Array of movie objects fetched from the backend
   */
  function displayMovies(movies) {
    const movieList = document.getElementById('movie-list'); 
    movieList.innerHTML = ''; 

    // If no movies were found, display a message to the user
    if (!movies || movies.length === 0) {
      movieList.innerHTML = '<p>No movies found</p>';
      return; 
    }

    // Looping through each movie in the fetched movies array
    movies.forEach((movie) => {
      // Creates a container div for each movie
      const movieItem = document.createElement('div'); 
      movieItem.classList.add('movie-item'); 

      // Creates and adds the movie title to the movie item container
      const movieTitle = document.createElement('h3');
      movieTitle.textContent = movie.title;

      // Creates and add the movie poster image to the movie item container
      const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Using the actual poster URL
        : 'https://via.placeholder.com/200x300.png?text=No+Image+Available'; // Use a placeholder if no poster

      const moviePoster = document.createElement('img');
      moviePoster.src = posterUrl; // Setting the image source
      moviePoster.alt = movie.title; // Setting alt text for the image

      // adding the title and poster to the movie item container
      movieItem.appendChild(movieTitle);
      movieItem.appendChild(moviePoster);

      // adding the movie item container to the movie list on the page
      movieList.appendChild(movieItem);
    });
  }
});

// Signup Functionality
document.getElementById('signup-form').addEventListener('submit', async (event) => {
  
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const dob = document.getElementById('dob').value.trim();

  // Creates an error message element
  const error = document.createElement('div');
  error.style.color = 'red'; 

  if (name && email && password) {
    try {
      
      const response = await fetch('http://localhost:5221/api/user/', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ name, email, password, dob }),
      });

     
      const data = await response.json();

      
      if (response.ok) {
        alert('Sign Up Successfull!...');
        error.style.display = 'none'; 

      } else {
        error.textContent = data.message || 'Sign Up Failed! Please try again.';
        error.style.display = 'block'; 
        document.body.appendChild(error); 
      }
    } catch (err) {

      error.textContent = 'An error occurred. Please try again later.'; 
      error.style.display = 'block'; 
      document.body.appendChild(error);
    }
  } else {
    error.textContent = 'All fields are required!';
    error.style.display = 'block';
    document.body.appendChild(error); 
  }
});