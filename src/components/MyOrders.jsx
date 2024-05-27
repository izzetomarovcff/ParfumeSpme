import React, { useEffect, useState } from 'react'
import Footernavbar from './Footernavbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'

function MyOrders() {
    const [authUser, setAuthUser] = useState(null)
    const [orders, setOrders] = useState(null)
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            // console.log(user.email) //check token status
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null)
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
            setOrders(arr)
          } catch (error) {
            console.log(error)
          }
        }
        getData()
        console.log(orders)
      },[authUser])

    return (
        <div className='orderspage bg-secondary'>
            <div className='header bg-secondary'>
                <div className='backicon' onClick={() => { window.history.back() }}><img src="/icons/back.svg" alt="" /></div>

                My Orders
                <div className='right'></div>
            </div>
            <div className='orders'>
                {orders ? (
                    orders.map((order,orderkey)=>{
                        return(
                            <div className="order my-3 shadow-sm" key={orderkey}>
                                <div className="heading ">
                                    <h1 className="orderidtext">Order ID : <span className='orderid'>{order.id}</span></h1>
                                    <p className='date'>{order.date}</p>
                                </div>
                                <div className="quantitiyandprice mt-3">
                                    <p>Quantity: 
                                        <span className='text-dark ms-2'>
                                            {order.totalcount}
                                        </span>
                                    </p>
                                    <p>Total Amount: 
                                        <span className='text-dark ms-2'>
                                            {order.totalammount}$
                                        </span>
                                    </p>
                                </div>
                                <div className="details mt-3">
                                    <Link to={`/profile/orders/${order.id}`} className='btn btn-outline-dark px-4'>Details</Link>
                                    {order.orderStatus == "delivered" ? (<div className='status text-success'>Delivered</div>):(
                                        order.orderStatus == "processing" ? (<div className='status text-warning'>Processing</div>):(
                                            order.orderStatus == "cancelled" ? (<div className='status text-primary'>Cancelled</div>) :(<div className='status text-info'>Not Status</div>)
                                        )
                                    )}
                                    
                                </div>
                            </div>
                        )
                    })
                ) : (null)}
            </div>
            <Footernavbar />
        </div>
    )
}

export default MyOrders