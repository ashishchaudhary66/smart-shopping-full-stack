

import React from 'react'

function Spinner() {
  return (
    <div className='flex flex-col justify-center items-center h-[80vh]'>
        <div className='spinner'></div>
        <h2>Loading...</h2>
    </div>
  )
}

export default Spinner