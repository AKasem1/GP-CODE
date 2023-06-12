import React from "react"
import {useState, useEffect, useContext } from "react"
import {useAuthContext} from "../hooks/useAuthContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Profile = () =>{
    const [myreviews, setReviews] = useState([])
    const {user} = useAuthContext()
    const [data, setData] = useState([])
    const [myuser, setUser] = useState(null)
    const {state,dispatch} = useContext(AuthContext)
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
   const getmyuser = (userId) => {
       fetch(`/newreader/myuser/${userId}`, {
           headers: {
               'Authorization': `Bearer ${user.token}`,
           }
         })
           .then(res => res.json())
           .then(userr => {
             console.log("Current User is: ", userr);
             setUser(userr);

           });
   }

    useEffect(()=>{
        fetch('/newreader/myreviews', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        }).then(res=>res.json())
        .then(result=>{
            //console.log(userId)
            getmyuser(userId)
            console.log("myuser: ", myuser)
            setReviews(result.myposts)
        }).catch(err => {
            console.log("your fault is: ", err)
        })
    }, [userId])
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
        <div>
          <div style={{maxWidth:"75%"}}>
          {myuser && (
            <div style={{
                display: "flex",
                justifyContent: "space-around",
                margin: "18px 0px",
                borderBottom: "1px solid grey"
            }}>
                <div>
                    <img style={{width:"200px", height:"200px", borderRadius:"80px"}}
                    src={myuser.user.pic}
                    alt=""
                    />
                </div>
                <div style={{marginRight: "50px"}}>
                    <h4 style={{fontSize:"40px"}}>{user.name}</h4>
                    <div style={{display:"flex", justifyContent:"space-between", width:"108%"}}>
                        <h6 style={{fontSize:"20px"}}>{myuser.user.followers.length} Followers</h6>
                        <h6> </h6>
                        <h6 style={{fontSize:"20px"}}>{myuser.user.following.length} Followings</h6>
                        <h6 style={{fontSize:"20px"}}> </h6>
                        <h6 style={{fontSize:"20px"}}>{myuser.user.read.length} Books</h6>
                    </div>
                </div>
            </div>
          )}
          <div className="gallery">
            {myreviews && myreviews.map(item => (
              <img key={item._id} className="item" alt={item.title} src={item.photo}/>
            ))}
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
                        <img src={item.book.image} />
                    </div>
                    </div>
                )
            })
        }
    </div>
        </div>
      )
      
}
export default Profile