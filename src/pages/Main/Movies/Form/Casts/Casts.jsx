import React, { useContext, useEffect, useRef, useState } from 'react'
import './Casts.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';

function Casts() {

    //user token and information
    const { auth } = useContext(AuthContext);

    let { tmdbId } = useParams();
    let { movieId } = useParams();
    const castCardsRef = useRef(null);


    const [castData, setCastData] = useState([]);
    const [crewData, setCrewData] = useState([]);

    useEffect(() => {
        const data = {
        }
        axios({
            method: 'get',
            url: `https://api.themoviedb.org/3/movie/${tmdbId}/credits?language=en-US`,
            headers: {
                Accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2FhNTRiYzJhNzI2MTFlZjY3MDAxZDllYjVkNThkMyIsIm5iZiI6MTcyOTI5NzUwNi40MzA0MTYsInN1YiI6IjY3MTJmYTU3MTZjYWE4YjBmMDljN2U1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prLBCxZWKAzfnbc5pboPiBEiHNWu4j8csiGBO2Af7x4', // Make sure to replace this with your actual API key
              },
        }).then((response) => {
            setCastData(response.data.cast)
            setCrewData(response.data.crew)
            console.log(response)
        })
    },[tmdbId])


    function SaveCast(){

        const data = {
          userId: auth.user.userId,
          movieId: movieId,
          name: castData[0].name,
          characterName: castData[0].character,
          url: `https://image.tmdb.org/t/p/original/${castData[0].profile_path}`
        }

        console.log(data)
      
        axios({
            method: 'POST',
            url: '/casts',
            data: data,
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            }
        }).then((response) => {
            console.log("Database Updated", response)
        }).catch((err => {
          console.log(err)
        }))
    }


      return (
        <div className='cast-and-crew-container'>
          <div className='cast-and-crew-header'>
            <h1>Casts</h1>
            <button onClick={SaveCast}>ADD CAST</button>
          </div>
          <div className="cast-cards-container">
            <div className="cast-cards" ref={castCardsRef}>
              {castData.map((cast) => (
                <div key={cast.cast_id} className="cast-card">
                  <img
                    src={
                      cast.profile_path
                        ? `https://image.tmdb.org/t/p/w500${cast.profile_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={cast.name}
                    className="cast-image"
                  />
                  <div className="cast-info">
                    <h3>{cast.name}</h3>
                    <p>{cast.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h1>Crew</h1>
          <div className="cast-cards-container">
            <div className="cast-cards" ref={castCardsRef}>
              {crewData.map((crew) => (
                <div key={crew.cast_id} className="cast-card">
                  <img
                    src={
                      crew.profile_path
                        ? `https://image.tmdb.org/t/p/w500${crew.profile_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={crew.name}
                    className="cast-image"
                  />
                  <div className="cast-info">
                    <h3>{crew.name}</h3>
                    <p>{crew.job}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
}

export default Casts