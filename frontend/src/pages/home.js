import React from 'react'
import './home.css'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useRef } from 'react';
import { useEffect,useState } from 'react';
import axios, { Axios } from 'axios';
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

function Home({user}) {
  const navagation=useNavigate()
  // const [is_auth,setAuth]=useState(false);
  // const navigate=useNavigate();
  // const checkAuth=async()=>{
  //   await axios({
  //     url: 'http://localhost:4000/api/v1/is_authenticated',
  //     method: "get",
  //     withCredentials: true
  //   }).then(res=>{
  //     // console.log(res.data.success)
  //     // setAuth(res.data.success)
  //     if(!res.data.success) navigate('/login')
  //     else{
  //       localStorage.setItem('auth',true)
  //     }
  //     }).catch(err=>{
  //       console.log(err);
  //     })
  // }
  // useEffect(()=>{
  //   checkAuth();
  // },[])

  let ref=useRef()
  const [val,setVal]=useState('');
  const [searchData,setSearchData]=useState([]);
  const [open_close,setOpenClose]=useState({});
  const [low_high,setLowHigh]=useState({});
  const [volume,setVolume]=useState([]);
  const [dividend_amount,set_dividend_amount]=useState([]);
  const [datakeys,setKeys]=useState([]);
  const [isAvailable,setIsAvailable]=useState(true);
  const [stockName,setStockName]=useState('');
  const fetchData=async()=>{
    let res=await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${val}&apikey=LMMQP8JNJKR9JVV4`)
    if(res.data.bestMatches){
      let arr=res.data.bestMatches;
      setSearchData(arr);
    }else if(val){
      setIsAvailable(false)
      setSearchData([]);
    }
    else{
      setSearchData([]);
    }
  }
useEffect(()=>{
  fetchData()
},[val])

  const plotChart=async(x,y)=>{
    setStockName(y)
    let res=await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${x}&apikey=LMMQP8JNJKR9JVV4`)
    let open_arr=[];
    let close_arr=[];
    let low_arr=[];
    let high_arr=[];
    let vol_arr=[];
    let div_ammount_arr=[];
    let arr=res.data['Time Series (Daily)'];
    console.log(Object.keys(res.data).length);
    if(Object.keys(res.data).length<=1){
      setIsAvailable(false)
      setSearchData([])
      return
    }else{
      setIsAvailable(true)
    }
    setKeys(arr)
    Object.keys(res.data['Time Series (Daily)']).map((data_key)=>{
      open_arr.push(parseInt(arr[data_key]['1. open']));
      close_arr.push(parseInt(arr[data_key]['4. close']));
      low_arr.push(parseInt(arr[data_key]['3. low']));
      high_arr.push(parseInt(arr[data_key]['2. high']));
      vol_arr.push(parseInt(arr[data_key]['6. volume']));
      div_ammount_arr.push(parseInt(arr[data_key]['7. dividend amount']));
    })
    open_arr.reverse();
    close_arr.reverse();
    low_arr.reverse();
    high_arr.reverse();
    vol_arr.reverse();
    div_ammount_arr.reverse();
    arr=Object.keys(arr)
    arr.reverse()
    let chartData_Open_Close={
      labels:arr,
    datasets: [
      {
        label: 'Open',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(255,0,0,1)',
        borderWidth: 2,
        data: open_arr,
      },
      {
        label: 'Close',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(0,255,0,1)',
        borderWidth: 2,
        data: close_arr,
      },
    ]
  }
  let chart_high_low={
    labels:arr,
    datasets: [
      {
        label: 'Low',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(255,0,0,1)',
        borderWidth: 2,
        data: low_arr,
      },
      {
        label: 'High',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(0,255,0,1)',
        borderWidth: 2,
        data: high_arr,
      },
    ]
  }
  let chart_volume={
    labels:arr,
    datasets: [
      {
        label: 'Volume',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(0,0,255,1)',
        borderWidth: 2,
        data: vol_arr,
      },
    ]
  }
  let chart_div_amount={
    labels:arr,
    datasets: [
      {
        label: 'Dividend Amount',
        fill: false,
        lineTension: 0.5,
        borderColor: 'rgba(0,0,255,1)',
        borderWidth: 2,
        data: div_ammount_arr,
      },
    ]
  }
  setOpenClose(chartData_Open_Close)
  setLowHigh(chart_high_low)
  setVolume(chart_volume)
  set_dividend_amount(chart_div_amount)
  setSearchData([])
}
  // if(!user) return navagation('/login')
  return (
    <>
    <div>
      <div className="input-box">
        <i className="uil uil-search"></i>
        <input type="text" placeholder="Search here..." ref={ref} onChange={(e)=>{setVal(e.target.value)}}/>
        {searchData.length>0 && <div className="serach-results">
          {
            searchData.map((elem,index)=>{
              return <li className='search-item' key={index} onClick={()=>{plotChart(elem['1. symbol'],`${elem['1. symbol']} - (${elem['2. name']})`)}}>{elem['1. symbol']} - ({elem['2. name']})</li>
            })
          }
        </div>}
      </div>
      {isAvailable && 
        <div className='stock-name'>{stockName}</div>
      }
    {isAvailable && <div>
    <div className='chart-box'>
      {Object.keys(datakeys).length>0 && 
        <Line
          data={open_close}
          options={{
            title: {
              display: true,
              text: 'Class Strength',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      }
      </div>
      {Object.keys(datakeys).length>0 && 
      <div className='chart-box'>
        <Line
          data={low_high}
          options={{
            title: {
              display: true,
              text: 'Class Strength',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      </div>
      }
      {Object.keys(datakeys).length>0 && 
      <div className='chart-box'>
        <Line
          data={volume}
          options={{
            title: {
              display: true,
              text: 'Class Strength',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      </div>
      }
      {Object.keys(datakeys).length>0 && 
      <div className='chart-box'>
        <Line
          data={dividend_amount}
          options={{
            title: {
              display: true,
              text: 'Class Strength',
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
          }}
        />
      </div>
      }
    </div>}
    {
      ! isAvailable &&
      <div className='stock-name'>Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency</div>
    }

    <div className='footer-box'>
      <h2>Search and find following details about stocks of any company.</h2>
      <p>Opening and closing price</p>
      <p>Lowest and highest price</p>
      <p>Volume of stocks</p>
      <p>Dividend amount</p>
    </div>
    </div>
    </>
  )
}

export default Home