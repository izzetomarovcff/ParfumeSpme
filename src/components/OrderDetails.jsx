import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'

function OrderDetails() {
    const [authUser, setAuthUser] = useState(null)
    const [order, setOrder] = useState(null)
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            // console.log(user.email) //check token status
            if (user) {
                setAuthUser(user)
            } else {
                window.location.href = "/signup"
            }
        })
        return () => {
            listen()
        }
    }, [])
    useEffect(() => {
        let orderId = window.location.pathname.split("/")[3]
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/orders/${orderId}.json`)
                let resData = await response.json()
                setOrder({ ...resData, id: orderId })
            } catch (error) {
                console.log(error)
            }
        }
        getData()
    },[])
    return (
        <div className='orderdetails mb-3'>
            <div className='orderheader bg-secondary'>
                <div className='backicon' onClick={() => { window.history.back() }}><img src="/icons/back.svg" alt="" /></div>
                {order ? (<div className='orderid'>Details</div>) : (null)}
                <div className='shareicon'></div>
            </div>
            {order ? (
                <div className='order mt-2'>
                    <div className='orderidanddate'>
                        <h6><span className='text'>Order ID: </span> <span className='idtext'>{order.id[0]}{order.id[1]}{order.id[2]}{order.id[3]}{order.id[4]}{order.id[5]}{order.id[6]}{order.id[7]}...</span></h6>
                        <h6 className='date'>{order.date}</h6>
                    </div>
                    {order.orderStatus == "delivered" ? (<div className='status text-success mt-2'>Delivered</div>) : (
                        order.orderStatus == "processing" ? (<div className='status text-warning mt-2'>Processing</div>) : (
                            order.orderStatus == "cancelled" ? (<div className='status text-primary mt-2'>Cancelled</div>) : (<div className='status text-info'>Not Status</div>)
                        )
                    )}
                    <div className="productcount mt-2">Have {order.products.length} products</div>
                    {order.products.map((product,productkey)=>{
                        return(
                            <div className="product mt-3 shadow-sm bg-white" key={productkey}>
                                <div className='imgdiv'>
                                    <img src={product.imgUrl} alt="" />
                                </div>
                                <div className="details p-3">
                                    <h2>{product.productName}</h2>
                                    <p className='mt-1'>{product.brandName}</p>
                                    {order.sizes == "" ? (<p className='mt-1'>Size: <span className='text-dark'>{product.sizes}</span></p>):(null)}
                                    <div className='countandprice'>
                                        <p className='mt-1'>Count: <span className='text-dark'>{product.count}</span></p>
                                        <p className='price  text-dark mt-1'>${product.price*product.count}</p>
                                    </div>
                                    
                                </div>
                                

                            </div>
                        )
                    })}
                    <div className="otherinfo mt-4">Order Information</div>
                    <p className='otherdetails mt-2'>Shipping Address: <span className='text-dark ms-2'>{order.shippingAddress}</span></p>
                    <p className='otherdetails mt-2'>Payment Method: <span className='text-dark ms-2'>**** **** **** {order.card16digit[12]}{order.card16digit[13]}{order.card16digit[14]}{order.card16digit[15]}</span></p>
                    <p className='otherdetails mt-2'>Total Amount: <span className='text-dark ms-2 totalamount'>{order.totalammount} $</span></p>
                </div>
            ) : (null)}
        </div>
    )
}

export default OrderDetails