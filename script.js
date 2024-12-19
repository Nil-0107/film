const API_KEY = "889f9ec4"; // Replace with your OMDb API key
const movieContainer = document.getElementById("movieContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const genreButtons = document.querySelectorAll(".genre-button");

// Fetch movies from OMDb API
async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?s=${query}&apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieContainer.innerHTML = `<p>No movies found for "${query}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    movieContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

// Display movies on the page
function displayMovies(movies) {
  movieContainer.innerHTML = ""; // Clear previous results
  movies.forEach(movie => {
    const movieElement = document.createElement("div");
    movieElement.classList.add("movie");

    movieElement.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300"}" alt="${movie.Title}">
      <h3>${movie.Title}</h3>
      <p>Year: ${movie.Year}</p>
    `;

    movieElement.addEventListener("click", () => openMovieDetailsInNewWindow(movie.imdbID));
    movieContainer.appendChild(movieElement);
  });
}

// Open movie details in a new window
async function openMovieDetailsInNewWindow(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const movie = await response.json();

    if (movie.Response === "True") {
      // Open a new window
      const movieWindow = window.open("", "_blank", "width=800,height=600");

      // Populate the new window with movie details
      movieWindow.document.write(`
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${movie.Title} - Details</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #121212;
              color: white;
              margin: 0;
              padding: 0;
            }
            .movie-details {
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
            }
            .movie-details img {
              width: 250px;
              height: 375px;
              margin-bottom: 20px;
            }
            .movie-details h3 {
              margin-top: 0;
              font-size: 2rem;
            }
            .movie-details p {
              font-size: 1rem;
              margin: 5px 0;
            }
            .movie-details .rating {
              font-weight: bold;
              color: #e50914;
            }
          </style>
        </head>
        <body>
          <div class="movie-details">
            <img src="${movie.Poster}" alt="${movie.Title}">
            <h3>${movie.Title} (${movie.Year})</h3>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p class="rating"><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
            <p><strong>Language:</strong> ${movie.Language}</p>
          </div>
        </body>
        </html>
      `);

      movieWindow.document.close();
    } else {
      alert("Movie details not found.");
    }
  } catch (error) {
    console.error("Error fetching movie details:", error);
  }
}

// Event listener for the search button
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  } else {
    movieContainer.innerHTML = "<p>Please enter a movie title.</p>";
  }
});

// Event listener for the Enter key to initiate search
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    if (query) {
      fetchMovies(query);
    } else {
      movieContainer.innerHTML = "<p>Please enter a movie title.</p>";
    }
  }
});

// Event listeners for genre buttons
genreButtons.forEach(button => {
  button.addEventListener("click", () => {
    const genre = button.textContent.trim().toLowerCase();
    suggestMoviesByGenre(genre);
  });
});

// Suggest movies based on selected genre
async function suggestMoviesByGenre(genre) {
  const genreMappings = {
    "action": "action",
    "comedy": "comedy",
    "drama": "drama",
    "romance": "romance",
    "horror": "horror",
    "thriller": "thriller"
  };

  const url = `https://www.omdbapi.com/?s=${genreMappings[genre]}&apikey=${API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      displayMovies(data.Search);
    } else {
      movieContainer.innerHTML = `<p>No movies found for genre "${genre}".</p>`;
    }
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    movieContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

// Suggest movies on page load (optional)
window.onload = () => {
  // Default suggestions when the page loads
  suggestMoviesByGenre("action");
};
