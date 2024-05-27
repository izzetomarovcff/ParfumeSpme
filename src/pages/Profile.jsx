import React, { useEffect, useState } from 'react'
import Footernavbar from '../components/Footernavbar'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'

function Profile() {
  const [authUser, setAuthUser] = useState(null)
  const [orders, setOrders] = useState(null)
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // console.log(user.email) //check token status
      if (user) {
        setAuthUser(user)
      } else {
        setAuthUser(null)
        window.location.href = "/login"
      }
    })
    return () => {
      listen()
    }
  }, [])
  useEffect(()=>{
    const getData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/orders.json`)
        let resData = await response.json()
        let arr = []
        for (const key in resData) {
          if (resData[key].orderOwnerEmail == authUser.email) {
            arr.unshift({ ...resData[key], id: key })
          }
        }
        console.log("red")

        setOrders(arr)
      } catch (error) {
        console.log(error)
      }
    }
    getData()
  },[authUser])
  const userSignOut = () => {
    signOut(auth).then(() => {
      console.log("Sigin Out Successfully")
    }).catch((error) => {
      console.log(error)
    })
  }
  return (
    <div className='profilepage'>
      <div className='header bg-secondary'>My Profile</div>
      <div className="profilecontainer">
        {authUser ? (
          <div className='profile rounded'>
          <div className="imgprofile shadow">
            <img src="/icons/profile.svg" alt="" />
          </div>
          <div className='email'>{authUser.email}</div>
        </div>
        ):(null)}
        
        <Link to={"/profile/orders"} className="itembox mt-4">
          <div className="info">
            <h2>My Orders</h2>
            <p className='mt-1'>Alredy have {orders?(orders.length):(0)} orders</p>
          </div>
          <div className="to">
            <img src="/icons/chevron_right.svg" alt="" />
          </div>
        </Link>
        <Link to={"/profile/settings"} className="itembox mt-4">
          <div className="info">
            <h2>Settings</h2>
            <p className='mt-1'>Password, Log Out</p>
          </div>
          <div className="to">
            <img src="/icons/chevron_right.svg" alt="" />
          </div>
        </Link>
        {authUser ? (<button className='btn btn-primary mt-3 mb-5' onClick={userSignOut}>Sign Out</button>) : (null)}
      </div>
      <Footernavbar />
    </div>
  )
}

export default Profile