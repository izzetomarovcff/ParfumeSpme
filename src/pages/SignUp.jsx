import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'


function SignUp() {
  const [error, setError] = useState(null)
  const [resError, setReserror] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  //set signup params. state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // console.log(user.email) //check token status
      if (user) {
        window.location.href= "/"
      } else {
        
      }
    })
    return () => {
      listen()
    }
  },[])
  //check inputs correct or incorrect
   function handleCheck() {
    if(formData.name.length<1){
      setReserror(null)
      return "Invalid Full Name (in Full Name must have characters!)";
    } else if (formData.name.includes(".") || formData.name.includes(",")) {
      setReserror(null)
      return "Invalid Full Name (in Full Name must not have this (. ,) characters!)";
    } else if(formData.phone === ""){
      setReserror(null)
      return "Invalid Phone Number";
    } else if(formData.email.length<1){
      setReserror(null)
      return "E-mail cannot be left blank!"
    }else if (formData.password.length < 6) {
      setReserror(null)
      return "Password must be at least 6 characters long!"
    } else {
      setLoading(true)
      setReserror(null)
      handleSignUp()
      return null
    }
  }

  //senda data to database
  const handleSignUp = async () =>{
    try{
      await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      window.location.href = "/"
      fetch(`${process.env.REACT_APP_FIREBASE_DATABASE_URL}/users.json`,
      {
        method: "POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      window.location.href = "/"
    }catch(error){
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Email address is already in use.');
          setLoading(false)
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          setLoading(false)
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          setLoading(false)
          break;
        default:
          setError('An error occurred while signing up.');
          setLoading(false)
      }
    }
  }
  
  //form submit
  const handleSubmit = (e) => {
    e.preventDefault()
    setError(handleCheck())
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
      <h1 className=''>Qeydiyyat</h1>
      {error ? (<p className='alert alert-warning w-100 mt-4'>{error}</p>) : (null)}
      {resError ? (<p className='alert alert-danger w-100 mt-4'>{resError}</p>) : (null)}
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className="mb-3 w-100">
          <label htmlFor="fullname" className="form-label">Ad,Soyad</label>
          <input type="text" name='name' className="form-control" id="fullname" value={formData.name} onChange={handleChange} autoComplete='off' placeholder='' />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="phone" className="form-label">Telefon nömrəsi</label>
          <input type="tel" name='phone' className="form-control" id="phone" value={formData.phone} onChange={handleChange} autoComplete='off' placeholder=''  />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="email" className="form-label">E-Mail</label>
          <input type="email" name='email' className="form-control" id="email" value={formData.email} onChange={handleChange} autoComplete='off' placeholder=''  />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="password" className="form-label">Şifrə</label>
          <input type="password" name='password' className="form-control" id="password" value={formData.password} onChange={handleChange} autoComplete='off' placeholder=''  />
        </div>
        <button type='submit' className='btn btn-primary w-100 mt-3'>Qeydiyyat</button>
        <Link to="/login" className='btn btn-outline-primary w-100 mt-3'>Hesabınız mövcuddur  ?</Link>
      </form>
    </div>
  )
}

export default SignUp