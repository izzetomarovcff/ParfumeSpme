import React, { useEffect, useState } from 'react'
import Footernavbar from '../components/Footernavbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { ClearCart, ProductMinus, ProductPlus, ProductRemoveCart } from '../redux/actions'
import { Link } from 'react-router-dom'

function Cart() {
  const { GeneralResponse } = useSelector(state => state)
  const [sum, setSum] = useState(0)
  const [oldSum, setOldSum] = useState(null)
  const dispatch = useDispatch()
  useEffect(() => {
    let total = 0
    let totalold = 0
    for (let i of GeneralResponse.cart) {
      totalold = totalold + i.count * i.oldPrice
      total = total + i.count * i.price
    }
    setOldSum(totalold)
    setSum(total)
  }, [GeneralResponse])
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
      } else {
        window.location.href = "/signup"
      }
    })
    return () => {
      listen()
    }
  }, [])
  const productCountPlus = (id) => {
    let stateres = GeneralResponse.cart.find(item => item.id == id)
    if (stateres) {
      dispatch(ProductPlus(id))
    } else {

    }
  }
  const productCountMinus = (id) => {
    let stateres = GeneralResponse.cart.find(item => item.id == id)
    if (stateres) {
      dispatch(ProductMinus(id))
    }
  }
  const removecart = (id) => {
    let stateres = GeneralResponse.cart.find(item => item.id == id)
    if (stateres) {
      dispatch(ProductRemoveCart(id))
    }
  }
  
  return (
    <div className='cart'>
      
      
      <div className='header bg-secondary'>My Bag</div>
      <div className='products'>
        {GeneralResponse.cart.length == 0 ? (
          <div className='mx-auto mt-5'>Bag Is Empty</div>
        ) : (
          GeneralResponse.cart.map((product, productkey) => {
            return (
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
                      {product.sizes == "" ? (null) : (
                        <p className='size mt-1'><span>Size:</span><span className='text-dark ms-2'>{product.sizes}</span></p>
                      )}
                    </div>
                    <div className='totrash me-3 mt-2' onClick={() => removecart(product.id)}>
                      <img src="/icons/trash.svg" alt="" />
                    </div>
                  </div>
                  <div className="countandprice mb-3">
                    <div className="countinfo">
                      <div className="countminus shadow" onClick={() => productCountMinus(product.id)}>
                        <img src="/icons/minus.svg" alt="" />
                      </div>
                      {product.count}
                      <div className="countplus shadow" onClick={() => productCountPlus(product.id)}>
                        <img src="/icons/plus.svg" alt="" />
                      </div>

                    </div>
                    <div className="price me-4 ">
                      {product.oldPrice * product.count == 0 ? (null) : (<del className='me-1'>${product.oldPrice * product.count}</del>)}
                      ${product.price * product.count}
                    </div>

                  </div>

                </div>
              </div>
            )
          })
        )}
      </div>
      <Link to={GeneralResponse.cart.length == 0 ? ('/shop/women'):('/cart/neworder')} className="neworder btn btn-primary">
        Order Now
      </Link>
      <div className="footer bg-white">
        <div className='total text-dark ms-4'>Total: </div>
        <div className="amount text-primary me-4">
          {oldSum == 0 ? (null) : (<del className='me-2'>${oldSum}</del>)}

          ${sum}
        </div>

      </div>

      <Footernavbar />
    </div>
  )
}

export default Cart