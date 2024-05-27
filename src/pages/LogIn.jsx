import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { auth } from '../firebase';


function LogIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const[error,setError] = useState(null)
  const [loading, setLoading] = useState(false)
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
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleLogIn = async () =>{
    try{
      await signInWithEmailAndPassword(auth,formData.email, formData.password)
      window.location.href = "/"
    }catch(error){
      switch (error.code) {
        case 'auth/user-not-found':
          setError('User not found.');
          setLoading(false)
          break;
        case 'auth/wrong-password':
          setError('Wrong password.');
          setLoading(false)
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          setLoading(false)
          break;
        default:
          setError('An error occurred while logging in.');
          setLoading(false)
      }
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    handleLogIn()
  }
  return (
    <div className='login'>
      {loading?(
        <div className='loading-overlay bg-secondary'>
          <div className="spinner-border text-primary border-5" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
        
      ):(null)}
      <h1 className=''>Giriş</h1>
      {error ? (<p className='alert alert-warning w-100 mt-4'>{error}</p>) : (null)}
      <form onSubmit={handleSubmit} className='mt-4'>
        <div className="mb-3 w-100">
          <label htmlFor="email" className="form-label">E-Mail</label>
          <input type="email" name='email' className="form-control" id="email" value={formData.email} onChange={handleChange} autoComplete='off' placeholder='Emailinizi daxil edin'  required />
        </div>
        <div className="mb-3 w-100">
          <label htmlFor="password" className="form-label">Şifrə</label>
          <input type="password" name='password' className="form-control" id="password" value={formData.password} onChange={handleChange} autoComplete='off' placeholder='Şifrəni daxil edin' required />
        </div>
        <Link to="/forgetpassword">Şifrəni unutmusunuz?</Link>
        <button type='submit' className='btn btn-primary w-100 mt-3'>Giriş</button>
        <Link to="/signup" className='btn btn-outline-primary w-100 mt-3'>Hesabınız yoxdur ?</Link>
      </form>
    </div>
  )
}

export default LogIn