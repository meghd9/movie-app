import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/tmdb";

export const useMovieDetails = () => {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieDetails, setSelectedMovieDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsErrorMessage, setDetailsErrorMessage] = useState("");

  const closeMovieDetails = () => {
    setSelectedMovieId(null);
    setSelectedMovieDetails(null);
    setDetailsErrorMessage("");
  };

  const selectMovie = async (movieId) => {
    setSelectedMovieId(movieId);
    setSelectedMovieDetails(null);
    setDetailsErrorMessage("");
    setIsLoadingDetails(true);

    try {
      const details = await getMovieDetails(movieId);
      setSelectedMovieDetails(details);
    } catch (error) {
      console.error(`Error fetching movie details: ${error}`);
      setSelectedMovieDetails(null);
      setDetailsErrorMessage("Error fetching movie details. Please try again.");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (!selectedMovieId) {
      return undefined;
    }

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

  return {
    selectedMovieId,
    selectedMovieDetails,
    isLoadingDetails,
    detailsErrorMessage,
    selectMovie,
    closeMovieDetails,
  };
};
