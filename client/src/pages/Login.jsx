import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { logIn, signUp } from "../actions/AuthAction.js";

import Google from "../img/google.png";
import Facebook from "../img/facebook.png";
import Github from "../img/github.png";

const Login = () => {
  const initialState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmpass: "",
  };

  const [isSignUp, setIsSignUp] = useState(false);

  const [data, setData] = useState(initialState);

  const [confirmPass, setConfirmPass] = useState(true);

  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.authReducer.loading);

  // handle Form Submissin
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      data.password === data.confirmpass
        ? dispatch(signUp(data))
        : setConfirmPass(false);
    } else {
      dispatch(logIn(data));
    }
  };

  const resetForm = () => {
    setConfirmPass(true);
    setData({
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  const google = () => {
    window.open("http://localhost:5007/auth/google", "_self");
  };

  const github = () => {
    window.open("http://localhost:5007/auth/github", "_self");
  };

  const facebook = () => {
    window.open("http://localhost:5007/auth/facebook", "_self");
  };
  return (
    <div className="login">
      <h1 className="loginTitle">Choose a Login Method</h1>
      <div className="wrapper">
        <div className="left">
          <div className="loginButton google" onClick={google}>
            <img src={Google} alt="" className="icon" />
            Google
          </div>
          <div className="loginButton facebook" onClick={facebook}>
            <img src={Facebook} alt="" className="icon" />
            Facebook
          </div>
          <div className="loginButton github" onClick={github}>
            <img src={Github} alt="" className="icon" />
            Github
          </div>
        </div>
        <div className="center">
          <div className="line" />
          <div className="or">OR</div>
        </div>
        <div className="right">
          <div className="a-right">
            <form className="infoForm authForm" onSubmit={handleSubmit}>
              <h3>{isSignUp ? "Register" : "Login"}</h3>
              {isSignUp && (
                <div>
                  <input
                    required
                    type="text"
                    placeholder="First Name"
                    className="infoInput"
                    name="firstname"
                    value={data.firstname}
                    onChange={handleChange}
                  />
                  <input
                    required
                    type="text"
                    placeholder="Last Name"
                    className="infoInput"
                    name="lastname"
                    value={data.lastname}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div>
                <input
                  required
                  type="text"
                  placeholder="Username"
                  className="infoInput"
                  name="username"
                  value={data.username}
                  onChange={handleChange}
                />
              </div>
              <div>
                <input
                  required
                  type="password"
                  className="infoInput"
                  placeholder="Password"
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                />
                {isSignUp && (
                  <input
                    required
                    type="password"
                    className="infoInput"
                    name="confirmpass"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                  />
                )}
              </div>

              <span
                style={{
                  color: "red",
                  fontSize: "12px",
                  alignSelf: "flex-end",
                  marginRight: "5px",
                  display: confirmPass ? "none" : "block",
                }}
              >
                *Confirm password is not same
              </span>
              <div>
                <span
                  style={{
                    fontSize: "12px",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => {
                    resetForm();
                    setIsSignUp((prev) => !prev);
                  }}
                >
                  {isSignUp
                    ? "Already have an account Login"
                    : "Don't have an account Sign up"}
                </span>
                <button
                  className="button infoButton"
                  type="Submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : isSignUp ? "SignUp" : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
