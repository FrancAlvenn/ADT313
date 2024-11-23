import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Movie.css'

function Movie() {

    //user token and information
  const { auth } = useContext(AppContext);

  let { movieId } = useParams();

  const [movies , setMovies] = useState([])
  const [ featuredMovie, setFeaturedMovie ] = useState([])


  const [movie, setMovie] = useState([]);
  const [castData, setCastData] = useState([])
  const [photoData, setPhotoData] = useState([])
  const [videoData, setVideoData] = useState([])

  useEffect(()=>{
    getAllCasts();
    getAllPhotos();
    getAllVideos();
  },[movieId])

  function getAllCasts(){
    axios({
      method: 'get',
      url: `/casts`,
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
    }).then((response) => {
        setCastData(response.data)
  })
  }

  function getAllPhotos(){
    axios({
      method: 'get',
      url: `/photos`,
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
    }).then((response) => {
        setPhotoData(response.data)
  })
  }

  function getAllVideos(){
    axios({
      method: 'get',
      url: `/videos`,
      headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${auth.accessToken}`,
        },
    }).then((response) => {
        setVideoData(response.data)
  })
  }

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          tmdbId: response.data.id,
          title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
      }).catch(error => console.error("Error fetching movie data: ", error));
    }
  }, [movieId]);


  // State to control the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');

  // Function to open the modal with clicked image details
  const openModal = (imageUrl, caption) => {
    setCurrentImage(imageUrl);
    setCurrentCaption(caption);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
    setCurrentCaption('');
  };

  return (
    <>
        <div className="user-movie-container">
            <div className='user-container'>
                <div className='featured-movie'>
                    <img
                        src={movie.posterPath}
                        className='background-overlay'
                        alt='Featured Movie'
                    />
                    <span id='movie-description'> 
                        <h1>{movie.title}</h1>
                        <p>{movie.overview}</p>
                        <a href='#videos' className='transparent'>Watch Trailer</a>
                    </span>
                    <img
                        src={movie.posterPath}
                        className='movie-frame'
                        alt='Featured Movie Frame'
                    />
                </div>
            </div>

            <div id='container'>
                <h2>Casts</h2>
                <div className="cast-cards-container">
                    <div className='cast-cards-group'>
                        {castData.map((cast) => (
                            cast.movieId === parseInt(movie.tmdbId) && (
                                <div key={cast.id} className="cast-card">
                                <div className='control-group'></div>
                                <img
                                    src={
                                    cast.url && !cast.url.includes("null")
                                        ? cast.url
                                        : 'https://via.placeholder.com/500x750?text=No+Image'
                                    }
                                    className="cast-image"
                                    allowFullScreen
                                />
                                <p className='cast-name'>{cast.name}</p>
                                <p className='cast-character-name'>{cast.characterName}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            </div>



            <div id='container'>
                <h2>Photos</h2>
                <div className="photo-cards-container">
                    <div className='photo-cards-group'>
                    {photoData?.map((photo) => (
                        photo.movieId === parseInt(movie.tmdbId) && (
                        <div key={photo.id} className="photo-card">
                            <div className='control-group'>
                            {/* Add any control elements you want here */}
                            </div>
                            <img
                            src={
                                photo.url && !photo.url.includes("null")
                                ? photo.url
                                : 'https://via.placeholder.com/500x750?text=No+Image'
                            }
                            className="photo-image"
                            allowFullScreen
                            onClick={() => openModal(photo.url, `${photo.description}`)}
                            />
                        </div>
                        )
                    ))}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <span className="close" onClick={closeModal}>&times;</span>
                    <img className="modal-content" src={currentImage} alt={currentCaption} />
                    <div id="caption">{currentCaption}</div>
                </div>
            )}


        <div className="videos-cards-container">
            <h2 id='videos'>Videos</h2>
            <div className="videos-cards-group">
            {videoData?.map((video) => (
            video.movieId === parseInt(movie.tmdbId) && (
                <div key={video.id} className="videos-card">
                    <iframe
                    src={
                        video.url && !video.url.includes("null")
                        ? video.url
                        : 'https://via.placeholder.com/500x300?text=No+Video'
                        }
                        id="video-frame"
                        allowFullScreen
                    >
                    </iframe>
                </div>
            )
            ))}
            </div>
        </div>




        </div>
    
    </>
  )
}

export default Movie