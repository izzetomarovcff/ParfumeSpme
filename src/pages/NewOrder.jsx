import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { auth } from '../firebase'
import { ClearCart } from '../redux/actions'
import { Link } from 'react-router-dom'

function NewOrder() {
    const { GeneralResponse } = useSelector(state => state)
    const dispatch = useDispatch()
    const [resError, setResError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [summary, setSummary] = useState(0)
    const [authUser, setAuthUser] = useState(null)
    const [loading, setLoading] = useState(false)

    const [order, setOrder] = useState({
        id: "",
        date: "",
        orderOwnerEmail: "",
        totalcount: "",
        totalammount: "",
        orderStatus: "processing",
        products: [],
        shippingAddress: "",
        card16digit: "",
    })
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
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
        let summary = 0
        GeneralResponse.cart.forEach(element => {
            summary = summary + element.count * element.price
            setSummary(summary)
        });
    })
    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        try {
            if (GeneralResponse.cart.length != 0) {
                const currentDate = new Date();
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                let totalCount = 0
                let totalAmmount = 0
                GeneralResponse.cart.forEach(element => {
                    totalCount = totalCount + element.count
                });
                GeneralResponse.cart.forEach(element => {
                    totalAmmount = totalAmmount + element.count * element.price
                })
                let orderOBJ = order
                order.date = `${day < 10 ? (`0${day}`) : (day)}-${month < 10 ? (`0${month}`) : (month)}-${year}`
                order.orderOwnerEmail = authUser.email
                order.totalcount = totalCount
                order.totalammount = totalAmmount
                order.products = GeneralResponse.cart
                let response = await fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/orders.json`,
                    {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderOBJ)
                    })
                console.log(response)
                if (response.ok) {
                    dispatch(ClearCart())
                    setLoading(false)
                    setSuccess(true)
                } else {
                    setResError("An Error Occured Try Again!")
                    setLoading(false)

                    setTimeout(() => {
                        setResError(null)
                    }, 3000);
                }
            } else {
                window.location.pathname = "/shop/women"
            }

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    return (
        <div className='neworderpage bg-secondary'>
            {success ? (
                <div className="success bg-secondary">
                    <div className="imgandtext">
                        <img src="/image/bags.svg" alt="" />
                        <h1 className='mt-3'>Success!</h1>
                        <p className='text-center w-75 mt-2'>Your order will be delivered soon. Thank you for choosing our app!</p>
                    </div>
                    <div className='button'>
                        <Link to="/shop/women" className='btn btn-primary w-100'>CONTINUE</Link>
                    </div>
                    
                </div>
            ) : (null)}
            {loading ? (
                <div className='loading-overlay bg-secondary'>
                    <div className="spinner-border text-primary border-5" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : (null)}
            
            {resError ? (<div className='alert alert-danger'>{resError}</div>) : (null)}
            <div className='header bg-secondary'>
                <div className='backicon' onClick={() => { window.history.back() }}><img src="/icons/back.svg" alt="" /></div>
                Order Info
                <div className='right'></div>
            </div>
            <form onSubmit={handleSubmit} className='submitorder'>
                <div className="mb-3 w-100">
                    <label htmlFor="shippingAddress" className="form-label">Shipping Address</label>
                    <input type="text" name='shippingAddress' className="form-control" id="shippingAddress" value={order.shippingAddress} onChange={handleChange} autoComplete='off' required placeholder='Baku AZ, Xatai, Polad Hashimov' />
                </div>
                <div className="mb-3 w-100">
                    <label htmlFor="card16digit" className="form-label">Card Number</label>
                    <input type="number" name='card16digit' className="form-control" id="card16digit" value={order.card16digit} onChange={handleChange} autoComplete='off' required placeholder='1234 5678 9012 3456' min={1000000000000000} max={9999999999999999}/>
                </div>
                <div className='order'>
                    <p className='text'>Order</p>
                    <p className='price'>{summary}$</p>
                </div>
                <div className='summary mt-2'>
                    <p className='text'>Summary</p>
                    <p className='price'>{summary}$</p>
                </div>
                <button type='submit' className='btn btn-primary w-100'> Submit </button>
            </form>
        </div>
    )
}

export default NewOrder