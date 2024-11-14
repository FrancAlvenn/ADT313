import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  let { movieId } = useParams();

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setSelectedMovie((prevData) => ({
      ...prevData,
      [name]: value
    }));

    console.log(selectedMovie)
  }

  //overlay
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);

  //debounce search (onChange)
  const debounceTimer = useRef(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  //alert box
  const [alertMessage, setAlertMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');

  // debounce function
  const debounce = (func, delay) => {
    return (...args) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  //Search
  const handleSearch = useCallback((value, page = 1) => {
    if (value.trim() === '') {
      setSearchedMovieList([]);
      setOverlayVisible(false);
      return;
    }
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${value}&include_adult=false&language=en-US&page=${page}`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlN2FhNTRiYzJhNzI2MTFlZjY3MDAxZDllYjVkNThkMyIsIm5iZiI6MTcyOTI5NzUwNi40MzA0MTYsInN1YiI6IjY3MTJmYTU3MTZjYWE4YjBmMDljN2U1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.prLBCxZWKAzfnbc5pboPiBEiHNWu4j8csiGBO2Af7x4', // Make sure to replace this with your actual API key
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      setTotalPages(response.data.total_pages);
      if (response.data.results.length > 0) {
        setOverlayVisible(true);
      } else {
        setOverlayVisible(false);
      }
      console.log(response.data.results);
    }).catch(error => {
      console.error("Error fetching data: ", error);
    });
  }, []);

  const debouncedSearch = useRef(debounce(handleSearch, 300)).current;

  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
    setCurrentPage(1);
  };

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setOverlayVisible(false);
  };

  const handleClickOutside = (event) => {
    if (overlayRef.current && !overlayRef.current.contains(event.target)) {
      setOverlayVisible(false);
    }
  };

  const handleSave = () => {
    console.log(accessToken);
    if (selectedMovie === undefined) {
      // Add validation
      alert('Please search and select a movie.');
    } else {
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };

      axios({
        method: 'post',
        url: '/movies',
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((saveResponse) => {
        console.log(saveResponse);
        setIsError(false);
        setAlertMessage(saveResponse.data.message);
        setTimeout(() => {
          setAlertMessage('');
          navigate('/main/movies');
        }, 3000);
      })
      .catch((error) => {
        if(error.status === 422){
          setIsError(true);
          setAlertMessage(error.response.data.errors);
          setTimeout(()=>{
            setAlertMessage('');
          }, 3000)
        }else{
          setIsError(true);
          setAlertMessage("An error has occurred! Please try again later!");
          setTimeout(()=>{
            setAlertMessage('');
          }, 3000)
          console.log(error)
        }
      });
    }
  };

  const handleUpdate = (id) => {
    console.log(accessToken);
    if (selectedMovie === undefined){

    }else{
      const data = {
        tmdbId: selectedMovie.id,
        title: selectedMovie.title,
        overview: selectedMovie.overview,
        popularity: selectedMovie.popularity,
        releaseDate: selectedMovie.release_date,
        voteAverage: selectedMovie.vote_average,
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };
      console.log(data)
      axios({
        method: 'patch',
        url: `/movies/${id}`,
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((saveResponse) => {
        console.log(saveResponse);
        setIsError(false);
        setAlertMessage(saveResponse.data.message);
        setTimeout(() => {
          setAlertMessage('');
          navigate('/main/movies');
        }, 3000);
      })
      .catch((error) => console.log(error));


    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          tmdbId: response.data.id,
          title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
      }).catch(error => console.error("Error fetching movie data: ", error));
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [movieId]);

  return (
    <>
      <div className="form-header">
      {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
        <h1>{movieId !== undefined ? 'Edit ' : 'Create '} Movie</h1>
        {movieId === undefined && (
          <div className='search-container'>
            <input
              type='text'
              onChange={handleInputChange}
              placeholder='Search movie'
            />
            <span className='fas fa-search' type='button' onClick={() => handleSearch(query)}></span>
            <div className={`searched-movie ${overlayVisible ? 'show' : ''}`} ref={overlayRef}>
              <div className='container'>
                <div className="movie-list">
                  {searchedMovieList.map((movie) => (
                      <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                          {movie.original_title}
                      </p>
                  ))}
                </div>
                <div className="pagination">
                    {currentPage > 1 && (
                        <button onClick={() => {
                            const newPage = currentPage - 1;
                            setCurrentPage(newPage);
                            handleSearch(query, newPage);
                        }}>
                           <p className='fas fa-chevron-left'></p> Previous
                        </button>
                    )}
                    {currentPage < totalPages && (
                        <button onClick={() => {
                            const newPage = currentPage + 1;
                            setCurrentPage(newPage);
                            handleSearch(query, newPage);
                        }}>
                            Next <p className='fas fa-chevron-right'></p>
                        </button>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='movie-container'>
        <form>
          <div className="col movie-details">
            <div className='field'>
              Title:
              <input
                type='text'
                value={selectedMovie ? selectedMovie.title : ''}
                required
                name='title'
                onChange={handleOnChange}
              />
            </div>
            <div className='field text-area'>
              <span>Overview:</span>
              <textarea
                rows={5}
                value={selectedMovie ? selectedMovie.overview : ''}
                required
                name='overview'
                onChange={handleOnChange}
              />
            </div>
            <div className='field'>
              Popularity:
              <input
                type='number'
                value={selectedMovie ? selectedMovie.popularity : ''}
                required
                name='popularity'
                onChange={handleOnChange}
              />
            </div>
            <div className='field'>
              Release Date:
              <input
                type='text'
                value={selectedMovie ? selectedMovie.release_date : ''}
                required
                name='release_date'
                onChange={handleOnChange}
              />
            </div>
            <div className='field'>
              Vote Average:
              <input
                type='number'
                value={selectedMovie ? selectedMovie.vote_average : ''}
                required
                name='vote_average'
                onChange={handleOnChange}
              />
            </div>
            <button type='button' onClick={movieId !== undefined ? () => {handleUpdate(movieId)} : handleSave}>
              Save
            </button>
          </div>

          <div className="col poster-col">
              <img
                className='poster-image'
                src={selectedMovie ? `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}` : `/movie-background.jpg`}
                alt={`selectedMovie.original_title`}></img>
          </div>
        </form>
      </div>

      {movieId !== undefined && selectedMovie && (
        <div>
          <hr />
          <nav>
            <ul className='tabs'>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/cast-and-crews`);
                }}
              >
                Cast & Crews
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/videos`);
                }}
              >
                Videos
              </li>
              <li
                onClick={() => {
                  navigate(`/main/movies/form/${movieId}/photos`);
                }}
              >
                Photos
              </li>
            </ul>
          </nav>

          {/* <Outlet /> */}
        </div>
      )}
    </>
  );
};

export default Form;
