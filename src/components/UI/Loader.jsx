import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

function Loader() {

  return (
    <div className='min-h-screen flex justify-center items-center mx-auto w-auto'>
          <svg width={0} height={0}>
           <defs>
            <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="black" />
            <stop offset="100%" stopColor="#171F2E" />
            </linearGradient>
           </defs>
          </svg>
          <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />  
    </div>
  )
}

export default Loader