import { useNavigate } from "react-router-dom";

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
