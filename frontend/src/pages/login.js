import React, { useState } from 'react'
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
function Login({user,authFunc}) {
  const [userEmail,setEmail]=useState();
  const [userPassword,setPassword]=useState();
  const navigation=useNavigate()
  const handleLogin=async()=>{
    await axios({
      url: 'http://localhost:4000/api/v1/login',
      method: "post",
      data: {
        "email":userEmail,
        "password":userPassword
      },
      withCredentials: true
  }).then(res=>{
      alert('Login successful !')
      authFunc(true)
      navigation('/')
    }).catch(err=>{
      alert(err.response.data.message);

    })
  }

  // const handleLogin=async()=>{
  //   var headers = new Headers();
  //   headers.append('Content-Type', 'application/json');
  //   headers.append('Accept', 'application/json');

  //   await fetch('http://localhost:4000/api/v1/login', {
  //       method: 'POST',
  //       // mode: 'same-origin',
  //       redirect: 'follow',
  //       credentials: 'include', // Don't forget to specify this if you need cookies
  //       headers: headers,
  //       body: JSON.stringify({
  //         "email":userEmail,
  //         "password":userPassword
  //       })
  //   })
  // }

  return (
    <div className="container">
      <div className="container">
        <div className="login form">
          <header>Login</header>
          <form action="#">
          <input type="email" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>
            <input type="password" placeholder="Create a password" onChange={(e)=>{setPassword(e.target.value)}}/>
            {/* <a href="#">Forgot password?</a> */}
            <input type="button" className="button" value="Login" onClick={handleLogin}/>
          </form>
          <div className="signup">
            <span className="signup">
              Don't have an account?
            <Link to='/register'>Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
