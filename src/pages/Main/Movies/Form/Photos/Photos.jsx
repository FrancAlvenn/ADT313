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

  // alert box state
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(()=>{
    getAll();
  },[state])

  function getAll(){
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
  }

  //IMPORT FUNCTION
  function importPhotos(){
    axios({
        method: 'get',
        url: `https://api.themoviedb.org/3/movie/${tmdbId}/images`,
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2FhNTRiYzJhNzI2MTFlZjY3MDAxZDllYjVkNThkMyIsIm5iZiI6MTcyOTI5NzUwNi40MzA0MTYsInN1YiI6IjY3MTJmYTU3MTZjYWE4YjBmMDljN2U1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prLBCxZWKAzfnbc5pboPiBEiHNWu4j8csiGBO2Af7x4', // Make sure to replace this with your actual API key
          },
    }).then((response) => {
        saveImportedCasts(response.data.backdrops);

        setIsError(false);
        setAlertMessage(`Successfully Imported ${response.data.backdrops.length} Photos`);
        setTimeout(() => {
          setAlertMessage('')
          getAll();
        }, 2000);

    })
}

async function saveImportedCasts(importedData) {
  console.log(importedData)
  await Promise.all(importedData.map(async (data) => {
    const payload = {
      userId: auth.user.userId,
      movieId: tmdbId,
      url: `https://image.tmdb.org/t/p/w500/${data.file_path}`,
      description: `Imported from TMDB`,
    };
    console.log('Sending payload:', payload);
    try {
      const response = await axios.post('/photos', payload, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
      });
      console.log('Response:', response);
    } catch (error) {
      console.error('Error sending cast data:', error);
    }
  }));
  console.log('Done!');
}

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this photo?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/photos/${id}`,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
        },
      })
        .then((response) => {
          console.log('Database Updated');
          console.log(response.data);
          setIsError(false);
          setAlertMessage(response.data.message);
          setTimeout(() => {
            setAlertMessage('');
            setState('base');
            getAll();
          }, 2000);
        })
        .catch((error) => {
          console.log(error.data);
          setIsError(true);
          setAlertMessage(error.data.message);
          setTimeout(() => setAlertMessage(''), 2000);
        });
    }
  };

  return (
    <>
    <div className='photo-header'>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <h2 onClick={() => setState('base')}>{state != 'base' ? <span className='back-button fas fa-chevron-left'><h3>Back to Photos</h3></span> :  'Photos'}</h2>
      <div>
        <button onClick={importPhotos}>IMPORT PHOTOS</button>
        {state == 'base' && <button onClick={()=>setState('add')}>ADD PHOTO</button>}
      </div>
    </div>
    {state == 'add' && (<Form data={[]} state={state} setState={setState}/>)}
    {state == 'update' && (<Form data={selectedPhoto} state={state}  setState={setState}/>)}
    {state == 'base' && (<div className="photo-cards-container">
        <div className="photo-cards-group">
        {photoData?.map((photo) => (
          photo.movieId === parseInt(tmdbId) && (
            <div key={photo.id} className="photo-card" onClick={() => {setSelectedPhoto(photo)}}>
              <div className='control-group'>
                <span onClick={() => {setSelectedPhoto(photo); setState('update')}} className='fas fa-edit'></span>
                <span onClick={() => {handleDelete(photo.id)}} className='fas fa-trash-can'></span>
              </div>
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