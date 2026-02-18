import { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";

const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsErrorMessage, setDetailsErrorMessage] = useState("");

  const [popularMovies, setPopularMovies] = useState([]);

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (!data.results) {
        setErrorMessage("Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPopularMovies = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/popular?language=en-US&page=1`,
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error("Failed to fetch popular movies");
      }

      const data = await response.json();
      setPopularMovies(data.results || []);
    } catch (error) {
      console.error(`Error fetching popular movies: ${error}`);
    }
  };

  const fetchMovieDetails = async (movieId) => {
    setIsLoadingDetails(true);
    setDetailsErrorMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/movie/${movieId}?language=en-US`,
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }

      const data = await response.json();
      setSelectedMovieDetails(data);
    } catch (error) {
      console.error(`Error fetching movie details: ${error}`);
      setSelectedMovieDetails(null);
      setDetailsErrorMessage("Error fetching movie details. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleMovieSelect = (movieId) => {
    setSelectedMovieId(movieId);
    setSelectedMovieDetails(null);
    fetchMovieDetails(movieId);
  };

  const closeMovieDetails = () => {
    setSelectedMovieId(null);
    setSelectedMovieDetails(null);
    setDetailsErrorMessage("");
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    loadPopularMovies();
  }, []);

  useEffect(() => {
    if (!selectedMovieId) return undefined;

    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        closeMovieDetails();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [selectedMovieId]);

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {popularMovies.length > 0 && (
          <section className="trending">
            <h2>Popular Movies</h2>

            <ul>
              {popularMovies.slice(0, 5).map((movie, index) => (
                <li key={movie.id}>
                  <p>{index + 1}</p>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <li key={movie.id}>
                  <MovieCard movie={movie} onSelect={handleMovieSelect} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {selectedMovieId && (
        <div className="movie-modal-backdrop" onClick={closeMovieDetails}>
          <div
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Movie details"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="movie-modal-close"
              onClick={closeMovieDetails}
            >
              ×
            </button>

            {isLoadingDetails ? (
              <div className="movie-modal-loading">
                <Spinner />
              </div>
            ) : detailsErrorMessage ? (
              <p className="text-red-500">{detailsErrorMessage}</p>
            ) : (
              selectedMovieDetails && (
                <div className="movie-modal-content">
                  <img
                    src={
                      selectedMovieDetails.poster_path
                        ? `https://image.tmdb.org/t/p/w500${selectedMovieDetails.poster_path}`
                        : "/no-movie.png"
                    }
                    alt={selectedMovieDetails.title}
                  />

                  <div>
                    <h3>{selectedMovieDetails.title}</h3>
                    <p>
                      {selectedMovieDetails.overview || "No overview available."}
                    </p>

                    <div className="movie-modal-meta">
                      <p>
                        <strong>Release Date:</strong>{" "}
                        {selectedMovieDetails.release_date || "N/A"}
                      </p>
                      <p>
                        <strong>Runtime:</strong>{" "}
                        {selectedMovieDetails.runtime
                          ? `${selectedMovieDetails.runtime} minutes`
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Rating:</strong>{" "}
                        {selectedMovieDetails.vote_average
                          ? selectedMovieDetails.vote_average.toFixed(1)
                          : "N/A"}
                      </p>
                      <p>
                        <strong>Genres:</strong>{" "}
                        {selectedMovieDetails.genres?.length
                          ? selectedMovieDetails.genres
                              .map((genre) => genre.name)
                              .join(", ")
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
