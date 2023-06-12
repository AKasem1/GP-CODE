import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const genres = ['Medical', 'Sport','Natural-History',
'Business-Finance-Law', 'Art-Photography', 'Computing',
'Childrens-Books', 'Biography', 'Religion', 'Science-Geography'];
const SignUp = () =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [image,setImage] = useState("")
    const [pic,setPic] = useState(undefined)
    const {signup, isLoading, error} = useSignup()
    const [selectedGenres, setSelectedGenres] = useState([]);

  const handleGenreChange = (event) => {
    const { value } = event.target;
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(value)) {
        return prevSelectedGenres.filter((genre) => genre !== value);
      } else {
        return [...prevSelectedGenres, value];
      }
    });
  };
    const uploadPic = ()=>{
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","newreader")
        data.append("cloud_name","kasem")
        fetch("https://api.cloudinary.com/v1_1/kasem",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            setPic(data.pic)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(image){
            uploadPic()
        }else{
            signup(name, email, password, selectedGenres, pic)
        }
    }

    return(
        <form className="login" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column'}}>
            <h3>Sign Up</h3>
            <label>Name: </label>
            <input 
            type="name"
            onChange={e => setName(e.target.value)}
            value={name}
            ></input>
            <label>Email: </label>
            <input 
            type="email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            ></input>
            <label>Password: </label>
            <input 
            type="password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            ></input>
          <label style={{marginTop: "10px", marginBottom: "5px"}}>Select Genres:</label>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          {genres.slice(0, 3).map((genre) => (
            <div key={genre} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={handleGenreChange}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>{genre}</span>
              </label>
            </div>
          ))}
        </div>
        <div>
          {genres.slice(3, 6).map((genre) => (
            <div key={genre} style={{ marginBottom: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  value={genre}
                  checked={selectedGenres.includes(genre)}
                  onChange={handleGenreChange}
                  style={{ marginRight: '0.5rem' }}
                />
                <span>{genre}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
            <div className="file-field input-field">
            
            </div>
            <button disabled={isLoading}>Sign Up</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}
export default SignUp