import { useReviewContext } from "./useReviewContext"
import { useAuthContext } from "./useAuthContext"
export const useLogout = () => {
    const {dispatch} = useAuthContext()
    const {dispatch: reviewDispatch} = useReviewContext()

    const logout = () =>{
        //remove local storage
        localStorage.removeItem('user')
        localStorage.removeItem('jwt')
        //dispatch logout action
        dispatch({type: 'LOGOUT'})
        reviewDispatch({type: 'SET_REVIEWS'})
    }
    return {logout}
}