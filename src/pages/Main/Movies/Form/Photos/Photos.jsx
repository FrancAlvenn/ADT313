import React from 'react'
import './Photos.css'
import { useNavigate, useParams } from 'react-router-dom';

function Photos() {

  let { tmdbId } = useParams();
  return (
    <>
    <h1>Photos</h1>
    </>
  )
}

export default Photos