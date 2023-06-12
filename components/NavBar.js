import { Link } from "react-router-dom"
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useReviewContext } from "../hooks/useReviewContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import Search from "./Search";
import SearchIcon from "./SearchIcon";
import M from 'materialize-css'
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";


const NavBar = () => {
  
  const  searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const [bookName, setBook] = useState('')
  const [rating, setRating] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const {dispatch} = useReviewContext()
  const {user} = useAuthContext()
  const [emptyFields, setEmptyFields] = useState([])
  const [isOpen, setIsOpen] = useState(false);
  const {logout} = useLogout()

  //Here the implementation logic of popup
  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };
  const handleClick = () =>{
    logout()
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!user){
      setError('You must be logged in')
      return
    }
    const review = {bookName, rating, body}
    
    const response = await fetch('/newreader/createreview', {
      method: 'POST',
      body: JSON.stringify(review),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    //console.log(review)
    const json = await response.json()
    const emptyF = await response.json.emptyFields
    if (!response.ok) {
      setError(json.error)
      setEmptyFields(emptyF)
    }
    if (response.ok) {
      setError(null)
      setBody('')
      setBook('')
      setRating('')
      setEmptyFields([])
      console.log('new review added:', json)
      dispatch({type: 'CREATE_REVIEW', payload: json})
    }
  closePopup();
};

return(
        <header>
            <div className="container">
            <Link to="/">
                <h1 className="logo">The NewReader</h1>
            </Link>
            <nav>
                <div className="navLinks">
                    {user &&( 
                      <div>
                        <Link className="Links" to="/following">My Following</Link>
                        <Link className="Links" to="/mybooks">My Books</Link>
                        <Link className="Links" to="/blog">My Blog</Link>
                        <Link className="Links" onClick={openPopup}>Create Review</Link>
                        <Link className="Links" to="/awardedbooks">Awarded Books</Link>
                        <Link className="Links" to="/recommendations">For You</Link>
                        <Link className="Links" to="/profile">Profile</Link>
                        <button onClick={handleClick}>Log out</button>
                        

                    </div>
                )}
                        
                        {!user &&( 
                    <div>
                        <Link className="Links" to="/login">LogIn</Link>
                        <Link className="Links" to="/signup">SignUp</Link>
                    </div>
                )}
                {user && (
                    <div>
                        {/* <span>{user.name}</span> */}
                    </div>
                )}
                </div>
            </nav>
            </div>
           
            <div>

      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>New Review</h2>
            <form onSubmit={handleSubmit}>
            <label>Choose Book:</label>
              <input 
                type="text" 
                onChange={(e) => setBook(e.target.value)} 
                value={bookName}
                className={emptyFields && emptyFields.includes('bookName') ? 'error' : ''}
              />

              <label>Enter Rating: </label>
              <input 
                type="number" 
                onChange={(e) => setRating(e.target.value)} 
                value={rating}
                className={emptyFields && emptyFields.includes('rating') ? 'error' : ''}
                min={0}
                max={5}
              />

              <label>Review:</label>
              <input 
                type="text" 
                onChange={(e) => setBody(e.target.value)} 
                value={body}
                className={emptyFields && emptyFields.includes('review') ? 'error' : ''}
              />


              <button type="submit">Submit</button>
              {error && <div className="error">{error}</div>}
            </form>
            <button onClick={closePopup}>Cancel</button>
          </div>
        </div>
      )}
    </div>
        </header>
        
    )
}
export default NavBar