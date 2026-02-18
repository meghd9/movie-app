import MovieCard from "../MovieCard";
import Spinner from "../Spinner";

const MoviesGrid = ({ isLoading, errorMessage, movies, onSelectMovie }) => {
  return (
    <section className="all-movies">
      <h2>All Movies</h2>

      {isLoading ? (
        <Spinner />
      ) : errorMessage ? (
        <p className="text-red-500">{errorMessage}</p>
      ) : (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard movie={movie} onSelect={onSelectMovie} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default MoviesGrid;
