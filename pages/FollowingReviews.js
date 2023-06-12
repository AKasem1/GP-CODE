import React from "react"
import {useState, useEffect, useContext } from "react"
import {useAuthContext} from "../hooks/useAuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";

const FollowingReviews = () => {
    const {user} = useAuthContext()
    const [data, setData] = useState([])
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
        fetch('/newreader/following', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${user.token}`,
                'Content-Type': 'application/json'
            },
        }).then(res=>res.json())
        .then(result=>{
            console.log("results: ", result)
            setData(result.reviews)
        }).catch(err => {
            console.log("error is: ", err)
        })
    }, [])
    const likeReview = (id) =>{
        fetch('/newreader/like', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body:JSON.stringify({reviewId: id})
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log("error is: ", err)
        })
    }
    const unlikeReview = (id) =>{
        fetch('/newreader/unlike', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body:JSON.stringify({reviewId: id})
        }).then(res =>res.json())
        .then(result=>{
            // console.log(result)
            console.log("userId: ", userId)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log("error is: ", err)
        })
    }
    const makeComment = (text, reviewId) =>{
        fetch('/newreader/comment', {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body:JSON.stringify({
                reviewId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            // console.log(result)
            const newData = data.map(item=>{
                if(item._id == result._id){
                    return result
                }
                else{
                    return item
                }
            })
            setData(newData)
        }).catch(err => {
            console.log("error is: ", err)
        })
    }
    const deletePost = (reviewId)=>{
        fetch(`newreader/deletereview/${reviewId}`,{
            method:"DELETE",
            headers:{
                Authorization : `Bearer ${user.token}`
            }
        }).then(res => res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
return (
    <div className="home">
        {
            data.map(item=>{
                return(
                    <div className="reviewCard" key={item._id}>
                    
                    <div className="card-content">
                        <h5 style={{padding:"5px"}}><Link style={{color: "#000000", textDecoration:"none"}} to={item.postedBy._id !== userId?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link> <span className="rated">rated</span> {item.title} with {item.rating}</h5>
                        <p className="post-content">{item.body}</p>
                        {
                            item.comments.map(record=>{
                                return(
                                <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span> {record.text}</h6>
                                )
                            })
                        }
                        <div className="comment-wrapper">
                        <form onSubmit={(e)=>{
                            e.preventDefault()
                            makeComment(e.target[0].value, item._id)
                        }}>
                        <input type="text" placeholder="Add a comment" className="comment-input" />
                        </form>
                        <div className="loveIcon">
                        {item.likes.includes(userId)
                        ? 
                        (
                        <FontAwesomeIcon icon={faHeart} onClick={() => unlikeReview(item._id)} color="red" />
                        ): (
                            <FontAwesomeIcon icon={faHeart} onClick={()=>{likeReview(item._id)}} color="#407b6b"/>
                          )
                        }
                        </div>
                        <h6 style={{ fontSize: '20px', marginLeft: '15px', color: '#203d35'}}>{item.likes.length}</h6>
                        {item.postedBy._id == userId
                        && <FontAwesomeIcon
                        icon={faTrash} style={{float:"right", 
                        marginLeft:"20px", fontSize:"20px"}}
                        onClick={() => deletePost(item._id)}
                        color="#ff0000" />
                        }
                        </div>
                    </div>
                    <div className="card-image">
                        <img src="https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" />
                    </div>
                    </div>
                )
            })
        }
    </div>
)}
export default FollowingReviews