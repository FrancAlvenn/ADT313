import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');

  //get user information
  const userInformation = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user')
    navigate('/');
  };

  useEffect(() => {
    if (
      accessToken === undefined ||
      accessToken === '' ||
      accessToken === null
    ) {
      handleLogout();
    }
  }, []);

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <h1 className='header'>Movie<span>DB</span></h1>
          <div className='admin-profile'>
            <div>
              <span className='fas fa-user'></span>
              <span className='user-info'><p>{userInformation.role}</p><h1>{userInformation.firstName}</h1></span>
            </div>
            <a onClick={handleLogout} className='fas fa-right-from-bracket'></a>
          </div>
          <ul className='admin-links'>
            <li>
              <span className='fas fa-border-all'></span>
              <a href='/main/dashboard'>Dashboard</a>
            </li>
            <li>
              <span className='fas fa-film'></span>
              <a href='/main/movies'>Movies</a>
            </li>
            <li>
              <span className='fas fa-user-circle'></span>
              <a href='/main/users'>Users</a>
            </li>
            <li className='logout'>
              <span className='fas fa-right-from-bracket'></span>
              <a onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
