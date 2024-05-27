import React, { useEffect  } from 'react'
import Footernavbar from '../components/Footernavbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import AddProduct from '../components/AddProduct'
import { Link, Route, Routes } from 'react-router-dom'
import AddCategory from '../components/AddCategory'
import AddCollection from '../components/AddCollection'
function Admin() {
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // console.log(user.email) //check token status
      if (user) {
      } else {
        window.location.href = "/login"
      }
    })
    return () => {
      listen()
    }
  }, [])
  return (
    <div className='admin mb-4'>
      <div className=' d-flex flex-column'>
      <Link to="/admin/addproduct" className='btn btn-outline-primary w-100 mt-3 mx-1'>Product </Link>
      <Link to="/admin/addcategory" className='btn btn-outline-primary w-100 mt-3 mx-1'>Category </Link>
      <Link to="/admin/addcollection" className='btn btn-outline-primary w-100 mt-3 mx-1'>Collection </Link>
      </div>
      <Routes>
        <Route path='/addproduct' element={<AddProduct/>}/>
        <Route path='/addcategory' element={<AddCategory/>}/>
        <Route path='/addcollection' element={<AddCollection/>}/>
      </Routes>
      <Footernavbar />
    </div>
  )
}

export default Admin