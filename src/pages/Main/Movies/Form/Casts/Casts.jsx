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