// Imported necessary modules
import express from 'express';  // Express framework to create the server and routes
import path from 'path';  // To work with file and directory paths
import cors from 'cors';  // To enable Cross-Origin Resource Sharing (CORS)
import fetch from 'node-fetch';  // To make HTTP requests to the external API
import dotenv from 'dotenv';  // To load environment variables from .env file
import { fileURLToPath } from 'url';  // To work with file URLs
import userRoutes from './routes/userRoutes.js'; // Importing the user routes for registration and login
import mongoose from 'mongoose';  // To connect to MongoDB

//  dotenv is to load environment variables from the .env file
dotenv.config();

// Creating an Express application instance
const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());  

// Using the userRoutes for '/api/user' endpoint
app.use('/api/user', userRoutes)

// Setting the port for the server to run on
const port = 5221;

// Fetching the API key for The Movie DB from the .env file
const apiKey = process.env.TMDB_API_KEY;
const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// MongoDB Atlas connection URI from the .env file
const dbURI = process.env.DB_URI;

// Checks if the TMDB_API_KEY exists in the .env file
if (!apiKey) {
  // If the API key is missing, shows an error and exit the server
  console.error('Error: TMDB_API_KEY is missing in the .env file.');
  process.exit(1);  // Stop execution of the server if no API key is present
}

// Function to connect to MongoDB Atlas
const connectDB = async () => {
  try {
      await mongoose.connect(dbURI);
      console.log('MongoDB Connected...');
  } catch (err) {
      console.error('Error connecting to MongoDB:', err.message);
  }
};

// Connect to MongoDB Atlas
connectDB();

// the current file's directory and name using the 'url' module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to enable CORS for all incoming requests
app.use(cors());  // This allows other domains to access the server

// Serve static files (for frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the "Frontend" folder
app.use('/Frontend', express.static(path.join(__dirname, '..', 'Frontend')));

// Route to handle movie search queries
app.get('/search', async (req, res) => {
  // Extract the query parameter from the request URL
  const query = req.query.query;

  // If no query is provided, return a 400 Bad Request response
  if (!query) {
    return res.status(400).send('Search query is required');
  }

  try {
    // Make a GET request to The Movie DB API with the search query using fetch
    const response = await fetch(`${apiUrl}${encodeURIComponent(query)}`);
    
    // Checking if the API returned any results
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      // If results are found, send them back as JSON
      res.json(data.results);
    } else {
      // If no results are found, return a 404 Not Found response
      res.status(404).send('No results found');
    }
  } catch (error) {
    // If there is an error with the API request, log the error and send a 500 response
    console.error('Error fetching data from The Movie DB API:', error.message);
    res.status(500).send('Error fetching data from The Movie DB API');
  }
});

// Route to serve the index.html file
app.get('/', (req, res) => {
  // Send the index.html file located in the root of the project
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Starting the server and showing a message when it is running
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});