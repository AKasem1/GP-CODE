import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

 const SearchIcon = () => {

  return (
    <div>
        <Link to="/search" className="searchButton">
        <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '20px' }} />
        </Link>
    </div>
  )
}
export default SearchIcon