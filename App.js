import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useAuthContext } from './hooks/useAuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import NavBar from './components/NavBar';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import ScrollButton from './components/ScrollButton';
import CreateReview from './components/createReview';
import FollowingReviews from './pages/FollowingReviews';
import AwardedBooks from './pages/AwardedBooks';
import Book from './pages/Book';
import Recommendations from './pages/Recommendations';
import MyBooks from './pages/MyBooks';
import Search from './components/Search';
import Start from './pages/Start';
import Blog from './pages/Blog';

function App() {
  const {user} = useAuthContext()
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar />
      <div className="pages">
          <Routes>
            <Route 
              exact path="/"
              element={user? <Home /> : <Navigate to="/GetStarted"/>}
            />
            <Route 
              exact path="/GetStarted"
              element={!user? <Start /> : <Navigate to="/"/>}
            />
            <Route 
              exact path="/profile" 
              element={user? <Profile /> : <Navigate to="/GetStarted"/>}
            />
            <Route 
              exact path="/recommendations" 
              element={user? <Recommendations /> : <Navigate to="/GetStarted"/>}
            />
            <Route 
              path="/profile/:readerId" 
              element={<UserProfile />}
            />
            <Route 
              path="/createreview" 
              element={user? <CreateReview /> : <Navigate to="/GetStarted"/>}
            />
            <Route 
              path="/mybooks" 
              element={user? <MyBooks /> : <Navigate to="/GetStarted"/>}
            />
            <Route 
              path="/login" 
              element={!user? <Login /> : <Navigate to="/"/>} 
            />
            <Route 
              path="/signup" 
              element={!user? <SignUp /> : <Navigate to="/"/>} 
            />
            <Route 
              path="/awardedbooks" 
              element={<AwardedBooks />} 
            />
            <Route 
              path="/search" 
              element={<Search />} 
            />
            <Route 
              path="/following" 
              element={user? <FollowingReviews /> : <Navigate to="/GetStarted"/>} 
            />
            <Route 
              path="/blog" 
              element={user? <Blog /> : <Navigate to="/GetStarted"/>} 
            />
            <Route 
              path="/book/:bookId" 
              element={<Book />}
            />
        </Routes>
      </div>
      </BrowserRouter>
      <ScrollButton/>
    </div>
  );
}

export default App;
