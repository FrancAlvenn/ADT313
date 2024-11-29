import axios from 'axios';
import './Home.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

function Home() {
  // user token and information
  const { auth } = useContext(AppContext);

  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);

  // alert box state
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    if (
      auth.accessToken === undefined ||
      auth.accessToken === '' ||
      auth.accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    getAllMovies();
  }, []);

  // Get all movies
  const getAllMovies = () => {
    axios({
      method: 'get',
      url: '/movies',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
      .then((response) => {

        //get all featured movies
        const allMovies = response.data;
        const featuredMovies = allMovies.filter((movie) => movie.isFeatured === true);
        const selectedFeaturedMovies = featuredMovies.length > 0 ? featuredMovies : allMovies.slice(0, 5); //condition where there are no featured movie

        setMovies(response.data);
        setFeaturedMovies(selectedFeaturedMovies);
        setIsError(false);
        setAlertMessage(response.data.message);
        setTimeout(() => {
          setAlertMessage('');
        }, 2000);
      })
      .catch((error) => {
        setIsError(true);
        setAlertMessage(error.message);
        setTimeout(() => {
          setAlertMessage('');
        }, 2000);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeaturedIndex((prevIndex) =>
        prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

 
    return () => clearInterval(interval);
  }, [featuredMovies]);


  const handleNextMovie = () => {
    setCurrentFeaturedIndex((prevIndex) =>
      prevIndex === featuredMovies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevMovie = () => {
    setCurrentFeaturedIndex((prevIndex) =>
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className='user-home'>
      {alertMessage && (
        <div className={`alert-box ${isError ? 'error' : 'success'}`}>
          {alertMessage}
        </div>
      )}
      <div className='user-container'>
        <div className='featured-movie'>
          {featuredMovies.length > 0 && (
            <div className='carousel'>
              <img
                src={featuredMovies[currentFeaturedIndex].posterPath}
                className='background-overlay'
                alt='Featured Movie'
              />
              <span id='movie-details'>
                <h1>{featuredMovies[currentFeaturedIndex].title}</h1>
                <p>{featuredMovies[currentFeaturedIndex].overview}</p>
                <button
                  onClick={() => {
                    navigate(`movie/${featuredMovies[currentFeaturedIndex].id}`);
                  }}
                >
                  Watch Now
                </button>
                <button 
                className='transparent'
                onClick={() => {
                    navigate(`movie/${featuredMovies[currentFeaturedIndex].id}`);
                  }}>Watch Trailer</button>
              </span>
              <img
                src={featuredMovies[currentFeaturedIndex].posterPath}
                className='movie-frame'
                alt='Featured Movie Frame'
              />
            </div>
          )}
          <div className='carousel-controls'>
            <span className='fas fa-chevron-left' onClick={handlePrevMovie}></span>
            <span className='fas fa-chevron-right' onClick={handleNextMovie}></span>
          </div>
        </div>

        <h2 className='movie-cards-header'>Movies</h2>
        <div className='movie-cards-container'>
          <div className='movie-cards-group'>
            {movies.map((movie) => (
              <div
              className='movie-card'
              key={movie.id}
              onClick={() => {
                navigate(`movie/${movie.id}`);
              }}
              >
                <img
                  src={movie.posterPath}
                  className='movie-frame'
                  alt={movie.title}
                />
                <p>{movie.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
