import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

function Loader() {

  return (
    <div className='min-h-screen flex justify-center items-center w-auto'>
      <i className="ri-loader-2-fill text-2xl animate-spin"></i>
    </div>
  )
}

export default Loader