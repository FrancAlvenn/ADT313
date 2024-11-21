import React, { useContext, useEffect, useRef, useState } from 'react'
import './Casts.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../../../context/AuthContext';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import axios from 'axios';
import Form from './Form';

function Casts() {

  const { auth } = useContext( AuthContext );

  let { tmdbId } = useParams();
  let { movieId } = useParams();

  const [castData, setCastData] = useState([]);
  const [selectedCast, setSelectedCast] = useState();

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
      url: `/casts`,
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
    }).then((response) => {
        setCastData(response.data)
        console.log(response.data)
  })
  }

//IMPORT FUNCTION
  function importCasts(){
      axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2FhNTRiYzJhNzI2MTFlZjY3MDAxZDllYjVkNThkMyIsIm5iZiI6MTcyOTI5NzUwNi40MzA0MTYsInN1YiI6IjY3MTJmYTU3MTZjYWE4YjBmMDljN2U1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prLBCxZWKAzfnbc5pboPiBEiHNWu4j8csiGBO2Af7x4', // Make sure to replace this with your actual API key
            },
      }).then((response) => {
          saveImportedCasts(response.data.cast);

          setIsError(false);
          setAlertMessage(`Successfully Imported ${response.data.cast.length} Casts`);
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
        name: data.name,
        characterName: data.character,
        url: `https://image.tmdb.org/t/p/w500/${data.profile_path}`,
      };
      console.log('Sending payload:', payload);
      try {
        const response = await axios.post('/casts', payload, {
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
    const isConfirmed = window.confirm('Are you sure you want to delete this cast?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/casts/${id}`,
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
    <div className='cast-header'>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <h2 onClick={() => setState('base')}>{state != 'base' ? <span className='back-button fas fa-chevron-left'><h3>Back to Casts</h3></span> :  'Casts'}</h2>
      <div>
        <button onClick={importCasts}>IMPORT CASTS</button>
        {state == 'base' && <button onClick={()=>setState('add')}>ADD CAST</button>}
      </div>
    </div>
    {state == 'add' && (<Form data={[]} state={state} setState={setState}/>)}
    {state == 'update' && (<Form data={selectedCast} state={state}  setState={setState}/>)}
    {state == 'base' && (<div className="cast-cards-container">
        <div className="cast-cards-group">
        {castData?.map((cast) => (
          cast.movieId === parseInt(tmdbId) && (
            <div key={cast.id} className="cast-card" onClick={() => {setSelectedCast(cast)}}>
                <div className='control-group'>
                  <span onClick={() => {setSelectedCast(cast); setState('update')}} className='fas fa-edit'></span>
                  <span onClick={() => {handleDelete(cast.id)}} className='fas fa-trash-can'></span>
                </div>
                <img
                  src={
                    cast.url && !cast.url.includes("null")
                      ? cast.url
                      : 'https://via.placeholder.com/500x750?text=No+Image'
                  }
                    className="cast-image"
                    allowFullScreen
                  />
                  <p className='cast-name'>{cast.name}</p>
                  <p className='cast-character-name'>{cast.characterName}</p>
            </div>
          )
        ))}
        </div>
    </div>)}
    </>
  )
}

export default Casts