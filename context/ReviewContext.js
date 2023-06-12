import { createContext, useReducer } from "react";

export const ReviewContext = createContext();

const reviewReducer = (state, action) => {
    switch (action.type){
        case 'SET_REVIEWS':
            return{
                reviews: action.payload
            }
            case 'CREATE_REVIEW':
                return {
                  reviews: [action.payload, ...state.reviews]
                }
        case 'DELETE_REVIEW':
            return{
                reviews: state.reviews.filter((r)=>r._id !== action.payload._id)
            }
        default:
            return state
    }
}
export const ReviewContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reviewReducer, {
        reviews: []
    })
    return(
        <ReviewContext.Provider value={{...state, dispatch}}>
            {children}
        </ReviewContext.Provider>
    )
}