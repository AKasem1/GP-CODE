import { ReviewContext } from "../context/ReviewContext";
import { useContext } from "react";

export const useReviewContext = () => {
  const context = useContext(ReviewContext);

  if (!context) {
    throw new Error('Failed to access ReviewContext. Make sure you have wrapped your component with the ReviewContextProvider.');
  }

  return context;
};