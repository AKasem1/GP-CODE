import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";

const Recommendations = () => {
    const [data, setData] = useState([]);
    const getCookie = (name) => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
          }
        }
        return null; // Cookie not found
      };
    const userId = getCookie('id');

    useEffect(() => {
        fetch(`/newreader/recommend/${userId}`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          setData(responseData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        }, [userId])

    return(
    <div>
      <h1 style={{textAlign: 'center', color: '#356659'}}>Recommended for You</h1>
      <div className="recommended-container">
        {data.map((book) => (
          <div key={book._id} className="recommended-card">
            <img src={book.image} alt={book.title} className="recommended-cover" />
            <div className="recommended-details">
              <h3 className='recommended-name'>{book.title}</h3>
              <p className='recommended-category'>Author: {book.author}</p>
              <p className='recommended-averageR'>Average Rating: {book.average_rating}</p>
              <p className='recommended-category'>Category: {book.category}</p>
              <Link className="LearnMore" to= {`/book/${book._id}`} >Learn More</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
    )
}

export default Recommendations