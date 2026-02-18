import { getPosterUrl } from "../../services/tmdb";

const PopularMovies = ({ movies }) => {
  if (!movies.length) {
    return null;
  }

  return (
    <section className="trending">
      <h2>Popular Movies</h2>

      <ul>
        {movies.slice(0, 5).map((movie, index) => (
          <li key={movie.id}>
            <p>{index + 1}</p>
            <img src={getPosterUrl(movie.poster_path)} alt={movie.title} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PopularMovies;
