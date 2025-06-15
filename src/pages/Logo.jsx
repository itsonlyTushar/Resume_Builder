import { useLocation, useNavigate } from "react-router";

function Logo() {
  const navigate = useNavigate();
  const current_location = useLocation();

  const handleNavigation = (targetpath) => {

    if(current_location.pathname === targetpath) {
      return
    }
    navigate(targetpath)

  }

  return (
    <h1 className={`sm:text-3xl text-2xl font-bold`}>
      <button onClick={() => handleNavigation('/select_template')}>
        <i className="ri-attachment-2"></i>ResuMate
      </button>
    </h1>
  );
}

export default Logo;
