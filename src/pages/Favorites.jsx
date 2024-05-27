import React from 'react'
import Footernavbar from '../components/Footernavbar'
import { useDispatch, useSelector } from 'react-redux'
import { AddToCart, AddToFav } from '../redux/actions'
import { Link } from 'react-router-dom'

function Favorites() {
  const { GeneralResponse } = useSelector(state => state)
  const dispatch = useDispatch()

  const removefav = (product) =>{
    let stateres = GeneralResponse.favorites.find(item=>item.id == product.id)
  if(stateres){
    dispatch(AddToFav(product))
  }
  }
  return (
    <div className='favorites'>
      <div className='header bg-secondary'>Favorites</div>
      <div className='products'>
        {GeneralResponse.favorites.length == 0 ? (<div className='mx-auto mt-5'>Favorites Is Empty</div>):(
          GeneralResponse.favorites.map((product,productkey)=>{
            return(
              <div className='product shadow-sm' key={productkey}>
                <Link to={`/shop/product/${product.id}`}>
                  <div className="imgdiv">
                    <img src={product.imgUrl} alt="" />
                  </div>
                </Link>
                <div className="details">
                  <div className="textcontent">
                    <div className='info mt-2'>
                      <Link className='h1' to={`/shop/product/${product.id}`}>{product.productName}</Link>
                      
                      <p className='size mt-1'>{product.brandName}</p>
                    </div>
                    <div className="removedavcontainer">
                      <div className='removefav me-3 mt-3 bg-primary shadow-sm' onClick={()=>removefav(product)}>
                        <img src="/image/home/sale/heart.svg" alt="" />
                      </div>
                    </div>
                    
                  </div>
                  <div className="countandprice mb-3">
                    <div className="countinfo">
                      

                    </div>
                    <div className="price me-4 ">
                      {product.oldPrice == 0 ? (null):(<del className='me-1'>${product.oldPrice}</del>)}
                      ${product.price}
                    </div>

                  </div>
                </div>
              </div>

            )
          })
        )}
      </div>

      <Footernavbar/>
    </div>
  )
}

export default Favorites