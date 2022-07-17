import React from 'react'

import {Link } from "react-router-dom";

import Google from "../../img/google.png";

import './Navbar.css'

const Navbar = ({user}) => {

    const logout = () => {
        window.open("http://localhost:5007/api/auth/logout", "_self")
    }
  return (
    <div className="navbar">
        <span className="logo">
            <Link to="/">
                BuddyUp
            </Link>
        </span>
        {user ? (
            <ul className="list">
                <li className="listItem">
                    <img 
                        src={Google}
                        alt="avatar"
                        className="profilePic"/>
                </li>
                <li className="listItem">
                    {user?.user?.username}
                </li>
                <li className="listItem" onClick={logout}>
                    Logout
                </li>
            </ul>
        ) : (
            <Link className="link" to="login">
                Login
            </Link>
        )}
    </div>
  )
}

export default Navbar