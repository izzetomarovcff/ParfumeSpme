import React, { useEffect, useState } from 'react'
import Footernavbar from '../components/Footernavbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { Routes, Route } from 'react-router-dom'
import WomenCollection from '../components/WomenCollection'
import MenCollection from '../components/MenCollection'
import KidsCollection from '../components/KidsCollection'
import CollectionProduct from '../components/CollectionProduct'
import WomenCategory from '../components/WomenCategory'
import MenCategory from '../components/MenCategory'
import CategoryProduct from '../components/CategoryProduct'
import KidsCategory from '../components/KidsCategory'

function Shop() {
  const [header, setHeader] = useState("Kategoriyalar")
  const [forClass, setForClass] = useState({
    women: "elementsfor",
    men: "elementsfor",
    kids: "elementsfor"
  })

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // console.log(user.email) //check token status
      if (user) {
      } else {
        window.location.href = "/signup"
      }
    })
    return () => {
      listen()
    }
  }, [])

  useEffect(()=>{
    switch(window.location.pathname.split("/")[2]){
      case "women":
        setForClass({...forClass, women: "activelementsfor", men: "elementsfor", kids: "elementsfor"})
        break;
      case "men":
        setForClass({...forClass, women: "elementsfor", men: "activelementsfor", kids: "elementsfor"})
        break;

    }
    switch(window.location.pathname){
      case "/shop/women":
        setForClass({...forClass, women: "activelementsfor", men: "elementsfor", kids: "elementsfor"})
        break;
      case "/shop/men":
        setForClass({...forClass, women: "elementsfor", men: "activelementsfor", kids: "elementsfor"})
        break;


    }
  },[])
  const handleClick = (item) =>{
    switch(item){
      case "women":
        window.location.pathname= "/shop/women"
        break;
      case "men":
        window.location.pathname= "/shop/men"
        break;

    }
  }
  return (
    <div className='shoppage'>
      <div className='headerbox w-100'>
        <div className="none"></div>
        <h1>{header}</h1>
        <div className='none'></div>
      </div>
      <div className='selecetfor  bg-secondary'>
        <div  className={forClass.women} onClick={()=>handleClick("women")}>Qadın</div>
        <div  className={forClass.men} onClick={()=>handleClick("men")}>Kişi</div>
  
      </div>
      <Routes>
        <Route path='/women' element={<><WomenCollection/><WomenCategory/></>}/>
        <Route path='/women/collection/*' element={<CollectionProduct/>}/>
        <Route path='/women/category/*' element={<CategoryProduct/>}/>
        
        <Route path='/men' element={<><MenCollection/><MenCategory/></>}/>
        <Route path='/men/collection/*' element={<CollectionProduct/>}/>
        <Route path='/men/category/*' element={<CategoryProduct/>}/>


  


      </Routes>
        
        <Footernavbar/>
    </div>
  )
}

export default Shop