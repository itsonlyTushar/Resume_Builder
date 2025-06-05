import { useNavigate } from "react-router-dom";

// function which adds smooth transition effect when switch pages

export function useViewTransition() {
  const navigate = useNavigate();

  return (to) => {
    if (document.startViewTransition) {
      document.startViewTransition(() => navigate(to));
    } else {
      navigate(to);
    }
  };    
}
