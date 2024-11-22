import axios from 'axios';
import './Home.css'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

function Home() {
  //user token and information
  const { auth } = useContext(AppContext);

  const [movies , setMovies] = useState([])
  const [ featuredMovie, setFeaturedMovie ] = useState([])

  //get user information
  // const userInformation = JSON.parse(localStorage.getItem('user'));

  // alert box state
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user')
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
  }, [])

  const getAllMovies = () => {
    axios({
      method: 'get',
      url: '/movies',
      headers: {
        Authorization: `Bearer ${auth.accessToken}`
      }
    }).then((response) => {
      console.log(response.data);
      setMovies(response.data)
      setFeaturedMovie(response.data[0])


      console.log(movies)
      setIsError(false);
      setAlertMessage(response.data.message);
      setTimeout(() => {
        setAlertMessage('');
      }, 2000)
    }).catch((error) =>{
      setIsError(true);
      setAlertMessage(error.message);
      setTimeout(() => {
        setAlertMessage('');
      }, 2000)
    })
  }

  useEffect(() => {
    console.log(movies);
  }, [movies]); // This will log whenever `movies` state updates
  

  return (
    <div className='user-home'>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <div className="user-container">
        <div className='featured-movie'>
          <span>
            <h1>{featuredMovie.title}</h1>
            <p>{featuredMovie.overview}</p>
            <button>Watch Now</button>
            <button className='transparent'>Watch Trailer</button>
          </span>
          <img src={featuredMovie.posterPath} className='movie-frame'/>
        </div>
        <h2 className='movie-cards-header'>Movies</h2>
        <div className="movie-cards-container">
          <div className="movie-cards-group">
              {movies.map((movie)=>(
                <div className="movie-card">
                  <img
                    src={movie.posterPath}
                    className="movie-frame"
                  >
                  </img>
                  <p>{movie.title}</p>
                </div>
              ))
              }
          </div>
        </div>




      </div>

    </div>
  );
}

export default Home