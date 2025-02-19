import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import Tooltip from "./Tooltip";
import Logo from "./Logo";
import Contact from "./Contact";

function Navigation() {

  const location = useLocation();

  return (
    <nav className="fixed backdrop-blur-md bg-opacity-30 bg-white/45 w-full border-white border shadow-sm h-16 py-2 px-3 mb-5">
    <div className="flex justify-between">
        <Logo />
      <ul className="flex justify-center items-center">
        <li>
            {
              location.pathname === "/signin" ? 
              <Link to="/signup">
              <button className="border-black bg-black text-white text-md rounded-xl px-2 py-1 mr-2 shadow-sm">
                Sign Up
              </button>
            </Link>
              :

              <Link to="/signin">
              <button className="border-black bg-black text-md text-white rounded-xl px-2 py-1 mr-2 shadow-sm">
                Sign In
              </button>
            </Link>

            }
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
  </nav>
  )
}

export default Navigation