import { useState } from "react"
import { useLogin } from "../hooks/useLogin"
import { Link } from "react-router-dom"

const Login = () =>{
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {login, isLoading, error} = useLogin()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        login(email, password)
    }

    return(
        <form className="login" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column'}}>
            <h3>LOG IN</h3>
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
            <button disabled={isLoading} style={{marginTop: "10px"}}>Log in</button>
            {error && <div className="error">{error}</div>}
            <Link className="signupinstead" to="/signup">Sign Up instead?</Link>
        </form>
    )
}
export default Login