// 'rfce' 
import React, { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import movieTrailer from 'movie-trailer'

import axios from './axios'
import './Row.css'

const base_url = 'https://image.tmdb.org/t/p/original/'

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([])
    const [trailerUrl, setTrailerUrl] = useState("")

    useEffect(() => {
        async function fecthData(){
            const request = await axios.get(fetchUrl)
            setMovies(request.data.results)
            return request
        }
        fecthData()
    }, [fetchUrl])

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {

            autoplay: 1
        }
    }

    const handleClick = (movie) => {
        if(trailerUrl){
            setTrailerUrl('')
        } else {
            movieTrailer(movie?.title || movie?.name || movie?.original_name || " ").then(url => {
                const urlParams = new URLSearchParams(new URL(url).search)
                setTrailerUrl(urlParams.get('v'))
            }).catch(err => console.log(err))
        }
    }

    return (
        <div className='row'>
            <h2>{ title }</h2>

            <div className="row_posters">
                {movies.map(movie => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${isLargeRow && "row_posterLarge"}`}
                        src={`${base_url}${isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                        alt={movie.name}/>
                ))}
            </div>
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}/>}
        </div>
    )
}

export default Row
