import React, { useContext, useEffect, useRef, useState } from 'react'
import './Casts.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../../../context/AuthContext';
import { useDebounce } from '../../../../../utils/hooks/useDebounce';

function Casts() {

    //user token and information
    const { auth } = useContext(AuthContext);

    let { tmdbId } = useParams();
    let { movieId } = useParams();

    const [castData, setCastData] = useState([]);
    const [crewData, setCrewData] = useState([]);

    const castCardsRef = useRef(null);

    const [selectedCast, setSelectedCast] = useState();

    const nameRef = useRef();
    const characterNameRef = useRef();
    const urlRef = useRef();

    const [state, setState] = useState('casts');


    const [status, setStatus] = useState('idle');

    const navigate = useNavigate();

    const userInputDebounce = useDebounce({ selectedCast }, 2000);
    const [debounceState, setDebounceState] = useState(false);
    const [isFieldsDirty, setIsFieldsDirty] = useState(false);

    const handleOnChange = (e) => {
      setDebounceState(false);
      setIsFieldsDirty(true);
      const { name, value } = e.target;
  
      setSelectedCast((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      console.log(selectedCast)
      console.log(state)
    }

    const [selectedMovie, setSelectedMovie] = useState(undefined);
    const [movie, setMovie] = useState(undefined);

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
          setSelectedMovie(tempData);
        }).catch(error => console.error("Error fetching movie data: ", error));
      }
    }, [movieId]);

    //debounce
    useEffect(() => {
      setDebounceState(true);
    }, [userInputDebounce]);


    //alert box
    const [alertMessage, setAlertMessage] = useState('');
    const [isError, setIsError] = useState(false);

    //gets all casts from tmdb not from database - database getAll() is broken
    useEffect(() => {
      getAllCasts();
    },[tmdbId])

    function handleCardSelect(data){
      setSelectedCast(data);
      setState('update')
    }

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
          console.log(response.data)
      })
    }

    function handleAddCast(){
      setSelectedCast('')
      setState('add');
    }

    function handleSaveCast(){

        const data = {
          userId: auth.user.userId,
          movieId: movieId,
          name: castData[0].name,
          characterName: castData[0].character,
          url: `https://image.tmdb.org/t/p/original/${castData[0].profile_path}`,
          dateUpdated: Date.now()
        }

        console.log(data)
      
        axios({
            method: 'POST',
            url: '/casts',
            data: data,
            headers: {
                Authorization: `Bearer ${auth.accessToken}`
            }
        }).then((response) => {
            console.log("Database Updated", response)
        }).catch((error)=>{
          setIsError(false);
          setAlertMessage(error.data.message);
          setTimeout(() => {
            setAlertMessage('');
          }, 2000);
        })
    }

    function handleUpdateCast(){
      const data = {
        userId: selectedCast.userId,
        movieId: selectedMovie.id,
        name: selectedCast.name,
        url: selectedCast.url,
        characterName: selectedCast.characterName,
        id: selectedCast.id,
      }
      axios({
        method: 'patch',
        url: `/casts/${selectedCast.id}`,
        data: data,
        headers: {
          Authorization: `Bearer ${auth.accessToken}`
        }
      }).then((response) => {
        console.log("Database Updated")
        console.log(response.data)
        setIsError(false);
        setAlertMessage(response.data.message);
        setTimeout(() => {
          setAlertMessage('');
          getAllCasts();
          setSelectedCast(undefined);
        }, 2000);
      }).catch((error)=>{
        setIsError(false);
        setAlertMessage(error.data.message);
        setTimeout(() => {
          setAlertMessage('');
        }, 2000);
      })
    }

    function handleDelete(){
      const isConfirmed = window.confirm("Are you sure you want to delete this cast?");
      if (isConfirmed){
        axios({
          method: 'delete',
          url: `/casts/${selectedCast.id}`,
          headers:{
            Authorization: `Bearer ${auth.accessToken}`
          }
        }).then((response)=>{
          console.log("Database Updated")
          console.log(response.data)
          setIsError(false);
          setAlertMessage(response.data.message);
          setTimeout(() => {
            setAlertMessage('');
            getAllCasts();
            setSelectedCast(undefined);
          }, 2000);
        })
      }
    }

    


      return (
        <div className='cast-and-crew-container'>
          {alertMessage && (<div className={`alert-box ${isError ? 'error' : 'success'}`}>{alertMessage}</div>)}
          <div className='cast-and-crew-header'>
            <h2 onClick={()=> {setSelectedCast(undefined); setState('casts')}}>{selectedCast != undefined ? <span className='back-button fas fa-chevron-left'><h3>Back to Casts</h3></span> : 'Casts' }</h2>
            <div>
              {state == 'casts' && <button onClick={handleAddCast}>ADD CAST</button>}
            </div>
          </div>
          <div className="cast-cards">
            {selectedCast != undefined ?
            <>
            <form>
                <div className='casts-details'>
                  <div className="field readonly">
                    Movie featured in
                    <input type="text"
                    value={selectedMovie.title}
                    onChange={handleOnChange}
                    readOnly
                    />
                  </div>
                  <div className="field">
                    Artist Name
                    <input type="text" 
                    value={selectedCast.name ? castData.name : ''}
                    name='name'
                    onChange={handleOnChange}
                    ref={nameRef}
                    />
                    {debounceState && isFieldsDirty && (selectedCast.name == '' || castData.name == '') && (<span className='errors'>This field is required</span>)}
                  </div>
                  <div className="field">
                    Character Name
                    <input type="text"
                    value={selectedCast.characterName ? castData.characterName : '' }
                    name='characterName'
                    onChange={handleOnChange}
                    ref={characterNameRef}
                    />
                    {debounceState && isFieldsDirty && (selectedCast.characterName == '' || castData.characterName == '') && (<span className='errors'>This field is required</span>)}
                  </div>
                  <div className="field">
                    Profile Image
                    <input type="text"
                    value={selectedCast.url ? castData.url : ''}
                    name='url'
                    onChange={handleOnChange}
                    ref={urlRef}
                    />
                    {debounceState && isFieldsDirty && (selectedCast.url == '' || castData.url == '') && (<span className='errors'>This field is required</span>)}
                  </div>

                  

                </div>
                <div className="cast-profile">
                  <img
                     src={
                      selectedCast.url && !selectedCast.url.includes("null")
                        ? selectedCast.url
                        : 'https://via.placeholder.com/500x750?text=No+Image'
                    }
                    alt={selectedCast.name}
                    className="cast-image"
                  />
                </div>
              </form>
              <div className='button-group'>
                {state == 'update' ? <button className='delete-button' onClick={handleDelete}>DELETE CAST</button> : ''}
                <button onClick={() => {
                    if (status === 'loading') {
                      return;
                    }
                    if (selectedCast.userId && selectedMovie.id && selectedCast.name && selectedCast.url && selectedCast.characterName) {
                      state == 'update' ? handleUpdateCast() : handleSaveCast()
                    } else {
                      //fields are incomplete
                      setIsFieldsDirty(true);
                      //focus if field is empty
                      if (!selectedCast.name) {
                        nameRef.current.focus();
                      }else if (!selectedCast.characterName) {
                        characterNameRef.current.focus();
                      }else if (!selectedCast.url) {
                        urlRef.current.focus();
                      }
                    }
                  }}>SAVE</button>
              </div>
            </>
              :
              <div className="cast-cards-container">
                <div className="cast-cards-group" ref={castCardsRef}>
                {castData.map((cast) => (
                  cast.movieId === parseInt(tmdbId) && (
                    <div key={cast.cast_id} className="cast-card" onClick={() => {handleCardSelect(cast)}}>
                      <img
                        src={
                          cast.url && !cast.url.includes("null")
                            ? cast.url
                            : 'https://via.placeholder.com/500x750?text=No+Image'
                        }
                        alt={cast.name}
                        className="cast-image"
                      />
                      <div className="cast-info">
                        <h3>{cast.name}</h3>
                        <p>{cast.characterName}</p>
                      </div>
                    </div>
                  )
                ))}
                </div>
            </div>}
          </div>
        </div>
      );
}

export default Casts


