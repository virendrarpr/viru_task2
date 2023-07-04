import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import './navbar.css'
import axios from 'axios';
function Navbar({user,authFunc}) {
  const navigate=useNavigate()
  const handleAuth=async()=>{
    await axios({
      url: 'http://localhost:4000/api/v1/logout',
      method: "get",
      withCredentials: true
    }).then(res=>{
      localStorage.removeItem('auth')
      authFunc(false)
        navigate('/login')
      }).catch(err=>{
        console.log(err);
      })
  }
  const [auth_val,setAuthVal]=useState(localStorage.getItem('auth'))
  // useEffect(()=>{
  //   setAuthVal(localStorage.getItem('auth'))
  // },[localStorage.getItem('auth')])

  useEffect(() => {
    function checkUserData() {
      console.log('function called');
      setAuthVal(localStorage.getItem('auth'))
    }
    window.addEventListener('storage', checkUserData)
  
    return () => {
      window.removeEventListener('storage', checkUserData)
    }
  }, [])
  return (
    <div className='con'>
      <div>
      </div>
      <div className='links'>
        <div><Link to='/' className='link'>Home</Link></div>
        {/* <div className='account'>
        {user && <button onClick={handleAuth} className='btn'>Log out</button>}
        {!user && <Link to='/register' className='link'>Sign up</Link>}
        {!user && <Link to='/login' className='link'>Login</Link>}
        </div> */}
      </div>
    </div>
  )
}

export default Navbar