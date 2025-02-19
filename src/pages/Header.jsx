import React from 'react'

function Header() {
  return (
    <nav className='fixed backdrop-blur-md bg-opacity-30  bg-white/45 w-full border-white border shadow-sm h-16 py-2 px-3 '>
        <div className='flex justify-between'>
            <Link>Logo</Link>
            <ul className='flex space-x-3 text-lg' >
            <li>
            <button className='border-black bg-black text-white rounded-2xl px-3 py-1 shadow-sm'>
                <Link to="/signIn">Sign In</Link>
            </button>
            </li>
            <li>
            <button className='py-1 px-3 border bg-white rounded-full text-xl shadow-sm'>
                Sign Up
            </button>
            </li>
            </ul>
        </div>
    </nav>
  )
}

export default Header