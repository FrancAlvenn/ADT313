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
  const [backgroundImage, setBackgroundImage] = useState('');

  //overlay
  const [overlayVisible, setOverlayVisible] = useState(false);
  const overlayRef = useRef(null);

  //debounce search (onChange)
  const debounceTimer = useRef(null);

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);


  const navigate = useNavigate();


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
    const accessToken = localStorage.getItem('accessToken');
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
        navigate('/main/movies');
        console.log(saveResponse);
        alert('Success');
      })
      .catch((error) => console.log(error));
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        setBackgroundImage(tempData.poster_path);
        console.log(response.data);
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
                value={selectedMovie ? selectedMovie.original_title : ''}
                readOnly // Prevent editing of the title
              />
            </div>
            <div className='field text-area'>
              <span>Overview:</span>
              <textarea
                rows={5}
                value={selectedMovie ? selectedMovie.overview : ''}
                readOnly // Prevent editing of the overview
              />
            </div>
            <div className='field'>
              Popularity:
              <input
                type='text'
                value={selectedMovie ? selectedMovie.popularity : ''}
                readOnly // Prevent editing of popularity
              />
            </div>
            <div className='field'>
              Release Date:
              <input
                type='text'
                value={selectedMovie ? selectedMovie.release_date : ''}
                readOnly // Prevent editing of release date
              />
            </div>
            <div className='field'>
              Vote Average:
              <input
                type='text'
                value={selectedMovie ? selectedMovie.vote_average : ''}
                readOnly // Prevent editing of vote average
              />
            </div>
            <button type='button' onClick={handleSave}>
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
    </>
  );
};

export default Form;
