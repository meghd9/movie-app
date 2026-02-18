import Search from "./components/Search";
import MovieDetailsModal from "./components/movies/MovieDetailsModal";
import MoviesGrid from "./components/movies/MoviesGrid";
import PopularMovies from "./components/movies/PopularMovies";
import { useMovieDetails } from "./hooks/useMovieDetails";
import { useMovies } from "./hooks/useMovies";

const App = () => {
  const { searchTerm, setSearchTerm, movieList, popularMovies, isLoading, errorMessage } =
    useMovies();

  const {
    selectedMovieId,
    selectedMovieDetails,
    isLoadingDetails,
    detailsErrorMessage,
    selectMovie,
    closeMovieDetails,
  } = useMovieDetails();

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You&apos;ll Enjoy
            Without the Hassle
          </h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <PopularMovies movies={popularMovies} />

        <MoviesGrid
          isLoading={isLoading}
          errorMessage={errorMessage}
          movies={movieList}
          onSelectMovie={selectMovie}
        />
      </div>

      <MovieDetailsModal
        selectedMovieId={selectedMovieId}
        selectedMovieDetails={selectedMovieDetails}
        isLoadingDetails={isLoadingDetails}
        detailsErrorMessage={detailsErrorMessage}
        onClose={closeMovieDetails}
      />
    </main>
  );
};

export default App;
