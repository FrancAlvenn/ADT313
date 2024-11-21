import { useNavigate } from 'react-router-dom';
import './Lists.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../../../../context/AppContext';


const Lists = () => {

  //user token and information
  const { auth } = useContext(AppContext);
  const { movie } = useContext(AppContext);
  const {setMovieData} = useContext(AppContext);

  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  // alert box state
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const getMovies = () => {
    //get the movies from the api or database
    axios.get('/movies').then((response) => {
      setLists(response.data);
      setMovieData(response.data);
    });
  };
  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      'Are you sure that you want to delete this data?'
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
          },
        })
        .then((response) => {
          //update list by modifying the movie list array
          const tempLists = [...lists];
          const index = lists.findIndex((movie) => movie.id === id);
          if (index !== undefined || index !== -1) {
            tempLists.splice(index, 1);
            setLists(tempLists);
          }
          setIsError(false);
          setAlertMessage(response.data.message);
          setTimeout(() => {
            setAlertMessage('');
          }, 2000);

          //update list by requesting again to api
          // getMovies();
        }).catch((error) => {
          setIsError(true);
          setAlertMessage(error.data.message);
          setTimeout(() => {
            setAlertMessage('');
          }, 2000);
        })
    }
  };

  return (
    <div className='lists-container'>
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
      <div className='create-container'>
        <button
          type='button'
          onClick={() => {
            navigate('/main/movies/form');
          }}
        >
          Create new
        </button>
      </div>
      <div className='table-container'>
        <table className='movie-lists'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr>
                <td>{movie.id}</td>
                <td>{movie.title}</td>
                <td className='button-container'>
                  <span className='fas fa-pen-to-square tooltip'
                    type='button'
                    data-tooltip="Edit"
                    onClick={() => {
                      navigate('/main/movies/form/' + movie.id);
                    }}
                  >
                    <span className="tooltiptext">Edit</span>
                  </span>
                  <span className='fas fa-trash-can tooltip'
                    type='button'
                    data-tooltip="Delete"
                    onClick={() =>
                      handleDelete(movie.id)}
                  >
                    <span className="tooltiptext">Delete</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;