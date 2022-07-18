import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Post from "./pages/Post";
import { useSelector } from "react-redux";
import api from './api/endpoint'

function App() {
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.authReducer.authData);

  console.log("user data", userData);
  console.log("user 1", user);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await api.get(
          "/auth/login/success"
        );
        const user = res.userData
        if(res && user) setUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }, []);

  return (
    <div>
      <Navbar user={user || userData} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={user || userData ? <Navigate to="/" /> : <Login />}
        />
        {/* <Route 
              path="/post/:id"
              element={user || userData? <Post/> : <Navigate to="/login"/>}
              /> */}
      </Routes>
    </div>
  );
}

export default App;
