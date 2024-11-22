import React, { useContext, useEffect, useRef, useState } from 'react'
import './Videos.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../../../../context/AppContext';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import axios from 'axios';
import Form from './Form';

function Videos() {

  const { auth } = useContext( AppContext );

  let { tmdbId } = useParams();
  let { movieId } = useParams();

  const [videoData, setVideoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState();

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
      url: `/videos`,
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
    }).then((response) => {
        setVideoData(response.data)
        console.log(response.data)
  })
  }

    //IMPORT FUNCTION
    function importVideos(){
      axios({
          method: 'get',
          url: `https://api.themoviedb.org/3/movie/${tmdbId}/videos`,
          headers: {
              Accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2FhNTRiYzJhNzI2MTFlZjY3MDAxZDllYjVkNThkMyIsIm5iZiI6MTcyOTI5NzUwNi40MzA0MTYsInN1YiI6IjY3MTJmYTU3MTZjYWE4YjBmMDljN2U1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prLBCxZWKAzfnbc5pboPiBEiHNWu4j8csiGBO2Af7x4', // Make sure to replace this with your actual API key
            },
      }).then((response) => {
          saveImportedCasts(response.data.results);
  
          setIsError(false);
          setAlertMessage(`Successfully Imported ${response.data.results.length} Videos`);
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
        url: `https://youtube.com/embed/${data.key}`,
        description: `Imported from TMDB`,
      };
      console.log('Sending payload:', payload);
      try {
        const response = await axios.post('/videos', payload, {
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
    const isConfirmed = window.confirm('Are you sure you want to delete this Video?');
    if (isConfirmed) {
      axios({
        method: 'delete',
        url: `/videos/${id}`,
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
    <div className='video-header'>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <h2 onClick={() => setState('base')}>{state != 'base' ? <span className='back-button fas fa-chevron-left'><h3>Back to Videos</h3></span> :  'Videos'}</h2>
      <div>
        <button onClick={importVideos}>IMPORT VIDEOS</button>
        {state == 'base' && <button onClick={()=>setState('add')}>ADD VIDEO</button>}
      </div>
    </div>
    {state == 'add' && (<Form data={[]} state={state} setState={setState}/>)}
    {state == 'update' && (<Form data={selectedVideo} state={state}  setState={setState}/>)}
    {state == 'base' && (
      <div className="video-cards-container">
        <div className="video-cards-group">
          {videoData?.map((video) => (
          video.movieId === parseInt(tmdbId) && (
            <div key={video.id} className="video-card" onClick={() => {setSelectedVideo(video)}}>
                <div className='control-group'>
                  <span onClick={() => {setSelectedVideo(video); setState('update')}} className='fas fa-edit'></span>
                  <span onClick={() => {handleDelete(video.id)}} className='fas fa-trash-can'></span>
                </div>
                <iframe
                  src={
                    video.url && !video.url.includes("null")
                      ? video.url
                      : 'https://via.placeholder.com/500x300?text=No+Video'
                    }
                    className="video-frame"
                    allowFullScreen
                  >
                </iframe>
            </div>
          )
          ))}
        </div>
      </div>)}
    </>
  )
}

export default Videos