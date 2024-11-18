import React, { useContext, useEffect, useRef, useState } from 'react'
import './Photos.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../../../context/AuthContext';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import axios from 'axios';
import Form from './Form';

function Photos() {

  const { auth } = useContext( AuthContext );

  let { tmdbId } = useParams();
  let { movieId } = useParams();

  const [photoData, setPhotoData] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState();

  const [state, setState] = useState('base');

  useEffect(()=>{
    axios({
        method: 'get',
        url: `/photos`,
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${auth.accessToken}`,
          },
      }).then((response) => {
          setPhotoData(response.data)
          console.log(response.data)
    })
  },[state])

  return (
    <>
    <div className='photo-header'>
      <h2 onClick={() => setState('base')}>{state != 'base' ? <span className='back-button fas fa-chevron-left'><h3>Back to Photos</h3></span> :  'Photos'}</h2>
      <div>
        {state == 'base' && <button onClick={()=>setState('add')}>ADD PHOTO</button>}
      </div>
    </div>
    {state == 'add' && (<Form data={[]} state={state} setState={setState}/>)}
    {state == 'update' && (<Form data={selectedPhoto} state={state}  setState={setState}/>)}
    {state == 'base' && (<div className="photo-cards-container">
        <div className="photo-cards-group">
        {photoData?.map((photo) => (
          photo.movieId === parseInt(tmdbId) && (
            <div key={photo.id} className="photo-card" onClick={() => {setSelectedPhoto(photo); setState('update')}}>
              <img
                src={
                  photo.url && !photo.url.includes("null")
                    ? photo.url
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={photo.description}
                className="photo-image"
              />
            </div>
          )
        ))}
        </div>
    </div>)}
    </>
  )
}

export default Photos