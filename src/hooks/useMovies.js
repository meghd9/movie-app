import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { getMovies, getPopularMovies } from "../services/tmdb";

export const useMovies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [movieList, setMovieList] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const movies = await getMovies(debouncedSearchTerm);
        setMovieList(movies);
      } catch (error) {
        console.error(`Error fetching movies: ${error}`);
        setMovieList([]);
        setErrorMessage("Error fetching movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const loadPopularMovies = async () => {
      try {
        const movies = await getPopularMovies();
        setPopularMovies(movies);
      } catch (error) {
        console.error(`Error fetching popular movies: ${error}`);
        setPopularMovies([]);
      }
    };

    loadPopularMovies();
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    movieList,
    popularMovies,
    isLoading,
    errorMessage,
  };
};
