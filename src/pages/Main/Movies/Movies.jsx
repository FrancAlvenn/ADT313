import React from 'react'
import { Outlet } from 'react-router-dom'
import './Movies.css'

function Movies() {
  return (
    <>
        <div className='movies-header'>Movies</div>
        <Outlet />
    </>
  )
}

export default Movies