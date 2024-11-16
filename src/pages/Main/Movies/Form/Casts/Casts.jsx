import React, { useEffect, useRef, useState } from 'react'
import './Casts.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Casts() {

    let { tmdbId } = useParams();

    const [castData, setCastData] = useState([]);
    const [crewData, setCrewData] = useState([]);

    const castCardsRef = useRef(null);

    console.log(tmdbId)
    useEffect(() => {
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


      return (
        <div>
          <h1>Casts</h1>
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