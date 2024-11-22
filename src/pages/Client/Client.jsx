import React, { useContext, useEffect, useState } from 'react'
import './Client.css'
import { AppContext } from '../../context/AppContext';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Client() {
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
    <div className='user-container'>
      <nav>
        <span onClick={()=>navigate('/home')}>
          <h1>Movie<span>DB</span></h1>
        </span>
        <span className='fas fa-right-from-bracket logout' onClick={handleLogout}></span>
      </nav>
      <Outlet/>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 MovieDB. All rights reserved.</p>
          <p>
            Discover and explore the world's greatest movies and TV shows.
            Data provided by <a href="https://www.themoviedb.org" target="_blank">The Movie Database (TMDb)</a>.
          </p>
          <p>
            Thank you for using our platform to find your next favorite movie!
            Stay tuned for updates and new releases.
          </p>
          <p className="footer-credits">
            Designed and developed by Franc Alvenn Dela Cruz. Built with a passion for film and technology.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Client