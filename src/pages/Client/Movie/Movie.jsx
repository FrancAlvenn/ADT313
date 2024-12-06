import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Movie.css'
import { useMovieContext } from '../../../context/MovieContext';

function Movie() {

  const { movie, setMovie } = useMovieContext();

  console.log(movie)

  //user token and information
  const { auth } = useContext(AppContext);

  let { movieId } = useParams();

//   const [movie, setMovie] = useState([]);
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
        {movie && (
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

            <div id="container">
            <h2>Casts</h2>
            <div className="cast-cards-container">
                {castData && castData.filter(cast => cast.movieId === parseInt(movie.tmdbId)).length > 0 ? (
                <div className="cast-cards-group">
                    {castData.filter(cast => cast.movieId === parseInt(movie.tmdbId)).map(cast => (
                        <div key={cast.id} className="cast-card">
                        <div className="control-group"></div>
                        <img
                            src={
                            cast.url && !cast.url.includes("null")
                                ? cast.url
                                : "https://via.placeholder.com/500x750?text=No+Image"
                            }
                            className="cast-image"
                            alt={cast.name}
                        />
                        <p className="cast-name">{cast.name}</p>
                        <p className="cast-character-name">{cast.characterName}</p>
                        </div>
                    ))}
                </div>
                ) : (
                <h3 id='no-movie-data-text'>✨ All dressed up, but no stars to show. 🌟</h3>
                )}
            </div>
            </div>



            <div id="container">
            <h2>Photos</h2>
            <div className="photo-cards-container">
                {photoData && photoData.filter(photo => photo.movieId === parseInt(movie.tmdbId)).length > 0 ? (
                <div className="photo-cards-group">
                    {photoData.filter(photo => photo.movieId === parseInt(movie.tmdbId)).map(photo => (
                        <div key={photo.id} className="photo-card">
                        <div className="control-group">
                        </div>
                        <img
                            src={
                            photo.url && !photo.url.includes("null")
                                ? photo.url
                                : "https://via.placeholder.com/500x750?text=No+Image"
                            }
                            className="photo-image"
                            alt={photo.description || "Photo"}
                            allowFullScreen
                            onClick={() => openModal(photo.url, `${photo.description}`)}
                        />
                        </div>
                    ))}
                </div>
                ) : (
                <h3 id='no-movie-data-text'>📷 Looks like the camera lens was on vacation! 🌴</h3>
                )}
            </div>

            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                <span className="close" onClick={closeModal}>&times;</span>
                <img
                    className="modal-content"
                    src={currentImage}
                    alt={currentCaption}
                />
                <div id="caption">{currentCaption}</div>
                </div>
            )}
            </div>



            <div className="videos-cards-container">
            <h2 id="videos">Videos</h2>
            {videoData && videoData.filter(video => video.movieId === parseInt(movie.tmdbId)).length > 0 ? (
                <div className="videos-cards-group">
                {videoData.filter(video => video.movieId === parseInt(movie.tmdbId)).map(video => (
                    <div key={video.id} className="videos-card">
                        <iframe
                        src={
                            video.url && !video.url.includes("null")
                            ? video.url
                            : "https://via.placeholder.com/500x300?text=No+Video"
                        }
                        id="video-frame"
                        allowFullScreen
                        ></iframe>
                    </div>
                    ))}
                </div>
            ) : (
                <h3 id='no-movie-data-text'>🎥 Lights, camera... wait, where’s the action? 🎬</h3>
            )}
            </div>

        </div>
        )}
    </>
  )
}

export default Movie