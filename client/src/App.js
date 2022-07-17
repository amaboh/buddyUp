
import './App.css';
import {Routes, Route, Navigate} from "react-router-dom"
import {useEffect, useState} from "react";
import Home from './pages/Home';
import Navbar from './components/Navbar/Navbar';
import Login from './pages/Login';
import Post from './pages/Post';
import {useSelector} from "react-redux";
import axios from "axios"
// import {fetchUser} from "./api/UserRequests"


function App() {
  const [user,setUser] = useState(null) 
  const userData = useSelector((state)=> state.authReducer.authData)
  
  
  useEffect(()=>{
    const getUserData = async()=>{
      try {
        const {userData} = await axios.get("http://localhost/5007/api/auth/login/success")
        console.log(userData)
        setUser(userData)
      } catch (error) {
        console.log(error)
      }
    }; getUserData()
  },[])

  return (

    <div>
      <Navbar user={user ||userData }/>
      <Routes>
          <Route path="/" element={<Login/>}/>
          <Route 
            path="/login"
            element={user || userData ? <Navigate to="/"/> : <Home/>}
            />
            <Route 
              path="/post/:id"
              element={user || userData? <Post/> : <Navigate to="/login"/>}
              />
      </Routes>
    </div>
  );
}

export default App;
