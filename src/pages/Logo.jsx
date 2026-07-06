import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function Logo() {
  const navigate = useNavigate();
  const current_location = useLocation();
  const { currentUser } = useAuth();

  const handleNavigation = () => {
    const targetpath = currentUser ? "/select_template" : "/";
    if (current_location.pathname === targetpath) {
      return;
    }
    navigate(targetpath);
  };

  return (
    <h1 className={`sm:text-3xl text-2xl font-extrabold tracking-tight`}>
      <button onClick={handleNavigation}>
        <span style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700, marginRight: '2px' }}>x</span><span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}>LPA</span>
      </button>
    </h1>
  );
}

export default Logo;
