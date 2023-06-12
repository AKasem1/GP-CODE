import React, { useState } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import {FaSearch} from 'react-icons/fa'
import { SearchResultsList } from './SearchResultsList';


const Search = () => {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]); 
    const {user} = useAuthContext()

    const fetchUser = (value) => {
      fetch("/newreader/users", {
        method: "GET",
        headers: {
          'Authorization': `Bearer ${user.token}`,
        }
      })
      .then((response) => response.json())
      .then((json) => {
        const results = json.filter((user) => {
          value = value.toLowerCase()
          return (
            value &&
            user &&
            user.name &&
            user.name.toLowerCase().includes(value)
          );
        });
        console.log(results)
        setResults(results)
      })
    }
    const handleChangeUser = (value) => {
      setInput(value);
      fetchUser(value);
    };
    const fetchBook = (value) => {
      fetch('/newreader/allbooks',{
        method:"post",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          query: value
        })
      }).then((response) => response.json())
      .then((json) => {
        const results = json.filter((book) => {
          value = value.toLowerCase()
          return (
            value &&
            book &&
            book.title &&
            book.title.toLowerCase().includes(value)
          );
        });
        console.log("Your search results", results)
        setResults(results)
      })
    }
    const handleChangeBook = (value) => {
      setInput(value);
      fetchBook(value);
    };
  
    return (
      <div>
      <div className='input-wrapper'>
        <input
        placeholder='Type to Search..'
        className='search-input'
        value={input}
        onChange={(e) => handleChangeUser(e.target.value)}
        />
        <FaSearch id='search-icon'/>
      </div>
      {results && results.length > 0 && <SearchResultsList results={results} />}
      </div>
    );
  };
export default Search;
