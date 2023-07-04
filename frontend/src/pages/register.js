import React, { useState } from 'react'
import './login.css'
import { Link } from 'react-router-dom'
import axios from 'axios';
function Register() {
  const [userEmail,setEmail]=useState();
  const [userPassword,setPassword]=useState();
  const handlerRegistration=async()=>{
    if(userPassword.length<6) {
      alert('Password must have atleast 6 characters')
      return
  }
    await axios.post('http://localhost:4000/api/v1/register',{
      "email":userEmail,
      "password":userPassword
    }).then(res=>{
      alert('Registration successful ! Please varify your identity by clicking on link sent on given email address.')
    }).catch(err=>{
      alert(err.response.data.message);
    })

  }

  return (
    <>
     <div className="container">
      <div className="container">
        <div className="registration form">
          <header>Signup</header>
          <form action="#">
            <input type="email" placeholder="Enter your email" onChange={(e)=>{setEmail(e.target.value)}}/>
            <input type="password" placeholder="Create a password" onChange={(e)=>{setPassword(e.target.value)}}/>
            <input type="button" className="button" value="Signup" onClick={handlerRegistration} />
          </form>
          <div className="signup">
            <span className="signup">
              Already have an account?
              <Link to='/login'>Login</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Register