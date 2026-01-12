import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// custom functon will scorll to top after every page changes
export const ScrollTop = () => {
  const path = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
};

// does the checking of if string or object is not empty
export const checkStr = (str) => str.trim().length > 0;

export const checkEach = (details, str) => {
  return details.some((obj) => obj[str] !== "");
};

// Sanitizes user input by removing potentially harmful characters
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  // Remove < > " ' characters to prevent basic XSS, preserve all spaces
  return input.replace(/[<>\"']/g, '');
};
