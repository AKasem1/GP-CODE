import React, { useState } from "react";
import { useReviewContext } from "../hooks/useReviewContext";
import { useAuthContext } from "../hooks/useAuthContext";

const CreateReview = () => {
  const [book, setBook] = useState('')
  const [rating, setRating] = useState('')
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const {dispatch} = useReviewContext()
  const {user} = useAuthContext()
  const [emptyFields, setEmptyFields] = useState([])
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

    const handleSubmit = async (e) => {
      e.preventDefault()
  
      if(!user){
        setError('You must be logged in')
        return
      }
      const {id} = user
      const review = {book, rating, body, id}
      
      const response = await fetch('/newreader/createreview', {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
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

  return (
    <div>
      <button onClick={openPopup}>Create Review</button>

      {isOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Create Review</h2>
            <label>Choose Book:</label>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                onChange={(e) => setBook(e.target.value)} 
                value={book}
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
  );
};

export default CreateReview;