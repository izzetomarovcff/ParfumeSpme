import { onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'

function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [sended, setSended] = useState(false)
    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
          // console.log(user.email) //check token status
          if (user) {
            window.location.href = "/"
          } else {
            
          }
        })
        return () => {
          listen()
        }
      },[])

    const handleChange = (e) => {
        setEmail(e.target.value)
    }
    const handleSendResetmail = async () => {
        try {
            let responsee = await sendPasswordResetEmail(auth,email)
            console.log(responsee)
            setLoading(false)
            setSended(true)
            setTimeout(() => {
                window.location.href = "/login"
            }, 1500);

        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    setError("User not found. Please check your email address or register.")
                    setLoading(false)
                    break;
                case 'auth/invalid-email':
                    setError("Invalid email address. Please enter a valid email address.")
                    setLoading(false)
                    break;
                case 'auth/too-many-requests':
                    setError("Too many unsuccessful attempts. Please try again later.")
                    setLoading(false)
                    break;
                default:
                    setError("An error occurred while sending mail!")
                    setLoading(false)

            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        handleSendResetmail()
    }
    return (
        <div className='signup'>
            {loading ? (
                <div className='loading-overlay bg-secondary'>
                    <div className="spinner-border text-primary border-5" role="status">
                        <span className="sr-only"></span>
                    </div>
                </div>
            ) : (null)}
            {sended ? (
                <div className='loading-overlay bg-secondary'>
                    <div className='alert alert-success text-center'>
                        E-mail sent successfully!<br></br> Check Your Email: <br></br>{email}
                    </div>
                    <p className='text-success w-50 text-center'>After a few seconds, you will be redirected to the login page</p>
                </div>
            ) : (null)}
            <h1 className='mt-5'>Forgot Password</h1>
            <p className=' text-center mt-3'>Please, enter your email address. You will receive a link to create a new password via email.</p>
            {error ? (<p className='alert alert-warning w-100'>{error}</p>) : (null)}
            <form onSubmit={handleSubmit} className='mt-1'>
                <div className="mb-3 w-100">
                    <label htmlFor="email" className="form-label">E-Mail</label>
                    <input type="email" name='email' className="form-control" id="email" value={email} onChange={handleChange} autoComplete='off' placeholder='izzetomarovcff@gmail.com' required />
                </div>
                <button type='submit' className='btn btn-primary w-100 mt-3'>SEND</button>
            </form>
        </div>
    )
}

export default ForgotPassword