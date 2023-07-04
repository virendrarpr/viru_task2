import { BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/home";
import { Route, Routes } from "react-router-dom"
import { redirect } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Navbar from "./components/Navbar";
import { useEffect,useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
function App() {
  const navigate=useNavigate();
  const [isAuth,setIsAuth]=useState(false);
  const checkAuth=async()=>{
    await axios({
      url: 'http://localhost:4000/api/v1/is_authenticated',
      method: "get",
      withCredentials: true
    }).then(res=>{
      // console.log(res.data.success)
      setIsAuth(res.data.success)
      if(!res.data.success) navigate('/login')
      else{
        localStorage.setItem('auth',true)
      }
      }).catch(err=>{
        console.log(err);
      })
  }
  useEffect(()=>{
    checkAuth();
  },[])
  return (
    <div className="App">
      {/* <Navbar user={isAuth} authFunc={setIsAuth}/> */}
      <Routes>
        <Route path="/" element={<Home user={isAuth}/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/login" element={<Login user={isAuth} authFunc={setIsAuth}/>}/>
      </Routes>
    </div>
  );
}

export default App;
