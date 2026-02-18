const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const requestJson = async (endpoint, fallbackErrorMessage) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, API_OPTIONS);

  if (!response.ok) {
    throw new Error(fallbackErrorMessage);
  }

  return response.json();
};

export const getMovies = async (query = "") => {
  const endpoint = query
    ? `/search/movie?query=${encodeURIComponent(query)}`
    : "/discover/movie?sort_by=popularity.desc";

  const data = await requestJson(endpoint, "Failed to fetch movies");
  return data.results || [];
};

export const getPopularMovies = async () => {
  const data = await requestJson(
    "/movie/popular?language=en-US&page=1",
    "Failed to fetch popular movies"
  );

  return data.results || [];
};

export const getMovieDetails = async (movieId) => {
  return requestJson(
    `/movie/${movieId}?language=en-US`,
    "Failed to fetch movie details"
  );
};

export const getPosterUrl = (path) => {
  if (!path) {
    return "/no-movie.png";
  }

  return `https://image.tmdb.org/t/p/w500${path}`;
};
