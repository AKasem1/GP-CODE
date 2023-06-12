import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className='getStarted'>
        <img src="https://i.ibb.co/ZgHrsy8/reading.png" alt="reading" border="0" />
        <div className='phrases'>
        <h1 className='startPhrase' style={{color:"#17888c", marginBottom:"10px"}}>Hi New Reader!
        </h1>
        <h1 className='startPhrase'>
        Share, Discover, and Connect through the World of Books!
        </h1>
        <Link to="/signup">
        <FontAwesomeIcon className ="arrow-icon" icon={faArrowRight} />
        </Link>
        </div>
    </div>
  )
}
export default Start
