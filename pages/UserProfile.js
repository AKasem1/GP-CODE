import React, {useEffect, useState, useContext} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AuthContext } from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";

const UserProfile = () =>{
    const [userProfile, setProfile] = useState(null)
    const [myuser, setUser] = useState(null)
    const [myreviews, setReviews] = useState([])
    const {user} = useAuthContext()
    const [data, setData] = useState([])
    const {state,dispatch} = useContext(AuthContext)
    const {readerId} = useParams()
    const [showfollow,setShowFollow] = useState(true)
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


        useEffect(()=>{
          fetch(`/newreader/reviews/${readerId}`, {
              headers: {
                  'Authorization': `Bearer ${localStorage.getItem("jwt")}`
              }
          }).then(res=>res.json())
          .then(result=>{
              setReviews(result.posts)
          }).catch(err => {
              console.log("your fault is: ", err)
          })
      }, [userId])
    useEffect(() => {
        fetch(`/newreader/user/${readerId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
          }
        })
          .then(res => res.json())
          .then(result => {
            console.log(result.reviews);
            console.log(userId)
            setProfile(result);
            setReviews(result.reviews)
          });
      }, [readerId])

      const followUser = () =>{
        fetch('/newreader/follow', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body:JSON.stringify({followId: readerId})
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
        .catch(error => {
                console.error('Error:', error);
              });
      }
      const unfollowUser = () =>{
        fetch('/newreader/unfollow', {
            method: "put",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body:JSON.stringify({unfollowId: readerId})
        }).then(res=>res.json())
        .then(data=>{
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
        })
        .catch(error => {
                console.error('Error:', error);
              });
      }
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
    return(
        <>
        {userProfile ? 
        <div style={{maxWidth:"75%"}}>
        <div style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "18px 0px",
            borderBottom: "1px solid grey"
        }}>
            <div>
            <img style={{width:"200px", height:"200px", borderRadius:"80px"}}
                src= {userProfile.user.pic}
                alt=""
                />
            </div>
            <div style={{marginRight: "50px"}}>
                <h4 style={{fontSize:"40px"}}>{userProfile.user.name}</h4>
                <h4>{userProfile.user.email}</h4>
                <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                    <h6 style={{fontSize:"20px"}}>{userProfile.user.followers.length} Followers</h6>
                    <h6 style={{fontSize:"20px"}}>{userProfile.user.following.length} Followings</h6>
                    <h6 style={{fontSize:"20px"}}>{userProfile.reviews.length} Reviews</h6>
                </div>
                {showfollow ?
                <button
                className="follow-button"
                onClick={() => followUser()}
              >
                Follow
              </button>
              :
              <button
                className="unfollow-button"
                onClick={() => unfollowUser()}
              >
                Unfollow
              </button>
                }
            </div>
        
        </div>
        <div className="home">
        { myreviews &&
            myreviews.map(item=>{
                return(
                    <div className="reviewCard" key={item._id}>
                    <div className="card-content">
                        <h5 style={{padding:"5px"}}><Link style={{color: "#000000", textDecoration:"none"}} to={item.postedBy._id !== userId?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link>
                        <span className="rated"> </span>
                        <span className="rated" style={{fontSize: "18px"}}>rated</span>
                        <span className="rated"> </span>
                        <span className="rated"> </span>
                        <span className="rated"> </span>
                        <Link className="" style={{color: "#1e4e41", textDecoration: "none", fontSize: "18px"}}
                        to={`/book/${item.book._id}`}>{item.bookName}</Link>
                        <span className="rated"> </span>
                         with
                         <span className="rated"> </span>
                         <span className="rated"> </span>
                         <span className="rated"> </span>
                         
                         {[...Array(item.rating)].map((_, index) => (
                        <span key={index} className="star-icon" style={{fontSize: "18px", color: '#1e4e41'}}>
                            &#9733;
                        </span>
                        ))}
                         </h5>
                        <p className="post-content">{item.body}</p>
                        {
                            item.comments.map(record=>{
                                return(
                                <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name}</span>{record.text}</h6>
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
                        
                        </div>
                    </div>
                    <div className="card-image">
                        <img src={item.book.image} />
                    </div>
                    </div>
                )
            })
        }
        </div>
    </div>
    
        : 
        <h1 style={{color: "#3bb091"}}>Loading...!</h1>
        
        }
      
        
    </>
    )
}
export default UserProfile