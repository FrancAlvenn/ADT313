 import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Dashboard from './pages/Main/Dashboard/Dashboard';
import Main from './pages/Main/Main';
import Register from './pages/Public/Register/Register';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Movies from './pages/Main/Movies/Movies';
import MovieLists from './pages/Main/Movies/Lists/Lists';
import MovieForm from './pages/Main/Movies/Form/Form';
import Casts from './pages/Main/Movies/Form/Casts/Casts';
import Videos from './pages/Main/Movies/Form/Videos/Videos';
import Photos from './pages/Main/Movies/Form/Photos/Photos';
import { AuthProvider } from './context/AppContext';
import Client from './pages/Client/Client';
import Home from './pages/Client/Home/Home';
import Movie from './pages/Client/Movie/Movie';


//ADT313 Project (Movie DB)
//Submitted by: Franc Alvenn Dela Cruz

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: 'admin/login',
    element: <Login />
  },
  {
    path: 'admin/register',
    element: <Register />
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'movies',
        element: <Movies />,
        children: [
          {
            path: '',
            element: <MovieLists />,
          },
          {
            path: 'form/:movieId?/',
            element: <MovieForm />,
            children: [
              {
                path: 'cast-and-crews/:tmdbId?',
                element: <Casts/>,
              },
              {
                path: 'videos/:tmdbId?',
                element: <Videos />,
              },
              {
                path: 'photos/:tmdbId?',
                element: <Photos />,
              }
            ]
          },
        ],
      }
    ],
  },{
    path: '/home',
    element: <Client/>,
    children: [
        {
          path: '',
          element: <Home/>
        },
        {
          path: 'movie/:movieId',
          element: <Movie/>
        }
    ]
  }
]);

function App() {
  return (
    <AuthProvider>
    <div className='App'>
      <RouterProvider router={router} />
    </div>
    </AuthProvider>
  );
}

export default App;
