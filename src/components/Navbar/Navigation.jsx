import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tooltip from "../UI/Tooltip";
import Logo from "../../pages/Logo";
import Contact from "../../pages/Contact";

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav
        className={`flex justify-between fixed backdrop-blur-md bg-opacity-30 bg-white/45 w-full border-white border shadow-sm ${
          isOpen && "h-30"
        }  z-20`}
      >
        <div className="block sm:hidden px-2 pt-2">
          <Logo />
        </div>
        <div
          className={`sm:block hidden fixed backdrop-blur-md bg-opacity-30 bg-white/70 w-full border-white border shadow-sm h-16 py-2 px-3 mb-5 z-20`}
        >
          <div className="flex justify-between">
            <Logo />
            <ul className="flex justify-center items-center">
              <li>
                {location.pathname === "/signin" ? (
                  <Link to="/signup">
                    <button className="border-black bg-black text-white text-md rounded-xl px-2 py-1 mr-2 shadow-sm">
                      Sign Up
                    </button>
                  </Link>
                ) : (
                  <Link to="/signin">
                    <button className="border-black bg-black text-md text-white rounded-xl px-2 py-1 mr-2 shadow-sm">
                      Sign In
                    </button>
                  </Link>
                )}
              </li>
              <li>
                <Tooltip title="Contact">
                  <button className="border-white border bg-white text-md text-black rounded-xl px-2 py-1 mr-1 shadow-sm">
                    <Contact />
                  </button>
                </Tooltip>
              </li>
            </ul>
          </div>
        </div>

        <div className="px-2 pt-2 block sm:hidden ">
          <button className="text-2xl" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? (
              <i className="ri-close-fill"></i>
            ) : (
              <i className="ri-menu-line"></i>
            )}
          </button>

          <div>
            {isOpen && (
              <ul className="">
                <li>
                  {location.pathname === "/signin" ? (
                    <Link to="/signup">
                      <button className="border-black bg-black text-white text-md rounded-xl px-2 py-1 shadow-sm">
                        Sign Up
                      </button>
                    </Link>
                  ) : (
                    <Link to="/signin">
                      <button className="border-black bg-black text-md text-white rounded-xl px-2 py-1 shadow-sm">
                        Sign In
                      </button>
                    </Link>
                  )}
                </li>
                <li className="my-2">
                  <Tooltip title="Contact">
                    <button className="border-white border bg-white text-md text-black rounded-xl px-2 py-1 mt-4 shadow-sm">
                      <Contact />
                    </button>
                  </Tooltip>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navigation;
