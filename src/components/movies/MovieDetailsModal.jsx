import Spinner from "../Spinner";
import { getPosterUrl } from "../../services/tmdb";

const MovieDetailsModal = ({
  selectedMovieId,
  selectedMovieDetails,
  isLoadingDetails,
  detailsErrorMessage,
  onClose,
}) => {
  if (!selectedMovieId) {
    return null;
  }

  return (
    <div className="movie-modal-backdrop" onClick={onClose}>
      <div
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Movie details"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="movie-modal-close" onClick={onClose}>
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
                src={getPosterUrl(selectedMovieDetails.poster_path)}
                alt={selectedMovieDetails.title}
              />

              <div>
                <h3>{selectedMovieDetails.title}</h3>
                <p>{selectedMovieDetails.overview || "No overview available."}</p>

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
  );
};

export default MovieDetailsModal;
