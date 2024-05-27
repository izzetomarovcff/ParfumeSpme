import { onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'

function Footernavbar() {
  const [iconpath,setIconPath] = useState({
    home: "icons/home.svg",
    shop: "icons/shop.svg",
    cart: "icons/cart.svg",
    favorites: "icons/favorites.svg",
    profile: "icons/profile.svg",
    admin: "icons/profile.svg"
  })
  const [authUser, setAuthUser] = useState(null)
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      // console.log(user.email) //check token status
      if (user) {
        setAuthUser(user)
        // console.log(authUser.email)
      } else {
        setAuthUser(null)
      }
    })
    if(window.location.pathname.includes("/shop/women/category") || window.location.pathname.includes("/shop/women/collection")||window.location.pathname.includes("/shop/men/category")||window.location.pathname.includes("/shop/men/collection") || window.location.pathname.includes("/shop/kids/category")||window.location.pathname.includes("/shop/kids/collection")){
      setIconPath({...iconpath, home:"../../../icons/home.svg",shop:"../../../icons/shopactive.svg",cart:"../../../icons/cart.svg",favorites:"../../../icons/favorites.svg",profile:"../../../icons/profile.svg",admin:"../../../icons/profile.svg"})
    }
    if(window.location.pathname.includes("/shop/product/")){
      setIconPath({...iconpath, home:"../../../icons/home.svg",shop:"../../../icons/shopactive.svg",cart:"../../../icons/cart.svg",favorites:"../../../icons/favorites.svg",profile:"../../../icons/profile.svg",admin:"../../../icons/profile.svg"})
    }
    switch(window.location.pathname){
      case "/":
        setIconPath({...iconpath, home:"icons/homeactive.svg",shop:"icons/shop.svg",cart:"icons/cart.svg",favorites:"icons/favorites.svg",profile:"icons/profile.svg", admin:"icons/profile.svg"})
        break;
      case "/shop":
        setIconPath({...iconpath, home:"icons/home.svg",shop:"icons/shopactive.svg",cart:"icons/cart.svg",favorites:"icons/favorites.svg",profile:"icons/profile.svg",admin:"icons/profile.svg"})
        break;
      case "/cart":
        setIconPath({...iconpath, home:"icons/home.svg",shop:"icons/shop.svg",cart:"icons/cartactive.svg",favorites:"icons/favorites.svg",profile:"icons/profile.svg",admin:"icons/profile.svg"})
        break;
      case "/favorites":
        setIconPath({...iconpath, home:"icons/home.svg",shop:"icons/shop.svg",cart:"icons/cart.svg",favorites:"icons/favoritesactive.svg",profile:"icons/profile.svg",admin:"icons/profile.svg"})
        break;
      case "/profile":
        setIconPath({...iconpath, home:"icons/home.svg",shop:"icons/shop.svg",cart:"icons/cart.svg",favorites:"icons/favorites.svg",profile:"icons/profileactive.svg",admin:"icons/profile.svg"})
        break;
      case "/profile/":
      case "/profile/orders":
        setIconPath({...iconpath, home:"../icons/home.svg",shop:"../icons/shop.svg",cart:"../icons/cart.svg",favorites:"../icons/favorites.svg",profile:"../icons/profileactive.svg",admin:"../icons/profile.svg"})
        break;
      case "/admin":
          setIconPath({...iconpath, home:"icons/home.svg",shop:"icons/shop.svg",cart:"icons/cart.svg",favorites:"icons/favorites.svg",profile:"icons/profile.svg",admin:"icons/profileactive.svg"})
          break;
      case "/admin/":
      case "/admin/addproduct":
      case "/admin/addcategory":
      case "/admin/addcollection":
          setIconPath({...iconpath, home:"../icons/home.svg",shop:"../icons/shop.svg",cart:"../icons/cart.svg",favorites:"../icons/favorites.svg",profile:"../icons/profile.svg",admin:"../icons/profileactive.svg"})
          break;
      case "/shop/":
      case "/shop/women":
      case "/shop/men":
      case "/shop/kids":
        setIconPath({...iconpath, home:"../icons/home.svg",shop:"../icons/shopactive.svg",cart:"../icons/cart.svg",favorites:"../icons/favorites.svg",profile:"../icons/profile.svg",admin:"../icons/profile.svg"})
      default:
        break;
    }
    return () => {
      listen()
    }
  }, [])
  const handleClick = (item) =>{
    switch(item){
      case "home":
        window.location.pathname="/"
        break;
      case "shop":
        window.location.pathname="/shop/women"
        break;
      case "cart":
        window.location.pathname="/cart"
        break;
      case "favorites":
        window.location.pathname="/favorites"
        break;
      case "profile":
        window.location.pathname="/profile"
        break;
        case "admin":
          window.location.pathname="/admin"
          break;
        default:
          break;
    }
  }
  return (
    <div className='footernavbar shadow-lg'>
      <div className='navitem'  onClick={()=>handleClick("home")}>
        <img src={iconpath.home} alt="" />
        <p>Home</p>
      </div>
      <div className='navitem' onClick={()=>handleClick("shop")}>
        <img src={iconpath.shop} alt="" />
        <p>Shop</p>
      </div>
      <div className='navitem' onClick={()=>handleClick("cart")}>
        <img src={iconpath.cart} alt="" />
        <p>Cart</p>
      </div>
      <div className='navitem' onClick={()=>handleClick("favorites")}>
        <img src={iconpath.favorites} alt="" />
        <p>Like</p>
      </div>
      <div className='navitem' onClick={()=>handleClick("profile")}>
        <img src={iconpath.profile} alt="" />
        <p>Profile</p>
      </div>
      {authUser ? (authUser.email === process.env.REACT_APP_FIREBASE_ADMIN_EMAIL ?(
        <div className='navitem' onClick={()=>handleClick("admin")}>
        <img src={iconpath.admin} alt="" />
        <p>Admin</p>
      </div>
      ):(null)):(null)}
      
    </div>
  )
}

export default Footernavbar