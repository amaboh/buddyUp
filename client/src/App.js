import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login";
import Post from "./pages/Post";
import { useSelector } from "react-redux";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const userData = useSelector((state) => state.authReducer.authData);


  const getUser = async () => {
    try {
      const url = "http://localhost:5007/auth/login/success";
      const { data } = await axios.get(url, { withCredentials: true }); 
      setUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
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
