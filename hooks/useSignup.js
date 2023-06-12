import { useState } from "react";
import {useAuthContext} from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (name, email, password, genre, pic) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/newreader/signup',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password, genre, pic})
        })
        const json = await response.json()
        if(!response.ok){
            setError(json.error)
            setIsLoading(false)
        }
        else{
            //save the user to a local storage
            localStorage.setItem('user', JSON.stringify(json))
            //update the auth context
            dispatch({type: 'LOGIN', payload: json})
            setIsLoading(false)
        }
    }
    return {signup, isLoading, error}
}