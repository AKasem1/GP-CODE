import React from "react"
import { useParams } from "react-router-dom"
import { useReviewContext } from "../hooks/useReviewContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { useState, useEffect } from "react"

const Book = () => {
  const {bookId} = useParams()
  const [status, setStatus] = useState()
  const [bName, setBookName] = useState('')
  const [mybook, setBook] = useState(null)
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState('')
  const [error, setError] = useState(null)
  const {dispatch} = useReviewContext()
  const {user} = useAuthContext()
  const [emptyFields, setEmptyFields] = useState([])

  useEffect(() => {
    fetch(`/newreader/book/${bookId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
      }
    })
      .then(res => res.json())
      .then(result => {
        console.log("your book is: ", result.book.title);
        console.log("your book id is: ", bookId)
        setBook(result);
      });
    }, [bookId])
    
    const handleSubmit = async () => {
      if (!user) {
        setError('You must be logged in');
        return;
      }
      const bookName = mybook.book.title;
      console.log("bookName is: ", bookName);
      const review = { bookName, rating, body};
      console.log("book rating is: ", rating)
      console.log("book review is: ", body)
    
      const response = await fetch('/newreader/createreview', {
        method: 'POST',
        body: JSON.stringify(review),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });
    
    const json = await response.json();
    const emptyF = response.json.emptyFields
    if (!response.ok) {
      setError(json.error)
      setEmptyFields(emptyF)
    }
    if (response.ok) {
      setStatus(true)
      setError(null)
      setEmptyFields([])
      console.log('new review added:', json)
      dispatch({type: 'CREATE_REVIEW', payload: json})
    }
};
const currentlyReading = () =>{
  fetch('/newreader/currentlyReading', {
      method: "put",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({bookId})
  }).then(res=>res.json())
  .then(data=>{
      dispatch({type:"UPDATE",payload:{currentlyReading:data.currentlyReading}})
       localStorage.setItem("user",JSON.stringify(data))
       console.log("You are Currently Reading this: ", data.currentlyReading)
  })
  .catch(error => {
          console.error('Error:', error);
        });
}

const wantsToRead = () =>{
  fetch('/newreader/wantstoread', {
      method: "put",
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
      },
      body:JSON.stringify({bookId})
  }).then(res=>res.json())
  .then(data=>{
      dispatch({type:"UPDATE",payload:{wantsToRead:data.wantsToRead}})
       localStorage.setItem("user",JSON.stringify(data))
       console.log("You Wants to Read this: ", data.wantsToRead)
  })
  .catch(error => {
          console.error('Error:', error);
        });
}
    return (
      <div>
      {mybook && (<div className="bookPage">
      <img src={mybook.book.image} alt={mybook.book.title} className="bookImage" />
      <div className="bookDetails">
        <h2 className="bookTitle">{mybook.book.title}</h2>
        <p className="bookAuthor">By {mybook.book.author}</p>
        <p className="bookFormat">Format: {mybook.book.format}</p>
        <p className="bookAverageRating">Average Rating: {mybook.book.average_rating}</p>
        <p className="bookISBN">ISBN: {mybook.book.isbn}</p>
        <p className="bookCategory">Category: {mybook.book.category}</p>
        <div className="star-rating" style={{marginTop: '20px'}}>
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                style={{backgroundColor: 'transparent', fontSize: '30px', border: 'none', outline: 'none', cursor: 'pointer'}}
                key={index}
                className={index <= (hover || rating) ? "on" : "off"}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}
          {rating && (
            <div className="addReview">
            <input
            type="text"
            onChange={(e) => setBody(e.target.value)} 
            value={body}
            className="writeReview"
            placeholder="Write Review"></input>
            {status?
            <span className="submitAdded">Added</span> :
            <button className="submitReview" onClick={handleSubmit} type="button">Add Review</button>
          }
            </div>
          )}
        </div>
      </div>
    </div>)}
    <div className="catalogButtons">
    <button className="currentlyReading" type="button" onClick={() => currentlyReading()}>Currently Reading</button>
    <button className="wantsToRead" type="button" onClick={() => {wantsToRead()}}>Wants to Read</button>
    </div>
    </div>
    )
}

export default Book