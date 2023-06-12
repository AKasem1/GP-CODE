import React, { useEffect, useState } from 'react';

const AwardedBooks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://hapi-books.p.rapidapi.com/top/2021', {
      method: 'GET',
      url: 'https://hapi-books.p.rapidapi.com/top/2022',
      headers: {
      'X-RapidAPI-Key': 'f5c30098a7mshb5da4857ec5e364p19ad49jsn0638a78b1821',
      'X-RapidAPI-Host': 'hapi-books.p.rapidapi.com'
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1 style={{textAlign: 'center', color: '#356659'}}>Awarded Books for 2022</h1>
      <div className="books-container">
        {data.map((book) => (
          <div key={book.book_id} className="book-card">
            <img src={book.cover} alt={book.name} className="book-cover" />
            <div className="book-details">
              <h3 className='book-name'>{book.name}</h3>
              <p className='book-category'>Category: {book.category}</p>
              <a href={book.url} target="_blank" rel="noopener noreferrer" className='book-url'>
                Learn More
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AwardedBooks;
