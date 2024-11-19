import React, { useContext, useEffect, useRef, useState } from 'react'
import './Videos.css'
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../../../../context/AuthContext';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';
import axios from 'axios';
import Form from './Form';

function Videos() {

  const { auth } = useContext( AuthContext );

  let { tmdbId } = useParams();
  let { movieId } = useParams();

  const [videoData, setVideoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState();

  const [state, setState] = useState('base');

  useEffect(()=>{
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
  },[state])

  return (
    <>
    <div className='video-header'>
      <h2 onClick={() => setState('base')}>{state != 'base' ? <span className='back-button fas fa-chevron-left'><h3>Back to Videos</h3></span> :  'Videos'}</h2>
      <div>
        {state == 'base' && <button onClick={()=>setState('add')}>ADD VIDEO</button>}
      </div>
    </div>
    {state == 'add' && (<Form data={[]} state={state} setState={setState}/>)}
    {state == 'update' && (<Form data={selectedVideo} state={state}  setState={setState}/>)}
    {state == 'base' && (<div className="video-cards-container">
        <div className="video-cards-group">
        {videoData?.map((video) => (
          video.movieId === parseInt(tmdbId) && (
            <div key={video.id} className="video-card" onClick={() => {setSelectedVideo(video); setState('update')}}>
              <img
                src={
                  video.url && !video.url.includes("null")
                    ? video.url
                    : 'https://via.placeholder.com/500x750?text=No+Video'
                }
                alt={video.description}
                className="video-image"
              />
            </div>
          )
        ))}
        </div>
    </div>)}
    </>
  )
}

export default Videos